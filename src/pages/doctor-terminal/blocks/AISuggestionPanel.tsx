import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAISuggestion } from "./useAISuggestion";
import type { Patient, ConsultationData, AITherapySuggestion, TherapyProject } from "@/services/types";
import { Sparkles, RotateCcw, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AISuggestionPanelProps {
  patient: Patient;
  consultationData: ConsultationData;
  onAdopt: (suggestion: AITherapySuggestion, projects: TherapyProject[]) => void;
}

export function AISuggestionPanel({ patient, onAdopt }: AISuggestionPanelProps) {
  const { suggestion, loading, error, fetch: fetchSuggestion, adoptProjects } = useAISuggestion(patient.id);

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
            <Button variant="default" size="sm" onClick={async () => {
              const projects = await adoptProjects();
              onAdopt(suggestion, projects);
            }} aria-label="采纳 AI 建议">
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
