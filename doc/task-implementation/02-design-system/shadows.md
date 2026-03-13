---
inclusion: always
---

## 6. 阴影（Shadows）

阴影令牌用于表达元素的层级关系和视觉深度，统一使用 Tailwind 内置阴影类。

| 语义名称 | Tailwind 类 | 使用场景 |
|----------|-------------|----------|
| sm | `shadow-sm` | 微阴影，用于卡片悬停前的默认状态、输入框 |
| default | `shadow` | 默认阴影，用于卡片、面板 |
| md | `shadow-md` | 中等阴影，用于下拉菜单、弹出提示 |
| lg | `shadow-lg` | 大阴影，用于对话框、模态框 |
| xl | `shadow-xl` | 超大阴影，用于浮动面板、全屏遮罩上的内容 |
| none | `shadow-none` | 无阴影，用于扁平化元素、禁用态 |

使用规范：
- 卡片默认使用 `shadow-sm`，悬停态使用 `shadow-md`（搭配 `hover:shadow-md`）
- 下拉菜单和弹出层使用 `shadow-md` 或 `shadow-lg`
- 对话框和模态框使用 `shadow-lg` 或 `shadow-xl`
- 层级越高的元素阴影越深，保持视觉层次一致性
- 禁止使用自定义阴影值（如 `shadow-[0_2px_4px_rgba(0,0,0,0.1)]`）

---

⬅️ [上一节：圆角（Border Radius）](./border-radius.md) | [返回目录](./index.md) | [下一节：断点（Breakpoints）](./breakpoints.md) ➡️
