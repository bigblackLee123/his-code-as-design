import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { therapyService } from "@/services";
import type { TherapyPackage } from "@/services/types";
import { Music, Search, X, Users, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TherapyPackageSelectorProps {
  selectedPackageId: string | null;
  onSelect: (pkg: TherapyPackage) => void;
}

export function TherapyPackageSelector({
  selectedPackageId,
  onSelect,
}: TherapyPackageSelectorProps) {
  const [packages, setPackages] = useState<TherapyPackage[]>([]);
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    therapyService.getPackages().then(setPackages);
  }, []);

  const selectedPkg = packages.find((p) => p.id === selectedPackageId) ?? null;

  const filtered = keyword.trim()
    ? packages.filter((p) => {
        const k = keyword.toLowerCase();
        return (
          p.name.toLowerCase().includes(k) ||
          p.matchedSymptoms.toLowerCase().includes(k) ||
          p.targetAudience.toLowerCase().includes(k) ||
          p.pinyinInitial.toLowerCase().startsWith(k)
        );
      })
    : packages;

  const handleSelect = useCallback(
    (pkg: TherapyPackage) => {
      onSelect(pkg);
      setKeyword("");
      setIsOpen(false);
    },
    [onSelect]
  );

  const handleClear = useCallback(() => {
    setKeyword("");
    setIsOpen(false);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
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
          疗愈套餐处方
        </span>
      </div>

      {/* Search input with dropdown */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="输入套餐名称或症状关键词检索（英文模式）"
            value={keyword}
            onChange={(e) => { setKeyword(e.target.value); setIsOpen(true); }}
            onFocus={() => setIsOpen(true)}
            className="pl-7 text-xs leading-tight h-7"
            aria-label="疗愈套餐搜索"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="search"
          />
        </div>

        {isOpen && filtered.length > 0 && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md max-h-48 overflow-auto">
            {filtered.map((pkg) => (
              <button
                key={pkg.id}
                type="button"
                className={cn(
                  "flex w-full items-center justify-between px-2 py-1.5 text-xs leading-tight hover:bg-primary-50 transition-colors text-left",
                  pkg.id === selectedPackageId && "bg-primary-50"
                )}
                onClick={() => handleSelect(pkg)}
              >
                <span className="text-neutral-800">{pkg.name}</span>
                <span className="text-neutral-400 truncate ml-2 max-w-32">
                  {pkg.matchedSymptoms}
                </span>
              </button>
            ))}
          </div>
        )}

        {isOpen && keyword.trim() && filtered.length === 0 && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md px-2 py-2 text-xs text-neutral-400 text-center">
            未找到匹配的疗愈套餐
          </div>
        )}
      </div>

      {/* Selected package card */}
      {selectedPkg && (
        <div className="flex flex-col gap-1 rounded-md border border-primary-400 bg-primary-50 p-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-800 leading-tight">
              {selectedPkg.name}
            </span>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs leading-tight">
                {selectedPkg.projects.length} 个项目
              </Badge>
              <button
                type="button"
                onClick={handleClear}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="取消选择套餐"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-neutral-500 leading-tight">
            <span className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {selectedPkg.targetAudience}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            {selectedPkg.matchedSymptoms.split(",").map((s) => (
              <Badge key={s} variant="secondary" className="text-xs leading-tight px-1 py-0">
                <Activity className="h-3 w-3 mr-0.5" />
                {s}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
