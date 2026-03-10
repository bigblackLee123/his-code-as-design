import type { Patient, VitalSigns } from "../types";
import { mockPatients } from "./data/patients";

// In-memory patient store (cloned from mock data)
const patients: Patient[] = [...mockPatients];

// In-memory vital signs store (patientId → VitalSigns)
const vitalSignsStore: Map<string, VitalSigns> = new Map();

let nextId = patients.length + 1;

export const patientService = {
  /** 通过患者 ID 查询患者 */
  getById: async (patientId: string): Promise<Patient | null> => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ?? null;
  },

  /** 通过医保卡号查询患者 */
  getByInsuranceCard: async (cardNo: string): Promise<Patient | null> => {
    const patient = patients.find((p) => p.insuranceCardNo === cardNo);
    return patient ?? null;
  },

  /** 创建新患者档案 */
  create: async (
    data: Omit<Patient, "id" | "status" | "createdAt">
  ): Promise<Patient> => {
    const newPatient: Patient = {
      ...data,
      id: `P${String(nextId++).padStart(3, "0")}`,
      status: "checked-in",
      createdAt: new Date().toISOString(),
    };
    patients.push(newPatient);
    return newPatient;
  },

  /** 保存生理数据 */
  saveVitalSigns: async (
    patientId: string,
    vitals: VitalSigns
  ): Promise<void> => {
    vitalSignsStore.set(patientId, vitals);
  },

  /** 获取患者生理数据（内部辅助方法） */
  getVitalSigns: async (patientId: string): Promise<VitalSigns | null> => {
    return vitalSignsStore.get(patientId) ?? null;
  },
};
