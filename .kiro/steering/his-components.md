---
inclusion: always
---

# HIS 组件约束规则（Component Constraints）

> 本文件定义 HIS 前端项目中所有 UI 组件的使用约束规则。AI 在生成任何 UI 代码时必须严格遵循以下约束。
> 技术栈：React + TypeScript + Tailwind CSS + shadcn/ui + @tanstack/react-table。
> 所有组件必须基于 shadcn/ui 组件库构建，禁止引入其他第三方 UI 组件库。

## 1. 通用 shadcn/ui 组件约束

### 1.1 Button 按钮

- **允许的属性：**
  - `variant`: `"default"` | `"destructive"` | `"outline"` | `"secondary"` | `"ghost"` | `"link"`
  - `size`: `"default"` | `"sm"` | `"lg"` | `"icon"`
  - `disabled`: `boolean`
  - `asChild`: `boolean`
- **推荐默认值：** `variant="default"` `size="sm"`（HIS 紧凑模式）
- **禁止的属性组合：**
  - `variant="link"` 与 `size="icon"` 不可同时使用
  - `variant="destructive"` 不可用于非危险操作场景
- **互斥属性：** `disabled` 与 `loading` 互斥，不可同时为 `true`
- **层级约束：** 无特殊父组件限制

### 1.2 Input 输入框

- **允许的属性：**
  - `type`: `"text"` | `"password"` | `"email"` | `"number"` | `"search"` | `"tel"`
  - `placeholder`: `string`
  - `disabled`: `boolean`
  - `readOnly`: `boolean`
- **推荐默认值：** 使用 `text-xs leading-tight`（紧凑模式）或 `text-sm leading-normal`（标准模式）
- **禁止的属性组合：**
  - `disabled` 与 `readOnly` 不可同时为 `true`
- **层级约束：** 必须在 `<FormItem>` 内使用，且必须关联 `<Label>`

### 1.3 Card 卡片

- **允许的属性：**
  - `className`: Tailwind 工具类
- **推荐默认值：** `rounded-lg shadow-sm`
- **层级约束：**
  - `CardHeader` 只能作为 `Card` 的直接子组件
  - `CardContent` 只能作为 `Card` 的直接子组件
  - `CardFooter` 只能作为 `Card` 的直接子组件
  - `CardTitle` 只能作为 `CardHeader` 的子组件
  - `CardDescription` 只能作为 `CardHeader` 的子组件

### 1.4 Dialog 对话框

- **允许的属性：**
  - `open`: `boolean`
  - `onOpenChange`: `(open: boolean) => void`
- **推荐默认值：** `rounded-lg shadow-lg`
- **层级约束：**
  - `DialogTrigger` 只能作为 `Dialog` 的直接子组件
  - `DialogContent` 只能作为 `Dialog` 的直接子组件
  - `DialogHeader` 只能作为 `DialogContent` 的子组件
  - `DialogFooter` 只能作为 `DialogContent` 的子组件
  - `DialogTitle` 只能作为 `DialogHeader` 的子组件（必须存在，无障碍性要求）
  - `DialogDescription` 只能作为 `DialogHeader` 的子组件
- **禁止用法：** `DialogContent` 内禁止嵌套另一个 `Dialog`

### 1.5 Table 表格（基础）

- **层级约束：**
  - `TableHeader` 只能作为 `Table` 的直接子组件
  - `TableBody` 只能作为 `Table` 的直接子组件
  - `TableFooter` 只能作为 `Table` 的直接子组件
  - `TableRow` 只能作为 `TableHeader` / `TableBody` / `TableFooter` 的子组件
  - `TableHead` 只能作为 `TableRow`（在 `TableHeader` 内）的子组件
  - `TableCell` 只能作为 `TableRow`（在 `TableBody` / `TableFooter` 内）的子组件
- **注意：** HIS 数据表格场景请使用下方定义的 `HISDataTable` 组件，而非直接使用基础 `Table`


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


## 3. 组件层级关系汇总

下表汇总了所有组件的父子层级约束关系。AI 在生成代码时必须遵循这些层级规则。

