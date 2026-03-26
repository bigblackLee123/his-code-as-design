import { createClient, SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? "";
const useMock = import.meta.env.VITE_USE_MOCK === "true";

function initClient(): SupabaseClient<Database> {
  if (!supabaseUrl || !supabaseAnonKey) {
    if (useMock) {
      // Mock 模式下返回一个占位 client，不会实际调用
      return createClient<Database>("http://localhost:0", "placeholder");
    }
    throw new Error(
      "缺少 Supabase 配置：请设置 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY 环境变量"
    );
  }
  return createClient<Database>(supabaseUrl, supabaseAnonKey);
}

export const supabase = initClient();
