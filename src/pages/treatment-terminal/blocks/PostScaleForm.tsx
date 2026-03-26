import { useRef } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ScaleResult } from "@/services/types";
import { ClipboardList } from "lucide-react";
import { ScaleQuestionRenderer } from "@/pages/doctor-terminal/blocks/ScaleQuestionRenderer";
import { usePostScaleForm } from "./usePostScaleForm";

export interface PostScaleFormProps {
  onSubmit: (results: ScaleResult) => void;
}

export function PostScaleForm({ onSubmit }: PostScaleFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    currentTemplate,
    answers,
    errorIds,
    isLoading,
    allRequiredAnswered,
    totalScore,
    handleAnswerChange,
    handleSubmit,
  } = usePostScaleForm(onSubmit);

  return (
    <div ref={formRef} className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <ClipboardList className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">
          治疗后量表评估
        </span>
      </div>

      <Select value={selectedTemplateId} onValueChange={(v) => setSelectedTemplateId(v ?? "")}>
        <SelectTrigger size="sm" className="text-xs leading-tight h-7 w-full data-[state=open]:ring-0 data-[state=open]:border-input">
          <SelectValue placeholder="请选择量表模板" />
        </SelectTrigger>
        <SelectContent side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false}>
          {templates.map((t) => (
            <SelectItem key={t.id} value={t.name} className="text-xs">
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isLoading && (
        <span className="text-xs text-neutral-400 leading-tight">加载中…</span>
      )}

      {currentTemplate && !isLoading && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-500 leading-tight">
            {currentTemplate.description}
          </p>

          <div className="flex flex-col gap-1">
            {currentTemplate.questions.map((q) => (
              <ScaleQuestionRenderer
                key={q.id}
                question={q}
                value={answers[q.id]}
                onChange={handleAnswerChange}
                hasError={errorIds.has(q.id)}
              />
            ))}
          </div>

          <div className="flex items-center justify-between">
            {totalScore !== undefined && (
              <span className="text-xs text-neutral-600 leading-tight">
                当前总分：
                <span className="font-medium text-primary-600">{totalScore}</span>
              </span>
            )}
            <Button
              size="sm"
              disabled={!allRequiredAnswered}
              onClick={handleSubmit}
              className="text-xs ml-auto"
            >
              提交量表
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
