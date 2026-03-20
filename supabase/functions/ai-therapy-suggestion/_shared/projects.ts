import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

export interface CandidateProject {
  id: string;
  region: string;
  name: string;
  bpm: number | null;
  mood: string | null;
  energyLevel: string | null;
  targetAudience: string | null;
}

/**
 * 从 therapy_projects 表查询所有项目，
 * 用代码排除与患者禁忌症冲突的项目，返回候选列表。
 */
export async function loadCandidateProjects(
  supabase: ReturnType<typeof createClient>,
  patientContraindications: string[],
): Promise<CandidateProject[]> {
  const { data, error } = await supabase
    .from("therapy_projects")
    .select("id, region, name, bpm, mood, energy_level, target_audience, contraindications");

  if (error) {
    throw new Error(`查询 therapy_projects 失败: ${error.message}`);
  }

  const rows = data ?? [];
  const banned = new Set(patientContraindications);

  return rows
    .filter((row: { contraindications: string[] | null }) => {
      const projContra: string[] = row.contraindications ?? [];
      // 只要项目的任一禁忌症命中患者禁忌，就排除
      return !projContra.some((c: string) => banned.has(c));
    })
    .map((row: Record<string, unknown>) => ({
      id: row.id as string,
      region: (row.region as string) ?? "",
      name: row.name as string,
      bpm: row.bpm as number | null,
      mood: (row.mood as string) ?? null,
      energyLevel: (row.energy_level as string) ?? null,
      targetAudience: (row.target_audience as string) ?? null,
    }));
}
