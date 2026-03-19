---
inclusion: manual
---

# 后端变更标准操作流程（Backend Change SOP）

> 当变更涉及数据库 schema、Supabase Edge Function、数据迁移、前后端联调时，按以下步骤顺序执行。
> 纯前端 UI 变更请使用 `01-change-sop`；如果一个任务同时涉及前后端，后端部分走本流程，前端部分走 01-change-sop。

## 步骤导航

| 步骤 | 文档 | 说明 |
|------|------|------|
| 1 | [需求与数据分析](./step-1-requirement-data-analysis.md) | 明确变更的业务意图、涉及的表和字段 |
| 2 | [Schema 变更设计](./step-2-schema-change-design.md) | 设计表结构变更，确认迁移策略 |
| 3 | [Seed Data 管理](./step-3-seed-data.md) | 数据源解析、生成脚本编写、导入验证 |
| 4 | [RLS 与权限](./step-4-rls-permissions.md) | 行级安全策略和访问控制更新 |
| 5 | [Edge Function / RPC](./step-5-edge-function.md) | 服务端逻辑开发（Edge Function、数据库函数） |
| 6 | [后端验证](./step-6-backend-validation.md) | 数据一致性、API 调用、迁移回滚验证 |
| 7 | [前后端联调](./step-7-integration.md) | 前端对接后端接口，端到端流程验证 |

## 快速参考：常见后端变更场景

| 场景 | 典型步骤路径 |
|------|-------------|
| 新增表 + seed data | 1→2→3→4→6 |
| 修改现有表字段 | 1→2→3(如需)→4(如需)→6 |
| 新增 Edge Function | 1→5→6→7 |
| 数据架构重构（多表联动） | 1→2→3→4→5(如需)→6→7 |
| 新增外部 API 对接 | 1→5→6→7 |
