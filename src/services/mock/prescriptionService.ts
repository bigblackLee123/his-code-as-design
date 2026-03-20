import type { PrescriptionData, TherapyProject, PrescriptionStep } from "../types";

const prescriptionStore: Map<string, PrescriptionData> = new Map();

export const prescriptionService = {
  /** 保存处方 */
  save: async (
    patientId: string,
    prescription: PrescriptionData
  ): Promise<void> => {
    prescriptionStore.set(patientId, prescription);
  },

  /** Mock: 保存处方 + 拆解 steps */
  saveWithSteps: async (
    patientId: string,
    prescription: PrescriptionData,
    projects: TherapyProject[]
  ): Promise<{ prescriptionId: string; steps: PrescriptionStep[] }> => {
    prescriptionStore.set(patientId, prescription);
    const steps: PrescriptionStep[] = projects.map((p, i) => ({
      id: `mock-step-${i}`,
      prescriptionId: `mock-rx-${patientId}`,
      projectId: p.id,
      projectName: p.name,
      region: p.region,
      sortOrder: i + 1,
      status: "pending" as const,
      startedAt: null,
      completedAt: null,
      treatmentRecordId: null,
    }));
    return { prescriptionId: `mock-rx-${patientId}`, steps };
  },
};
