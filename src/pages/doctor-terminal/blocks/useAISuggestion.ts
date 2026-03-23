import { useState, useCallback, useRef } from "react";
import { aiService, therapyService } from "@/services";
import { consultationHelper } from "@/services/supabase/consultationHelper";
import type { AITherapySuggestion, TherapyProject } from "@/services/types";

const TIMEOUT_MS = 30_000;

export function useAISuggestion(patientId: string) {
  const [suggestion, setSuggestion] = useState<AITherapySuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSuggestion(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const consultationId = await consultationHelper.getActiveId(patientId);

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
  }, [patientId]);

  const adoptProjects = useCallback(async (): Promise<TherapyProject[]> => {
    if (!suggestion) return [];
    const results = await Promise.all(
      suggestion.projectIds.map((id) => therapyService.getProjectById(id)),
    );
    return results.filter((p): p is TherapyProject => p !== null);
  }, [suggestion]);

  return { suggestion, loading, error, fetch, adoptProjects };
}
