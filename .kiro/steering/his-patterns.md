---
inclusion: always
---

# HIS 页面模式与积木式生成策略

> 本文件定义 HIS 前端项目的页面模式规范，包括积木式 Prompt 策略规则、四种预置页面模板、数据脱敏规则和图标规范。
> AI 在生成任何页面级 UI 代码时必须严格遵循以下规则。
> 技术栈：React + TypeScript + Tailwind CSS + shadcn/ui。

## 1. 积木式 Prompt 策略规则（Block Composition Rules）

### 1.1 核心原则

所有页面必须拆分为独立的 Block（积木块），每个 Block 是一个语义完整的 UI 区域。

- **每个 Block = 一个独立的 React 组件**，存放在独立的 `.tsx` 文件中
- **单个 Block 不超过 200 行**；超过时必须拆分为子 Block
- **Block 之间通过 props 和 context 通信**，禁止 Block 之间直接操作 DOM 或共享可变状态
- **生成单个 Block 时，仅注入该 Block 相关的 Design Token 子集和组件约束子集**，限制 AI 的生成范围

### 1.2 Block 拆分规则

| 规则 | 说明 |
|------|------|
| 语义完整性 | 每个 Block 对应页面中一个功能独立的区域（如筛选栏、数据表格、操作栏） |
| 单一职责 | 一个 Block 只负责一个功能，不混合展示逻辑和业务逻辑 |
| 200 行上限 | 单个 Block 文件不超过 200 行（含类型定义和导入语句），超过时拆分为子 Block |
| 独立可测试 | 每个 Block 可以独立渲染和测试，不依赖其他 Block 的内部实现 |
| 命名规范 | Block 文件名使用 PascalCase，如 `FilterBar.tsx`、`DataTable.tsx`、`ActionPanel.tsx` |

### 1.3 Block 通信机制

```tsx
// ✅ 正确：通过 props 传递数据
interface FilterBarProps {
  onFilterChange: (filters: FilterParams) => void;
}

// ✅ 正确：通过 context 共享状态
const PageContext = React.createContext<PageState | null>(null);

// ❌ 禁止：Block 之间直接引用内部状态
// ❌ 禁止：Block 之间通过全局变量通信
```

### 1.4 Block 组合模式

页面入口文件负责组合所有 Block，定义数据流和布局结构：

```tsx
// pages/OrderListPage.tsx — 页面入口（组合层）
import { FilterBar } from "./blocks/FilterBar";
import { DataTable } from "./blocks/DataTable";
import { ActionBar } from "./blocks/ActionBar";

export function OrderListPage() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-2">
      <FilterBar onFilterChange={setFilters} />
      <DataTable
        filters={filters}
        onSelectionChange={setSelectedRows}
      />
      <ActionBar selectedRows={selectedRows} />
    </div>
  );
}
```


## 2. HIS 预置页面模板

以下四种页面模板覆盖 HIS 系统中最常见的页面类型。AI 在生成页面时，应根据业务场景选择对应模板，按 Block 拆分方案逐一生成。

### 2.1 列表页模板（List Page）

适用场景：医嘱列表、患者列表、检验报告列表、药品目录等数据密集型列表展示。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| FilterBar | 搜索输入框、筛选下拉、日期范围选择器 | `blocks/FilterBar.tsx` |
| DataTable | HISDataTable 数据表格，展示列表数据 | `blocks/DataTable.tsx` |
| ActionBar | 批量操作按钮、导出按钮、新增按钮 | `blocks/ActionBar.tsx` |

> 注意：分页功能内置于 HISDataTable 组件中，无需单独拆分为 Block。

#### 推荐组件列表

- `HISDataTable`：数据表格（必须使用，禁止直接使用基础 Table）
- `Input`：搜索输入框（`type="search"`）
- `Select`：筛选下拉框
- `Button`：操作按钮（`variant="default" size="sm"`）
- `Badge`：状态标签（使用 HIS 状态色）
- `Card`：页面容器（`rounded-lg shadow-sm`）

#### 数据流定义

```
FilterBar ──(filters: FilterParams)──→ DataTable
DataTable ──(selectedRows: string[])──→ ActionBar
```

- FilterBar 通过 `onFilterChange` 回调将筛选参数传递给页面入口
- 页面入口将筛选参数通过 props 传递给 DataTable
- DataTable 通过 `onSelectionChange` 回调将选中行 ID 传递给页面入口
- 页面入口将选中行 ID 通过 props 传递给 ActionBar

#### 代码示例

