import type { PatientContext } from "./patient.ts";
import type { CandidateProject } from "./projects.ts";

/** 将候选项目列表格式化为紧凑文本 */
function formatCandidates(candidates: CandidateProject[]): string {
  if (candidates.length === 0) {
    return "（无可用项目，所有项目均与患者禁忌症冲突）";
  }

  const grouped: Record<string, CandidateProject[]> = {};
  for (const p of candidates) {
    const region = p.region || "其他";
    (grouped[region] ??= []).push(p);
  }

  const lines: string[] = [];
  for (const [region, projects] of Object.entries(grouped)) {
    lines.push(`【${region}】`);
    for (const p of projects) {
      const parts = [`${p.name}（ID: ${p.id}）`];
      if (p.bpm != null) parts.push(`BPM ${p.bpm}`);
      if (p.mood) parts.push(`情绪: ${p.mood}`);
      if (p.energyLevel) parts.push(`能量: ${p.energyLevel}`);
      if (p.targetAudience) parts.push(`适用: ${p.targetAudience}`);
      lines.push(`  - ${parts.join("，")}`);
    }
  }
  return lines.join("\n");
}

/** 构建发送给百炼的 user message（患者数据 + 候选项目） */
export function buildUserMessage(
  patient: PatientContext,
  candidates: CandidateProject[],
): string {
  const v = patient.vitals;
  return `患者信息：
- 姓名：${patient.name}
- 生理数据：${v ? `收缩压 ${v.systolicBP}mmHg，舒张压 ${v.diastolicBP}mmHg，心率 ${v.heartRate}次/分` : "暂无"}
- 禁忌症：${patient.contraindications.length > 0 ? patient.contraindications.join("、") : "无"}
- 量表评估：${patient.scaleScore != null ? `总分 ${patient.scaleScore}` : "暂无"}

以下是经过禁忌症排除后的候选疗愈项目（共 ${candidates.length} 个），请只从此列表中选择：

${formatCandidates(candidates)}

请从以上候选项目中选择 2-4 个推荐组合，优先从不同区域各选一个。返回的 projectIds 和 projectNames 必须与上方列表完全一致。`;
}