| 子组件 | 必须的父组件 | 说明 |
|--------|-------------|------|
| `CardHeader` | `Card` | 只能作为 `Card` 的直接子组件 |
| `CardContent` | `Card` | 只能作为 `Card` 的直接子组件 |
| `CardFooter` | `Card` | 只能作为 `Card` 的直接子组件 |
| `CardTitle` | `CardHeader` | 只能在 `CardHeader` 内使用 |
| `CardDescription` | `CardHeader` | 只能在 `CardHeader` 内使用 |
| `DialogTrigger` | `Dialog` | 只能作为 `Dialog` 的直接子组件 |
| `DialogContent` | `Dialog` | 只能作为 `Dialog` 的直接子组件 |
| `DialogHeader` | `DialogContent` | 只能在 `DialogContent` 内使用 |
| `DialogFooter` | `DialogContent` | 只能在 `DialogContent` 内使用 |
| `DialogTitle` | `DialogHeader` | 必须存在（无障碍性要求） |
| `DialogDescription` | `DialogHeader` | 只能在 `DialogHeader` 内使用 |
| `TableHeader` | `Table` | 只能作为 `Table` 的直接子组件 |
| `TableBody` | `Table` | 只能作为 `Table` 的直接子组件 |
| `TableFooter` | `Table` | 只能作为 `Table` 的直接子组件 |
| `TableRow` | `TableHeader` / `TableBody` / `TableFooter` | 只能在表格分区内使用 |
| `TableHead` | `TableRow`（在 `TableHeader` 内） | 只能在表头行内使用 |
| `TableCell` | `TableRow`（在 `TableBody` / `TableFooter` 内） | 只能在数据行内使用 |
| `Input` | `FormItem` | 必须在 `FormItem` 内使用，且关联 `Label` |
| `FormItem` / `FormField` | `HISFormLayout` | 所有表单字段必须在 `HISFormLayout` 内部 |
| `HISStatCard` | 网格布局容器 | 推荐在 `grid` 布局内使用，禁止嵌套 |
| `HISTimeline` | `Card` 或侧边面板 | 推荐放置在卡片或面板内 |
| `HISDataTable` | `Card` 或独立区块 | 推荐放置在卡片或独立区块内 |

## 4. 互斥规则汇总

下表汇总了所有组件的互斥属性规则。AI 在生成代码时必须确保不会同时使用互斥的属性。

| 组件 | 互斥属性 A | 互斥属性 B | 说明 |
|------|-----------|-----------|------|
| `Button` | `disabled={true}` | `loading={true}` | 禁用态和加载态不可同时存在 |
| `Button` | `variant="link"` | `size="icon"` | 链接变体不支持图标尺寸 |
| `Button` | `variant="destructive"` | 非危险操作场景 | 危险变体仅用于删除、取消等危险操作 |
| `Input` | `disabled={true}` | `readOnly={true}` | 禁用态和只读态不可同时存在 |
| `HISStatCard` | `trend="up"` / `trend="down"` | 缺少 `trendValue` | 有趋势方向时必须提供趋势数值 |
| `HISDataTable` | 数据量 > 100 行 | `enableVirtualScroll={false}` | 大数据量时必须启用虚拟滚动 |
| `HISFormLayout` | `columns={1\|2\|3}` | 超过 3 列 | 最多支持 3 列布局 |
| `HISTimeline` | 垂直布局（默认） | 水平布局 | HIS 场景中时间线必须为垂直方向 |
| `Dialog` | `DialogContent` | 嵌套 `Dialog` | 对话框内禁止嵌套另一个对话框 |
| `HISStatCard` | 外层 `HISStatCard` | 内层 `HISStatCard` | 统计卡片禁止嵌套 |
| `HISTimeline` | 外层 `HISTimeline` | 内层 `HISTimeline` | 时间线禁止嵌套 |


## 5. 使用示例与禁止用法

### 5.1 HISDataTable 数据表格

#### ✅ 正确用法

