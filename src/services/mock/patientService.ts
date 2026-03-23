import type { Patient, VitalSigns, PatientHistoryRecord } from "../types";
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

  /** 患者签到（复诊：重置状态） */
  checkIn: async (patientId: string): Promise<void> => {
    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      patient.status = "checked-in";
    }
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
    vitals: VitalSigns,
    _stage?: "pre-treatment" | "post-treatment"
  ): Promise<void> => {
    vitalSignsStore.set(patientId, vitals);
  },

  /** 获取患者生理数据（内部辅助方法） */
  getVitalSigns: async (patientId: string): Promise<VitalSigns | null> => {
    return vitalSignsStore.get(patientId) ?? null;
  },

  /** 搜索患者（按姓名或医保卡号模糊匹配） */
  searchPatients: async (keyword: string): Promise<Patient[]> => {
    const trimmed = keyword.trim().toLowerCase();
    if (!trimmed) return [];
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(trimmed) ||
        p.insuranceCardNo.toLowerCase().includes(trimmed)
    );
  },

  /** 获取患者历史就诊记录（mock 返回模拟数据） */
  getPatientHistory: async (patientId: string): Promise<PatientHistoryRecord[]> => {
    const patient = patients.find((p) => p.id === patientId);
    if (!patient) return [];
    // 返回模拟历史记录
    return [
      {
        consultationId: "mock-c1",
        date: "2024-01-10T09:00:00Z",
        contraindications: ["高血压", "心脏病"],
        scaleScore: 72,
        projects: ["五音疗法-宫调", "太极导引"],
      },
      {
        consultationId: "mock-c2",
        date: "2024-01-03T10:30:00Z",
        contraindications: ["高血压"],
        scaleScore: 68,
        projects: ["音乐冥想-深度放松"],
      },
    ];
  },
};
