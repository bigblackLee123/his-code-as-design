import { useState, useCallback, useRef, useEffect } from "react";
import { patientService } from "@/services";
import { supabase } from "@/services/supabase/client";
import type { Patient } from "@/services/types";

export function usePatientStatusSearch() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setSearched(false);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await patientService.searchPatients(term);
      setResults(data);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = useCallback(
    (val: string) => {
      setKeyword(val);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => doSearch(val), 300);
    },
    [doSearch]
  );

  // Realtime: 患者状态变更时自动刷新搜索结果
  const keywordRef = useRef(keyword);
  keywordRef.current = keyword;

  useEffect(() => {
    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    if (useMock) return;

    const channel = supabase
      .channel("patient-status-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "patients" },
        () => {
          if (keywordRef.current.trim()) {
            doSearch(keywordRef.current);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [doSearch]);

  return { keyword, results, loading, searched, handleChange };
}