```tsx
import { HISDataTable } from "@/components/his/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  patientName: string;
  orderType: string;
  status: "pending" | "executing" | "completed" | "cancelled";
  createdAt: string;
}

const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "医嘱编号",
    size: 120,
  },
  {
    accessorKey: "patientName",
    header: "患者姓名",
    enablePinning: true, // 固定患者姓名列
  },
  {
    accessorKey: "orderType",
    header: "医嘱类型",
  },
  {
    accessorKey: "status",
    header: "状态",
    cell: ({ row }) => {
      const status = row.getValue("status") as Order["status"];
      const statusMap = {
        pending: { label: "待执行", className: "bg-his-pending/10 text-his-pending" },
        executing: { label: "执行中", className: "bg-his-executing/10 text-his-executing" },
        completed: { label: "已完成", className: "bg-his-completed/10 text-his-completed" },
        cancelled: { label: "已取消", className: "bg-his-cancelled/10 text-his-cancelled" },
      };
      const { label, className } = statusMap[status];
      return <Badge className={className}>{label}</Badge>;
    },
  },
];

export function OrderListTable({ data }: { data: Order[] }) {
  return (
    <HISDataTable
      columns={columns}
      data={data}
      enableColumnPinning
      enableRowSelection
      enableVirtualScroll={data.length > 100}
      pagination={{ pageSize: 50, pageIndex: 0, total: data.length }}
      density="compact"
      onRowClick={(row) => console.log("选中医嘱:", row.original.id)}
    />
  );
}
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：在数据密集型场景中直接使用基础 Table 组件
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// 这种写法缺少列固定、虚拟滚动、行选择等 HIS 必需能力
export function OrderList({ orders }: { orders: Order[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>医嘱编号</TableHead>
          <TableHead>患者姓名</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="text-base">{order.id}</TableCell> {/* ❌ 禁止使用 text-base */}
            <TableCell>{order.patientName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**说明：** HIS 数据表格场景必须使用 `HISDataTable` 组件，它内置了列固定、行选择、虚拟滚动等能力。直接使用基础 `Table` 无法满足 HIS 高密度数据展示需求。

### 5.2 HISStatCard 统计卡片

#### ✅ 正确用法

```tsx
import { HISStatCard } from "@/components/his/stat-card";
import { Users, BedDouble, AlertTriangle, ClipboardList } from "lucide-react";

export function DashboardStats() {
  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
      <HISStatCard
        title="在院患者"
        value={128}
        icon={<Users className="h-4 w-4 text-primary-500" />}
        trend="up"
        trendValue="+5%"
        description="较昨日"
      />
      <HISStatCard
        title="空余床位"
        value={32}
        icon={<BedDouble className="h-4 w-4 text-success-500" />}
        trend="down"
        trendValue="-3"
        description="较昨日"
      />
      <HISStatCard
        title="危急患者"
        value={4}
        icon={<AlertTriangle className="h-4 w-4 text-error-500" />}
        trend="neutral"
        trendValue="0"
      />
      <HISStatCard
        title="待执行医嘱"
        value={56}
        icon={<ClipboardList className="h-4 w-4 text-warning-500" />}
        trend="up"
        trendValue="+12"
        description="较上一班次"
      />
    </div>
  );
}
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：嵌套 HISStatCard
<HISStatCard title="总览" value={100}>
  <HISStatCard title="子项" value={50} /> {/* ❌ 禁止嵌套 */}
</HISStatCard>

// ❌ 禁止：有趋势方向但缺少趋势数值
<HISStatCard
  title="在院患者"
  value={128}
  trend="up"
  // trendValue 缺失！trend 为 "up" 或 "down" 时必须提供 trendValue
/>

// ❌ 禁止：使用自定义颜色表示趋势
<HISStatCard
  title="在院患者"
  value={128}
  trend="up"
  trendValue="+5%"
  className="text-[#00ff00]" // ❌ 禁止自定义颜色，必须使用语义色
/>
```

**说明：** `HISStatCard` 禁止嵌套使用。趋势方向（`trend`）为 `"up"` 或 `"down"` 时必须同时提供 `trendValue`。趋势颜色由组件内部根据语义色自动处理，禁止外部覆盖。

### 5.3 HISTimeline 时间线

#### ✅ 正确用法

```tsx
import { HISTimeline } from "@/components/his/timeline";
import type { TimelineItem } from "@/components/his/timeline";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const patientRecords: TimelineItem[] = [
  {
    time: "2024-01-15 09:30",
    status: "admitted",
    title: "入院登记",
    description: "患者由急诊科转入内科病房，床位号 A-301",
  },
  {
    time: "2024-01-15 10:15",
    status: "pending",
    title: "医嘱开立",
    description: "开立血常规、肝功能检查医嘱",
  },
  {
    time: "2024-01-15 11:00",
    status: "executing",
    title: "检验执行中",
    description: "血液样本已采集，送检验科",
  },
  {
    time: "2024-01-15 14:30",
    status: "completed",
    title: "检验完成",
    description: "检验报告已出，各项指标正常",
  },
  {
    time: "2024-01-15 15:00",
    status: "critical",
    title: "病情变化",
    description: "患者体温升高至 39.2°C，启动紧急处理",
  },
];

