---
inclusion: always
---

## 2. HIS 专用组件约束

### 2.1 HISDataTable 数据表格

基于 `@tanstack/react-table` + shadcn/ui `Table` 构建的 HIS 高密度数据表格组件，适用于医嘱列表、患者列表、检验报告等数据密集型场景。

- **技术依赖：**
  - `@tanstack/react-table`：表格核心逻辑（列定义、排序、筛选、分页）
  - `@tanstack/react-virtual`：虚拟滚动（大数据量场景）
  - shadcn/ui `Table` 系列组件：渲染层
- **必须支持的能力：**
  - **列固定（Column Pinning）：** 支持左侧/右侧列固定，常用于固定患者姓名列和操作列
  - **行选择（Row Selection）：** 支持单选和多选模式，选中行使用 `bg-primary-50` 高亮
  - **单元格编辑（Inline Cell Editing）：** 支持单击/双击进入编辑模式，编辑态使用 `ring-2 ring-primary-400` 聚焦样式
  - **虚拟滚动（Virtual Scrolling）：** 数据量超过 100 行时必须启用虚拟滚动，通过 `@tanstack/react-virtual` 实现
  - **分页（Pagination）：** 支持前端分页和服务端分页两种模式
- **允许的属性：**
  - `columns`: `ColumnDef<TData>[]` — 列定义数组（必填）
  - `data`: `TData[]` — 数据源（必填）
  - `enableColumnPinning`: `boolean` — 是否启用列固定，默认 `false`
  - `enableRowSelection`: `boolean | ((row: Row<TData>) => boolean)` — 是否启用行选择，默认 `false`
  - `enableCellEditing`: `boolean` — 是否启用单元格编辑，默认 `false`
  - `enableVirtualScroll`: `boolean` — 是否启用虚拟滚动，默认 `false`（数据量 > 100 时自动启用）
  - `pagination`: `{ pageSize: number; pageIndex: number; total: number }` — 分页配置
  - `onRowClick`: `(row: Row<TData>) => void` — 行点击回调
  - `density`: `"compact" | "standard"` — 数据密度，默认 `"compact"`
- **默认数据密度（紧凑模式）：**
  - 单元格字号：`text-xs`
  - 行高：`leading-tight`
  - 单元格内间距：`px-1 py-1`
  - 表头字号：`text-xs font-medium`
  - 表头背景：`bg-neutral-100`
  - 行间距：`gap-1`
  - 边框：`border-b border-neutral-200`
- **禁止用法：**
  - 禁止在 HIS 数据密集型场景（医嘱列表、患者列表、检验报告等）中直接使用基础 `Table` 组件
  - 禁止在数据量超过 100 行时不启用虚拟滚动
  - 禁止使用 `text-base` 或更大字号作为表格单元格字号
- **层级约束：** 无特殊父组件限制，但建议放置在 `Card` 或独立区块内

### 2.2 HISStatCard 统计卡片

基于 shadcn/ui `Card` 构建的 HIS 统计数据展示卡片，适用于仪表盘、科室概览、工作站首页等场景。

- **组件结构：** 图标 + 标题 + 数值 + 趋势指示器 + 描述
- **允许的属性：**
  - `title`: `string` — 统计指标名称（必填）
  - `value`: `string | number` — 统计数值（必填）
  - `icon`: `React.ReactNode` — 图标，推荐使用 `lucide-react` 图标（可选）
  - `trend`: `"up" | "down" | "neutral"` — 趋势方向（可选）
  - `trendValue`: `string` — 趋势变化值，如 "+12%" 或 "-3%"（可选）
  - `description`: `string` — 补充描述文字（可选）
- **默认样式：**
  - 卡片：`rounded-lg shadow-sm bg-white`
  - 标题：`text-xs text-neutral-500 leading-tight`
  - 数值：`text-2xl font-bold text-neutral-800 leading-tight`
  - 趋势上升：`text-success-600`
  - 趋势下降：`text-error-600`
  - 趋势持平：`text-neutral-500`
  - 内间距：`p-3`（紧凑模式）
- **禁止用法：**
  - 禁止在 `HISStatCard` 内嵌套另一个 `HISStatCard`
  - 禁止将 `trend` 设为 `"up"` 或 `"down"` 时不提供 `trendValue`
  - 禁止使用自定义颜色表示趋势方向，必须使用上述语义色
- **层级约束：** 通常作为仪表盘网格布局的子元素，推荐使用 `grid grid-cols-2 xl:grid-cols-4 gap-3` 布局

### 2.3 HISTimeline 时间线

