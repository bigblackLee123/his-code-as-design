// src/services/supabase/mappers.ts — 临床数据映射（Patient / VitalSigns / Contraindication / Scale / AI）
import type { Tables, TablesInsert } from "@/types/supabase";
import type {
  Patient,
  VitalSigns,
  Contraindication,
  ScaleTemplate,
  ScaleQuestion,
  ScaleOption,
  ScaleResult,
  AISuggestion,
  AISuggestedHerb,
} from "../types";

// Re-export flow mappers for backward compatibility
export {
  toQueueItem,
  toTherapyProject,
  fromPrescription,
  toPrescriptionStep,
  fromPrescriptionStepInsert,
} from "./mappersFlow";

// ─── Patient ────────────────────────────────────────────────────────

export function toPatient(row: Tables<"patients">): Patient {
  return {
    id: row.id,
    name: row.name,
    gender: row.gender as Patient["gender"],
    age: row.age,
    idNumber: row.id_number ?? "",
    phone: row.phone ?? "",
    insuranceCardNo: row.insurance_card_no ?? "",
    status: row.status,
    createdAt: row.created_at,
  };
}

export function fromPatientCreate(
  data: Omit<Patient, "id" | "status" | "createdAt">
): TablesInsert<"patients"> {
  return {
    name: data.name,
    gender: data.gender,
    age: data.age,
    id_number: data.idNumber,
    phone: data.phone,
    insurance_card_no: data.insuranceCardNo,
    status: "checked-in",
  };
}

// ─── VitalSigns ─────────────────────────────────────────────────────

export function toVitalSigns(row: Tables<"vital_signs">): VitalSigns {
  return {
    systolicBP: row.systolic_bp,
    diastolicBP: row.diastolic_bp,
    heartRate: row.heart_rate,
    recordedAt: row.recorded_at,
    recordedBy: row.recorded_by ?? "",
  };
}

export function fromVitalSigns(
  vitals: VitalSigns,
  consultationId: string,
  stage: "pre-treatment" | "post-treatment"
): TablesInsert<"vital_signs"> {
  return {
    consultation_id: consultationId,
    systolic_bp: vitals.systolicBP,
    diastolic_bp: vitals.diastolicBP,
    heart_rate: vitals.heartRate,
    stage,
    recorded_at: vitals.recordedAt,
    recorded_by: vitals.recordedBy,
  };
}

// ─── Contraindication ───────────────────────────────────────────────

export function toContraindication(
  row: Tables<"contraindications">
): Contraindication {
  return {
    code: row.code,
    name: row.name,
    pinyin: row.pinyin ?? "",
    pinyinInitial: row.pinyin_initial ?? "",
    category: row.category ?? "",
  };
}

// ─── ScaleQuestion / ScaleTemplate ──────────────────────────────────

export function toScaleQuestion(row: Tables<"scale_questions">): ScaleQuestion {
  return {
    id: row.id,
    text: row.text,
    type: row.type,
    required: row.required,
    options: row.options
      ? (row.options as unknown as ScaleOption[])
      : undefined,
    sliderConfig: row.slider_config
      ? (row.slider_config as unknown as { min: number; max: number; step: number })
      : undefined,
  };
}

export function toScaleTemplate(
  row: Tables<"scale_templates">,
  questionRows: Tables<"scale_questions">[]
): ScaleTemplate {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? "",
    questions: questionRows.map(toScaleQuestion),
  };
}

// ─── ScaleResult ────────────────────────────────────────────────────

export function toScaleResult(row: Tables<"scale_results">): ScaleResult {
  return {
    templateId: row.template_id,
    answers: row.answers as unknown as Record<string, string | string[] | number>,
    totalScore: row.total_score ?? undefined,
    submittedAt: row.submitted_at,
  };
}

export function fromScaleResult(
  result: ScaleResult,
  consultationId: string,
  stage: "pre" | "post"
): TablesInsert<"scale_results"> {
  return {
    consultation_id: consultationId,
    template_id: result.templateId,
    stage,
    answers: result.answers as unknown as TablesInsert<"scale_results">["answers"],
    total_score: result.totalScore ?? null,
    submitted_at: result.submittedAt,
  };
}

// ─── AISuggestion ───────────────────────────────────────────────────

export function toAISuggestion(row: Tables<"ai_suggestions">): AISuggestion {
  return {
    id: row.id,
    herbs: row.herbs
      ? (row.herbs as unknown as AISuggestedHerb[])
      : [],
    usage: row.usage ?? "",
    notes: row.notes ?? "",
    confidence: row.confidence ?? 0,
    generatedAt: row.generated_at,
  };
}
