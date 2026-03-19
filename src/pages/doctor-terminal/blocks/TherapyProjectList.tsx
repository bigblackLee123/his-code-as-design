import { Badge } from "@/components/ui/badge";
import type { TherapyProject } from "@/services/types";
import { ListMusic, MapPin, Heart, Zap, MessageSquare, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TherapyProjectListProps {
  selectedProjects: TherapyProject[];
}

export function TherapyProjectList({ selectedProjects }: TherapyProjectListProps) {
  if (selectedProjects.length === 0) {
    return (
      <div className="flex items-center justify-center py-4">
        <span className="text-xs text-neutral-400 leading-tight">
          请先选择疗愈项目
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <ListMusic className="h-4 w-4 text-secondary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          已选项目 — {selectedProjects.length} 个
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        {selectedProjects.map((proj, idx) => (
          <div
            key={proj.id}
            className="rounded-md border border-neutral-200 bg-white p-2"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-neutral-800 leading-tight">
                  {proj.name}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-xs leading-tight px-1 py-0">
                  <MapPin className="h-3 w-3 mr-0.5" />
                  {proj.region}
                </Badge>
                {proj.hasGuidance && (
                  <Badge className={cn(
                    "text-xs leading-tight px-1 py-0",
                    "bg-success-50 text-success-700 border-success-200"
                  )}>
                    <MessageSquare className="h-3 w-3 mr-0.5" />
                    有引导语
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-xs text-neutral-600 leading-tight mb-1">
              {proj.mechanism}
            </p>
            <div className="flex items-center gap-3 text-xs text-neutral-500 leading-tight">
              {proj.bpm && (
                <span className="flex items-center gap-0.5">
                  <Clock className="h-3 w-3" />
                  {proj.bpm} BPM
                </span>
              )}
              <span className="flex items-center gap-0.5">
                <Heart className="h-3 w-3" />
                {proj.mood}
              </span>
              <span className="flex items-center gap-0.5">
                <Zap className="h-3 w-3" />
                {proj.energyLevel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
