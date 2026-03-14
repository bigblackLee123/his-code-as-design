import type { PrescriptionData } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { fromPrescription } from "./mappers";

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
};
