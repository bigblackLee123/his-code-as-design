import type { Contraindication } from "../types";
import { mockContraindications } from "./data/contraindications";

export const contraindicationService = {
  /** 搜索禁忌症（支持拼音首字母和汉字模糊匹配） */
  search: async (keyword: string): Promise<Contraindication[]> => {
    if (!keyword.trim()) return [];

    const lower = keyword.toLowerCase().trim();

    return mockContraindications.filter((item) => {
      if (item.name.includes(lower)) return true;
      if (item.pinyinInitial.toLowerCase().includes(lower)) return true;
      if (item.pinyin.toLowerCase().includes(lower)) return true;
      return false;
    });
  },

  /** Mock: 保存就诊禁忌症关联（no-op） */
  saveForConsultation: async (
    _consultationId: string,
    _contraindications: Contraindication[]
  ): Promise<void> => {},
};
