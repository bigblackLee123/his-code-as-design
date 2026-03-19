---
inclusion: manual
---

## 步骤 6：后端验证

确认后端变更的正确性和稳定性。

验证清单：
- Schema 变更已生效（表/字段/索引存在）
- Seed data 已导入且数据正确
- RLS 策略生效（用不同角色测试访问）
- Edge Function / RPC 返回预期结果
- 外键约束有效（插入非法引用应报错）
- 数据一致性（跨表查询结果正确）

输出格式：
✅ 后端验证

Schema 验证：通过/失败
Seed data 验证：通过/失败
RLS 验证：通过/失败
函数验证：通过/失败（如适用）
数据一致性：通过/失败
---

⬅️ [上一步：Edge Function / RPC](./step-5-edge-function.md) | [返回目录](./index.md) | [下一步：前后端联调](./step-7-integration.md) ➡️
