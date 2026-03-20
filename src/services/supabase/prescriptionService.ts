import type { PrescriptionData, TherapyProject, PrescriptionStep } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { fromPrescription } from "./mappers";
import { prescriptionStepsService } from "./prescriptionStepsService";

export const prescriptionService = {
  /** 保存处方（meta/herbs 为 JSON，关联活跃 Consultation） */
  async save(patientId: string, prescription: PrescriptionData): Promise<void> {
    const consultationId = await consultationHelper.getActiveId(patientId);
    const payload = fromPrescription(prescription, consultationId);

    const { error } = await supabase
      .from("prescriptions")
      .insert(payload);

    throwIfError(error, { table: "prescriptions", operation: "insert" });
  },

  /** 保存处方 + 自动拆解为 prescription_steps（疗愈处方专用） */
  async saveWithSteps(
    patientId: string,
    prescription: PrescriptionData,
    projects: TherapyProject[]
  ): Promise<{ prescriptionId: string; steps: PrescriptionStep[] }> {
    const consultationId = await consultationHelper.getActiveId(patientId);
    const payload = fromPrescription(prescription, consultationId);

    // 1. 插入处方主记录
    const { data, error } = await supabase
      .from("prescriptions")
      .insert(payload)
      .select("id")
      .single();

    throwIfError(error, { table: "prescriptions", operation: "insert" });

    const prescriptionId = data!.id;

    // 2. 拆解为 prescription_steps
    const steps = await prescriptionStepsService.createSteps(prescriptionId, projects);

    return { prescriptionId, steps };
  },
};
