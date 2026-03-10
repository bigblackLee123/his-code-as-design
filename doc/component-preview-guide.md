# HIS 组件预览系统使用指南

> 本文档说明如何使用 HIS 项目的组件预览系统（`/preview` 路由），用于快速调试和视觉验证 Block 组件。

## 1. 快速开始

### 1.1 访问预览页面

启动开发服务器后，访问：

```
http://localhost:5176/preview
```

或在侧边栏点击"组件预览"导航项。

### 1.2 界面布局

- **左侧面板**：页面列表（分诊终端、医生终端、治疗终端）+ Block 选择器
- **右侧面板**：Block 组件渲染区域

### 1.3 基本操作

1. **切换页面**：点击左上角的页面按钮（分诊终端/医生终端/治疗终端）
2. **查看所有 Block**：点击"全部展示"，右侧垂直排列该页面所有 Block
3. **单独预览 Block**：点击具体 Block 名称，右侧只显示该组件

## 2. 使用场景

### 2.1 日常开发调试

**问题**：每次调整一个按钮的间距，都要从头走业务流程（签到 → 录入生理数据 → 叫号 → 治疗）才能看到效果。

**解决方案**：
1. 访问 `/preview`
2. 选择对应页面（如治疗终端）
3. 点击要调试的 Block（如 `TreatmentAction`）
4. 修改代码，保存后浏览器自动刷新
5. 立刻看到视觉变化

### 2.2 视觉设计验证

**问题**：不确定新写的组件是否符合 HIS 设计规范（颜色、间距、字号）。

**解决方案**：
1. 在 `/preview` 中预览组件
2. 触发"HIS 视觉设计审查" Hook
3. 自动截图并对比设计规范，检查合规性

### 2.3 多状态对比

**问题**：需要同时查看一个页面所有 Block 的布局效果。

**解决方案**：
1. 访问 `/preview`
2. 选择页面
3. 点击"全部展示"
4. 一屏看完所有组件，快速发现布局问题

## 3. 添加新 Block 到预览

### 3.1 场景

你新写了一个 `PatientHistory` 组件，想加到医生终端预览中。

### 3.2 步骤

1. 打开对应页面的配置文件：

```bash
src/pages/preview/configs/doctor.tsx
```

2. 在 `blocks` 数组中添加新条目：

```tsx
{
  name: "PatientHistory",
  description: "患者历史就诊记录",
  render: () => <PatientHistory patientId="P003" />,
}
```

3. 如果需要 mock 数据，在文件顶部定义：

```tsx
const mockHistory = {
  visits: [
    { date: "2024-01-10", diagnosis: "感冒", doctor: "李医生" },
    { date: "2024-01-05", diagnosis: "头痛", doctor: "王医生" },
  ],
};
```

4. 在 `render` 中使用 mock 数据：

```tsx
{
  name: "PatientHistory",
  description: "患者历史就诊记录",
  render: () => <PatientHistory patientId="P003" history={mockHistory} />,
}
```

5. 刷新 `/preview`，左侧 Block 列表自动显示新增的 `PatientHistory`

## 4. 添加新页面预览

### 4.1 场景

你要为"药房终端"页面创建预览配置。

### 4.2 步骤

#### 步骤 1：创建配置文件

创建 `src/pages/preview/configs/pharmacy.tsx`：

```tsx
import { registerPreview } from "../registry";
import { DrugDispense } from "@/pages/pharmacy/blocks/DrugDispense";
import { DrugInventory } from "@/pages/pharmacy/blocks/DrugInventory";
import type { Prescription } from "@/services/types";

// Mock 数据
const mockPrescription: Prescription = {
  id: "RX001",
  patientName: "张三丰",
  drugs: [
    { name: "黄芪", dosage: 30, unit: "g" },
    { name: "当归", dosage: 15, unit: "g" },
  ],
};

// 注册预览配置
registerPreview({
  id: "pharmacy",
  title: "药房终端",
  route: "/pharmacy",
  blocks: [
    {
      name: "DrugDispense",
      description: "药品发放",
      render: () => <DrugDispense prescription={mockPrescription} />,
    },
    {
      name: "DrugInventory",
      description: "库存查询",
      render: () => <DrugInventory />,
    },
  ],
});
```

#### 步骤 2：注册配置

打开 `src/pages/preview/PreviewPage.tsx`，在顶部导入新配置：

```tsx
/* 注册所有预览配置（副作用导入） */
import "./configs/triage";
import "./configs/doctor";
import "./configs/treatment";
import "./configs/pharmacy"; // 新增
```

#### 步骤 3：验证

刷新 `/preview`，左侧页面列表自动显示"药房终端"。

## 5. Mock 数据管理

### 5.1 原则

- Mock 数据定义在配置文件顶部，便于维护
- 尽量复用 `src/services/mock/data/` 中的现有 mock 数据
- 如果需要特殊状态（如异常数据、边界值），在配置文件中单独定义

### 5.2 示例：复用现有 mock 数据

```tsx
import { mockPatients } from "@/services/mock/data/patients";

const mockPatient = mockPatients[0]; // 复用第一个患者数据

registerPreview({
  // ...
  blocks: [
    {
      name: "PatientInfoBar",
      description: "患者信息栏",
      render: () => <PatientInfoBar patient={mockPatient} />,
    },
  ],
});
```

### 5.3 示例：定义特殊状态数据

