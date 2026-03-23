import { useState, useCallback, useRef, useEffect } from "react";
import { contraindicationService } from "@/services";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import type { Contraindication } from "@/services/types";

export function useContraindicationInput(
  patientId: string,
  onItemsChange?: (items: Contraindication[]) => void,
) {
  const [items, setItems] = useState<Contraindication[]>([]);
  const [commonList, setCommonList] = useState<Contraindication[]>([]);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Contraindication[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 加载常见禁忌症列表
  useEffect(() => {
    contraindicationService.getCommonList().then(setCommonList).catch(() => {});
  }, []);

  const persist = useCallback(async (next: Contraindication[]) => {
    try {
      const cId = await consultationHelper.getActiveId(patientId);
      await contraindicationService.saveForConsultation(cId, next);
    } catch { /* 静默失败 */ }
  }, [patientId]);

  const updateItems = useCallback((next: Contraindication[]) => {
    setItems(next);
    persist(next);
    onItemsChange?.(next);
  }, [persist, onItemsChange]);

  const handleToggle = useCallback((item: Contraindication) => {
    const exists = items.some((v) => v.code === item.code);
    const next = exists
      ? items.filter((v) => v.code !== item.code)
      : [...items, item];
    updateItems(next);
  }, [items, updateItems]);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]); setIsOpen(false); setIsLoading(false); return;
    }
    setIsLoading(true);
    try {
      const all = await contraindicationService.search(term);
      const selected = new Set(items.map((v) => v.code));
      setResults(all.filter((i) => !selected.has(i.code)));
      setIsOpen(true);
    } finally { setIsLoading(false); }
  }, [items]);

  const handleInputChange = useCallback((val: string) => {
    setKeyword(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 200);
  }, [doSearch]);

  const handleAdd = useCallback((item: Contraindication) => {
    const next = [...items, item];
    setKeyword(""); setResults([]); setIsOpen(false);
    updateItems(next);
  }, [items, updateItems]);

  const handleRemove = useCallback((code: string) => {
    const next = items.filter((v) => v.code !== code);
    updateItems(next);
  }, [items, updateItems]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  // 按分类分组
  const grouped = commonList.reduce<Record<string, Contraindication[]>>((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {});

  return {
    items, commonList, grouped, keyword, results, isOpen, isLoading,
    setIsOpen, handleInputChange, handleAdd, handleRemove, handleToggle, cleanup,
  };
}