```tsx
// pages/patient-list/PatientListPage.tsx
import { FilterBar } from "./blocks/FilterBar";
import { PatientDataTable } from "./blocks/PatientDataTable";
import { ActionBar } from "./blocks/ActionBar";
import { Card, CardContent } from "@/components/ui/card";

export function PatientListPage() {
  const [filters, setFilters] = useState<FilterParams>({});
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-3 flex flex-col gap-2">
        <FilterBar onFilterChange={setFilters} />
        <PatientDataTable
          filters={filters}
          onSelectionChange={setSelectedRows}
        />
        <ActionBar selectedRows={selectedRows} />
      </CardContent>
    </Card>
  );
}
```

---

### 2.2 详情页模板（Detail Page）

适用场景：患者详情、医嘱详情、检验报告详情、病历详情等信息展示页面。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| HeaderInfo | 实体基本信息卡片（患者姓名、ID、状态等） | `blocks/HeaderInfo.tsx` |
| TabNavigation | 标签页导航，切换不同内容区域 | `blocks/TabNavigation.tsx` |
| ContentPanel | 根据当前标签页动态展示内容 | `blocks/ContentPanel.tsx` |
| ActionPanel | 操作按钮区（编辑、打印、转科等） | `blocks/ActionPanel.tsx` |

#### 推荐组件列表

- `Card`、`CardHeader`、`CardContent`：信息卡片容器
- `Tabs`、`TabsList`、`TabsTrigger`、`TabsContent`：标签页导航（shadcn/ui）
- `Badge`：状态标签（使用 HIS 患者状态色）
- `Button`：操作按钮
- `HISTimeline`：就诊记录时间线（在 ContentPanel 中使用）
- `HISDataTable`：关联数据列表（如医嘱列表、检验列表）

#### 数据流定义

```
HeaderInfo ──(entityId: string)──→ 页面入口（提供实体 ID）
TabNavigation ──(activeTab: string)──→ ContentPanel（控制显示内容）
ActionPanel ←──(entityData: Entity)──── 页面入口（提供实体数据）
```

- HeaderInfo 展示实体基本信息，数据由页面入口通过 props 注入
- TabNavigation 通过 `onTabChange` 回调通知页面入口当前选中的标签
- ContentPanel 根据 `activeTab` prop 动态渲染对应内容
- ActionPanel 根据实体数据和权限状态决定可用操作

#### 代码示例

```tsx
// pages/patient-detail/PatientDetailPage.tsx
import { HeaderInfo } from "./blocks/HeaderInfo";
import { TabNavigation } from "./blocks/TabNavigation";
import { ContentPanel } from "./blocks/ContentPanel";
import { ActionPanel } from "./blocks/ActionPanel";

export function PatientDetailPage({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const patient = usePatientData(patientId);

  return (
    <div className="flex flex-col gap-3">
      <HeaderInfo patient={patient} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <ActionPanel patient={patient} />
        </div>
        <ContentPanel activeTab={activeTab} patientId={patientId} />
      </div>
    </div>
  );
}
```

---

### 2.3 表单页模板（Form Page）

适用场景：患者入院登记、医嘱开立、检查申请、处方录入等表单录入页面。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| FormHeader | 表单标题、描述、面包屑导航 | `blocks/FormHeader.tsx` |
| FormBody | HISFormLayout 表单主体（字段较多时拆分为子 Block） | `blocks/FormBody.tsx` |
| FormFooter | 提交、取消、保存草稿按钮 | `blocks/FormFooter.tsx` |

> 当 FormBody 超过 200 行时，按业务分组拆分为子 Block，例如：
> - `BasicInfoSection.tsx`：基本信息区
> - `DiagnosisSection.tsx`：诊断信息区
> - `OrderSection.tsx`：医嘱信息区

#### 推荐组件列表

- `HISFormLayout`：表单布局容器（`columns={2} density="compact"`）
- `Form`、`FormField`、`FormItem`、`FormLabel`、`FormControl`、`FormMessage`：表单组件（shadcn/ui + react-hook-form）
- `Input`：文本输入框
- `Select`、`SelectTrigger`、`SelectContent`、`SelectItem`：下拉选择
- `Button`：操作按钮
- `Card`：表单容器

#### 数据流定义

```
FormHeader ──(静态内容，无数据流)
FormBody ──(formState: FormValues)──→ react-hook-form 管理
FormFooter ──(触发 form.handleSubmit)──→ FormBody
```

- FormBody 内部使用 `react-hook-form` 管理表单状态
- FormFooter 通过 `form.handleSubmit` 触发表单提交
- 表单验证由 `react-hook-form` + `zod` 处理
- 页面入口通过 `FormProvider` 共享表单实例

#### 代码示例

```tsx
// pages/patient-admission/PatientAdmissionPage.tsx
import { FormHeader } from "./blocks/FormHeader";
import { FormBody } from "./blocks/FormBody";
import { FormFooter } from "./blocks/FormFooter";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";

export function PatientAdmissionPage() {
  const form = useForm<AdmissionFormValues>();

  const onSubmit = (data: AdmissionFormValues) => {
    // 提交入院登记
  };

  return (
    <Card className="rounded-lg shadow-sm">
      <CardContent className="p-4 flex flex-col gap-4">
        <FormHeader title="入院登记" description="请填写患者入院信息" />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormBody form={form} />
            <FormFooter
              onCancel={() => history.back()}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
```

