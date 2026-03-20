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

  /** 保存就诊禁忌症关联（先清除旧记录再批量插入） */
  async saveForConsultation(
    consultationId: string,
    contraindications: Contraindication[]
  ): Promise<void> {
    // 先查出禁忌症 id（contraindications 字典表按 code 查）
    if (contraindications.length === 0) {
      // 清空旧关联即可
      const { error } = await supabase
        .from("consultation_contraindications")
        .delete()
        .eq("consultation_id", consultationId);
      throwIfError(error, { table: "consultation_contraindications", operation: "delete" });
      return;
    }

    const codes = contraindications.map((c) => c.code);

    // 查出 id
    const { data: rows, error: selectError } = await supabase
      .from("contraindications")
      .select("id, code")
      .in("code", codes);

    throwIfError(selectError, { table: "contraindications", operation: "select" });

    // 先删旧关联
    const { error: deleteError } = await supabase
      .from("consultation_contraindications")
      .delete()
      .eq("consultation_id", consultationId);

    throwIfError(deleteError, { table: "consultation_contraindications", operation: "delete" });

    // 再插入新关联
    if (rows?.length) {
      const inserts = rows.map((r) => ({
        consultation_id: consultationId,
        contraindication_id: r.id,
      }));

      const { error: insertError } = await supabase
        .from("consultation_contraindications")
        .insert(inserts);

      throwIfError(insertError, { table: "consultation_contraindications", operation: "insert" });
    }
  },
};
