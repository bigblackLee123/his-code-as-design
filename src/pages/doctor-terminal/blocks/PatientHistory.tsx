import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { usePatientHistory } from "./usePatientHistory";
import { History, ChevronDown, ChevronRight, Calendar, FileText } from "lucide-react";

export interface PatientHistoryProps {
  patientId: string;
}

export function PatientHistory({ patientId }: PatientHistoryProps) {
  const { records, loading } = usePatientHistory(patientId);
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex items-center gap-1 text-left"
        aria-expanded={expanded}
      >
        <History className="h-4 w-4 text-primary-500 shrink-0" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          历史就诊记录
        </span>
        {!loading && (
          <span className="text-xs text-neutral-400 leading-tight">
            ({records.length} 条)
          </span>
        )}
        {expanded ? (
          <ChevronDown className="h-3 w-3 text-neutral-400" />
        ) : (
          <ChevronRight className="h-3 w-3 text-neutral-400" />
        )}
      </button>

      {expanded && (
        <div className="flex flex-col gap-1.5">
          {loading ? (
            <span className="text-xs text-neutral-400 leading-tight">加载中…</span>
          ) : records.length === 0 ? (
            <span className="text-xs text-neutral-400 leading-tight">暂无历史记录</span>
          ) : (
            records.map((r) => (
              <div
                key={r.consultationId}
                className="rounded-md border border-neutral-100 bg-neutral-50 px-2 py-1.5 flex flex-col gap-1"
              >
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 text-neutral-400 shrink-0" />
                  <span className="text-xs font-medium text-neutral-700 leading-tight">
                    {new Date(r.date).toLocaleDateString("zh-CN")}
                  </span>
                  {r.scaleScore !== null && (
                    <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0 bg-primary-50 text-primary-700">
                      量表 {r.scaleScore} 分
                    </Badge>
                  )}
                </div>

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

                {r.projects.length > 0 && (
                  <div className="flex items-start gap-1">
                    <FileText className="h-3 w-3 text-neutral-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-600 leading-tight">
                      {r.projects.join("、")}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
