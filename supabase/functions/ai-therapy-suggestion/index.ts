/**
 * Edge Function: ai-therapy-suggestion
 * 患者数据 → DB 禁忌过滤 → 候选项目列表 → 百炼模型选择组合 → 推荐方案
 *
 * 两种调用模式：
 *   1. App 模式（有 BAILIAN_APP_ID）：百炼原生 /api/v1/apps/{appId}/completion
 *   2. 直连模式（无 APP_ID）：OpenAI 兼容 chat/completions
 */

import { corsHeaders } from "./_shared/cors.ts";
import { getSupabaseClient, loadAIConfig } from "./_shared/config.ts";
import type { AIConfig } from "./_shared/config.ts";
import {
  loadPatientContext,
  buildPatientContextFromBody,
} from "./_shared/patient.ts";
import { loadCandidateProjects } from "./_shared/projects.ts";
import { buildUserMessage } from "./_shared/prompt.ts";

/** 百炼 App 原生 API 调用 */
async function callBailianApp(
  cfg: AIConfig,
  userMessage: string,
): Promise<string> {
  const url = `https://dashscope.aliyuncs.com/api/v1/apps/${cfg.appId}/completion`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      input: { prompt: userMessage },
      parameters: {},
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`百炼 App API 错误 (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.output?.text ?? "";
}

/** OpenAI 兼容模式调用（直连模型，无 App） */
async function callDirectModel(
  cfg: AIConfig,
  userMessage: string,
): Promise<string> {
  const url = `${cfg.baseURL}/chat/completions`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${cfg.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: cfg.model,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`模型 API 错误 (${res.status}): ${text}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = getSupabaseClient();
    const aiCfg = await loadAIConfig(supabase);
    const body = await req.json();

    // ── 患者上下文 ──
    const patient = body.consultationId
      ? await loadPatientContext(supabase, body.consultationId)
      : buildPatientContextFromBody(body);

    // ── 禁忌过滤：从 DB 查项目并排除冲突 ──
    const candidates = await loadCandidateProjects(
      supabase,
      patient.contraindications,
    );

    const userMessage = buildUserMessage(patient, candidates);

    // ── 调用百炼 ──
    const rawText = aiCfg.appId
      ? await callBailianApp(aiCfg, userMessage)
      : await callDirectModel(aiCfg, userMessage);

    // ── 解析返回 ──
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error(`AI 返回格式异常: ${rawText.slice(0, 200)}`);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const result = {
      id: `AI-${Date.now()}`,
      projectIds: parsed.projectIds ?? [],
      projectNames: parsed.projectNames ?? [],
      reason: parsed.reason ?? "",
      confidence: parsed.confidence ?? 0.5,
      generatedAt: new Date().toISOString(),
    };

    // ── 持久化 ──
    if (body.consultationId) {
      await supabase.from("ai_suggestions").upsert(
        {
          consultation_id: body.consultationId,
          model: aiCfg.appId ?? aiCfg.model,
          prompt_snapshot: userMessage,
          raw_response: rawText,
          notes: result.reason,
          confidence: result.confidence,
          generated_at: result.generatedAt,
        },
        { onConflict: "consultation_id" },
      );
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[ai-therapy-suggestion]", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
