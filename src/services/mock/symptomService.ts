import type { Symptom } from "../types";
import symptomsData from "./data/symptoms.json";

const symptoms: Symptom[] = symptomsData;

export const symptomService = {
  /** 搜索症状（支持拼音首字母和汉字模糊匹配），最多返回 20 条 */
  search: async (keyword: string): Promise<Symptom[]> => {
    if (!keyword.trim()) return [];
    const lower = keyword.toLowerCase().trim();

    const matched = symptoms.filter((item) => {
      if (item.name.includes(lower)) return true;
      if (item.pinyinInitial.toLowerCase().includes(lower)) return true;
      if (item.pinyin.toLowerCase().includes(lower)) return true;
      return false;
    });

    return matched.slice(0, 20);
  },
};
