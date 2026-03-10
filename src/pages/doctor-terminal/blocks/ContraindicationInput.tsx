import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { contraindicationService } from "@/services/mock/contraindicationService";
import type { Contraindication } from "@/services/types";
import { Search, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContraindicationInputProps {
  value: Contraindication[];
  onChange: (items: Contraindication[]) => void;
}

export function ContraindicationInput({ value, onChange }: ContraindicationInputProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Contraindication[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const items = await contraindicationService.search(term);
      const selectedCodes = new Set(value.map((v) => v.code));
      setResults(items.filter((item) => !selectedCodes.has(item.code)));
      setIsOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setKeyword(val);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => doSearch(val), 200);
  };

  const handleSelect = (item: Contraindication) => {
    onChange([...value, item]);
    setKeyword("");
    setResults([]);
    setIsOpen(false);
  };

  const handleRemove = (code: string) => {
    onChange(value.filter((v) => v.code !== code));
  };

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

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center gap-1">
        <AlertTriangle className="h-4 w-4 text-warning-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">禁忌症</span>
      </div>

      {/* Search input with dropdown */}
      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="输入禁忌症名称或拼音首字母检索"
            value={keyword}
            onChange={handleInputChange}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            className="pl-7 text-xs leading-tight h-7"
            aria-label="禁忌症搜索"
          />
          {isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
              检索中…
            </span>
          )}
        </div>

        {/* Dropdown results */}
        {isOpen && results.length > 0 && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-md max-h-48 overflow-auto">
            {results.map((item) => (
              <button
                key={item.code}
                type="button"
                className="flex w-full items-center justify-between px-2 py-1.5 text-xs leading-tight hover:bg-primary-50 transition-colors text-left"
                onClick={() => handleSelect(item)}
              >
                <span className="text-neutral-800">{item.name}</span>
                <span className="text-neutral-400">{item.category}</span>
              </button>
            ))}
          </div>
        )}

        {/* No results hint */}
        {isOpen && keyword.trim() && results.length === 0 && !isLoading && (
          <div className="absolute z-10 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-md px-2 py-2 text-xs text-neutral-400 text-center">
            未找到匹配的禁忌症
          </div>
        )}
      </div>

      {/* Selected badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item) => (
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
                onClick={() => handleRemove(item.code)}
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
