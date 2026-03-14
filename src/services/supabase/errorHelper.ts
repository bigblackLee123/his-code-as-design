interface SupabaseErrorContext {
  table: string;
  operation: "select" | "insert" | "update" | "delete" | "rpc";
}

export function throwIfError(
  error: { message: string; code?: string } | null,
  context: SupabaseErrorContext
): void {
  if (!error) return;
  throw new Error(`[${context.table}.${context.operation}] ${error.message}`);
}
