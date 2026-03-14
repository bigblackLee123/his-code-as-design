import type { QueueItem } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { toQueueItem } from "./mappers";

export const treatmentQueueService = {
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

    const { error: patientError } = await supabase
      .from("patients")
      .update({ status: "treating" })
      .eq("id", next.patient_id);

    throwIfError(patientError, { table: "patients", operation: "update" });

    const { error: treatmentError } = await supabase
      .from("treatment_records")
      .upsert(
        {
          consultation_id: next.consultation_id,
          start_time: new Date().toISOString(),
        },
        { onConflict: "consultation_id" }
      );

    throwIfError(treatmentError, {
      table: "treatment_records",
      operation: "insert",
    });

    return toQueueItem({ ...next, status: "in-progress" });
  },

  async completeTreatment(patientId: string): Promise<void> {
      // 1. 查找该患者当前 in-progress 的治疗队列记录
      const { data: queueItem, error: findError } = await supabase
        .from("queue_items")
        .select("id, consultation_id, patient_id")
        .eq("patient_id", patientId)
        .eq("queue_type", "treatment")
        .eq("status", "in-progress")
        .order("enqueued_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      throwIfError(findError, { table: "queue_items", operation: "select" });

      if (!queueItem) {
        throw new Error("未找到该患者的治疗中队列记录");
      }

      // 2. 更新队列状态为 completed
      const { error: updateError } = await supabase
        .from("queue_items")
        .update({ status: "completed" })
        .eq("id", queueItem.id);

      throwIfError(updateError, { table: "queue_items", operation: "update" });

      const consultationId = queueItem.consultation_id;

      // 3. 更新 treatment_records：设置 end_time 和 duration
      const now = new Date().toISOString();

      const { data: treatmentRecord, error: fetchError } = await supabase
        .from("treatment_records")
        .select("start_time")
        .eq("consultation_id", consultationId)
        .single();

      throwIfError(fetchError, {
        table: "treatment_records",
        operation: "select",
      });

      const startTime = new Date(treatmentRecord!.start_time!).getTime();
      const endTime = new Date(now).getTime();
      const duration = Math.round((endTime - startTime) / 1000);

      const { error: treatmentUpdateError } = await supabase
        .from("treatment_records")
        .update({ end_time: now, duration })
        .eq("consultation_id", consultationId);

      throwIfError(treatmentUpdateError, {
        table: "treatment_records",
        operation: "update",
      });

      // 4. 更新患者状态为 completed
      const { error: patientError } = await supabase
        .from("patients")
        .update({ status: "completed" })
        .eq("id", patientId);

      throwIfError(patientError, { table: "patients", operation: "update" });

      // 5. 完成 Consultation
      await consultationHelper.complete(consultationId);
    }
,
};
