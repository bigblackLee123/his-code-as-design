---
inclusion: always
---

# HIS 设计规范（Design System）

> 本文件是医院信息系统（HIS）的核心设计规范，定义了所有 Design Token（设计令牌），
> 作为 AI 生成 UI 代码的唯一设计来源。技术栈：React + TypeScript + Tailwind CSS + shadcn/ui。

## 1. 颜色体系（Color System）

<!-- 品牌色、语义色、中性色阶、HIS 专用语义色将在任务 2 中填充 -->

### 1.1 品牌主色（Primary）

医疗蓝色系，传达专业、信任、安全的视觉感受。基准色为 `#0284c7`（sky-600）。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#f0f9ff` | `bg-primary-50`  | `text-primary-50`  |
| 100  | `#e0f2fe` | `bg-primary-100` | `text-primary-100` |
| 200  | `#bae6fd` | `bg-primary-200` | `text-primary-200` |
| 300  | `#7dd3fc` | `bg-primary-300` | `text-primary-300` |
| 400  | `#38bdf8` | `bg-primary-400` | `text-primary-400` |
| 500  | `#0ea5e9` | `bg-primary-500` | `text-primary-500` |
| 600  | `#0284c7` | `bg-primary-600` | `text-primary-600` |
| 700  | `#0369a1` | `bg-primary-700` | `text-primary-700` |
| 800  | `#075985` | `bg-primary-800` | `text-primary-800` |
| 900  | `#0c4a6e` | `bg-primary-900` | `text-primary-900` |

- 默认品牌色：`primary-600`（`#0284c7`），用于主按钮、链接、选中态
- 悬停态：`primary-700`（`#0369a1`）
- 浅色背景：`primary-50`（`#f0f9ff`），用于选中行、高亮区域
- 边框/分割线强调：`primary-200`（`#bae6fd`）

### 1.2 辅助色（Secondary）

医疗紫色系，用于次要操作、标签、辅助信息等场景。基准色为 `#7C3AED`（violet-600）。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#f5f3ff` | `bg-secondary-50`  | `text-secondary-50`  |
| 100  | `#ede9fe` | `bg-secondary-100` | `text-secondary-100` |
| 200  | `#ddd6fe` | `bg-secondary-200` | `text-secondary-200` |
| 300  | `#c4b5fd` | `bg-secondary-300` | `text-secondary-300` |
| 400  | `#a78bfa` | `bg-secondary-400` | `text-secondary-400` |
| 500  | `#8b5cf6` | `bg-secondary-500` | `text-secondary-500` |
| 600  | `#7C3AED` | `bg-secondary-600` | `text-secondary-600` |
| 700  | `#6d28d9` | `bg-secondary-700` | `text-secondary-700` |
| 800  | `#5b21b6` | `bg-secondary-800` | `text-secondary-800` |
| 900  | `#4c1d95` | `bg-secondary-900` | `text-secondary-900` |

- 默认辅助色：`secondary-600`（`#7C3AED`），用于次要按钮、标签、徽章
- 悬停态：`secondary-700`（`#6d28d9`）
- 浅色背景：`secondary-50`（`#f5f3ff`），用于辅助信息区域

### 1.3 语义色（Semantic Colors）

#### 成功色（Success）

绿色系，用于成功状态、确认操作、正向反馈。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#f0fdf4` | `bg-success-50`  | `text-success-50`  |
| 100  | `#dcfce7` | `bg-success-100` | `text-success-100` |
| 200  | `#bbf7d0` | `bg-success-200` | `text-success-200` |
| 300  | `#86efac` | `bg-success-300` | `text-success-300` |
| 400  | `#4ade80` | `bg-success-400` | `text-success-400` |
| 500  | `#22c55e` | `bg-success-500` | `text-success-500` |
| 600  | `#16a34a` | `bg-success-600` | `text-success-600` |
| 700  | `#15803d` | `bg-success-700` | `text-success-700` |
| 800  | `#166534` | `bg-success-800` | `text-success-800` |
| 900  | `#14532d` | `bg-success-900` | `text-success-900` |

- 默认成功色：`success-500`（`#22c55e`）
- 成功背景：`success-50`（`#f0fdf4`）
- 成功文字：`success-700`（`#15803d`）

#### 警告色（Warning）

