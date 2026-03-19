// src/services/supabase/mappersFlow.ts — 流程数据映射（Queue / TherapyProject / Prescription）
import type { Tables, TablesInsert } from "@/types/supabase";
import type {
  QueueItem,
  TherapyProject,
  PrescriptionData,
} from "../types";

// ─── QueueItem ──────────────────────────────────────────────────────

export function toQueueItem(
  row: Tables<"queue_items"> & {
    patients: { name: string; insurance_card_no: string | null };
  }
): QueueItem {
  return {
    id: row.id,
    patientId: row.patient_id,
    patientName: row.patients.name,
    insuranceCardNo: row.patients.insurance_card_no ?? "",
    queueNumber: row.queue_number,
    status: row.status,
    enqueuedAt: row.enqueued_at,
  };
}

// ─── TherapyProject ─────────────────────────────────────────────────

export function toTherapyProject(
  row: Tables<"therapy_projects">
): TherapyProject {
  const rawRow = row as Tables<"therapy_projects"> & { contraindications?: unknown };
  return {
    id: row.id,
    region: row.region ?? "",
    name: row.name,
    mechanism: row.mechanism ?? "",
    guidanceScript: row.guidance_script ?? null,
    bpm: row.bpm ?? null,
    mood: row.mood ?? "",
    energyLevel: row.energy_level ?? "",
    hasGuidance: row.has_guidance,
    hasScenario: row.has_scenario,
    targetAudience: row.target_audience ?? "",
    contraindications: Array.isArray(rawRow.contraindications)
      ? (rawRow.contraindications as string[])
      : [],
  };
}

// ─── Prescription (write-only) ──────────────────────────────────────

export function fromPrescription(
  prescription: PrescriptionData,
  consultationId: string
): TablesInsert<"prescriptions"> {
  return {
    consultation_id: consultationId,
    meta: prescription.meta as unknown as TablesInsert<"prescriptions">["meta"],
    herbs: prescription.herbs as unknown as TablesInsert<"prescriptions">["herbs"],
    total_amount: prescription.totalAmount,
  };
}
