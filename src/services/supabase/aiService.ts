import type {
  VitalSigns,
  Contraindication,
  ScaleResult,
  AITherapySuggestion,
} from "../types";
import { supabase } from "./client";

export const aiService = {
  /** 调用 Supabase Edge Function 获取 AI 疗愈套餐建议 */
  async getTherapySuggestion(data: {
    vitals: VitalSigns;
    contraindications: Contraindication[];
    scaleResult: ScaleResult | null;
  }): Promise<AITherapySuggestion> {
    const { data: response, error } = await supabase.functions.invoke(
      "ai-therapy-suggestion",
      { body: data }
    );

    if (error) {
      throw new Error(
        `[ai-therapy-suggestion] Edge Function 调用失败: ${error.message}`
      );
    }

    const suggestion: AITherapySuggestion = {
      id: response.id ?? `AI-${Date.now()}`,
      projectIds: Array.isArray(response.projectIds) ? response.projectIds : [],
      projectNames: Array.isArray(response.projectNames)
        ? response.projectNames
        : ["综合疗愈方案"],
      reason: response.reason,
      confidence: response.confidence,
      generatedAt: response.generatedAt ?? new Date().toISOString(),
    };

    // TODO: 将 AI 建议写入 ai_suggestions 表，关联当前活跃 Consultation
    // 当前 mock 接口未传入 patientId，无法查找活跃 Consultation。
    // 后续需要补充 patientId 参数或从 Edge Function 响应中获取 consultation 上下文。
    // 示例：
    // const consultationId = await consultationHelper.getActiveId(patientId);
    // await supabase.from("ai_suggestions").insert({
    //   consultation_id: consultationId,
    //   herbs: null,
    //   usage: null,
    //   notes: suggestion.reason,
    //   confidence: suggestion.confidence,
    //   generated_at: suggestion.generatedAt,
    // });

    return suggestion;
  },
};
