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

  /** 获取患者当前活跃 Consultation ID，没有则自动创建 */
  async getActiveId(patientId: string): Promise<string> {
    const { data, error } = await supabase
      .from("consultations")
      .select("id")
      .eq("patient_id", patientId)
      .eq("status", "in-progress")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    throwIfError(error, { table: "consultations", operation: "select" });

    if (!data) {
      // 没有活跃会话，自动创建一个
      return this.create(patientId);
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
