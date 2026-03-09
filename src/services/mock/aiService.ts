import type {
  VitalSigns,
  Contraindication,
  ScaleResult,
  AISuggestion,
} from "../types";

/** 模拟 1-2 秒延迟 */
function randomDelay(): Promise<void> {
  const ms = 1000 + Math.random() * 1000;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const aiService = {
  /** 获取 AI 处方建议（模拟延迟返回） */
  getSuggestion: async (_data: {
    vitals: VitalSigns;
    contraindications: Contraindication[];
    scaleResult: ScaleResult | null;
  }): Promise<AISuggestion> => {
    await randomDelay();

    return {
      id: `AI-${Date.now()}`,
      herbs: [
        { name: "黄芪", dosage: 30, unit: "g", reason: "补气固表" },
        { name: "当归", dosage: 15, unit: "g", reason: "补血活血" },
        { name: "白术", dosage: 15, unit: "g", reason: "健脾益气" },
        { name: "防风", dosage: 10, unit: "g", reason: "祛风解表" },
        { name: "陈皮", dosage: 10, unit: "g", reason: "理气健脾" },
        { name: "甘草", dosage: 6, unit: "g", reason: "调和诸药" },
      ],
      usage: "水煎服，每日一剂，分早晚两次温服",
      notes: "忌食生冷、辛辣刺激性食物，注意保暖休息",
      confidence: 0.85,
      generatedAt: new Date().toISOString(),
    };
  },
};
