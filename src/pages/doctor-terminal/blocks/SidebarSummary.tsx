import { Badge } from "@/components/ui/badge";
import type { Contraindication, ScaleResult, TherapyProject } from "@/services/types";
import { ShieldAlert, ClipboardList, Music } from "lucide-react";

export interface SidebarSummaryProps {
  contraindications: Contraindication[];
  scaleResults: ScaleResult | null;
  selectedProjects: TherapyProject[];
}

export function SidebarSummary({ contraindications, scaleResults, selectedProjects }: SidebarSummaryProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* 禁忌症 — 警告黄 */}
      <div className="rounded-xl border border-warning-200 bg-warning-50/50 p-3 flex flex-col gap-2 group">
        <div className="flex items-center gap-1.5">
          <ShieldAlert className="h-4 w-4 text-warning-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
        </div>
        {contraindications.length === 0 ? (
          <span className="text-xs text-neutral-400 leading-tight">暂无记录</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {contraindications.map((c) => (
              <Badge key={c.code} className="text-xs px-2 py-0.5 bg-warning-50 text-warning-700 border-warning-200">
                {c.name}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* 量表评估 — 成功绿 */}
      <div className="rounded-xl border border-success-200 bg-success-50/50 p-3 flex flex-col gap-2 group">
        <div className="flex items-center gap-1.5">
          <ClipboardList className="h-4 w-4 text-success-500 transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">量表评估</span>
        </div>
        {!scaleResults ? (
          <span className="text-xs text-neutral-400 leading-tight">未评估</span>
        ) : (
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold text-success-700 leading-none">{scaleResults.totalScore ?? "—"}</span>
            <span className="text-xs text-neutral-400">分</span>
          </div>
        )}
      </div>

      {/* 已选配方 — 辅助紫 */}
      <div className="rounded-xl border border-secondary-200 bg-secondary-50/50 p-3 flex flex-col gap-2 group">
        <div className="flex items-center gap-1.5">
          <Music className="h-4 w-4 text-secondary-500 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-12" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">已选配方</span>
          <span className="text-xs text-neutral-400">({selectedProjects.length})</span>
        </div>
        {selectedProjects.length === 0 ? (
          <span className="text-xs text-neutral-400 leading-tight">未选择</span>
        ) : (
          <div className="flex flex-wrap gap-1">
            {selectedProjects.map((p) => (
              <Badge key={p.id} className="text-xs px-2 py-0.5 bg-secondary-50 text-secondary-700 border-secondary-200">
                {p.name}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
