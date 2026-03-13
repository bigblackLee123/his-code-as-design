---
inclusion: always
---

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

---

⬅️ [互斥规则汇总](./exclusion-rules.md) | [返回目录](./index.md)
