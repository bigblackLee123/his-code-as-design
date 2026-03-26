---
inclusion: always
---

## 1. 颜色体系（Color System）

> Earmersion 视觉升级后的颜色体系。品牌色从 sky 蓝切换至 indigo 靛蓝，
> 传达科技感、专业感与耳界品牌调性。

### 1.1 品牌主色（Primary）

靛蓝色系（Indigo），传达科技、智能、专业的视觉感受。基准色为 `#4f46e5`（indigo-600）。

| 色阶 | Hex 值 | Tailwind bg 类 | Tailwind text 类 |
|------|--------|----------------|------------------|
| 50   | `#eef2ff` | `bg-primary-50`  | `text-primary-50`  |
| 100  | `#e0e7ff` | `bg-primary-100` | `text-primary-100` |
| 200  | `#c7d2fe` | `bg-primary-200` | `text-primary-200` |
| 300  | `#a5b4fc` | `bg-primary-300` | `text-primary-300` |
| 400  | `#818cf8` | `bg-primary-400` | `text-primary-400` |
| 500  | `#6366f1` | `bg-primary-500` | `text-primary-500` |
| 600  | `#4f46e5` | `bg-primary-600` | `text-primary-600` |
| 700  | `#4338ca` | `bg-primary-700` | `text-primary-700` |
| 800  | `#3730a3` | `bg-primary-800` | `text-primary-800` |
| 900  | `#312e81` | `bg-primary-900` | `text-primary-900` |

- 默认品牌色：`primary-600`（`#4f46e5`），用于主按钮、链接、选中态
- 悬停态：`primary-700`（`#4338ca`）
- 浅色背景：`primary-50`（`#eef2ff`），用于选中行、高亮区域
- 边框/分割线强调：`primary-200`（`#c7d2fe`）
- 深色背景（Header/侧边栏深色区域）：`primary-900`（`#312e81`）

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
| 900  | `#0f172a` | `bg-neutral-900` | `text-neutral-900` | 最深文字/深色面板背景 |

- 页面背景：`neutral-50`（`#f8fafc`）
- 卡片背景：`white`（`#ffffff`）或 `neutral-100`（`#f1f5f9`）
- 默认边框：`neutral-200`（`#e2e8f0`），对应 `border-neutral-200`
- 正文文字：`neutral-700`（`#334155`）
- 标题文字：`neutral-800`（`#1e293b`）
- 辅助/次要文字：`neutral-500`（`#64748b`）
- 占位符文字：`neutral-400`（`#94a3b8`）
- 禁用态文字：`neutral-300`（`#cbd5e1`）
- AI 深色面板背景：`neutral-900`（`#0f172a`）

### 1.5 HIS 专用语义色

#### 1.5.1 患者状态色

| 状态 | 语义 | Hex 值 | Tailwind bg 类 | Tailwind text 类 | 浅色背景类 |
|------|------|--------|----------------|------------------|------------|
| 入院 | admitted | `#4f46e5` | `bg-his-admitted` | `text-his-admitted` | `bg-his-admitted/10` |
| 在院 | inHospital | `#16a34a` | `bg-his-inHospital` | `text-his-inHospital` | `bg-his-inHospital/10` |
| 出院 | discharged | `#64748b` | `bg-his-discharged` | `text-his-discharged` | `bg-his-discharged/10` |
| 危急 | critical | `#dc2626` | `bg-his-critical` | `text-his-critical` | `bg-his-critical/10` |

使用规范：
- 状态标签（Badge）：使用浅色背景 + 对应深色文字，如 `bg-his-admitted/10 text-his-admitted`
- 状态圆点：使用实色背景，如 `bg-his-inHospital`
- 危急状态需额外添加视觉强调（如闪烁动画或加粗边框），不可仅依赖颜色区分

#### 1.5.2 医嘱状态色

| 状态 | 语义 | Hex 值 | Tailwind bg 类 | Tailwind text 类 | 浅色背景类 |
|------|------|--------|----------------|------------------|------------|
| 待执行 | pending | `#d97706` | `bg-his-pending` | `text-his-pending` | `bg-his-pending/10` |
| 执行中 | executing | `#4f46e5` | `bg-his-executing` | `text-his-executing` | `bg-his-executing/10` |
| 已完成 | completed | `#16a34a` | `bg-his-completed` | `text-his-completed` | `bg-his-completed/10` |
| 已取消 | cancelled | `#64748b` | `bg-his-cancelled` | `text-his-cancelled` | `bg-his-cancelled/10` |

使用规范：
- 状态标签（Badge）：使用浅色背景 + 对应深色文字
- 待执行状态在紧急医嘱场景下可搭配 `animate-pulse` 提示关注

### 1.6 Earmersion 专属场景色

耳界疗愈系统特有的区域/场景色，用于治疗区域标识和干预面板。

| 场景 | 色系 | 基准色 | 浅色背景 | 文字色 | 使用场景 |
|------|------|--------|----------|--------|----------|
| 静区（睡眠+情志） | blue | `primary-600` | `primary-50` | `primary-700` | 静区干预面板、睡眠/情志配方卡片 |
| 动区（运动疗愈） | emerald | `success-600` | `success-50` | `success-700` | 动区康复面板、运动配方卡片 |
| AI 面板 | slate dark | `neutral-900` | — | `primary-300` | AI 诊断终端、知识库匹配卡 |
| 禁忌症 | amber | `warning-600` | `warning-50` | `warning-700` | 禁忌症筛查、冲突标记 |

---

[返回目录](./index.md) | [下一节：排版规范（Typography）](./typography.md) ➡️
```

### 2. 圆角