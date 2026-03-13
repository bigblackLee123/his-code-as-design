---
inclusion: manual
---

## 步骤 2：影响评估

判断变更的影响范围和修改策略。

对照现有 Block 拆分，判断属于以下哪种情况：

| 变更类型 | 操作策略 | 风险等级 |
|----------|----------|----------|
| 修改现有 Block 内部逻辑 | 只改对应 Block 文件 | 低 |
| 新增 Block | 新建 Block 文件 + 修改页面组合层 | 低 |
| 删除 Block | 删除 Block 文件 + 修改页面组合层 | 中 |
| 调整 Block 间数据流 | 修改页面组合层的 props/state | 中 |
| 修改共享组件（components/his/） | 影响所有引用该组件的 Block | 高 |
| 新增/修改 Design Token | 改 steering 文件 + tailwind.config.ts | 高 |

输出格式：
```
🔍 影响评估
- 变更类型：xxx
- 受影响文件：xxx
- 风险等级：低/中/高
- 是否影响其他 Block：是/否
```
---

⬅️ [上一步：需求分析](./step-1-requirement-analysis.md) | [返回目录](./index.md) | [下一步：设计规范检查](./step-3-design-check.md) ➡️
