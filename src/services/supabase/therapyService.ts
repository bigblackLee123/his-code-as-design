import type { TherapyPackage } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { toTherapyProject, toTherapyPackage } from "./mappers";

export const therapyService = {
  /** 获取所有疗愈套餐（含关联项目，按 sort_order 排序） */
  async getPackages(): Promise<TherapyPackage[]> {
    const { data, error } = await supabase
      .from("therapy_packages")
      .select("*, therapy_package_items(sort_order, therapy_projects(*))");

    throwIfError(error, { table: "therapy_packages", operation: "select" });

    return (data ?? []).map((row) => {
      const projects = (row.therapy_package_items ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => toTherapyProject(item.therapy_projects));
      return toTherapyPackage(row, projects);
    });
  },

  /** 按 ID 获取套餐详情（含关联项目），不存在返回 null */
  async getPackageById(id: string): Promise<TherapyPackage | null> {
    const { data, error } = await supabase
      .from("therapy_packages")
      .select("*, therapy_package_items(sort_order, therapy_projects(*))")
      .eq("id", id)
      .maybeSingle();

    throwIfError(error, { table: "therapy_packages", operation: "select" });

    if (!data) return null;

    const projects = (data.therapy_package_items ?? [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => toTherapyProject(item.therapy_projects));

    return toTherapyPackage(data, projects);
  },

  /** 按症状关键词匹配套餐（matched_symptoms ilike 任一关键词） */
  async matchBySymptoms(symptoms: string[]): Promise<TherapyPackage[]> {
    if (symptoms.length === 0) return [];

    const orFilter = symptoms
      .map((s) => `matched_symptoms.ilike.%${s}%`)
      .join(",");

    const { data, error } = await supabase
      .from("therapy_packages")
      .select("*, therapy_package_items(sort_order, therapy_projects(*))")
      .or(orFilter);

    throwIfError(error, { table: "therapy_packages", operation: "select" });

    return (data ?? []).map((row) => {
      const projects = (row.therapy_package_items ?? [])
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((item) => toTherapyProject(item.therapy_projects));
      return toTherapyPackage(row, projects);
    });
  },
};
