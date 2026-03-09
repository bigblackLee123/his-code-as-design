import type { PrescriptionData } from "../types";

// In-memory prescription store (patientId → PrescriptionData)
const prescriptionStore: Map<string, PrescriptionData> = new Map();

export const prescriptionService = {
  /** 保存处方 */
  save: async (
    patientId: string,
    prescription: PrescriptionData
  ): Promise<void> => {
    prescriptionStore.set(patientId, prescription);
  },
};
