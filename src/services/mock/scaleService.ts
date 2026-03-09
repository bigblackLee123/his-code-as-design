import type { ScaleTemplate, ScaleResult } from "../types";
import { mockScaleTemplates } from "./data/scaleTemplates";

// In-memory scale results store (patientId → ScaleResult[])
const scaleResultsStore: Map<string, ScaleResult[]> = new Map();

export const scaleService = {
  /** 获取量表模板列表 */
  getTemplates: async (): Promise<ScaleTemplate[]> => {
    return [...mockScaleTemplates];
  },

  /** 获取量表模板详情 */
  getTemplate: async (templateId: string): Promise<ScaleTemplate> => {
    const template = mockScaleTemplates.find((t) => t.id === templateId);
    if (!template) {
      throw new Error(`量表模板不存在: ${templateId}`);
    }
    return { ...template };
  },

  /** 保存量表结果 */
  saveResult: async (
    patientId: string,
    result: ScaleResult
  ): Promise<void> => {
    const existing = scaleResultsStore.get(patientId) ?? [];
    existing.push(result);
    scaleResultsStore.set(patientId, existing);
  },
};
