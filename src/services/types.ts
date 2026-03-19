// services/types.ts — 共享类型定义

/** 患者基本信息 */
export interface Patient {
  id: string;
  name: string;
  gender: "male" | "female";
  age: number;
  idNumber: string;
  phone: string;
  insuranceCardNo: string;
  status: PatientStatus;
  createdAt: string;
}

/** 患者流程状态 */
export type PatientStatus =
  | "checked-in"        // 已签到
  | "waiting"           // 候诊中
  | "consulting"        // 就诊中
  | "pending-treatment" // 待治疗
  | "treating"          // 治疗中
  | "completed";        // 已完成

/** 生理数据 */
export interface VitalSigns {
  systolicBP: number;   // 收缩压 40-300 mmHg
  diastolicBP: number;  // 舒张压 20-200 mmHg
  heartRate: number;    // 心率 20-300 次/分
  recordedAt: string;
  recordedBy: string;
}

/** 生理数据校验规则 */
export const VITAL_SIGNS_RULES = {
  systolicBP: { min: 40, max: 300, unit: "mmHg", label: "收缩压" },
  diastolicBP: { min: 20, max: 200, unit: "mmHg", label: "舒张压" },
  heartRate: { min: 20, max: 300, unit: "次/分", label: "心率" },
} as const;

/** 生理数据异常阈值 */
export const VITAL_SIGNS_ALERT_THRESHOLDS = {
  systolicBP: 180,
  diastolicBP: 120,
  heartRate: 150,
} as const;

/** 禁忌症条目 */
export interface Contraindication {
  code: string;
  name: string;
  pinyin: string;        // 拼音全拼
  pinyinInitial: string; // 拼音首字母
  category: string;
}

/** 症状条目 */
export interface Symptom {
  name: string;
  pinyin: string;        // 拼音全拼
  pinyinInitial: string; // 拼音首字母
}

/** 量表模板 */
export interface ScaleTemplate {
  id: string;
  name: string;
  description: string;
  questions: ScaleQuestion[];
}

/** 量表题目 */
export interface ScaleQuestion {
  id: string;
  text: string;
  type: "single-choice" | "multi-choice" | "slider" | "text";
  required: boolean;
  options?: ScaleOption[];    // 单选/多选的选项
  sliderConfig?: { min: number; max: number; step: number }; // 滑块配置
}

/** 量表选项 */
export interface ScaleOption {
  value: string;
  label: string;
  score?: number;
}

/** 量表填写结果 */
export interface ScaleResult {
  templateId: string;
  answers: Record<string, string | string[] | number>;
  totalScore?: number;
  submittedAt: string;
}

/** AI 处方建议 */
export interface AISuggestion {
  id: string;
  herbs: AISuggestedHerb[];
  usage: string;
  notes: string;
  confidence: number;
  generatedAt: string;
}

/** AI 建议药材 */
export interface AISuggestedHerb {
  name: string;
  dosage: number;
  unit: string;
  reason: string;
}

/** 候诊/治疗队列项 */
export interface QueueItem {
  id: string;
  patientId: string;
  patientName: string;
  insuranceCardNo: string; // 医保卡号
  queueNumber: number;
  status: "waiting" | "in-progress" | "completed";
  enqueuedAt: string;
  prescriptionType?: string; // 治疗队列专用
}

/** 治疗记录 */
export interface TreatmentRecord {
  patientId: string;
  startTime: string | null;
  endTime: string | null;
  duration: number | null;  // 秒
  preVitals: VitalSigns;
  postVitals: VitalSigns | null;
  postScaleResult: ScaleResult | null;
}

/** 诊疗数据（医生终端汇总） */
export interface ConsultationData {
  contraindications: Contraindication[];
  symptoms: Symptom[];
  scaleResults: ScaleResult | null;
  aiSuggestion: AISuggestion | AITherapySuggestion | null;
}

/** 处方元数据（与已有 PrescriptionForm 组件对齐） */
export interface PrescriptionMeta {
  route: string;
  usage: string;
  frequency: string;
  dosage: string;
  orderType: string;
  department: string;
  doses: number;
}

/** 中药处方明细项（与已有 HerbGrid 组件对齐） */
export interface HerbItem {
  name: string;
  dosage: number;
  unit: string;
  note?: string;
}

/** 处方数据 */
export interface PrescriptionData {
  meta: PrescriptionMeta;
  herbs: HerbItem[];
  totalAmount: number;
}

/** 治疗终端患者（含完整诊疗信息） */
export interface TreatmentPatient extends Patient {
  vitalSigns: VitalSigns;
  contraindications: Contraindication[];
  projects: TherapyProject[];
}

/** 治疗状态 */
export interface TreatmentState {
  status: "idle" | "treating" | "post-vitals" | "post-scale" | "completing";
  startTime: Date | null;
  endTime: Date | null;
}

/** 疗愈项目 */
export interface TherapyProject {
  id: string;
  region: string;
  name: string;
  mechanism: string;
  guidanceScript: string | null;
  bpm: number | null;
  mood: string;
  energyLevel: string;
  hasGuidance: boolean;
  hasScenario: boolean;
  targetAudience: string;
  contraindications: string[];
}

/** AI 疗愈建议（推荐多个项目） */
export interface AITherapySuggestion {
  id: string;
  projectIds: string[];
  projectNames: string[];
  reason: string;
  confidence: number;
  generatedAt: string;
}
