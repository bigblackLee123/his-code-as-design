import type { QueueItem } from "../types";
import { mockPatients } from "./data/patients";

const DEFAULT_MAX_QUEUE_SIZE = 20;

// In-memory waiting queue (departmentId → QueueItem[])
const waitingQueues: Map<string, QueueItem[]> = new Map();

// In-memory treatment queue
const treatmentQueue: QueueItem[] = [];

// Queue number counters
let waitingQueueCounter = 0;
let treatmentQueueCounter = 0;

export const queueService = {
  /** 获取候诊队列 */
  getWaitingQueue: async (departmentId: string): Promise<QueueItem[]> => {
    const queue = waitingQueues.get(departmentId) ?? [];
    return queue.filter((item) => item.status === "waiting");
  },

  /** 患者入队（候诊） */
  enqueueWaiting: async (
    patientId: string,
    departmentId: string
  ): Promise<QueueItem> => {
    const queue = waitingQueues.get(departmentId) ?? [];
    const waitingCount = queue.filter((i) => i.status === "waiting").length;

    if (waitingCount >= DEFAULT_MAX_QUEUE_SIZE) {
      throw new Error("候诊队列已满，请稍后再试");
    }

    // 从患者数据中获取姓名和医保卡号
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) {
      throw new Error(`患者不存在: ${patientId}`);
    }

    waitingQueueCounter++;
    const item: QueueItem = {
      id: `WQ-${Date.now()}-${waitingQueueCounter}`,
      patientId,
      patientName: patient.name,
      insuranceCardNo: patient.insuranceCardNo,
      consultationId: `mock-consult-${patientId}`,
      queueNumber: waitingQueueCounter,
      status: "waiting",
      enqueuedAt: new Date().toISOString(),
    };

    queue.push(item);
    waitingQueues.set(departmentId, queue);
    return item;
  },

  /** 叫号（候诊） */
  callNextWaiting: async (
    departmentId: string
  ): Promise<QueueItem | null> => {
    const queue = waitingQueues.get(departmentId) ?? [];
    const next = queue.find((item) => item.status === "waiting");
    if (!next) return null;

    next.status = "in-progress";
    return { ...next };
  },

  /** 获取治疗队列 */
  getTreatmentQueue: async (): Promise<QueueItem[]> => {
    return treatmentQueue.filter((item) => item.status === "waiting");
  },

  /** 患者入队（治疗） */
  enqueueTreatment: async (patientId: string): Promise<QueueItem> => {
    // 从患者数据中获取姓名和医保卡号
    const patient = mockPatients.find((p) => p.id === patientId);
    if (!patient) {
      throw new Error(`患者不存在: ${patientId}`);
    }

    treatmentQueueCounter++;
    const item: QueueItem = {
      id: `TQ-${Date.now()}-${treatmentQueueCounter}`,
      patientId,
      patientName: patient.name,
      insuranceCardNo: patient.insuranceCardNo,
      consultationId: `mock-consult-${patientId}`,
      queueNumber: treatmentQueueCounter,
      status: "waiting",
      enqueuedAt: new Date().toISOString(),
    };

    treatmentQueue.push(item);
    return item;
  },

  /** 叫号（治疗） */
  callNextTreatment: async (): Promise<QueueItem | null> => {
    const next = treatmentQueue.find((item) => item.status === "waiting");
    if (!next) return null;

    next.status = "in-progress";
    return { ...next };
  },

  /** 患者出队（治疗完成） */
  completeTreatment: async (queueItemId: string): Promise<void> => {
    const item = treatmentQueue.find((i) => i.id === queueItemId);
    if (!item) {
      throw new Error(`治疗队列项不存在: ${queueItemId}`);
    }
    item.status = "completed";
  },

  /** 获取队列最大容量 */
  getMaxQueueSize: async (_departmentId: string): Promise<number> => {
    return DEFAULT_MAX_QUEUE_SIZE;
  },

  /** 按区域获取治疗队列（中终端用，mock 返回全部治疗队列） */
  getTreatmentQueueByRegion: async (_region: string): Promise<QueueItem[]> => {
    return treatmentQueue.filter((item) => item.status === "waiting");
  },

  /** 过号（将患者移到队列末尾） */
  skipPatient: async (queueItemId: string): Promise<QueueItem> => {
    const queue = Array.from(waitingQueues.values()).flat();
    const item = queue.find((i) => i.id === queueItemId);
    if (!item) {
      throw new Error(`队列项不存在: ${queueItemId}`);
    }

    const maxQueueNumber = Math.max(...queue.map((i) => i.queueNumber), 0);
    item.queueNumber = maxQueueNumber + 1;
    return { ...item };
  },

  /** 移出队列（患者不来了） */
  removeFromQueue: async (queueItemId: string): Promise<void> => {
    for (const [, queue] of waitingQueues) {
      const idx = queue.findIndex((i) => i.id === queueItemId);
      if (idx !== -1) {
        queue[idx]!.status = "completed";
        return;
      }
    }
  },
};