```tsx
// 异常生理数据（用于测试警告提示）
const abnormalVitals: VitalSigns = {
  systolicBP: 190, // 超过阈值 180
  diastolicBP: 130, // 超过阈值 120
  heartRate: 160,   // 超过阈值 150
  recordedAt: new Date().toISOString(),
  recordedBy: "护士A",
};

registerPreview({
  // ...
  blocks: [
    {
      name: "VitalSignsInput（异常值）",
      description: "生理数据录入 — 测试异常值警告",
      render: () => <VitalSignsInput patient={mockPatient} initialValues={abnormalVitals} />,
    },
  ],
});
```

## 6. 配合视觉审查工作流

### 6.1 完整流程

1. **开发阶段**：在 `/preview` 中实时预览组件
2. **视觉验证**：触发"HIS 视觉设计审查" Hook
3. **修复问题**：根据审查报告修改代码
4. **再次验证**：刷新预览页面，确认修复效果

### 6.2 审查 Hook 触发方式

- 在 Kiro 中点击"HIS 视觉设计审查" Hook
- 或在 `.tsx` 文件保存后自动触发（如果配置了 `fileEdited` hook）

### 6.3 审查内容

- 颜色令牌合规性（是否使用 `his-design-system.md` 定义的颜色）
- 间距网格合规性（是否符合 4px 网格体系）
- 组件变体正确性（Button、Badge、Card 等组件的 variant 和 size）
- 数据脱敏（患者姓名、身份证号、手机号是否使用 `MaskedText`）
- 图标规范（是否使用 `lucide-react` 图标，尺寸是否标准）

## 7. 常见问题

### 7.1 预览页面空白

**原因**：配置文件未正确导入到 `PreviewPage.tsx`。

**解决方案**：检查 `PreviewPage.tsx` 顶部是否有对应的 `import "./configs/xxx"`。

### 7.2 Block 渲染报错

**原因**：Mock 数据不完整或类型不匹配。

**解决方案**：
1. 检查 Block 组件的 Props 接口定义
2. 确保 mock 数据包含所有必填字段
3. 使用 TypeScript 类型检查（`getDiagnostics` 工具）

### 7.3 修改代码后预览未更新

**原因**：浏览器缓存或 HMR（热模块替换）失效。

**解决方案**：
1. 手动刷新浏览器（`Ctrl+R` 或 `Cmd+R`）
2. 如果仍未更新，硬刷新（`Ctrl+Shift+R` 或 `Cmd+Shift+R`）

## 8. 最佳实践

### 8.1 Block 命名规范

- 使用 PascalCase（如 `PatientCheckIn`）
- 名称应与组件文件名一致
- 描述应简洁明了，说明组件功能

### 8.2 Mock 数据组织

- 简单数据：直接在配置文件中定义
- 复杂数据：提取到 `src/services/mock/data/` 目录
- 特殊状态：在配置文件中单独定义，并在描述中注明（如"异常值"、"空数据"）

### 8.3 预览配置维护

- 每次新增 Block 组件时，同步更新预览配置
- 定期检查预览页面是否正常渲染
- 删除已废弃的 Block 预览条目

## 9. 技术架构

### 9.1 目录结构

```
src/pages/preview/
├── PreviewPage.tsx          # 预览页面主组件
├── registry.ts              # 预览注册表（类型定义 + 注册函数）
└── configs/                 # 各页面预览配置
    ├── triage.tsx           # 分诊终端配置
    ├── doctor.tsx           # 医生终端配置
    └── treatment.tsx        # 治疗终端配置
```

### 9.2 核心类型

```typescript
/** 单个 Block 预览条目 */
export interface BlockPreviewEntry {
  name: string;              // Block 名称
  description: string;       // 简要说明
  render: () => ReactNode;   // 渲染函数
}

/** 页面预览配置 */
export interface PagePreviewConfig {
  id: string;                // 页面标识
  title: string;             // 页面中文名
  route: string;             // 页面路由
  blocks: BlockPreviewEntry[]; // Block 列表
}
```

### 9.3 注册机制

配置文件通过 `registerPreview()` 函数将配置注册到全局注册表：

```typescript
registerPreview({
  id: "triage",
  title: "分诊终端",
  route: "/triage",
  blocks: [/* ... */],
});
```

`PreviewPage.tsx` 通过 `getPreviewRegistry()` 获取所有注册的配置并渲染。

## 10. 扩展建议

### 10.1 支持多状态预览

为同一个 Block 添加多个预览条目，展示不同状态：

```tsx
{
  name: "VitalSignsInput（正常值）",
  description: "生理数据录入 — 正常范围内的值",
  render: () => <VitalSignsInput patient={mockPatient} />,
},
{
  name: "VitalSignsInput（异常值）",
  description: "生理数据录入 — 超过阈值的异常值",
  render: () => <VitalSignsInput patient={mockPatient} initialValues={abnormalVitals} />,
},
```

### 10.2 添加交互式控制

在预览页面中添加控制面板，动态调整 Block 的 props：

```tsx
function InteractivePreview() {
  const [density, setDensity] = useState<"compact" | "standard">("compact");
  
  return (
    <>
      <select value={density} onChange={(e) => setDensity(e.target.value)}>
        <option value="compact">紧凑模式</option>
        <option value="standard">标准模式</option>
      </select>
      <VitalSignsInput patient={mockPatient} density={density} />
    </>
  );
}
```

### 10.3 集成 Storybook

如果项目规模扩大，可以考虑迁移到 Storybook，获得更强大的预览和文档能力。

---

**文档版本**：v1.0  
**最后更新**：2024-01-15  
**维护者**：HIS 前端团队
