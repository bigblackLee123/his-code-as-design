import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { therapyService } from "@/services/mock/therapyService";
import type { TherapyPackage } from "@/services/types";
import { Music, Check, Users, Activity } from "lucide-react";
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

  useEffect(() => {
    therapyService.getPackages().then(setPackages);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Music className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          疗愈套餐处方
        </span>
      </div>
      <div>
        <div className="flex flex-col gap-1.5">
          {packages.map((pkg) => {
            const isSelected = pkg.id === selectedPackageId;
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => onSelect(pkg)}
                className={cn(
                  "flex flex-col gap-1 rounded-md border p-2 text-left transition-colors",
                  isSelected
                    ? "border-primary-400 bg-primary-50"
                    : "border-neutral-200 bg-white hover:border-primary-200 hover:bg-neutral-50"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-neutral-800 leading-tight">
                    {pkg.name}
                  </span>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs leading-tight">
                      {pkg.projects.length} 个项目
                    </Badge>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary-600" />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-500 leading-tight">
                  <span className="flex items-center gap-0.5">
                    <Users className="h-3 w-3" />
                    {pkg.targetAudience}
                  </span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {pkg.matchedSymptoms.split(",").map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-xs leading-tight px-1 py-0"
                    >
                      <Activity className="h-3 w-3 mr-0.5" />
                      {s}
                    </Badge>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
