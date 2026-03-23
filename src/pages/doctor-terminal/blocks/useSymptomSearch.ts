import { useState, useCallback, useRef, useEffect } from "react";
import { symptomService } from "@/services";
import type { Symptom } from "@/services/types";

export function useSymptomSearch(selected: Symptom[]) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Symptom[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]); setIsOpen(false); setIsLoading(false); return;
    }
    setIsLoading(true);
    try {
      const items = await symptomService.search(term);
      const selectedNames = new Set(selected.map((v) => v.name));
      setResults(items.filter((item) => !selectedNames.has(item.name)));
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [selected]);

  const handleSetKeyword = useCallback((val: string) => {
    setKeyword(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 200);
  }, [doSearch]);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return {
    keyword, setKeyword: handleSetKeyword,
    results, isLoading, isOpen, setIsOpen,
  };
}
