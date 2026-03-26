import { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Contraindication } from "@/services/types";
import { AlertTriangle } from "lucide-react";
import { useContraindicationInput } from "./useContraindicationInput";

export interface ContraindicationInputProps {
  patientId: string;
  onItemsChange?: (items: Contraindication[]) => void;
}

export function ContraindicationInput({ patientId, onItemsChange }: ContraindicationInputProps) {
  const s = useContraindicationInput(patientId, onItemsChange);

  useEffect(() => s.cleanup, [s.cleanup]);

  const selectedCodes = new Set(s.items.map((i) => i.code));

  return (
    <div className="flex flex-col gap-2">
      {/* 常见禁忌症清单 */}
      {Object.keys(s.grouped).length > 0 && (
        <div className="flex flex-col gap-2 rounded-xl border border-warning-200 bg-warning-50/50 p-3">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
            <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
            {s.items.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1 py-0 bg-warning-100 text-warning-700">
                已选 {s.items.length}
              </Badge>
            )}
          </div>
          <div className="columns-2 gap-x-6">
            {Object.entries(s.grouped).map(([category, list]) => (
              <div key={category} className="break-inside-avoid mb-2.5 flex flex-col gap-1">
                <span className="text-xs font-medium text-warning-700 leading-tight">{category}</span>
                <div className="flex flex-col gap-1 pl-1">
                  {list.map((item) => {
                    const checked = selectedCodes.has(item.code);
                    return (
                      <label key={item.code} className="flex items-center gap-1 cursor-pointer">
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => s.handleToggle(item)}
                          className="h-3.5 w-3.5"
                          aria-label={item.name}
                        />
                        <span className="text-xs leading-tight text-neutral-700">{item.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          {s.items.length > 0 && (
            <div className="flex items-center gap-1 rounded-lg bg-warning-100 px-2 py-1">
              <AlertTriangle className="h-3 w-3 text-warning-600 shrink-0" aria-hidden="true" />
              <span className="text-xs text-warning-700 leading-tight">
                已标记 {s.items.length} 项禁忌症，处方时将自动排除冲突项目
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
