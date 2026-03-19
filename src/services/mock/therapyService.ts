import type { TherapyProject } from "../types";
import { mockTherapyProjects } from "./data/therapyProjects";

export const therapyService = {
  /** 获取所有疗愈项目 */
  async getProjects(): Promise<TherapyProject[]> {
    return mockTherapyProjects;
  },

  /** 按 ID 获取疗愈项目，不存在返回 null */
  async getProjectById(id: string): Promise<TherapyProject | null> {
    return mockTherapyProjects.find((p) => p.id === id) ?? null;
  },

  /** 按症状关键词匹配疗愈项目（targetAudience 包含任一关键词，不区分大小写） */
  async matchBySymptoms(symptoms: string[]): Promise<TherapyProject[]> {
    if (symptoms.length === 0) return [];

    return mockTherapyProjects.filter((project) =>
      symptoms.some((s) =>
        project.targetAudience.toLowerCase().includes(s.toLowerCase())
      )
    );
  },
};
