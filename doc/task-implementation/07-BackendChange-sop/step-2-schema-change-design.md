---
inclusion: manual
---

## 步骤 2：Schema 变更设计

设计表结构变更，确认迁移策略。

- 写出完整的 DDL（CREATE TABLE / ALTER TABLE）
- 标注字段类型、约束、默认值、索引
- 对照 `doc/backend/数据模块设计.md` 确认命名一致性（snake_case、UUID 主键、TIMESTAMPTZ 时间戳）
- 确认迁移策略：
  - 新增表 → 直接 CREATE
  - 修改字段 → ALTER + 数据回填方案
  - 删除字段/表 → 确认无引用后 DROP
- 如果是 Supabase 本地开发，确认 migration 文件命名规范

输出格式：
🗄️ Schema 变更设计

变更类型：新增表/修改表/删除表
DDL：（完整 SQL）
迁移策略：xxx
数据回填：需要/不需要（方案说明）
需要更新 数据模块设计.md：是/否
---

⬅️ [上一步：需求与数据分析](./step-1-requirement-data-analysis.md) | [返回目录](./index.md) | [下一步：Seed Data 管理](./step-3-seed-data.md) ➡️