---

### 2.4 仪表盘页模板（Dashboard Page）

适用场景：科室工作站首页、护理工作站概览、院长驾驶舱、运营数据看板等。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| StatsRow | HISStatCard 统计卡片网格 | `blocks/StatsRow.tsx` |
| ChartPanel | 数据可视化图表区域 | `blocks/ChartPanel.tsx` |
| ActivityFeed | HISTimeline 最近活动时间线 | `blocks/ActivityFeed.tsx` |
| QuickActions | 常用操作快捷按钮 | `blocks/QuickActions.tsx` |

#### 推荐组件列表

- `HISStatCard`：统计卡片（网格布局 `grid grid-cols-2 xl:grid-cols-4 gap-3`）
- `HISTimeline`：活动时间线（`density="compact"`）
- `Card`、`CardHeader`、`CardContent`：区块容器
- `Button`：快捷操作按钮（`variant="outline" size="sm"`）
- lucide-react 图标：统计卡片和快捷操作的图标

#### 数据流定义

```
StatsRow ←──(statsData)──── 页面入口（独立数据源）
ChartPanel ←──(chartData)──── 页面入口（独立数据源）
ActivityFeed ←──(activityItems)──── 页面入口（独立数据源）
QuickActions ──(静态内容，无数据流)
```

- StatsRow 和 ChartPanel 可共享同一数据上下文（如科室统计数据）
- ActivityFeed 独立获取最近活动数据
- QuickActions 为静态快捷入口，点击后导航到对应页面
- 各 Block 数据独立加载，互不阻塞

#### 代码示例

```tsx
// pages/dashboard/DashboardPage.tsx
import { StatsRow } from "./blocks/StatsRow";
import { ChartPanel } from "./blocks/ChartPanel";
import { ActivityFeed } from "./blocks/ActivityFeed";
import { QuickActions } from "./blocks/QuickActions";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-3">
      <StatsRow />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2">
          <ChartPanel />
        </div>
        <div className="flex flex-col gap-3">
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
```


## 3. 数据脱敏规则

HIS 系统涉及大量患者隐私数据，AI 在生成包含患者信息的 UI 区块时，必须自动对敏感字段使用脱敏展示。

### 3.1 脱敏字段与规则

| 字段类型 | 脱敏规则 | 原始值示例 | 脱敏后示例 |
|----------|----------|-----------|-----------|
| 患者姓名 | 保留姓氏，其余用 `*` 替代 | 张三丰 | 张** |
| 身份证号 | 保留前 3 位和后 4 位，中间用 `*` 替代 | 110101199001011234 | 110***********1234 |
| 联系方式（手机号） | 保留前 3 位和后 4 位，中间 4 位用 `*` 替代 | 13812345678 | 138****5678 |

### 3.2 脱敏组件 MaskedText

所有敏感字段必须使用统一的 `MaskedText` 组件展示，禁止在业务组件中手动实现脱敏逻辑。

```tsx
// components/his/MaskedText.tsx

export interface MaskedTextProps {
  /** 脱敏类型 */
  type: "name" | "idNumber" | "phone";
  /** 原始值 */
  value: string;
  /** 是否显示原始值（需权限控制） */
  revealed?: boolean;
  /** 自定义样式类 */
  className?: string;
}

export function MaskedText({ type, value, revealed = false, className }: MaskedTextProps) {
  const masked = revealed ? value : maskValue(type, value);

  return (
    <span className={cn("font-mono text-xs leading-tight", className)}>
      {masked}
    </span>
  );
}

function maskValue(type: MaskedTextProps["type"], value: string): string {
  switch (type) {
    case "name":
      return value.charAt(0) + "*".repeat(Math.max(value.length - 1, 1));
    case "idNumber":
      return value.slice(0, 3) + "*".repeat(Math.max(value.length - 7, 1)) + value.slice(-4);
    case "phone":
      return value.slice(0, 3) + "****" + value.slice(-4);
    default:
      return value;
  }
}
```

### 3.3 使用规范

- **严重程度：** 错误（Error）
- AI 在生成包含以下字段的 UI 区块时，必须自动使用 `MaskedText` 组件：
  - 患者姓名（`patientName`、`name`）
  - 身份证号（`idNumber`、`idCard`、`identityNumber`）
  - 联系方式（`phone`、`mobile`、`tel`、`contactNumber`）
- 禁止在表格单元格、卡片、详情页中直接展示上述字段的原始值
- `revealed` 属性需配合权限系统使用，仅授权用户可查看原始值

