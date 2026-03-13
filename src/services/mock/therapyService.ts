import type { TherapyPackage } from "../types";
import { mockTherapyPackages } from "./data/therapyPackages";

export const therapyService = {
  /** 获取所有疗愈套餐 */
  getPackages: async (): Promise<TherapyPackage[]> => {
    return mockTherapyPackages;
  },

  /** 根据 ID 获取套餐详情 */
  getPackageById: async (id: string): Promise<TherapyPackage | null> => {
    return mockTherapyPackages.find((p) => p.id === id) ?? null;
  },

  /** 根据症状关键词匹配套餐 */
  matchBySymptoms: async (symptoms: string[]): Promise<TherapyPackage[]> => {
    return mockTherapyPackages.filter((pkg) =>
      symptoms.some((s) => pkg.matchedSymptoms.includes(s))
    );
  },
};
