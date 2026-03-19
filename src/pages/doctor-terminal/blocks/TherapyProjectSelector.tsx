import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { therapyService } from "@/services";
import type { TherapyProject, Contraindication } from "@/services/types";
import { Music, Search } from "lucide-react";
import {
  ProjectDropdownList,
  SelectedProjectBadge,
} from "./TherapyProjectSelectorParts";

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

/** 按关键词过滤项目列表 */
export function filterProjectsByKeyword(
  projects: TherapyProject[],
  keyword: string,
): TherapyProject[] {
  const k = keyword.toLowerCase().trim();
  if (!k) return projects;
  return projects.filter(
    (p) =>
      p.name.toLowerCase().includes(k) ||
      p.region.toLowerCase().includes(k) ||
      p.targetAudience.toLowerCase().includes(k) ||
      p.mood.toLowerCase().includes(k),
  );
}

export function TherapyProjectSelector({
  selectedProjects,
  patientContraindications,
  onSelect,
}: TherapyProjectSelectorProps) {
  const [allProjects, setAllProjects] = useState<TherapyProject[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    therapyService.getProjects().then(setAllProjects);
  }, []);

  const selectedIds = useMemo(
    () => new Set(selectedProjects.map((p) => p.id)),
    [selectedProjects],
  );

  const filtered = useMemo(
    () => filterProjectsByKeyword(allProjects, keyword),
    [allProjects, keyword],
  );

  const handleAdd = useCallback(
    (project: TherapyProject) => {
      if (selectedIds.has(project.id)) return;
      onSelect([...selectedProjects, project]);
    },
    [selectedProjects, selectedIds, onSelect],
  );

  const handleRemove = useCallback(
    (projectId: string) => {
      onSelect(selectedProjects.filter((p) => p.id !== projectId));
    },
    [selectedProjects, onSelect],
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Music className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          疗愈项目处方
        </span>
      </div>

      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search
            className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400"
            aria-hidden="true"
          />
          <Input
            type="search"
            placeholder="输入项目名称/区域/人群/情绪关键词检索"
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="pl-7 text-xs leading-tight h-7"
            aria-label="疗愈项目搜索"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="search"
          />
        </div>

        {isOpen && filtered.length > 0 && (
          <ProjectDropdownList
            projects={filtered}
            selectedIds={selectedIds}
            patientContraindications={patientContraindications}
            onAdd={handleAdd}
          />
        )}

        {isOpen && keyword.trim() && filtered.length === 0 && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md px-2 py-2 text-xs text-neutral-400 text-center">
            未找到匹配的疗愈项目
          </div>
        )}
      </div>

      {selectedProjects.length > 0 && (
        <div className="flex flex-col gap-1">
          {selectedProjects.map((project) => (
            <SelectedProjectBadge
              key={project.id}
              project={project}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
