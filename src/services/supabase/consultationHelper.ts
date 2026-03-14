import { supabase } from "./client";
import { throwIfError } from "./errorHelper";

export const consultationHelper = {
  /** 创建新 Consultation，返回 consultation ID */
  async create(patientId: string): Promise<string> {
    const { data, error } = await supabase
      .from("consultations")
      .insert({ patient_id: patientId, status: "in-progress" })
      .select("id")
      .single();

    throwIfError(error, { table: "consultations", operation: "insert" });
    return data!.id;
  },

  /** 获取患者当前活跃 Consultation ID */
  async getActiveId(patientId: string): Promise<string> {
    const { data, error } = await supabase
      .from("consultations")
      .select("id")
      .eq("patient_id", patientId)
      .eq("status", "in-progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    throwIfError(error, { table: "consultations", operation: "select" });

    if (!data) {
      throw new Error("该患者没有活跃的诊疗会话");
    }

    return data.id;
  },

  /** 完成 Consultation */
  async complete(consultationId: string): Promise<void> {
    const { error } = await supabase
      .from("consultations")
      .update({ status: "completed" })
      .eq("id", consultationId);

    throwIfError(error, { table: "consultations", operation: "update" });
  },
};
