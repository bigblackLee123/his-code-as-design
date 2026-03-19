---
inclusion: manual
---

## 步骤 3：Seed Data 管理

处理初始数据的解析、生成和导入。

- 确认数据源文件（Excel/CSV 路径）
- 编写或更新数据生成脚本（`scripts/` 目录下）
- 脚本输出格式：SQL INSERT 或 Supabase JS SDK 批量插入
- 执行导入并验证数据完整性：
  - 记录数是否与源文件一致
  - 外键引用是否有效
  - 枚举值是否在允许范围内

输出格式：
🌱 Seed Data 管理

数据源：xxx
生成脚本：scripts/xxx
记录数：xxx 条
验证结果：通过/失败（具体说明）
---

⬅️ [上一步：Schema 变更设计](./step-2-schema-change-design.md) | [返回目录](./index.md) | [下一步：RLS 与权限](./step-4-rls-permissions.md) ➡️
