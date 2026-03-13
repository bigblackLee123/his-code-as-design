import { useState, useEffect, useCallback } from "react";
import { scaleService } from "@/services/mock/scaleService";
import type { ScaleTemplate, ScaleResult } from "@/services/types";

export function useScaleForm(onSubmit: (r: ScaleResult) => void) {
  const [templates, setTemplates] = useState<ScaleTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState<ScaleTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[] | number>>({});
  const [errorIds, setErrorIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | undefined>();
  const [submittedTemplateName, setSubmittedTemplateName] = useState("");

  useEffect(() => { scaleService.getTemplates().then(setTemplates); }, []);

  useEffect(() => {
    if (!selectedTemplateId) {
      setCurrentTemplate(null); setAnswers({}); setErrorIds(new Set()); return;
    }
    setIsLoading(true);
    const tpl = templates.find((t) => t.name === selectedTemplateId);
    if (!tpl) { setIsLoading(false); return; }
    scaleService.getTemplate(tpl.id)
      .then((t) => { setCurrentTemplate(t); setAnswers({}); setErrorIds(new Set()); })
      .finally(() => setIsLoading(false));
  }, [selectedTemplateId, templates]);

  const handleAnswerChange = useCallback(
    (qid: string, value: string | string[] | number) => {
      setAnswers((p) => ({ ...p, [qid]: value }));
      setErrorIds((p) => { if (!p.has(qid)) return p; const n = new Set(p); n.delete(qid); return n; });
    }, []
  );

  const isAnswered = useCallback((qid: string): boolean => {
    const v = answers[qid];
    if (v === undefined || v === null) return false;
    if (typeof v === "string") return v.trim().length > 0;
    if (Array.isArray(v)) return v.length > 0;
    return true;
  }, [answers]);

  const allRequiredAnswered = currentTemplate?.questions
    .filter((q) => q.required).every((q) => isAnswered(q.id)) ?? false;

  const calculateTotalScore = useCallback((): number | undefined => {
    if (!currentTemplate) return undefined;
    let total = 0; let hasScore = false;
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
  }, [currentTemplate, answers]);

  const handleSubmit = useCallback(() => {
    if (!currentTemplate) return;
    const missing = currentTemplate.questions
      .filter((q) => q.required && !isAnswered(q.id)).map((q) => q.id);
    if (missing.length > 0) {
      setErrorIds(new Set(missing));
      document.getElementById(`question-${missing[0]}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const result: ScaleResult = {
      templateId: currentTemplate.id, answers: { ...answers },
      totalScore: calculateTotalScore(), submittedAt: new Date().toISOString(),
    };
    setSubmittedScore(result.totalScore);
    setSubmittedTemplateName(currentTemplate.name);
    setSubmitted(true);
    onSubmit(result);
  }, [currentTemplate, answers, isAnswered, calculateTotalScore, onSubmit]);

  const handleReset = useCallback(() => {
    setSubmitted(false); setSelectedTemplateId(""); setCurrentTemplate(null); setAnswers({});
  }, []);

  return {
    templates, selectedTemplateId, setSelectedTemplateId,
    currentTemplate, answers, errorIds, isLoading,
    submitted, submittedScore, submittedTemplateName,
    allRequiredAnswered, calculateTotalScore,
    handleAnswerChange, handleSubmit, handleReset,
  };
}
