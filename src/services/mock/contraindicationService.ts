import type { Contraindication } from "../types";
import { mockContraindications } from "./data/contraindications";

export const contraindicationService = {
  /** 搜索禁忌症（支持拼音首字母和汉字模糊匹配） */
  search: async (keyword: string): Promise<Contraindication[]> => {
    if (!keyword.trim()) return [];

    const lower = keyword.toLowerCase().trim();

    return mockContraindications.filter((item) => {
      // 汉字模糊匹配（name 包含关键字）
      if (item.name.includes(lower)) return true;
      // 拼音首字母匹配（大小写不敏感）
      if (item.pinyinInitial.toLowerCase().includes(lower)) return true;
      // 拼音全拼匹配
      if (item.pinyin.toLowerCase().includes(lower)) return true;
      return false;
    });
  },
};
