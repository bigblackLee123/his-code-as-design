import { useState, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { usePatientHistory } from "./usePatientHistory";
import { History, Calendar, FileText, ChevronDown, ClipboardList } from "lucide-react";

export interface PatientHistoryProps {
  patientId: string;
}

export function PatientHistory({ patientId }: PatientHistoryProps) {
  const { records, loading } = usePatientHistory(patientId);
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const latest = records[0] ?? null;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <History className="h-4 w-4 text-primary-500 shrink-0" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          历史就诊记录
        </span>
        {!loading && (
          <span className="text-xs text-neutral-400 leading-tight">
            ({records.length} 条)
          </span>
        )}
      </div>

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => records.length > 0 && setOpen((v) => !v)}
          className="flex items-center w-full rounded-xl border border-input bg-background px-3 h-7 text-left"
        >
          {loading ? (
            <span className="text-xs text-neutral-400 leading-tight">加载中…</span>
          ) : !latest ? (
            <span className="text-xs text-neutral-400 leading-tight">暂无历史记录</span>
          ) : (
            <div className="flex items-center gap-1.5 w-full">
              <Calendar className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
              <span className="text-xs text-neutral-700 leading-tight">
                最近：{new Date(latest.date).toLocaleDateString("zh-CN")}
              </span>
              {latest.scaleScore !== null && (
                <span className="ml-auto text-xs text-primary-600 leading-tight">
                  量表 {latest.scaleScore} 分
                </span>
              )}
            </div>
          )}
          {records.length > 0 && (
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-auto" aria-hidden="true" />
          )}
        </button>

        {open && records.length > 0 && (
          <div className="absolute z-50 top-full mt-1 w-full rounded-lg bg-white shadow-md ring-1 ring-foreground/10 max-h-48 overflow-auto p-1 flex flex-col gap-1">
            {records.map((r) => (
              <div key={r.consultationId}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expandedId === r.consultationId ? null : r.consultationId)}
                  className="flex items-center gap-1.5 w-full rounded-md px-2 py-1.5 hover:bg-accent transition-colors text-left"
                >
                  <Calendar className="h-3 w-3 text-neutral-400 shrink-0" aria-hidden="true" />
                  <span className="text-xs font-medium text-neutral-700 leading-tight">
                    {new Date(r.date).toLocaleDateString("zh-CN")}
                  </span>
                  {r.scaleScore !== null && (
                    <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0 bg-primary-50 text-primary-700">
                      {r.scaleScore} 分
                    </Badge>
                  )}
                  <ChevronDown className={`h-3 w-3 text-neutral-400 shrink-0 transition-transform ${expandedId === r.consultationId ? "rotate-180" : ""}`} aria-hidden="true" />
                </button>
                {expandedId === r.consultationId && (
                  <div className="mx-2 mb-1 rounded-md bg-neutral-50 px-2 py-1.5 flex flex-col gap-1">
                    {r.projects.length > 0 && (
                      <div className="flex items-start gap-1">
                        <FileText className="h-3 w-3 text-primary-500 shrink-0 mt-0.5" aria-hidden="true" />
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-medium text-neutral-600 leading-tight">配方</span>
                          {r.projects.map((p) => (
                            <span key={p} className="text-xs text-neutral-700 leading-tight">· {p}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {r.scaleScore !== null && (
                      <div className="flex items-center gap-1">
                        <ClipboardList className="h-3 w-3 text-primary-500 shrink-0" aria-hidden="true" />
                        <span className="text-xs text-neutral-600 leading-tight">量表得分：</span>
                        <span className="text-xs font-medium text-primary-700 leading-tight">{r.scaleScore} 分</span>
                      </div>
                    )}
                    {r.contraindications.length > 0 && (
                      <div className="flex items-start gap-1">
                        <span className="text-xs text-neutral-500 leading-tight shrink-0">禁忌：</span>
                        <div className="flex flex-wrap gap-0.5">
                          {r.contraindications.map((c) => (
                            <Badge key={c} variant="outline" className="text-xs px-1 py-0 text-error-600 border-error-200">
                              {c}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {r.projects.length === 0 && r.scaleScore === null && r.contraindications.length === 0 && (
                      <span className="text-xs text-neutral-400 leading-tight">无详细记录</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
