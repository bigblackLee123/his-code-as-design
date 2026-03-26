---
inclusion: always
---

## 5. 圆角（Border Radius）

圆角令牌定义了系统中所有圆角值，统一使用 Tailwind 内置圆角类。

| 语义名称 | 像素值 | Tailwind 类 | 使用场景 |
|----------|--------|-------------|----------|
| none | 0px | `rounded-none` | 无圆角，用于全宽区块、分割线 |
| sm | 2px | `rounded-sm` | 微圆角，用于小型标签、徽章 |
| default | 4px | `rounded` | 默认圆角，用于按钮、输入框 |
| md | 6px | `rounded-md` | 中等圆角，用于卡片、下拉菜单 |
| lg | 8px | `rounded-lg` | 大圆角，用于对话框、弹出层 |
| xl | 12px | `rounded-xl` | 超大圆角，用于大型卡片、面板 |
| 2xl | 16px | `rounded-2xl` | 特大圆角，用于特殊装饰性容器 |
| full | 9999px | `rounded-full` | 全圆角，用于头像、圆形按钮、状态圆点 |

使用规范（Earmersion 视觉升级后）：
- HIS 系统默认组件圆角为 `rounded-lg`（8px）
- 按钮使用 `rounded-lg`（8px），大型 CTA 按钮使用 `rounded-full`
- 卡片使用 `rounded-xl`（12px）或 `rounded-2xl`（16px）
- 主内容区面板使用 `rounded-2xl`（16px）或 `rounded-3xl`（24px）
- 对话框和模态框使用 `rounded-xl`（12px）
- 头像和状态指示器使用 `rounded-full`
- 筛选 Tab / Pill 按钮使用 `rounded-full`
- 禁止使用任意圆角值（如 `rounded-[5px]`）

---

⬅️ [上一节：HIS 数据密度模式（Data Density）](./data-density.md) | [返回目录](./index.md) | [下一节：阴影（Shadows）](./shadows.md) ➡️