#### ✅ 正确用法

```tsx
import { MaskedText } from "@/components/his/MaskedText";

// 表格列定义中使用脱敏组件
{
  accessorKey: "patientName",
  header: "患者姓名",
  cell: ({ row }) => (
    <MaskedText type="name" value={row.getValue("patientName")} />
  ),
}

// 详情页中使用脱敏组件
<div className="flex items-center gap-2">
  <span className="text-xs text-neutral-500">身份证号：</span>
  <MaskedText type="idNumber" value={patient.idNumber} />
</div>
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：直接展示患者姓名原始值
<span>{patient.name}</span>

// ❌ 禁止：手动实现脱敏逻辑
<span>{patient.phone.slice(0, 3) + "****" + patient.phone.slice(-4)}</span>

// ❌ 禁止：在表格中不使用脱敏组件
<TableCell>{row.original.idNumber}</TableCell>
```

## 4. HIS 图标规范

### 4.1 图标库

HIS 系统统一使用 `lucide-react` 作为唯一图标库。

- **严重程度：** 错误（Error）
- 禁止引入其他图标库（如 `react-icons`、`@ant-design/icons`、`@heroicons/react`）
- 禁止使用自定义 SVG 图标文件
- 所有图标从 `lucide-react` 导入

```tsx
// ✅ 正确
import { Stethoscope, Pill, BedDouble } from "lucide-react";

// ❌ 禁止
import { FaHospital } from "react-icons/fa";
import { MedicineBoxOutlined } from "@ant-design/icons";
import CustomIcon from "./icons/custom.svg";
```

### 4.2 医疗场景常用图标映射

| 图标名称 | lucide-react 组件 | 使用场景 |
|----------|-------------------|----------|
| 听诊器/诊断 | `Stethoscope` | 诊断记录、门诊、问诊 |
| 药品/处方 | `Pill` | 药品管理、处方开立、用药记录 |
| 病床/住院 | `BedDouble` | 床位管理、住院管理、病房 |
| 心电图/生命体征 | `HeartPulse` | 生命体征监测、心电图、体征记录 |
| 注射/治疗 | `Syringe` | 注射治疗、输液管理、护理操作 |
| 检验/化验 | `TestTube` | 检验申请、化验报告、标本管理 |
| 病历/报告 | `FileText` | 病历文书、检查报告、出院小结 |
| 患者/人员 | `Users` | 患者列表、医护人员、科室人员 |
| 警告/危急 | `AlertTriangle` | 危急值提醒、过敏警告、异常提示 |
| 医嘱/任务 | `ClipboardList` | 医嘱列表、任务清单、待办事项 |
| 排班/预约 | `Calendar` | 排班管理、预约挂号、日程安排 |
| 监护/活动 | `Activity` | 监护记录、活动日志、操作记录 |

### 4.3 图标尺寸约束

| 尺寸名称 | Tailwind 类 | 像素值 | 使用场景 |
|----------|-------------|--------|----------|
| sm | `h-3 w-3` | 12px | 表格单元格内图标、Badge 内图标 |
| default | `h-4 w-4` | 16px | HIS 紧凑模式默认尺寸、按钮内图标、统计卡片图标 |
| lg | `h-5 w-5` | 20px | 标准模式图标、导航菜单图标 |
| xl | `h-6 w-6` | 24px | 页面标题图标、空状态图标 |

使用规范：
- HIS 紧凑模式下，默认图标尺寸为 `h-4 w-4`（16px）
- 图标颜色应使用语义色或中性色，禁止使用任意颜色值
- 图标与文字搭配时，使用 `gap-1`（4px）或 `gap-2`（8px）间距
- 禁止使用任意尺寸值（如 `h-[18px] w-[18px]`）

#### ✅ 正确用法

```tsx
import { Stethoscope, AlertTriangle, Pill } from "lucide-react";

// 统计卡片中的图标
<Stethoscope className="h-4 w-4 text-primary-500" />

// 危急状态图标（搭配动画）
<AlertTriangle className="h-4 w-4 text-error-500 animate-pulse" />

// 按钮中的图标
<Button variant="outline" size="sm">
  <Pill className="h-4 w-4" />
  <span>开立处方</span>
</Button>

// 导航菜单中的图标
<BedDouble className="h-5 w-5 text-neutral-500" />
```

#### ❌ 禁止用法

```tsx
// ❌ 禁止：使用任意尺寸
<Stethoscope className="h-[18px] w-[18px]" />

// ❌ 禁止：使用任意颜色
<Pill className="h-4 w-4 text-[#ff6600]" />

// ❌ 禁止：使用其他图标库
import { FaStethoscope } from "react-icons/fa";

// ❌ 禁止：使用自定义 SVG
import SyringeIcon from "./icons/syringe.svg";
```
