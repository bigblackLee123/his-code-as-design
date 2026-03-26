import type { QueueItem, RoomCheckIn, RoomCompleteResult, VitalSigns, ScaleResult, PrescriptionStep } from "../types";
import { mockPatients } from "./data/patients";
import { mockTherapyProjects } from "./data/therapyProjects";
import { consultationHelper } from "./consultationHelper";

/** 内存治疗队列 */
const treatmentQueue: QueueItem[] = [];
let queueCounter = 0;

/** 生成 mock 处方步骤 */
function buildMockSteps(consultationId: string, region: string): PrescriptionStep[] {
  const projects = mockTherapyProjects.filter((p) => p.region === region).slice(0, 2);
  if (projects.length === 0) {
    // 兜底：至少给一个步骤
    const fallback = mockTherapyProjects[0];
    if (!fallback) return [];
    projects.push(fallback);
  }
  return projects.map((p, i) => ({
    id: `mock-step-${Date.now()}-${i}`,
    prescriptionId: `mock-rx-${consultationId}`,
    projectId: p.id,
    projectName: p.name,
    region,
    sortOrder: i,
    status: "pending" as const,
    startedAt: null,
    completedAt: null,
    treatmentRecordId: null,
  }));
}

export const treatmentQueueService = {
  async getTreatmentQueue(): Promise<QueueItem[]> {
    return treatmentQueue.filter((i) => i.status === "waiting");
  },

  async enqueueTreatment(patientId: string): Promise<QueueItem> {
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) throw new Error(`患者不存在: ${patientId}`);

    queueCounter++;
    const item: QueueItem = {
      id: `TQ-${Date.now()}-${queueCounter}`,
      patientId,
      patientName: patient.name,
      insuranceCardNo: patient.insuranceCardNo,
      consultationId: `mock-consult-${patientId}`,
      queueNumber: queueCounter,
      status: "waiting",
      enqueuedAt: new Date().toISOString(),
    };
    treatmentQueue.push(item);
    return item;
  },

  async checkInByRoom(insuranceCardSuffix: string, region: string): Promise<RoomCheckIn> {
    const patient = mockPatients.find((p) => p.insuranceCardNo.endsWith(insuranceCardSuffix));
    if (!patient) throw new Error("未找到待治疗患者，请确认卡号");

    const consultationId = await consultationHelper.getActiveId(patient.id);
    const stepsInThisRoom = buildMockSteps(consultationId, region);
    const allSteps = stepsInThisRoom; // mock 简化：只有当前房间步骤

    return {
      patient,
      stepsInThisRoom,
      allSteps,
      remainingRooms: [],
    };
  },

  async completeRoom(consultationId: string, _region: string): Promise<RoomCompleteResult> {
    void consultationId;
    return { allDone: true, pendingRegions: [], pendingSteps: [] };
  },

  async completeTreatment(
    patientId: string,
    _postVitals?: VitalSigns,
    _postScaleResult?: ScaleResult,
  ): Promise<void> {
    const idx = treatmentQueue.findIndex(
      (i) => i.patientId === patientId && i.status !== "completed",
    );
    if (idx !== -1) treatmentQueue[idx]!.status = "completed";
  },

  async getTreatmentQueueByRegion(_region: string): Promise<QueueItem[]> {
    return treatmentQueue.filter((i) => i.status === "waiting");
  },

  async callNextTreatment(): Promise<QueueItem | null> {
    const next = treatmentQueue.find((i) => i.status === "waiting");
    if (!next) return null;
    next.status = "in-progress";
    return { ...next };
  },
};
