// src/services/supabase/mappersFlow.ts — 流程数据映射（Queue / TherapyProject / Prescription / PrescriptionStep）
import type { Tables, TablesInsert } from "@/types/supabase";
import type {
  QueueItem,
  TherapyProject,
  PrescriptionData,
  PrescriptionStep,
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

// ─── PrescriptionStep ───────────────────────────────────────────────

export function toPrescriptionStep(
  row: Tables<"prescription_steps"> & {
    therapy_projects: { name: string; region: string | null };
  }
): PrescriptionStep {
  return {
    id: row.id,
    prescriptionId: row.prescription_id,
    projectId: row.project_id,
    projectName: row.therapy_projects.name,
    region: row.region,
    sortOrder: row.sort_order,
    status: row.status,
    startedAt: row.started_at,
    completedAt: row.completed_at,
    treatmentRecordId: row.treatment_record_id,
  };
}

export function fromPrescriptionStepInsert(
  prescriptionId: string,
  projectId: string,
  region: string,
  sortOrder: number
): TablesInsert<"prescription_steps"> {
  return {
    prescription_id: prescriptionId,
    project_id: projectId,
    region,
    sort_order: sortOrder,
    status: "pending",
  };
}
