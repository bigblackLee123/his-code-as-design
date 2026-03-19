import type { TherapyProject } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { toTherapyProject } from "./mappers";

export const therapyService = {
  /** 获取所有疗愈项目 */
  async getProjects(): Promise<TherapyProject[]> {
    const { data, error } = await supabase
      .from("therapy_projects")
      .select("*");

    throwIfError(error, { table: "therapy_projects", operation: "select" });

    return (data ?? []).map(toTherapyProject);
  },

  /** 按 ID 获取疗愈项目，不存在返回 null */
  async getProjectById(id: string): Promise<TherapyProject | null> {
    const { data, error } = await supabase
      .from("therapy_projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    throwIfError(error, { table: "therapy_projects", operation: "select" });

    if (!data) return null;

    return toTherapyProject(data);
  },

  /** 按症状关键词匹配疗愈项目（target_audience ilike 任一关键词） */
  async matchBySymptoms(symptoms: string[]): Promise<TherapyProject[]> {
    if (symptoms.length === 0) return [];

    const orFilter = symptoms
      .map((s) => `target_audience.ilike.%${s}%`)
      .join(",");

    const { data, error } = await supabase
      .from("therapy_projects")
      .select("*")
      .or(orFilter);

    throwIfError(error, { table: "therapy_projects", operation: "select" });

    return (data ?? []).map(toTherapyProject);
  },
};
