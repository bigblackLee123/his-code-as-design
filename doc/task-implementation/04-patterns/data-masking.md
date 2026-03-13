---
inclusion: always
---

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

---

⬅️ [仪表盘页模板](./template-dashboard.md) | [返回目录](./index.md) | [HIS 图标规范](./icon-spec.md) ➡️
