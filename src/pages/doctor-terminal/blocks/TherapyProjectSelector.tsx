import { useState, useCallback, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { useTherapyProjects } from "./useTherapyProjects";
import type { TherapyProject, Contraindication } from "@/services/types";
import { Music, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TherapyProjectSelectorProps {
  selectedProjects: TherapyProject[];
  patientContraindications: Contraindication[];
  onSelect: (projects: TherapyProject[]) => void;
}

/** 计算项目与患者禁忌症的匹配结果 */
export function getMatchedContraindications(
  project: TherapyProject,
  patientContraindications: Contraindication[],
): string[] {
  const patientNames = new Set(patientContraindications.map((c) => c.name));
  return project.contraindications.filter((c) => patientNames.has(c));
}

const REGIONS = ["全部", "睡眠区", "情志区", "运动疗愈区"] as const;

export function TherapyProjectSelector({
  selectedProjects,
  patientContraindications,
  onSelect,
}: TherapyProjectSelectorProps) {
  const { allProjects } = useTherapyProjects();
  const [regionFilter, setRegionFilter] = useState<string>("全部");

  const selectedIds = useMemo(
    () => new Set(selectedProjects.map((p) => p.id)),
    [selectedProjects],
  );

  const filtered = useMemo(
    () => regionFilter === "全部"
      ? allProjects
      : allProjects.filter((p) => p.region === regionFilter),
    [allProjects, regionFilter],
  );

  const handleToggle = useCallback(
    (project: TherapyProject) => {
      if (selectedIds.has(project.id)) {
        onSelect(selectedProjects.filter((p) => p.id !== project.id));
      } else {
        // 同区域只能选 1 个
        const withoutSameRegion = selectedProjects.filter(
          (p) => p.region !== project.region,
        );
        onSelect([...withoutSameRegion, project]);
      }
    },
    [selectedProjects, selectedIds, onSelect],
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <Music className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-bold text-neutral-700 leading-tight">
          手动选择配方
        </span>
        {selectedProjects.length > 0 && (
          <Badge className="text-xs px-1.5 py-0 bg-primary-100 text-primary-700">
            已选 {selectedProjects.length}
          </Badge>
        )}
      </div>

      {/* 区域 Tab Pill */}
      <div className="flex gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRegionFilter(r)}
            className={cn(
              "text-xs px-3 py-1 rounded-full transition-colors",
              regionFilter === r
                ? "bg-primary-600 text-white"
                : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* 卡片网格 */}
      <div className="flex flex-col gap-2 max-h-64 overflow-y-auto">
        {filtered.map((project) => {
          const matched = getMatchedContraindications(project, patientContraindications);
          const isBlocked = matched.length > 0;
          const isSelected = selectedIds.has(project.id);
          return (
            <button
              key={project.id}
              type="button"
              disabled={isBlocked}
              onClick={() => !isBlocked && handleToggle(project)}
              className={cn(
                "p-3 rounded-xl border text-left transition-all",
                isBlocked
                  ? "border-error-200 bg-error-50 opacity-60 cursor-not-allowed"
                  : isSelected
                    ? "border-primary-400 bg-primary-50 ring-1 ring-primary-300"
                    : "border-neutral-200 hover:border-primary-300 hover:bg-neutral-50 cursor-pointer"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-xs font-bold",
                  isBlocked ? "text-error-400" : isSelected ? "text-primary-700" : "text-neutral-700"
                )}>
                  {project.name}
                </span>
                <span className="text-xs bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full">
                  {project.region}
                </span>
              </div>
              <p className="text-xs text-neutral-500 mb-1 leading-tight">{project.mechanism}</p>
              <div className="flex items-center gap-3 text-xs text-neutral-400">
                <span>BPM: {project.bpm}</span>
                <span>情绪: {project.mood}</span>
                <span>能量: {project.energyLevel}</span>
              </div>
              {isBlocked && (
                <div className="flex items-center gap-1 mt-1 text-xs text-error-600">
                  <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                  禁忌症冲突：{matched.join("、")}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* 已选 Tag 组 */}
      {selectedProjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedProjects.map((p) => (
            <span
              key={p.id}
              className="inline-flex items-center gap-1 text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
            >
              {p.name}
              <button
                type="button"
                onClick={() => onSelect(selectedProjects.filter((x) => x.id !== p.id))}
                className="hover:text-error-500"
                aria-label={`移除${p.name}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
