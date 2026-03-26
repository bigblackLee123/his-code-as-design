import { Badge } from "@/components/ui/badge";
import type { TherapyProject, Contraindication } from "@/services/types";
import { X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMatchedContraindications } from "./TherapyProjectSelector";

/** Dropdown list showing available projects with contraindication warnings */
export function ProjectDropdownList({
  projects,
  selectedIds,
  patientContraindications,
  onAdd,
}: {
  projects: TherapyProject[];
  selectedIds: Set<string>;
  patientContraindications: Contraindication[];
  onAdd: (p: TherapyProject) => void;
}) {
  return (
    <div className="absolute z-10 bottom-full mb-1 w-full rounded-xl border border-neutral-200 bg-white shadow-lg max-h-48 overflow-auto">
      {projects.map((project) => {
        const matched = getMatchedContraindications(
          project,
          patientContraindications,
        );
        const isDisabled = matched.length > 0;
        const isSelected = selectedIds.has(project.id);
        return (
          <button
            key={project.id}
            type="button"
            disabled={isDisabled}
            className={cn(
              "flex w-full items-start justify-between px-3 py-2 text-xs leading-tight transition-colors text-left gap-1",
              isDisabled
                ? "cursor-not-allowed bg-error-50/50"
                : isSelected
                  ? "bg-primary-50 cursor-default"
                  : "hover:bg-primary-50",
            )}
            onClick={() => !isDisabled && !isSelected && onAdd(project)}
          >
            <span className="flex flex-col gap-0.5 min-w-0">
              <span className={cn("truncate", isDisabled ? "text-error-600" : "text-neutral-800")}>
                {project.name}
              </span>
              <span className="text-neutral-400 truncate">
                {project.region} · {project.mood}
              </span>
              {isDisabled && (
                <span className="flex items-center gap-0.5 text-error-600">
                  <AlertTriangle
                    className="h-3 w-3 shrink-0"
                    aria-hidden="true"
                  />
                  禁忌冲突：{matched.join("、")}
                </span>
              )}
            </span>
            {isSelected && (
              <Badge
                variant="secondary"
                className="text-xs leading-tight shrink-0"
              >
                已选
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}

/** Selected project badge with remove button */
export function SelectedProjectBadge({
  project,
  onRemove,
}: {
  project: TherapyProject;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-primary-200 bg-primary-50 px-2 py-1.5">
      <span className="text-xs text-neutral-800 leading-tight truncate">
        {project.name}
        <span className="text-neutral-400 ml-1">{project.region}</span>
      </span>
      <button
        type="button"
        onClick={() => onRemove(project.id)}
        className="text-neutral-400 hover:text-neutral-600 shrink-0 ml-1"
        aria-label={`移除${project.name}`}
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
