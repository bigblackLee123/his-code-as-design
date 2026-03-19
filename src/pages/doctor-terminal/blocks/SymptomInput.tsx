import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { symptomService } from "@/services";
import type { Symptom } from "@/services/types";
import { Search, X, Stethoscope } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SymptomInputProps {
  value: Symptom[];
  onChange: (items: Symptom[]) => void;
}

export function SymptomInput({ value, onChange }: SymptomInputProps) {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<Symptom[]>([]);
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
      const items = await symptomService.search(term);
      const selected = new Set(value.map((v) => v.name));
      setResults(items.filter((item) => !selected.has(item.name)));
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

  const handleSelect = (item: Symptom) => {
    onChange([...value, item]);
    setKeyword("");
    setResults([]);
    setIsOpen(false);
  };

  const handleRemove = (name: string) => {
    onChange(value.filter((v) => v.name !== name));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <Stethoscope className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">症状</span>
      </div>

      <div ref={containerRef} className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-neutral-400" aria-hidden="true" />
          <Input
            type="search"
            placeholder="输入症状名称或拼音首字母检索"
            value={keyword}
            onChange={handleInputChange}
            onFocus={() => { if (results.length > 0) setIsOpen(true); }}
            className="pl-7 text-xs leading-tight h-7"
            aria-label="症状搜索"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            inputMode="search"
          />
          {isLoading && (
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
              检索中…
            </span>
          )}
        </div>

        {isOpen && results.length > 0 && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md max-h-48 overflow-auto">
            {results.map((item) => (
              <button
                key={item.name}
                type="button"
                className="flex w-full items-center px-2 py-1.5 text-xs leading-tight hover:bg-primary-50 transition-colors text-left"
                onClick={() => handleSelect(item)}
              >
                <span className="text-neutral-800">{item.name}</span>
              </button>
            ))}
          </div>
        )}

        {isOpen && keyword.trim() && results.length === 0 && !isLoading && (
          <div className="absolute z-10 bottom-full mb-1 w-full rounded-md border border-neutral-200 bg-white shadow-md px-2 py-2 text-xs text-neutral-400 text-center">
            未找到匹配的症状
          </div>
        )}
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {value.map((item) => (
            <Badge
              key={item.name}
              variant="secondary"
              className={cn("gap-1 text-xs leading-tight", "bg-primary-50 text-primary-700 border-primary-200")}
            >
              {item.name}
              <Button
                variant="ghost"
                size="icon"
                className="h-3 w-3 p-0 hover:bg-primary-100 rounded-full"
                onClick={() => handleRemove(item.name)}
                aria-label={`移除症状：${item.name}`}
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