琥珀色系，用于警告提示、需要注意的状态。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#fffbeb` | `bg-warning-50`  | `text-warning-50`  |
| 100  | `#fef3c7` | `bg-warning-100` | `text-warning-100` |
| 200  | `#fde68a` | `bg-warning-200` | `text-warning-200` |
| 300  | `#fcd34d` | `bg-warning-300` | `text-warning-300` |
| 400  | `#fbbf24` | `bg-warning-400` | `text-warning-400` |
| 500  | `#f59e0b` | `bg-warning-500` | `text-warning-500` |
| 600  | `#d97706` | `bg-warning-600` | `text-warning-600` |
| 700  | `#b45309` | `bg-warning-700` | `text-warning-700` |
| 800  | `#92400e` | `bg-warning-800` | `text-warning-800` |
| 900  | `#78350f` | `bg-warning-900` | `text-warning-900` |

- 默认警告色：`warning-500`（`#f59e0b`）
- 警告背景：`warning-50`（`#fffbeb`）
- 警告文字：`warning-700`（`#b45309`）

#### 错误色（Error）

红色系，用于错误状态、危险操作、删除确认。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#fef2f2` | `bg-error-50`  | `text-error-50`  |
| 100  | `#fee2e2` | `bg-error-100` | `text-error-100` |
| 200  | `#fecaca` | `bg-error-200` | `text-error-200` |
| 300  | `#fca5a5` | `bg-error-300` | `text-error-300` |
| 400  | `#f87171` | `bg-error-400` | `text-error-400` |
| 500  | `#ef4444` | `bg-error-500` | `text-error-500` |
| 600  | `#dc2626` | `bg-error-600` | `text-error-600` |
| 700  | `#b91c1c` | `bg-error-700` | `text-error-700` |
| 800  | `#991b1b` | `bg-error-800` | `text-error-800` |
| 900  | `#7f1d1d` | `bg-error-900` | `text-error-900` |

- 默认错误色：`error-500`（`#ef4444`）
- 错误背景：`error-50`（`#fef2f2`）
- 错误文字：`error-700`（`#b91c1c`）

#### 信息色（Info）

天蓝色系，用于信息提示、帮助说明、中性通知。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#f0f9ff` | `bg-info-50`  | `text-info-50`  |
| 100  | `#e0f2fe` | `bg-info-100` | `text-info-100` |
| 200  | `#bae6fd` | `bg-info-200` | `text-info-200` |
| 300  | `#7dd3fc` | `bg-info-300` | `text-info-300` |
| 400  | `#38bdf8` | `bg-info-400` | `text-info-400` |
| 500  | `#0ea5e9` | `bg-info-500` | `text-info-500` |
| 600  | `#0284c7` | `bg-info-600` | `text-info-600` |
| 700  | `#0369a1` | `bg-info-700` | `text-info-700` |
| 800  | `#075985` | `bg-info-800` | `text-info-800` |
| 900  | `#0c4a6e` | `bg-info-900` | `text-info-900` |

- 默认信息色：`info-500`（`#0ea5e9`）
- 信息背景：`info-50`（`#f0f9ff`）
- 信息文字：`info-700`（`#0369a1`）

### 1.4 中性色阶（Neutral Scale）

Slate 灰色系，用于文本、背景、边框、分割线等基础 UI 元素。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 | 用途说明 |
|------|--------|----------------|------------------|----------|
| 50   | `#f8fafc` | `bg-neutral-50`  | `text-neutral-50`  | 页面背景 |
| 100  | `#f1f5f9` | `bg-neutral-100` | `text-neutral-100` | 卡片/区块背景 |
| 200  | `#e2e8f0` | `bg-neutral-200` | `text-neutral-200` | 分割线、边框 |
| 300  | `#cbd5e1` | `bg-neutral-300` | `text-neutral-300` | 禁用态边框 |
| 400  | `#94a3b8` | `bg-neutral-400` | `text-neutral-400` | 占位符文字 |
| 500  | `#64748b` | `bg-neutral-500` | `text-neutral-500` | 辅助文字 |
| 600  | `#475569` | `bg-neutral-600` | `text-neutral-600` | 次要文字 |
| 700  | `#334155` | `bg-neutral-700` | `text-neutral-700` | 正文文字 |
| 800  | `#1e293b` | `bg-neutral-800` | `text-neutral-800` | 标题文字 |
| 900  | `#0f172a` | `bg-neutral-900` | `text-neutral-900` | 最深文字/深色背景 |

- 页面背景：`neutral-50`（`#f8fafc`）
- 卡片背景：`white`（`#ffffff`）或 `neutral-100`（`#f1f5f9`）
- 默认边框：`neutral-200`（`#e2e8f0`），对应 `border-neutral-200`
- 正文文字：`neutral-700`（`#334155`）
- 标题文字：`neutral-800`（`#1e293b`）
- 辅助/次要文字：`neutral-500`（`#64748b`）
- 占位符文字：`neutral-400`（`#94a3b8`）
- 禁用态文字：`neutral-300`（`#cbd5e1`）

