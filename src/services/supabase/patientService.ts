import type { Patient, VitalSigns } from "../types";
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