基于 shadcn/ui 基础组件构建的 HIS 垂直时间线组件，适用于患者就诊记录、医嘱执行记录、护理操作记录等场景。

- **组件结构：** 垂直时间轴 + 时间标记 + 状态圆点 + 内容区块
- **允许的属性：**
  - `items`: `TimelineItem[]` — 时间线条目数组（必填）
    - `time`: `string` — 时间标记，如 "2024-01-15 09:30"（必填）
    - `status`: `"admitted" | "inHospital" | "discharged" | "critical" | "pending" | "executing" | "completed" | "cancelled"` — 状态类型（必填）
    - `title`: `string` — 条目标题（必填）
    - `description`: `string` — 条目描述（可选）
    - `icon`: `React.ReactNode` — 自定义图标，默认使用状态圆点（可选）
  - `density`: `"compact" | "standard"` — 数据密度，默认 `"compact"`
- **状态圆点颜色映射：**
  - 使用 HIS 患者状态色和医嘱状态色（参见 `his-design-system.md` 1.5 节）
  - 入院（admitted）：`bg-his-admitted`
  - 在院（inHospital）：`bg-his-inHospital`
  - 出院（discharged）：`bg-his-discharged`
  - 危急（critical）：`bg-his-critical`（搭配 `animate-pulse`）
  - 待执行（pending）：`bg-his-pending`
  - 执行中（executing）：`bg-his-executing`
  - 已完成（completed）：`bg-his-completed`
  - 已取消（cancelled）：`bg-his-cancelled`
- **默认样式（紧凑模式）：**
  - 时间文字：`text-xs text-neutral-400 leading-tight`
  - 标题文字：`text-xs font-medium text-neutral-800 leading-tight`
  - 描述文字：`text-xs text-neutral-500 leading-tight`
  - 状态圆点：`w-2 h-2 rounded-full`
  - 时间轴线：`border-l border-neutral-200`
  - 条目间距：`gap-1`
- **禁止用法：**
  - 禁止使用水平布局（HIS 场景中时间线必须为垂直方向）
  - 禁止使用自定义颜色替代 HIS 状态色
  - 禁止在时间线条目内嵌套另一个 `HISTimeline`
- **层级约束：** 通常放置在 `Card` 或侧边面板内

### 2.4 HISFormLayout 表单布局

基于 shadcn/ui `Form` 构建的 HIS 表单布局组件，适用于患者信息录入、医嘱开立、检查申请等表单场景。

- **布局模式：**
  - **单列布局（1 列）：** 适用于简单表单、移动端适配
  - **双列布局（2 列）：** 适用于标准表单，HIS 最常用布局
  - **三列布局（3 列）：** 适用于信息密集型表单，如入院登记
- **允许的属性：**
  - `columns`: `1 | 2 | 3` — 列数（必填），默认 `2`
  - `density`: `"compact" | "standard"` — 数据密度，默认 `"compact"`
  - `children`: `React.ReactNode` — 表单字段（必填）
- **标签对齐规则：**
  - 标签必须右对齐（`text-right`），与输入框左侧对齐
  - 标签宽度固定，推荐使用 `w-24`（紧凑模式）或 `w-32`（标准模式）
  - 标签与输入框之间间距：`gap-2`（紧凑模式）或 `gap-4`（标准模式）
- **默认样式（紧凑模式）：**
  - 布局网格：`grid grid-cols-2 gap-2`（双列示例）
  - 标签：`text-xs text-neutral-600 text-right leading-tight`
  - 输入框：`text-xs leading-tight h-7`
  - 字段间距：`gap-2`
  - 区块间距：`gap-4`
- **默认样式（标准模式）：**
  - 布局网格：`grid grid-cols-2 gap-4`（双列示例）
  - 标签：`text-sm text-neutral-600 text-right leading-normal`
  - 输入框：`text-sm leading-normal h-9`
  - 字段间距：`gap-4`
  - 区块间距：`gap-6`
- **禁止用法：**
  - 禁止使用左对齐标签（`text-left`）
  - 禁止超过 3 列布局
  - 禁止在 `HISFormLayout` 外部放置表单字段
  - 禁止在表单字段中使用非 shadcn/ui 的输入组件
- **层级约束：**
  - 所有表单字段（`FormItem`、`FormField`）必须在 `HISFormLayout` 内部
  - `HISFormLayout` 通常放置在 `Card` 或 `DialogContent` 内

---

⬅️ [通用 shadcn/ui 组件约束](./base-components.md) | [返回目录](./index.md) | [组件层级关系汇总](./hierarchy.md) ➡️
