import type {
  VitalSigns,
  Contraindication,
  ScaleResult,
  AITherapySuggestion,
} from "../types";
import { mockTherapyProjects } from "./data/therapyProjects";

/** 模拟 1-2 秒延迟 */
function randomDelay(): Promise<void> {
  const ms = 1000 + Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const aiService = {
  /** 获取 AI 疗愈建议 — 从三个区域各选一个项目推荐 */
  getTherapySuggestion: async (_data: {
    vitals: VitalSigns;
    contraindications: Contraindication[];
    scaleResult: ScaleResult | null;
  }): Promise<AITherapySuggestion> => {
    await randomDelay();

    // 从睡眠区和情志区各取一个项目作为推荐
    const regions = ["睡眠区", "情志区"] as const;
    const picks = regions
      .map((r) => mockTherapyProjects.find((p) => p.region === r))
      .filter(Boolean);

    return {
      id: `AI-${Date.now()}`,
      projectIds: picks.map((p) => p!.id),
      projectNames: picks.map((p) => p!.name),
      reason:
        "该患者自述近两周入睡困难、易醒，睡眠质量较差，日间精力不足，情绪低落。" +
        "AI 优先从睡眠区选取「舒曼波」——其 7.83Hz 频段与 α 脑波高度吻合，" +
        "可在 15 分钟内显著降低皮质醇水平，改善入睡潜伏期；" +
        "情志区选取「海洋冥想」——自然海浪白噪声叠加引导语，" +
        "临床证据表明对焦虑-抑郁共病患者的 HAMA 评分平均改善 4.2 分。" +
        "两项联合形成「先镇静-后疏导」的阶梯式干预路径，预期 3 次疗程后睡眠质量明显改善。",
      confidence: 0.85,
      generatedAt: new Date().toISOString(),
    };
  },
};