### 1.5 HIS 专用语义色

#### 1.5.1 患者状态色

患者在院流程中的状态标识色，用于患者列表、床位图、状态标签等场景。

| 状态 | 语义 | Hex 值 | Tailwind bg 类 | Tailwind text 类 | 浅色背景类 |
|------|------|--------|----------------|------------------|------------|
| 入院 | admitted | `#0284c7` | `bg-his-admitted` | `text-his-admitted` | `bg-his-admitted/10` |
| 在院 | inHospital | `#16a34a` | `bg-his-inHospital` | `text-his-inHospital` | `bg-his-inHospital/10` |
| 出院 | discharged | `#64748b` | `bg-his-discharged` | `text-his-discharged` | `bg-his-discharged/10` |
| 危急 | critical | `#dc2626` | `bg-his-critical` | `text-his-critical` | `bg-his-critical/10` |

使用规范：
- 状态标签（Badge）：使用浅色背景 + 对应深色文字，如 `bg-his-admitted/10 text-his-admitted`
- 状态圆点：使用实色背景，如 `bg-his-inHospital`
- 危急状态需额外添加视觉强调（如闪烁动画或加粗边框），不可仅依赖颜色区分

#### 1.5.2 医嘱状态色

医嘱执行流程中的状态标识色，用于医嘱列表、执行单、护理工作站等场景。

| 状态 | 语义 | Hex 值 | Tailwind bg 类 | Tailwind text 类 | 浅色背景类 |
|------|------|--------|----------------|------------------|------------|
| 待执行 | pending | `#d97706` | `bg-his-pending` | `text-his-pending` | `bg-his-pending/10` |
| 执行中 | executing | `#0284c7` | `bg-his-executing` | `text-his-executing` | `bg-his-executing/10` |
| 已完成 | completed | `#16a34a` | `bg-his-completed` | `text-his-completed` | `bg-his-completed/10` |
| 已取消 | cancelled | `#64748b` | `bg-his-cancelled` | `text-his-cancelled` | `bg-his-cancelled/10` |

使用规范：
- 状态标签（Badge）：使用浅色背景 + 对应深色文字，如 `bg-his-pending/10 text-his-pending`
- 状态圆点：使用实色背景，如 `bg-his-completed`
- 待执行状态在紧急医嘱场景下可搭配 `animate-pulse` 提示关注

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

## 3. 间距系统（Spacing System）

<!-- 4px 基准网格倍数体系将在任务 3 中填充 -->

间距系统以 4px 为基准网格单位，所有间距值必须为 4px 的倍数。禁止使用任意间距值（如 `p-[13px]`）。

| 像素值 | rem 值 | Tailwind 类（padding） | Tailwind 类（margin） | Tailwind 类（gap） | 使用场景 |
|--------|--------|----------------------|---------------------|-------------------|----------|
| 4px | 0.25rem | `p-1` | `m-1` | `gap-1` | 紧凑元素内间距、图标与文字间距 |
| 8px | 0.5rem | `p-2` | `m-2` | `gap-2` | 按钮内间距、表格单元格间距 |
| 12px | 0.75rem | `p-3` | `m-3` | `gap-3` | 卡片内间距（紧凑模式）、输入框内间距 |
| 16px | 1rem | `p-4` | `m-4` | `gap-4` | 卡片内间距（标准模式）、区块间距 |
| 20px | 1.25rem | `p-5` | `m-5` | `gap-5` | 大卡片内间距、表单组间距 |
| 24px | 1.5rem | `p-6` | `m-6` | `gap-6` | 区块间距（标准模式）、页面内边距 |
| 32px | 2rem | `p-8` | `m-8` | `gap-8` | 大区块间距、页面分区间距 |
| 40px | 2.5rem | `p-10` | `m-10` | `gap-10` | 页面顶部/底部间距 |
| 48px | 3rem | `p-12` | `m-12` | `gap-12` | 大型布局间距 |
| 64px | 4rem | `p-16` | `m-16` | `gap-16` | 页面级大间距、Hero 区域间距 |

使用规范：
- 所有间距值必须从上表中选取，禁止使用 Tailwind 的任意值语法（如 `p-[13px]`）
- 同一层级的元素间距应保持一致
- 嵌套层级越深，间距越小（外层 `p-6`，内层 `p-4`，最内层 `p-2`）
- 水平间距和垂直间距可以不同，但都必须符合 4px 网格

## 4. HIS 数据密度模式（Data Density）

<!-- 紧凑/标准/宽松三种级别将在任务 3 中填充 -->

