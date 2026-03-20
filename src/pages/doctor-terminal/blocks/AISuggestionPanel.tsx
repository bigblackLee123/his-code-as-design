import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { aiService } from "@/services";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import type { Patient, ConsultationData, AITherapySuggestion } from "@/services/types";
import { Sparkles, RotateCcw, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMEOUT_MS = 30_000;

export interface AISuggestionPanelProps {
  patient: Patient;
  consultationData: ConsultationData;
  onAdopt: (suggestion: AITherapySuggestion) => void;
}

export function AISuggestionPanel({ patient, consultationData, onAdopt }: AISuggestionPanelProps) {
  const [suggestion, setSuggestion] = useState<AITherapySuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchSuggestion = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      // consultationId 模式：Edge Function 从 DB 聚合完整数据
      const consultationId = await consultationHelper.getActiveId(patient.id);

      const result = await Promise.race([
        aiService.getTherapySuggestion({
          consultationId,
          vitals: { systolicBP: 0, diastolicBP: 0, heartRate: 0, recordedAt: "", recordedBy: "" },
          contraindications: [],
          scaleResult: null,
        }),
        new Promise<never>((_, reject) => {
          const timer = setTimeout(() => reject(new Error("请求超时")), TIMEOUT_MS);
          controller.signal.addEventListener("abort", () => clearTimeout(timer));
        }),
      ]);

      if (!controller.signal.aborted) {
        setSuggestion(result);
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err instanceof Error ? err.message : "获取 AI 建议失败，请重试");
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
      abortRef.current = null;
    }
  }, [patient.id]);

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-secondary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">AI 疗愈建议</span>
        </div>
        {!loading && !suggestion && (
          <Button variant="default" size="sm" onClick={fetchSuggestion} aria-label="获取 AI 建议">
            <Sparkles className="h-3 w-3" />
            <span>获取建议</span>
          </Button>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-6 text-xs text-neutral-500">
          <Loader2 className="h-4 w-4 animate-spin text-primary-500" aria-hidden="true" />
          <span>AI 正在分析患者数据，匹配疗愈方案…</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="text-xs font-medium">获取失败</AlertTitle>
          <AlertDescription className="text-xs">{error}</AlertDescription>
          <div className="mt-2">
            <Button variant="outline" size="sm" onClick={fetchSuggestion} aria-label="重试获取 AI 建议">
              <RotateCcw className="h-3 w-3" />
              <span>重试</span>
            </Button>
          </div>
        </Alert>
      )}

      {/* Suggestion result */}
      {suggestion && (
        <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
          <div className="flex items-center justify-between">
            <Badge
              className={cn(
                "text-xs leading-tight",
                suggestion.confidence >= 0.8
                  ? "bg-success-50 text-success-700 border-success-200"
                  : "bg-warning-50 text-warning-700 border-warning-200"
              )}
            >
              置信度 {Math.round(suggestion.confidence * 100)}%
            </Badge>
            <Button variant="default" size="sm" onClick={() => onAdopt(suggestion)} aria-label="采纳 AI 建议">
              <CheckCircle className="h-3 w-3" />
              <span>采纳建议</span>
            </Button>
          </div>

          <div className="flex flex-col gap-1.5 rounded-md bg-primary-50 p-2">
            <span className="text-xs text-neutral-600 leading-tight">
              {suggestion.reason}
            </span>
            {suggestion.projectNames.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {suggestion.projectNames.map((name) => (
                  <Badge key={name} variant="outline" className="text-xs px-1 py-0">
                    {name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
