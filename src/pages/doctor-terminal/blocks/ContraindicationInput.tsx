import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Contraindication } from "@/services/types";
import { Search, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useContraindicationInput } from "./useContraindicationInput";

export interface ContraindicationInputProps {
  patientId: string;
  onItemsChange?: (items: Contraindication[]) => void;
}

export function ContraindicationInput({ patientId, onItemsChange }: ContraindicationInputProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const s = useContraindicationInput(patientId, onItemsChange);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        s.setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [s]);

  // Cleanup timer on unmount
  useEffect(() => s.cleanup, [s.cleanup]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
      </div>

      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="输入禁忌症名称或拼音首字母检索（英文模式）"
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

      {s.items.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {s.items.map((item) => (
            <Badge
              key={item.code}
              variant="secondary"
              className={cn(
                "gap-1 text-xs leading-tight",
                "bg-warning-50 text-warning-700 border-warning-200"
              )}
            >
              {item.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-warning-100 rounded-full"
                onClick={() => s.handleRemove(item.code)}
                aria-label={`移除禁忌症：${item.name}`}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
