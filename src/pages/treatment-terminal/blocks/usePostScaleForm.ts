import { useState, useEffect, useCallback } from "react";
import { scaleService } from "@/services";
import type { ScaleTemplate, ScaleResult } from "@/services/types";

export function usePostScaleForm(onSubmit: (result: ScaleResult) => void) {
  const [templates, setTemplates] = useState<ScaleTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState<ScaleTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

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
    const template = templates.find((t) => t.name === selectedTemplateId);
    if (!template) { setIsLoading(false); return; }
    scaleService
      .getTemplate(template.id)
      .then((t) => { setCurrentTemplate(t); setAnswers({}); setErrorIds(new Set()); })
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
    }, []
  );

  const isAnswered = useCallback(
    (qid: string): boolean => {
      const val = answers[qid];
      if (val === undefined || val === null) return false;
      if (typeof val === "string") return val.trim().length > 0;
      if (Array.isArray(val)) return val.length > 0;
      return true;
    }, [answers]
  );

  const allRequiredAnswered =
    currentTemplate?.questions.filter((q) => q.required).every((q) => isAnswered(q.id)) ?? false;

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
    onSubmit({
      templateId: currentTemplate.id,
      answers: { ...answers },
      totalScore: calculateTotalScore(),
      submittedAt: new Date().toISOString(),
    });
  };

  return {
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    currentTemplate,
    answers,
    errorIds,
    isLoading,
    allRequiredAnswered,
    totalScore: calculateTotalScore(),
    handleAnswerChange,
    handleSubmit,
  };
}
