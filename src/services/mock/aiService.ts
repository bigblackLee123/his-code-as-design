import type {
  VitalSigns,
  Contraindication,
  ScaleResult,
  AITherapySuggestion,
} from "../types";
import { mockTherapyPackages } from "./data/therapyPackages";

/** 模拟 1-2 秒延迟 */
function randomDelay(): Promise<void> {
  const ms = 1000 + Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const aiService = {
  /** 获取 AI 疗愈套餐建议（模拟延迟返回） */
  getTherapySuggestion: async (_data: {
    vitals: VitalSigns;
    contraindications: Contraindication[];
    scaleResult: ScaleResult | null;
  }): Promise<AITherapySuggestion> => {
    await randomDelay();

    const pkg = mockTherapyPackages[0]!;
    return {
      id: `AI-${Date.now()}`,
      packageId: pkg.id,
      packageName: pkg.name,
      reason: "根据患者生理数据及量表评估，建议采用失眠调理套餐，通过渐进式放松与α波助眠改善睡眠质量",
      confidence: 0.85,
      generatedAt: new Date().toISOString(),
    };
  },
};
