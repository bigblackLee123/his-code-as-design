---
inclusion: always
---

## 2. 排版规范（Typography）

<!-- 字体族、字号阶梯、行高比例将在任务 3 中填充 -->

### 2.1 字体族（Font Family）

系统采用 Inter 作为拉丁字符主字体，Noto Sans SC 作为中文字体，搭配系统回退字体栈。

```
font-family: "Inter", "Noto Sans SC", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

| 用途 | 字体族 | Tailwind 类 | 说明 |
|------|--------|-------------|------|
| 默认正文 | Inter + Noto Sans SC | `font-sans` | 所有 UI 文本的默认字体 |
| 等宽代码 | JetBrains Mono, monospace | `font-mono` | 代码片段、数据 ID 等场景 |

使用规范：
- 在 `tailwind.config.ts` 中将 `fontFamily.sans` 扩展为上述字体栈
- 所有 UI 文本默认使用 `font-sans`，无需显式声明
- 仅在代码展示、数据编号等场景使用 `font-mono`

### 2.2 字号阶梯（Font Size Scale）

字号阶梯覆盖标题（h1-h6）、正文（body）和辅助文字（caption）场景，所有字号均映射到 Tailwind 内置工具类。

| 语义名称 | 像素值 | rem 值 | Tailwind 类 | 字重 | 使用场景 |
|----------|--------|--------|-------------|------|----------|
| h1 | 30px | 1.875rem | `text-3xl` | `font-bold` | 页面主标题 |
| h2 | 24px | 1.5rem | `text-2xl` | `font-semibold` | 区块标题 |
| h3 | 20px | 1.25rem | `text-xl` | `font-semibold` | 卡片标题 |
| h4 | 18px | 1.125rem | `text-lg` | `font-medium` | 子区块标题 |
| h5 | 16px | 1rem | `text-base` | `font-medium` | 小节标题 |
| h6 | 14px | 0.875rem | `text-sm` | `font-medium` | 标签标题 |
| body | 14px | 0.875rem | `text-sm` | `font-normal` | 正文文字（HIS 默认） |
| caption | 12px | 0.75rem | `text-xs` | `font-normal` | 辅助说明、时间戳、脚注 |

使用规范：
- HIS 系统默认正文字号为 14px（`text-sm`），而非浏览器默认的 16px，以适应高密度数据展示
- 标题层级严格按 h1→h6 递减使用，不可跳级
- 字重搭配：标题使用 `font-bold` 或 `font-semibold`，正文使用 `font-normal`，强调文字使用 `font-medium`

### 2.3 行高比例（Line Height）

行高分为三个级别，对应不同的数据密度场景。

| 级别 | 行高比例 | Tailwind 类 | 使用场景 |
|------|----------|-------------|----------|
| 紧凑 | 1.25 | `leading-tight` | 数据表格、紧凑列表、HIS 默认模式 |
| 标准 | 1.5 | `leading-normal` | 正文段落、表单标签、一般内容 |
| 宽松 | 1.75 | `leading-relaxed` | 长文本阅读、病历描述、宽松模式 |

使用规范：
- HIS 数据表格和列表默认使用 `leading-tight`（1.25）
- 表单和正文区域使用 `leading-normal`（1.5）
- 长文本阅读场景（如病历详情）使用 `leading-relaxed`（1.75）

---

⬅️ [上一节：颜色体系（Color System）](./color-tokens.md) | [返回目录](./index.md) | [下一节：间距系统（Spacing System）](./spacing-grid.md) ➡️