### 4.1 紧凑模式（Compact）

HIS 系统的默认数据密度模式，适用于数据表格、医嘱列表、患者列表等高密度数据展示场景。

| 属性 | 值 | Tailwind 类 | 说明 |
|------|-----|-------------|------|
| 正文字号 | 12px | `text-xs` | 表格单元格、列表项文字 |
| 辅助字号 | 10px | `text-[10px]` | 时间戳、次要信息 |
| 标题字号 | 14px | `text-sm` | 表头、区块标题 |
| 行高 | 1.25 | `leading-tight` | 所有文本行高 |
| 行间距 | 4px | `gap-1` | 表格行间距、列表项间距 |
| 单元格内间距 | 4px | `px-1 py-1` | 表格单元格 padding |
| 区块间距 | 8px | `gap-2` | 卡片间距、表单组间距 |

使用场景：
- 数据表格（默认）
- 医嘱列表
- 患者列表
- 床位图
- 护理工作站

### 4.2 标准模式（Standard）

适用于表单页面、详情页面等需要适中信息密度的场景。

| 属性 | 值 | Tailwind 类 | 说明 |
|------|-----|-------------|------|
| 正文字号 | 14px | `text-sm` | 表单标签、正文内容 |
| 辅助字号 | 12px | `text-xs` | 帮助文字、提示信息 |
| 标题字号 | 16px | `text-base` | 表单区块标题、卡片标题 |
| 行高 | 1.5 | `leading-normal` | 所有文本行高 |
| 行间距 | 8px | `gap-2` | 表单字段间距 |
| 单元格内间距 | 8px | `px-2 py-2` | 输入框、选择器内间距 |
| 区块间距 | 16px | `gap-4` | 表单分组间距、卡片间距 |

使用场景：
- 表单页面
- 详情页面
- 设置页面
- 对话框内容

### 4.3 宽松模式（Comfortable）

适用于长文本阅读、病历详情、报告展示等需要良好可读性的场景。

| 属性 | 值 | Tailwind 类 | 说明 |
|------|-----|-------------|------|
| 正文字号 | 16px | `text-base` | 正文段落、病历内容 |
| 辅助字号 | 14px | `text-sm` | 注释、补充说明 |
| 标题字号 | 18px | `text-lg` | 区块标题 |
| 行高 | 1.75 | `leading-relaxed` | 所有文本行高 |
| 行间距 | 12px | `gap-3` | 段落间距 |
| 单元格内间距 | 12px | `px-3 py-3` | 内容区域内间距 |
| 区块间距 | 24px | `gap-6` | 大区块间距 |

使用场景：
- 病历详情页
- 检查报告展示
- 长文本阅读
- 打印预览

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

使用规范：
- HIS 系统默认组件圆角为 `rounded-md`（6px）
- 按钮使用 `rounded`（4px）或 `rounded-md`（6px）
- 卡片和对话框使用 `rounded-lg`（8px）
- 头像和状态指示器使用 `rounded-full`
- 禁止使用任意圆角值（如 `rounded-[5px]`）

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

## 7. 断点（Breakpoints）

断点系统基于 Tailwind CSS 默认断点，并针对 HIS 常用显示器分辨率进行适配说明。

| 断点名称 | 最小宽度 | Tailwind 前缀 | 说明 |
|----------|----------|---------------|------|
| sm | 640px | `sm:` | 小屏设备（平板竖屏） |
| md | 768px | `md:` | 中屏设备（平板横屏） |
| lg | 1024px | `lg:` | 大屏设备（小型桌面显示器） |
| xl | 1280px | `xl:` | 超大屏设备（标准桌面显示器） |
| 2xl | 1536px | `2xl:` | 宽屏设备（大型桌面显示器） |

HIS 常用分辨率适配：

| 分辨率 | 适用断点 | 说明 |
|--------|----------|------|
| 1280×1024 | `xl:` | 老旧医疗终端，4:3 比例，需确保纵向空间利用 |
| 1366×768 | `xl:` | 护士站常见分辨率，横向空间有限 |
| 1920×1080 | `2xl:` | 医生工作站标准分辨率，可充分利用横向空间 |

使用规范：
- HIS 系统以 `xl`（1280px）为主要设计断点，确保在 1280×1024 分辨率下完整可用
- 使用移动优先（mobile-first）的响应式策略，从小屏向大屏逐步增强
- 数据表格在 `lg` 以下断点应支持横向滚动
- 侧边导航栏在 `lg` 以下断点应可折叠
- 仪表盘卡片布局：`lg` 以下单列，`xl` 双列或三列，`2xl` 四列
