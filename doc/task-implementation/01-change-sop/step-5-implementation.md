---
inclusion: manual
---

## 步骤 5：实施修改

按积木式策略执行代码变更。

执行规则：
- 先改 steering 文件和 tailwind.config.ts（如步骤 3 有需要）
- 再改/建 Block 组件文件
- 最后改页面组合层
- 每个 Block 文件不超过 200 行
- 新 Block 必须有明确的 Props 接口定义并导出
- Block 之间只通过 props/context 通信
- 敏感字段必须使用 MaskedText
- 所有样式必须使用 Tailwind 工具类 + Design Token
---

⬅️ [上一步：技术先验](./step-4-tech-validation.md) | [返回目录](./index.md) | [下一步：静态校验](./step-6-static-validation.md) ➡️
