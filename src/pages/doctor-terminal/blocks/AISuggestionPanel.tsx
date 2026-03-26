import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAISuggestion } from "./useAISuggestion";
import type { Patient, ConsultationData, AITherapySuggestion, TherapyProject } from "@/services/types";
import { Sparkles, Brain, RotateCcw, CheckCircle, AlertTriangle, Loader2, Send, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AISuggestionPanelProps {
  patient: Patient;
  consultationData: ConsultationData;
  onAdopt: (suggestion: AITherapySuggestion, projects: TherapyProject[]) => void;
}

export function AISuggestionPanel({ patient, onAdopt }: AISuggestionPanelProps) {
  const { suggestion, loading, error, fetch: fetchSuggestion, adoptProjects } = useAISuggestion(patient.id);
  const [adoptPhase, setAdoptPhase] = useState<"idle" | "shrink" | "check" | "done">("idle");

  /* ── 初始态：大图标 + 居中引导 ── */
  if (!loading && !suggestion && !error) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-6 flex flex-col items-center justify-center gap-4 group cursor-pointer h-full" onClick={fetchSuggestion}>
          <Brain className="h-10 w-10 text-secondary-400" aria-hidden="true" />
          <div className="flex items-center gap-1">
            <Sparkles className="h-4 w-4 text-warning-400 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-125" aria-hidden="true" />
            <span className="text-sm font-bold text-white leading-tight">AI 预诊建议</span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed text-center">
            耳界疗愈大模型提供服务
          </p>
          <Button
            onClick={fetchSuggestion}
            className="rounded-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 text-sm font-medium"
            aria-label="开始智能分析"
          >
            <Send className="h-4 w-4" />
            开始智能分析
          </Button>
      </div>
    );
  }

  /* ── 加载态 ── */
  if (loading) {
    return (
      <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-6 flex flex-col items-center justify-center gap-3 h-full">
          <div className="relative">
            <Loader2 className="h-8 w-8 animate-spin text-primary-400" aria-hidden="true" />
            <Brain className="absolute inset-0 m-auto h-4 w-4 text-primary-300" aria-hidden="true" />
          </div>
          <span className="text-xs text-primary-300 animate-pulse leading-tight">
            耳界疗愈大模型正在检索文献库...
          </span>
      </div>
    );
  }

  /* ── 错误态 ── */
  if (error) {
    return (
      <Alert variant="destructive" className="rounded-2xl">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle className="text-xs font-medium">获取失败</AlertTitle>
        <AlertDescription className="text-xs">{error}</AlertDescription>
        <div className="mt-2">
          <Button variant="outline" size="sm" onClick={fetchSuggestion} aria-label="重试">
            <RotateCcw className="h-3 w-3" />
            重试
          </Button>
        </div>
      </Alert>
    );
  }

  /* ── 结果态 ── */
  if (!suggestion) return null;

  return (
    <div className="rounded-xl border border-neutral-700 bg-neutral-900 p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2 border-b border-neutral-700 pb-2">
          <Sparkles className="h-4 w-4 text-primary-300" aria-hidden="true" />
          <Brain className="h-4 w-4 text-primary-400" aria-hidden="true" />
          <span className="text-xs font-medium text-white leading-tight">耳界疗愈大模型临床分析结果</span>
        </div>

        <div className="flex items-center justify-between">
          <Badge
            className={cn(
              "text-xs leading-tight",
              suggestion.confidence >= 0.8
                ? "bg-success-500/20 text-success-400 border-success-500/30"
                : "bg-warning-500/20 text-warning-400 border-warning-500/30"
            )}
          >
            置信度 {Math.round(suggestion.confidence * 100)}%
          </Badge>
          <button
            type="button"
            disabled={adoptPhase !== "idle"}
            onClick={async () => {
              setAdoptPhase("shrink");
              const projects = await adoptProjects();
              setTimeout(() => setAdoptPhase("check"), 300);
              setTimeout(() => {
                setAdoptPhase("done");
                onAdopt(suggestion, projects);
              }, 900);
            }}
            className={cn(
              "flex items-center justify-center gap-1 text-sm font-medium text-white transition-all duration-300",
              adoptPhase === "idle" && "rounded-full bg-primary-600 hover:bg-primary-700 px-4 py-1.5",
              adoptPhase === "shrink" && "rounded-full bg-primary-600 w-8 h-8 px-0 py-0",
              adoptPhase === "check" && "rounded-full bg-success-500 w-8 h-8 px-0 py-0",
              adoptPhase === "done" && "rounded-full bg-success-500 px-4 py-1.5",
            )}
            aria-label="采纳建议"
          >
            {adoptPhase === "idle" && (
              <>
                <CheckCircle className="h-3 w-3" />
                采纳建议
              </>
            )}
            {(adoptPhase === "shrink") && <span className="opacity-0">·</span>}
            {adoptPhase === "check" && <Check className="h-4 w-4 animate-bounce" />}
            {adoptPhase === "done" && (
              <>
                <Check className="h-3 w-3" />
                已采纳
              </>
            )}
          </button>
        </div>

        <div className="rounded-xl bg-neutral-800 p-3 flex flex-col gap-1.5">
          <span className="text-xs text-primary-300 leading-relaxed">{suggestion.reason}</span>
          {suggestion.projectNames.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {suggestion.projectNames.map((name) => (
                <Badge key={name} variant="outline" className="text-xs px-1.5 py-0 text-neutral-300 border-neutral-600">
                  {name}
                </Badge>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
