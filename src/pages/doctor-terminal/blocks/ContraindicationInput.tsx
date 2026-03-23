import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Contraindication } from "@/services/types";
import { Search, AlertTriangle } from "lucide-react";
import { useContraindicationInput } from "./useContraindicationInput";

export interface ContraindicationInputProps {
  patientId: string;
  onItemsChange?: (items: Contraindication[]) => void;
}

export function ContraindicationInput({ patientId, onItemsChange }: ContraindicationInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const s = useContraindicationInput(patientId, onItemsChange);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        s.setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [s]);

  useEffect(() => s.cleanup, [s.cleanup]);

  const selectedCodes = new Set(s.items.map((i) => i.code));

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
        {s.items.length > 0 && (
          <Badge variant="secondary" className="text-xs px-1 py-0 bg-warning-50 text-warning-700">
            已选 {s.items.length}
          </Badge>
        )}
      </div>

      {/* 常见禁忌症清单 */}
      {Object.keys(s.grouped).length > 0 && (
        <div className="flex flex-col gap-3 rounded-md border border-neutral-200 p-2">
          {Object.entries(s.grouped).map(([category, list]) => (
            <div key={category} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-neutral-500 leading-tight">{category}</span>
              <div className="grid grid-cols-4 gap-x-2 gap-y-2 pl-1">
                {list.map((item) => {
                  const checked = selectedCodes.has(item.code);
                  return (
                    <label
                      key={item.code}
                      className="flex items-center gap-1 cursor-pointer"
                    >
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
      )}

      {/* 搜索补充 */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="搜索补充不在列表中的禁忌症"
            value={s.keyword}
            onChange={(e) => s.handleInputChange(e.target.value)}
            onFocus={() => { if (s.results.length > 0) s.setIsOpen(true); }}
            className="pl-7 text-xs leading-tight h-7"
            aria-label="禁忌症搜索"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="search"
          />
          {s.isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
              检索中…
            </span>
          )}
        </div>

        {s.isOpen && s.results.length > 0 && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md max-h-48 overflow-auto">
            {s.results.map((item) => (
              <button
                key={item.code}
                type="button"
                className="flex w-full items-center justify-between px-2 py-1.5 text-xs leading-tight hover:bg-primary-50 transition-colors text-left"
                onClick={() => s.handleAdd(item)}
              >
                <span className="text-neutral-800">{item.name}</span>
                <span className="text-neutral-400">{item.category}</span>
              </button>
            ))}
          </div>
        )}

        {s.isOpen && s.keyword.trim() && s.results.length === 0 && !s.isLoading && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md px-2 py-2 text-xs text-neutral-400 text-center">
            未找到匹配的禁忌症
          </div>
        )}
      </div>
    </div>
  );
}
