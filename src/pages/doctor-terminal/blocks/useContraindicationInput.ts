import { useState, useCallback, useRef } from "react";
import { contraindicationService } from "@/services";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import type { Contraindication } from "@/services/types";

export function useContraindicationInput(
  patientId: string,
  onItemsChange?: (items: Contraindication[]) => void,
) {
  const [items, setItems] = useState<Contraindication[]>([]);
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Contraindication[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const persist = useCallback(async (next: Contraindication[]) => {
    try {
      const cId = await consultationHelper.getActiveId(patientId);
      await contraindicationService.saveForConsultation(cId, next);
    } catch { /* 静默失败，不阻塞 UI */ }
  }, [patientId]);

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
    setItems(next);
    setKeyword(""); setResults([]); setIsOpen(false);
    persist(next);
    onItemsChange?.(next);
  }, [items, persist, onItemsChange]);

  const handleRemove = useCallback((code: string) => {
    const next = items.filter((v) => v.code !== code);
    setItems(next);
    persist(next);
    onItemsChange?.(next);
  }, [items, persist, onItemsChange]);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  return {
    items, keyword, results, isOpen, isLoading,
    setIsOpen, handleInputChange, handleAdd, handleRemove, cleanup,
  };
}
