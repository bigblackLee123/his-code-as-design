---
inclusion: manual
---

## 步骤 4：RLS 与权限

更新行级安全策略和访问控制。

- 新增表必须配置 RLS 策略（Supabase 默认开启 RLS）
- 确认访问模式：
  - 匿名读取（anon）
  - 认证用户读写（authenticated）
  - 服务端专用（service_role）
- 对照现有表的 RLS 策略保持一致风格
- 演示阶段如无认证需求，可暂用宽松策略并标注 TODO

输出格式：
🔒 RLS 与权限

新增/修改的 RLS 策略：xxx
访问模式：xxx
临时宽松策略：是/否（标注 TODO）
---

⬅️ [上一步：Seed Data 管理](./step-3-seed-data.md) | [返回目录](./index.md) | [下一步：Edge Function / RPC](./step-5-edge-function.md) ➡️
