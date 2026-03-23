import { useRef } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { ScaleResult } from "@/services/types";
import { ClipboardList, CheckCircle } from "lucide-react";
import { ScaleQuestionRenderer } from "./ScaleQuestionRenderer";
import { useScaleForm } from "./useScaleForm";

export interface ScaleFormProps {
  patientId: string;
  onSubmit: (results: ScaleResult) => void;
}

export function ScaleForm({ patientId, onSubmit }: ScaleFormProps) {
  const formRef = useRef<HTMLDivElement>(null);
  const s = useScaleForm(onSubmit, patientId);

  return (
    <div ref={formRef} className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <ClipboardList className="h-4 w-4 text-primary-500" aria-hidden="true" />
        <span className="text-xs font-medium text-neutral-800 leading-tight">量表评估</span>
      </div>

      {!s.submitted && (
        <Select value={s.selectedTemplateId} onValueChange={(v) => s.setSelectedTemplateId(v ?? "")}>
          <SelectTrigger size="sm" className="text-xs leading-tight h-7 w-full data-[state=open]:ring-0 data-[state=open]:border-input">
            <SelectValue placeholder="请选择量表模板" />
          </SelectTrigger>
          <SelectContent side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false}>
            {s.templates.map((t) => (
              <SelectItem key={t.id} value={t.name} className="text-xs">{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {s.submitted && (
        <div className="flex items-center justify-between rounded-md bg-success-50 border border-success-200 p-2">
          <div className="flex items-center gap-1 text-xs text-success-700 leading-tight">
            <CheckCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span>
              {s.submittedTemplateName} 已提交
              {s.submittedScore !== undefined && (
                <span className="ml-1 font-medium">（总分：{s.submittedScore}）</span>
              )}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={s.handleReset} className="text-xs h-6">
            重新评估
          </Button>
        </div>
      )}

      {s.isLoading && <span className="text-xs text-neutral-400 leading-tight">加载中…</span>}

      {s.currentTemplate && !s.isLoading && !s.submitted && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-500 leading-tight">{s.currentTemplate.description}</p>
          <div className="flex flex-col gap-1">
            {s.currentTemplate.questions.map((q) => (
              <ScaleQuestionRenderer
                key={q.id} question={q} value={s.answers[q.id]}
                onChange={s.handleAnswerChange} hasError={s.errorIds.has(q.id)}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            {s.calculateTotalScore() !== undefined && (
              <span className="text-xs text-neutral-600 leading-tight">
                当前总分：<span className="font-medium text-primary-600">{s.calculateTotalScore()}</span>
              </span>
            )}
            <Button
              size="sm" disabled={!s.allRequiredAnswered} onClick={s.handleSubmit}
              className="text-xs ml-auto bg-primary-600 text-white hover:bg-primary-700"
            >
              提交量表
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
