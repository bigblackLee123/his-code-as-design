---
inclusion: manual
---

## 步骤 6：静态校验

代码写入后，postToolUse Hook 会自动触发以下检查：

- Design Token 合规性（颜色、间距、字号、圆角、阴影）
- 组件使用合规性（层级关系、互斥规则、HIS 专用组件）
- 积木式拆分合规性（文件行数、单一职责、通信方式）
- 数据脱敏合规性（敏感字段是否使用 MaskedText）

如果有违规项，必须在此步骤修复后再继续。
---

⬅️ [上一步：实施修改](./step-5-implementation.md) | [返回目录](./index.md) | [下一步：视觉验证](./step-7-visual-verification.md) ➡️
