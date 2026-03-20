import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

/**
 * 初始化 Supabase 客户端
 * 本地：SUPABASE_URL=http://127.0.0.1:54321（supabase start 自动注入）
 * 云端 Docker：通过 docker run -e 传入真实地址
 */
export function getSupabaseClient() {
  const url = Deno.env.get("SUPABASE_URL") ?? "http://127.0.0.1:54321";
  const key =
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ??
    Deno.env.get("SUPABASE_ANON_KEY") ??
    "";
  return createClient(url, key);
}

export interface AIConfig {
  apiKey: string;
  model: string;
  baseURL: string;
  appId: string | null;
}

/** 从 system_config 表动态读取百炼 API 配置 */
export async function loadAIConfig(
  supabase: ReturnType<typeof createClient>
): Promise<AIConfig> {
  const { data, error } = await supabase
    .from("system_config")
    .select("key, value")
    .in("key", [
      "DASHSCOPE_API_KEY",
      "AI_MODEL_NAME",
      "AI_BASE_URL",
      "BAILIAN_APP_ID",
    ]);

  if (error) throw new Error(`读取 system_config 失败: ${error.message}`);

  const m = Object.fromEntries(
    (data ?? []).map((c: { key: string; value: string }) => [c.key, c.value])
  );

  const apiKey = m.DASHSCOPE_API_KEY;
  if (!apiKey || apiKey === "sk-placeholder") {
    throw new Error(
      "DASHSCOPE_API_KEY 未配置，请在 system_config 表中设置真实值"
    );
  }

  const appId = m.BAILIAN_APP_ID;

  return {
    apiKey,
    model: m.AI_MODEL_NAME ?? "qwen3.5-plus",
    baseURL:
      m.AI_BASE_URL ??
      "https://dashscope.aliyuncs.com/api/v2/apps/protocols/compatible-mode/v1",
    appId: appId && appId !== "app-placeholder" ? appId : null,
  };
}
