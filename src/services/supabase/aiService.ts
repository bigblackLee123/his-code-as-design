import type {
  VitalSigns,
  Contraindication,
  ScaleResult,
  AITherapySuggestion,
} from "../types";
import { supabase } from "./client";

export const aiService = {
  /**
   * 获取 AI 疗愈建议
   * 优先用 consultationId（Edge Function 自行查 DB 聚合数据）
   * 兼容旧模式：直传 vitals / contraindications / scaleResult
   */
  async getTherapySuggestion(data: {
    consultationId?: string;
    vitals: VitalSigns;
    contraindications: Contraindication[];
    scaleResult: ScaleResult | null;
  }): Promise<AITherapySuggestion> {
    const body = data.consultationId
      ? { consultationId: data.consultationId }
      : {
          vitals: data.vitals,
          contraindications: data.contraindications,
          scaleResult: data.scaleResult,
        };

    const { data: response, error } = await supabase.functions.invoke(
      "ai-therapy-suggestion",
      { body }
    );

    if (error) {
      throw new Error(
        `[ai-therapy-suggestion] Edge Function 调用失败: ${error.message}`
      );
    }

    return {
      id: response.id ?? `AI-${Date.now()}`,
      projectIds: Array.isArray(response.projectIds)
        ? response.projectIds
        : [],
      projectNames: Array.isArray(response.projectNames)
        ? response.projectNames
        : ["综合疗愈方案"],
      reason: response.reason ?? "",
      confidence: response.confidence ?? 0.5,
      generatedAt: response.generatedAt ?? new Date().toISOString(),
    };
  },
};