export function PatientTimeline() {
  return (
    <Card className="rounded-lg shadow-sm">
      <CardHeader className="p-3">
        <CardTitle className="text-sm font-semibold">就诊记录</CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <HISTimeline items={patientRecords} density="compact" />
      </CardContent>
    </Card>
  );
}
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：使用水平布局
<HISTimeline
  items={records}
  direction="horizontal" // ❌ HIS 场景中时间线必须为垂直方向
/>

// ❌ 禁止：使用自定义颜色替代 HIS 状态色
<HISTimeline
  items={records.map((r) => ({
    ...r,
    dotColor: "#ff6600", // ❌ 禁止自定义颜色，必须使用 HIS 状态色
  }))}
/>

// ❌ 禁止：嵌套时间线
<HISTimeline
  items={[
    {
      time: "2024-01-15",
      status: "admitted",
      title: "入院",
      children: <HISTimeline items={subItems} />, // ❌ 禁止嵌套
    },
  ]}
/>
```

**说明：** HIS 时间线组件仅支持垂直布局。状态圆点颜色由 HIS 专用语义色系统自动映射，禁止手动指定颜色。时间线不支持嵌套。

### 5.4 HISFormLayout 表单布局

#### ✅ 正确用法

```tsx
import { HISFormLayout } from "@/components/his/form-layout";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

interface PatientForm {
  name: string;
  idNumber: string;
  gender: string;
  age: number;
  phone: string;
  department: string;
}

export function PatientAdmissionForm() {
  const form = useForm<PatientForm>();

  return (
    <Form {...form}>
      <HISFormLayout columns={2} density="compact">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="w-24 text-xs text-neutral-600 text-right leading-tight">
                患者姓名
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="text-xs leading-tight h-7"
                  placeholder="请输入患者姓名"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="idNumber"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="w-24 text-xs text-neutral-600 text-right leading-tight">
                身份证号
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="text-xs leading-tight h-7"
                  placeholder="请输入身份证号"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="w-24 text-xs text-neutral-600 text-right leading-tight">
                性别
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-xs leading-tight h-7">
                    <SelectValue placeholder="请选择" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel className="w-24 text-xs text-neutral-600 text-right leading-tight">
                入院科室
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="text-xs leading-tight h-7">
                    <SelectValue placeholder="请选择科室" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="internal">内科</SelectItem>
                  <SelectItem value="surgery">外科</SelectItem>
                  <SelectItem value="pediatrics">儿科</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </HISFormLayout>
    </Form>
  );
}
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：标签左对齐
<FormLabel className="text-left">患者姓名</FormLabel> // ❌ 必须使用 text-right

// ❌ 禁止：超过 3 列布局
<HISFormLayout columns={4}> {/* ❌ 最多支持 3 列 */}
  {/* ... */}
</HISFormLayout>

// ❌ 禁止：表单字段放在 HISFormLayout 外部
<div>
  <HISFormLayout columns={2}>
    <FormField name="name" />
  </HISFormLayout>
  <FormField name="phone" /> {/* ❌ 必须在 HISFormLayout 内部 */}
</div>

// ❌ 禁止：使用非 shadcn/ui 的输入组件
import { Input as AntInput } from "antd"; // ❌ 禁止引入其他 UI 库
<HISFormLayout columns={2}>
  <AntInput /> {/* ❌ 必须使用 shadcn/ui 的 Input */}
</HISFormLayout>
```

**说明：** `HISFormLayout` 的标签必须右对齐（`text-right`），最多支持 3 列布局。所有表单字段必须放置在 `HISFormLayout` 内部，且只能使用 shadcn/ui 提供的输入组件。
