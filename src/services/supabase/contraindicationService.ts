import type { Contraindication } from "../types";
import { supabase } from "./client";
import { throwIfError } from "./errorHelper";
import { toContraindication } from "./mappers";

export const contraindicationService = {
  /** 搜索禁忌症（支持 name / pinyin / pinyin_initial 模糊匹配，大小写不敏感） */
  async search(keyword: string): Promise<Contraindication[]> {
    if (!keyword.trim()) return [];

    const k = `%${keyword.trim()}%`;

    const { data, error } = await supabase
      .from("contraindications")
      .select("*")
      .or(`name.ilike.${k},pinyin_initial.ilike.${k},pinyin.ilike.${k}`);

    throwIfError(error, { table: "contraindications", operation: "select" });

    return (data ?? []).map(toContraindication);
  },
};
