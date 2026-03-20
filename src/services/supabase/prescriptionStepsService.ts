// src/services/supabase/prescriptionStepsService.ts — 处方执行步骤服务（多房间流转核心）
import type { PrescriptionStep, TherapyProject, RoomCompleteResult } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { toPrescriptionStep } from "./mappersFlow";

/** prescription_steps 的 select 语句（JOIN therapy_projects 取名称） */
const STEP_SELECT = "*, therapy_projects!inner(name, region)";

export const prescriptionStepsService = {
  /** 批量创建处方步骤（每个疗愈项目一条 step） */
  async createSteps(
    prescriptionId: string,
    projects: TherapyProject[]
  ): Promise<PrescriptionStep[]> {
    const rows = projects.map((p, i) => ({
      prescription_id: prescriptionId,
      project_id: p.id,
      region: p.region,
      sort_order: i + 1,
      status: "pending" as const,
    }));

    const { data, error } = await supabase
      .from("prescription_steps")
      .insert(rows)
      .select(STEP_SELECT);

    throwIfError(error, { table: "prescription_steps", operation: "insert" });
    return (data ?? []).map(toPrescriptionStep);
  },

  /** 按就诊 ID 获取全部步骤 */
  async getStepsByConsultation(
    consultationId: string
  ): Promise<PrescriptionStep[]> {
    const { data, error } = await supabase
      .from("prescription_steps")
      .select(`${STEP_SELECT}, prescriptions!inner(consultation_id)`)
      .eq("prescriptions.consultation_id", consultationId)
      .order("sort_order", { ascending: true });

    throwIfError(error, { table: "prescription_steps", operation: "select" });
    return (data ?? []).map(toPrescriptionStep);
  },

  /** 按就诊 ID + 房间获取本房间待做步骤 */
  async getStepsByRegion(
    consultationId: string,
    region: string
  ): Promise<PrescriptionStep[]> {
    const { data, error } = await supabase
      .from("prescription_steps")
      .select(`${STEP_SELECT}, prescriptions!inner(consultation_id)`)
      .eq("prescriptions.consultation_id", consultationId)
      .eq("region", region)
      .order("sort_order", { ascending: true });

    throwIfError(error, { table: "prescription_steps", operation: "select" });
    return (data ?? []).map(toPrescriptionStep);
  },

  /** 开始本房间所有 pending 步骤 */
  async startRoomSteps(
    consultationId: string,
    region: string
  ): Promise<void> {
    // 先查出本房间 pending 的 step ids
    const { data: steps, error: selectError } = await supabase
      .from("prescription_steps")
      .select("id, prescriptions!inner(consultation_id)")
      .eq("prescriptions.consultation_id", consultationId)
      .eq("region", region)
      .eq("status", "pending");

    throwIfError(selectError, { table: "prescription_steps", operation: "select" });

    if (!steps?.length) return;

    const ids = steps.map((s) => s.id);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("prescription_steps")
      .update({ status: "in-progress", started_at: now })
      .in("id", ids);

    throwIfError(error, { table: "prescription_steps", operation: "update" });
  },

  /** 完成本房间所有步骤，回写 treatment_record_id */
  async completeRoomSteps(
    consultationId: string,
    region: string,
    treatmentRecordId: string
  ): Promise<void> {
    const { data: steps, error: selectError } = await supabase
      .from("prescription_steps")
      .select("id, prescriptions!inner(consultation_id)")
      .eq("prescriptions.consultation_id", consultationId)
      .eq("region", region)
      .in("status", ["pending", "in-progress"]);

    throwIfError(selectError, { table: "prescription_steps", operation: "select" });

    if (!steps?.length) return;

    const ids = steps.map((s) => s.id);
    const now = new Date().toISOString();

    const { error } = await supabase
      .from("prescription_steps")
      .update({
        status: "completed",
        completed_at: now,
        treatment_record_id: treatmentRecordId,
      })
      .in("id", ids);

    throwIfError(error, { table: "prescription_steps", operation: "update" });
  },

  /** 检查该就诊的全部步骤是否完成 */
  async checkAllCompleted(
    consultationId: string
  ): Promise<RoomCompleteResult> {
    const allSteps = await this.getStepsByConsultation(consultationId);

    const pendingSteps = allSteps.filter(
      (s) => s.status === "pending" || s.status === "in-progress"
    );
    const pendingRegions = [...new Set(pendingSteps.map((s) => s.region))];

    return {
      allDone: pendingSteps.length === 0,
      pendingRegions,
      pendingSteps,
    };
  },
};
