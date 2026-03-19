---
inclusion: manual
---

## 步骤 5：Edge Function / RPC

开发服务端逻辑。

适用场景：
- Supabase Edge Function（Deno/TypeScript）
- 数据库 RPC 函数（plpgsql）
- 外部 API 对接（如百炼平台）

开发流程：
1. 确认函数职责和输入/输出接口
2. 如涉及外部 API，先用独立脚本验证（参考 01-change-sop 步骤 4 技术先验）
3. 编写 Edge Function 或 RPC 函数
4. 本地测试：`supabase functions serve` 或 SQL 直接调用
5. 错误处理：统一返回格式 `{ data, error }`

输出格式：
⚡ Edge Function / RPC

函数名：xxx
类型：Edge Function / RPC
输入：xxx
输出：xxx
外部依赖：xxx（如有）
本地测试：通过/失败
---

⬅️ [上一步：RLS 与权限](./step-4-rls-permissions.md) | [返回目录](./index.md) | [下一步：后端验证](./step-6-backend-validation.md) ➡️
