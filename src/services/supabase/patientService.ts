import type { Patient, VitalSigns, PatientHistoryRecord } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { toPatient, fromPatientCreate, toVitalSigns, fromVitalSigns } from "./mappers";

export const patientService = {
  /** 通过患者 ID 查询患者 */
  async getById(patientId: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("id", patientId)
      .maybeSingle();

    throwIfError(error, { table: "patients", operation: "select" });
    return data ? toPatient(data) : null;
  },

  /** 通过医保卡号查询患者 */
  async getByInsuranceCard(cardNo: string): Promise<Patient | null> {
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("insurance_card_no", cardNo)
      .maybeSingle();

    throwIfError(error, { table: "patients", operation: "select" });
    return data ? toPatient(data) : null;
  },

  /** 患者签到（支持复诊：关闭旧数据，重置状态，创建新 consultation） */
  async checkIn(patientId: string): Promise<void> {
    // 1. 关闭所有未完成的旧 consultation
    const { data: openConsultations, error: selectError } = await supabase
      .from("consultations")
      .select("id")
      .eq("patient_id", patientId)
      .eq("status", "in-progress");

    throwIfError(selectError, { table: "consultations", operation: "select" });

    if (openConsultations?.length) {
      for (const c of openConsultations) {
        await consultationHelper.complete(c.id);
      }
    }

    // 2. 关闭所有未完成的旧 queue_items（waiting / in-progress）
    const { error: queueError } = await supabase
      .from("queue_items")
      .update({ status: "completed" })
      .eq("patient_id", patientId)
      .in("status", ["waiting", "in-progress"]);

    throwIfError(queueError, { table: "queue_items", operation: "update" });

    // 3. 重置患者状态为 checked-in
    const { error: updateError } = await supabase
      .from("patients")
      .update({ status: "checked-in" })
      .eq("id", patientId);

    throwIfError(updateError, { table: "patients", operation: "update" });

    // 4. 创建新 consultation
    await consultationHelper.create(patientId);
  },

  /** 创建新患者档案 + 自动创建 Consultation */
  async create(
    data: Omit<Patient, "id" | "status" | "createdAt">
  ): Promise<Patient> {
    const row = fromPatientCreate(data);

    const { data: inserted, error } = await supabase
      .from("patients")
      .insert(row)
      .select("*")
      .single();

    throwIfError(error, { table: "patients", operation: "insert" });

    // 自动创建 Consultation
    await consultationHelper.create(inserted!.id);

    return toPatient(inserted!);
  },

  /** 保存生理数据（关联活跃 Consultation） */
  async saveVitalSigns(
    patientId: string,
    vitals: VitalSigns,
    stage: "pre-treatment" | "post-treatment" = "pre-treatment"
  ): Promise<void> {
    const consultationId = await consultationHelper.getActiveId(patientId);
    const payload = fromVitalSigns(vitals, consultationId, stage);

    const { error } = await supabase
      .from("vital_signs")
      .insert(payload);

    throwIfError(error, { table: "vital_signs", operation: "insert" });
  },

  /** 搜索患者（按姓名或医保卡号模糊匹配） */
  async searchPatients(keyword: string): Promise<Patient[]> {
    const trimmed = keyword.trim();
    if (!trimmed) return [];

    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .or(`name.ilike.%${trimmed}%,insurance_card_no.ilike.%${trimmed}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    throwIfError(error, { table: "patients", operation: "select" });
    return (data ?? []).map(toPatient);
  },

  /** 获取患者历史就诊记录 */
  async getPatientHistory(patientId: string): Promise<PatientHistoryRecord[]> {
    // 查询已完成的 consultations
    const { data: consultations, error: cError } = await supabase
      .from("consultations")
      .select("id, created_at")
      .eq("patient_id", patientId)
      .eq("status", "completed")
      .order("created_at", { ascending: false })
      .limit(5);

    throwIfError(cError, { table: "consultations", operation: "select" });
    if (!consultations?.length) return [];

    const records: PatientHistoryRecord[] = [];

    for (const c of consultations) {
      // 禁忌症
      const { data: contras } = await supabase
        .from("consultation_contraindications")
        .select("contraindications!inner(name)")
        .eq("consultation_id", c.id);

      // 量表评分
      const { data: scales } = await supabase
        .from("scale_results")
        .select("total_score")
        .eq("consultation_id", c.id)
        .eq("stage", "pre")
        .limit(1)
        .maybeSingle();

      // 治疗项目
      const { data: steps } = await supabase
        .from("prescription_steps")
        .select("therapy_projects!inner(name), prescriptions!inner(consultation_id)")
        .eq("prescriptions.consultation_id", c.id);

      records.push({
        consultationId: c.id,
        date: c.created_at,
        contraindications: (contras ?? []).map((r: any) => r.contraindications.name),
        scaleScore: scales?.total_score ?? null,
        projects: (steps ?? []).map((s: any) => s.therapy_projects.name),
      });
    }

    return records;
  },

  /** 获取患者最近一次生理数据 */
  async getVitalSigns(patientId: string): Promise<VitalSigns | null> {
    const { data, error } = await supabase
      .from("vital_signs")
      .select("*, consultations!inner(patient_id)")
      .eq("consultations.patient_id", patientId)
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(error, { table: "vital_signs", operation: "select" });
    return data ? toVitalSigns(data) : null;
  },
};
