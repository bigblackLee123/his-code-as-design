---
inclusion: always
---

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

---

⬅️ [数据脱敏规则](./data-masking.md) | [返回目录](./index.md)
