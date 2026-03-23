import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MaskedText } from "@/components/his/MaskedText";
import { patientService } from "@/services";
import { supabase } from "@/services/supabase/client";
import type { Patient, PatientStatus } from "@/services/types";
import { Search, User } from "lucide-react";

const STATUS_MAP: Record<PatientStatus, { label: string; color: string }> = {
  "checked-in": { label: "已签到", color: "bg-neutral-100 text-neutral-600" },
  waiting: { label: "候诊中", color: "bg-warning-50 text-warning-700" },
  consulting: { label: "就诊中", color: "bg-primary-50 text-primary-700" },
  "pending-treatment": { label: "待治疗", color: "bg-info-50 text-info-700" },
  treating: { label: "治疗中", color: "bg-success-50 text-success-700" },
  completed: { label: "已完成", color: "bg-neutral-50 text-neutral-500" },
};

export function PatientStatusSearch() {
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

  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="p-2">
        <CardTitle className="text-xs font-semibold text-neutral-700 flex items-center gap-1">
          <Search className="h-4 w-4 text-primary-500" />
          患者状态查询
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex flex-col gap-2">
        <Input
          placeholder="输入姓名或医保卡号搜索"
          value={keyword}
          onChange={(e) => handleChange(e.target.value)}
          className="text-xs h-7"
        />

        {loading && (
          <span className="text-xs text-neutral-400 leading-tight">搜索中…</span>
        )}

        {!loading && searched && results.length === 0 && (
          <span className="text-xs text-neutral-400 leading-tight">未找到匹配患者</span>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-1">
            {results.map((p) => {
              const st = STATUS_MAP[p.status];
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-2 rounded-md bg-neutral-50 px-2 py-1.5"
                >
                  <User className="h-3 w-3 text-neutral-400 shrink-0" />
                  <MaskedText type="name" value={p.name} className="text-xs font-medium text-neutral-800" />
                  <span className="text-xs text-neutral-400">
                    {p.gender === "male" ? "男" : "女"} · {p.age}岁
                  </span>
                  <span className="text-xs text-neutral-300">|</span>
                  <span className="text-xs text-neutral-500">
                    卡号尾号 {p.insuranceCardNo.slice(-4)}
                  </span>
                  <Badge variant="secondary" className={`ml-auto text-xs px-1.5 py-0 ${st.color}`}>
                    {st.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
