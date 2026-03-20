import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export interface PatientContext {
  name: string;
  vitals: { systolicBP: number; diastolicBP: number; heartRate: number } | null;
  contraindications: string[];
  scaleScore: number | null;
}

/** 通过 consultationId 从 DB 聚合患者上下文 */
export async function loadPatientContext(
  supabase: ReturnType<typeof createClient>,
  consultationId: string
): Promise<PatientContext> {
  const [vitalsRes, contrRes, scaleRes, consultRes] = await Promise.all([
    supabase
      .from("vital_signs")
      .select("systolic_bp, diastolic_bp, heart_rate")
      .eq("consultation_id", consultationId)
      .eq("stage", "pre-treatment")
      .order("recorded_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("consultation_contraindications")
      .select("contraindications(name)")
      .eq("consultation_id", consultationId),
    supabase
      .from("scale_results")
      .select("total_score")
      .eq("consultation_id", consultationId)
      .eq("stage", "pre")
      .order("submitted_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("consultations")
      .select("patients(name)")
      .eq("id", consultationId)
      .single(),
  ]);

  const v = vitalsRes.data;
  return {
    name:
      (consultRes.data?.patients as { name: string } | null)?.name ?? "未知",
    vitals: v
      ? { systolicBP: v.systolic_bp, diastolicBP: v.diastolic_bp, heartRate: v.heart_rate }
      : null,
    contraindications: (contrRes.data ?? [])
      .map((c: { contraindications: { name: string } | null }) => c.contraindications?.name ?? "")
      .filter(Boolean),
    scaleScore: scaleRes.data?.total_score ?? null,
  };
}

/** 从前端直传的旧格式构建 PatientContext */
export function buildPatientContextFromBody(body: {
  vitals?: { systolicBP: number; diastolicBP: number; heartRate: number };
  contraindications?: { name: string }[];
  scaleResult?: { totalScore?: number };
}): PatientContext {
  return {
    name: "未知",
    vitals: body.vitals ?? null,
    contraindications: (body.contraindications ?? []).map((c) => c.name).filter(Boolean),
    scaleScore: body.scaleResult?.totalScore ?? null,
  };
}
