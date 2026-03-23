import type { QueueItem, RoomCheckIn, RoomCompleteResult, VitalSigns, ScaleResult } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { toQueueItem } from "./mappers";
import { prescriptionStepsService } from "./prescriptionStepsService";
import { toPatient, fromVitalSigns, fromScaleResult } from "./mappers";

export const treatmentQueueService = {
  /** 获取治疗队列（全部 waiting） */
  async getTreatmentQueue(): Promise<QueueItem[]> {
    const { data, error } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("queue_type", "treatment")
      .eq("status", "waiting")
      .order("queue_number", { ascending: true });

    throwIfError(error, { table: "queue_items", operation: "select" });
    return (data ?? []).map(toQueueItem);
  },

  /** 入治疗队列 */
  async enqueueTreatment(patientId: string): Promise<QueueItem> {
    const consultationId = await consultationHelper.getActiveId(patientId);

    const { data: maxRow, error: maxError } = await supabase
      .from("queue_items")
      .select("queue_number")
      .eq("queue_type", "treatment")
      .order("queue_number", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(maxError, { table: "queue_items", operation: "select" });

    const nextNumber = (maxRow?.queue_number ?? 0) + 1;

    const { data: inserted, error: insertError } = await supabase
      .from("queue_items")
      .insert({
        patient_id: patientId,
        consultation_id: consultationId,
        queue_type: "treatment",
        status: "waiting",
        queue_number: nextNumber,
      })
      .select("*, patients!inner(name, insurance_card_no)")
      .single();

    throwIfError(insertError, { table: "queue_items", operation: "insert" });

    const { error: updateError } = await supabase
      .from("patients")
      .update({ status: "pending-treatment" })
      .eq("id", patientId);

    throwIfError(updateError, { table: "patients", operation: "update" });

    return toQueueItem(inserted!);
  },

  /** 刷卡签到（按医保卡号后四位 + 房间） */
  async checkInByRoom(
    insuranceCardSuffix: string,
    region: string
  ): Promise<RoomCheckIn> {
    // 1. 按卡号后四位查待治疗患者
    const { data: patients, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .ilike("insurance_card_no", `%${insuranceCardSuffix}`)
      .in("status", ["pending-treatment", "treating"]);

    throwIfError(patientError, { table: "patients", operation: "select" });

    if (!patients?.length) {
      throw new Error("未找到待治疗患者，请确认卡号");
    }

    const patient = toPatient(patients[0]!);

    // 2. 获取活跃 consultation
    const consultationId = await consultationHelper.getActiveId(patient.id);

    // 3. 获取全部 steps 和本房间 steps
    const allSteps = await prescriptionStepsService.getStepsByConsultation(consultationId);
    const stepsInThisRoom = allSteps.filter((s) => s.region === region);

    // 4. 计算还需去的房间
    const pendingSteps = allSteps.filter(
      (s) => s.status === "pending" || s.status === "in-progress"
    );
    const remainingRooms = [
      ...new Set(pendingSteps.filter((s) => s.region !== region).map((s) => s.region)),
    ];

    // 5. 更新患者状态为 treating（如果还是 pending-treatment）
    if (patient.status === "pending-treatment") {
      const { error } = await supabase
        .from("patients")
        .update({ status: "treating" })
        .eq("id", patient.id);
      throwIfError(error, { table: "patients", operation: "update" });
      patient.status = "treating";
    }

    // 6. 创建本房间的 treatment_record
    const { error: recordError } = await supabase
      .from("treatment_records")
      .insert({
        consultation_id: consultationId,
        region,
        start_time: new Date().toISOString(),
      });

    throwIfError(recordError, { table: "treatment_records", operation: "insert" });

    // 7. 开始本房间步骤
    await prescriptionStepsService.startRoomSteps(consultationId, region);

    return { patient, stepsInThisRoom, allSteps, remainingRooms };
  },

  /** 完成本房间治疗 */
  async completeRoom(
    consultationId: string,
    region: string
  ): Promise<RoomCompleteResult> {
    // 1. 查找本房间的 treatment_record
    const { data: record, error: recordError } = await supabase
      .from("treatment_records")
      .select("id, start_time")
      .eq("consultation_id", consultationId)
      .eq("region", region)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(recordError, { table: "treatment_records", operation: "select" });

    if (record) {
      // 更新 end_time 和 duration
      const now = new Date().toISOString();
      const startTime = new Date(record.start_time!).getTime();
      const endTime = new Date(now).getTime();
      const duration = Math.round((endTime - startTime) / 1000);

      const { error } = await supabase
        .from("treatment_records")
        .update({ end_time: now, duration })
        .eq("id", record.id);

      throwIfError(error, { table: "treatment_records", operation: "update" });

      // 2. 完成本房间步骤
      await prescriptionStepsService.completeRoomSteps(
        consultationId,
        region,
        record.id
      );
    }

    // 3. 检查全部步骤是否完成
    return prescriptionStepsService.checkAllCompleted(consultationId);
  },

  /** 完成全部治疗（保存治疗后数据 + 出队） */
  async completeTreatment(
    patientId: string,
    postVitals?: VitalSigns,
    postScaleResult?: ScaleResult
  ): Promise<void> {
    // 1. 查找治疗队列记录
    const { data: queueItem, error: findError } = await supabase
      .from("queue_items")
      .select("id, consultation_id")
      .eq("patient_id", patientId)
      .eq("queue_type", "treatment")
      .in("status", ["waiting", "in-progress"])
      .order("enqueued_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(findError, { table: "queue_items", operation: "select" });

    if (!queueItem) {
      throw new Error("未找到该患者的治疗队列记录");
    }

    const consultationId = queueItem.consultation_id;

    // 2. 保存治疗后生理数据
    if (postVitals) {
      const payload = fromVitalSigns(postVitals, consultationId, "post-treatment");
      const { error } = await supabase.from("vital_signs").insert(payload);
      throwIfError(error, { table: "vital_signs", operation: "insert" });
    }

    // 3. 保存治疗后量表结果
    if (postScaleResult) {
      const payload = fromScaleResult(postScaleResult, consultationId, "post");
      const { error } = await supabase.from("scale_results").insert(payload);
      throwIfError(error, { table: "scale_results", operation: "insert" });
    }

    // 4. 更新队列状态
    const { error: updateError } = await supabase
      .from("queue_items")
      .update({ status: "completed" })
      .eq("id", queueItem.id);

    throwIfError(updateError, { table: "queue_items", operation: "update" });

    // 5. 更新患者状态
    const { error: patientError } = await supabase
      .from("patients")
      .update({ status: "completed" })
      .eq("id", patientId);

    throwIfError(patientError, { table: "patients", operation: "update" });

    // 6. 完成 consultation
    await consultationHelper.complete(consultationId);
  },

  /** 按区域获取治疗队列（中终端用） */
  async getTreatmentQueueByRegion(region: string): Promise<QueueItem[]> {
    // 查找该区域有 pending/in-progress 步骤的患者的治疗队列项
    const { data, error } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("queue_type", "treatment")
      .eq("status", "waiting")
      .order("queue_number", { ascending: true });

    throwIfError(error, { table: "queue_items", operation: "select" });

    if (!data?.length) return [];

    // 过滤出在该区域有步骤的患者
    const items = (data ?? []).map(toQueueItem);
    const patientIds = items.map((i) => i.patientId);

    const { data: steps, error: stepError } = await supabase
      .from("prescription_steps")
      .select("prescriptions!inner(consultations!inner(patient_id))")
      .eq("region", region)
      .in("status", ["pending", "in-progress"]);

    throwIfError(stepError, { table: "prescription_steps", operation: "select" });

    const regionPatientIds = new Set(
      (steps ?? []).map((s: any) => s.prescriptions.consultations.patient_id)
    );

    return items.filter((i) => regionPatientIds.has(i.patientId));
  },

  /** 保留旧的叫号方法（兼容，后续废弃） */
  async callNextTreatment(): Promise<QueueItem | null> {
    const { data: next, error: selectError } = await supabase
      .from("queue_items")
      .select("*, patients!inner(name, insurance_card_no)")
      .eq("queue_type", "treatment")
      .eq("status", "waiting")
      .order("queue_number", { ascending: true })
      .limit(1)
      .maybeSingle();

    throwIfError(selectError, { table: "queue_items", operation: "select" });
    if (!next) return null;

    const { error: updateError } = await supabase
      .from("queue_items")
      .update({ status: "in-progress" })
      .eq("id", next.id);

    throwIfError(updateError, { table: "queue_items", operation: "update" });

    return toQueueItem({ ...next, status: "in-progress" });
  },
};
