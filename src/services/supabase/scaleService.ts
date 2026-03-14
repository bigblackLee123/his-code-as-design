import type { ScaleTemplate, ScaleResult } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { consultationHelper } from "./consultationHelper";
import { toScaleTemplate, fromScaleResult } from "./mappers";

export const scaleService = {
  /** 获取所有量表模板（轻量列表，不含题目） */
  async getTemplates(): Promise<ScaleTemplate[]> {
    const { data, error } = await supabase
      .from("scale_templates")
      .select("*");

    throwIfError(error, { table: "scale_templates", operation: "select" });

    return (data ?? []).map((row) => toScaleTemplate(row, []));
  },

  /** 获取量表模板详情（含题目，按 sort_order 排序） */
  async getTemplate(templateId: string): Promise<ScaleTemplate> {
    const { data: templateRow, error: templateError } = await supabase
      .from("scale_templates")
      .select("*")
      .eq("id", templateId)
      .maybeSingle();

    throwIfError(templateError, { table: "scale_templates", operation: "select" });

    if (!templateRow) {
      throw new Error(`量表模板不存在: ${templateId}`);
    }

    const { data: questionRows, error: questionError } = await supabase
      .from("scale_questions")
      .select("*")
      .eq("template_id", templateId)
      .order("sort_order", { ascending: true });

    throwIfError(questionError, { table: "scale_questions", operation: "select" });

    return toScaleTemplate(templateRow, questionRows ?? []);
  },

  /** 保存量表结果（关联活跃 Consultation） */
  async saveResult(patientId: string, result: ScaleResult, stage: "pre" | "post" = "pre"): Promise<void> {
    const consultationId = await consultationHelper.getActiveId(patientId);
    const payload = fromScaleResult(result, consultationId, stage);

    const { error } = await supabase
      .from("scale_results")
      .insert(payload);

    throwIfError(error, { table: "scale_results", operation: "insert" });
  },
};
