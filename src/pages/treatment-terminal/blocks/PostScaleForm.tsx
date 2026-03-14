import { useState, useEffect, useCallback, useRef } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { scaleService } from "@/services";
import type { ScaleTemplate, ScaleResult } from "@/services/types";
import { ClipboardList } from "lucide-react";
import { ScaleQuestionRenderer } from "@/pages/doctor-terminal/blocks/ScaleQuestionRenderer";

export interface PostScaleFormProps {
  onSubmit: (results: ScaleResult) => void;
}

export function PostScaleForm({ onSubmit }: PostScaleFormProps) {
  const [templates, setTemplates] = useState<ScaleTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [currentTemplate, setCurrentTemplate] = useState<ScaleTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scaleService.getTemplates().then(setTemplates);
  }, []);

  useEffect(() => {
    if (!selectedTemplateId) {
      setCurrentTemplate(null);
      setAnswers({});
      setErrorIds(new Set());
      return;
    }
    setIsLoading(true);
    // Find template by name to get its ID
    const template = templates.find((t) => t.name === selectedTemplateId);
    if (!template) {
      setIsLoading(false);
      return;
    }
    scaleService
      .getTemplate(template.id)
      .then((t) => {
        setCurrentTemplate(t);
        setAnswers({});
        setErrorIds(new Set());
      })
      .finally(() => setIsLoading(false));
  }, [selectedTemplateId, templates]);

  const handleAnswerChange = useCallback(
    (questionId: string, value: string | string[] | number) => {
      setAnswers((prev) => ({ ...prev, [questionId]: value }));
      setErrorIds((prev) => {
        if (!prev.has(questionId)) return prev;
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    },
    []
  );

  const isAnswered = useCallback(
    (questionId: string): boolean => {
      const val = answers[questionId];
      if (val === undefined || val === null) return false;
      if (typeof val === "string") return val.trim().length > 0;
      if (Array.isArray(val)) return val.length > 0;
      return true;
    },
    [answers]
  );

  const allRequiredAnswered =
    currentTemplate?.questions
      .filter((q) => q.required)
      .every((q) => isAnswered(q.id)) ?? false;

  const calculateTotalScore = (): number | undefined => {
    if (!currentTemplate) return undefined;
    let total = 0;
    let hasScore = false;
    for (const q of currentTemplate.questions) {
      const val = answers[q.id];
      if (q.type === "single-choice" && typeof val === "string" && q.options) {
        const opt = q.options.find((o) => o.value === val);
        if (opt?.score !== undefined) { total += opt.score; hasScore = true; }
      }
      if (q.type === "multi-choice" && Array.isArray(val) && q.options) {
        for (const v of val) {
          const opt = q.options.find((o) => o.value === v);
          if (opt?.score !== undefined) { total += opt.score; hasScore = true; }
        }
      }
    }
    return hasScore ? total : undefined;
  };

  const handleSubmit = () => {
    if (!currentTemplate) return;
    const missing = currentTemplate.questions
      .filter((q) => q.required && !isAnswered(q.id))
      .map((q) => q.id);

    if (missing.length > 0) {
      setErrorIds(new Set(missing));
      const firstEl = document.getElementById(`question-${missing[0]}`);
      firstEl?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    const result: ScaleResult = {
      templateId: currentTemplate.id,
      answers: { ...answers },
      totalScore: calculateTotalScore(),
      submittedAt: new Date().toISOString(),
    };
    onSubmit(result);
  };

  const totalScore = calculateTotalScore();

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
