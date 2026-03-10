import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { aiService } from "@/services/mock/aiService";
import { patientService } from "@/services/mock/patientService";
import type { Patient, ConsultationData, AISuggestion } from "@/services/types";
import { Sparkles, RotateCcw, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const TIMEOUT_MS = 30_000;

export interface AISuggestionPanelProps {
  patient: Patient;
  consultationData: ConsultationData;
  onAdopt: (suggestion: AISuggestion) => void;
}

export function AISuggestionPanel({ patient, consultationData, onAdopt }: AISuggestionPanelProps) {
  const [suggestion, setSuggestion] = useState<AISuggestion | null>(null);
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
      const vitals = await patientService.getVitalSigns(patient.id);
      if (!vitals) {
        setError("未找到患者生理数据，无法获取 AI 建议");
        setLoading(false);
        return;
      }

      const result = await Promise.race([
        aiService.getSuggestion({
          vitals,
          contraindications: consultationData.contraindications,
          scaleResult: consultationData.scaleResults,
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
  }, [patient.id, consultationData.contraindications, consultationData.scaleResults]);

  return (
    <div className="flex flex-col gap-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Sparkles className="h-4 w-4 text-secondary-500" aria-hidden="true" />
          <span className="text-xs font-medium text-neutral-800 leading-tight">AI 处方建议</span>
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
          <span>AI 正在分析患者数据，请稍候…</span>
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
          {/* Confidence badge */}
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

          {/* Herb table */}
          <div className="overflow-auto">
            <table className="w-full text-xs leading-tight">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-100">
                  <th className="px-1 py-1 text-left font-medium text-neutral-600">药材</th>
                  <th className="px-1 py-1 text-right font-medium text-neutral-600">剂量</th>
                  <th className="px-1 py-1 text-left font-medium text-neutral-600">单位</th>
                  <th className="px-1 py-1 text-left font-medium text-neutral-600">功效</th>
                </tr>
              </thead>
              <tbody>
                {suggestion.herbs.map((herb) => (
                  <tr key={herb.name} className="border-b border-neutral-200 last:border-b-0">
                    <td className="px-1 py-1 text-neutral-800">{herb.name}</td>
                    <td className="px-1 py-1 text-right text-neutral-800">{herb.dosage}</td>
                    <td className="px-1 py-1 text-neutral-500">{herb.unit}</td>
                    <td className="px-1 py-1 text-neutral-500">{herb.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Usage & notes */}
          <div className="flex flex-col gap-1 text-xs leading-tight">
            <div className="flex gap-1">
              <span className="text-neutral-500 shrink-0">用法：</span>
              <span className="text-neutral-700">{suggestion.usage}</span>
            </div>
            <div className="flex gap-1">
              <span className="text-neutral-500 shrink-0">注意：</span>
              <span className="text-neutral-700">{suggestion.notes}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
