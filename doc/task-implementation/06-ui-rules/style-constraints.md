---
inclusion: always
---

## 1. 样式约束（Style Constraints）

### 1.1 禁止内联样式

- **规则：** 禁止在 JSX/TSX 中使用 `style` 属性定义内联样式
- **严重程度：** 错误（Error）
- **原因：** 内联样式无法被设计令牌系统管理，破坏样式一致性，且不利于主题切换和维护
- **示例：**

```tsx
// ❌ 禁止
<div style={{ color: '#3B82F6', padding: '16px' }}>内容</div>

// ✅ 正确
<div className="text-primary-500 p-4">内容</div>
```

### 1.2 禁止自定义 CSS 类

- **规则：** 禁止使用自定义 CSS 类名（非 Tailwind 工具类、非 shadcn/ui 组件内部类）
- **严重程度：** 错误（Error）
- **原因：** 自定义 CSS 类绕过了 Tailwind 的设计令牌体系，导致样式碎片化，增加维护成本
- **允许的类名来源：**
  - Tailwind CSS 工具类（如 `flex`、`p-4`、`text-sm`、`bg-primary-500`）
  - shadcn/ui 组件内部类（如 `cn()` 工具函数组合的类名）
  - Tailwind 变体修饰符（如 `hover:`、`dark:`、`md:`）
- **示例：**

```tsx
// ❌ 禁止
<div className="custom-header my-card-wrapper">内容</div>

// ❌ 禁止（不要创建 .css / .scss / .module.css 文件定义自定义类）

// ✅ 正确
<div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">内容</div>
```

### 1.3 必须使用 shadcn/ui 组件

- **规则：** 所有 UI 组件必须基于 shadcn/ui 组件库构建，禁止引入其他第三方 UI 组件库
- **严重程度：** 错误（Error）
- **原因：** shadcn/ui 提供可定制的无样式组件基础，与 Tailwind CSS 深度集成，确保设计系统的一致性
- **要求：**
  - 使用 shadcn/ui 提供的 `Button`、`Input`、`Table`、`Dialog`、`Card` 等基础组件
  - 通过 Tailwind 工具类和 `cn()` 函数定制组件外观
  - 复合组件通过组合 shadcn/ui 基础组件实现，不要从零编写
- **示例：**

```tsx
// ❌ 禁止（引入其他 UI 库）
import { Button } from 'antd';
import { TextField } from '@mui/material';

// ✅ 正确
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
```

### 1.4 必须使用 Tailwind CSS 工具类

- **规则：** 所有样式必须通过 Tailwind CSS 工具类表达，样式值必须来源于设计令牌定义
- **严重程度：** 错误（Error）
- **原因：** Tailwind 工具类与设计令牌一一对应，确保所有样式可追溯、可管理
- **要求：**
  - 颜色值必须使用 `his-design-system.md` 中定义的颜色令牌对应的 Tailwind 类
  - 间距值必须符合 4px 基准网格（使用 Tailwind 的 `p-1` 到 `p-16` 等标准间距类）
  - 字号必须使用设计令牌中定义的字号阶梯对应的 Tailwind 类
  - 使用 `cn()` 工具函数合并条件类名
- **示例：**

```tsx
// ❌ 禁止（任意颜色值）
<span className="text-[#ff6600]">警告</span>

// ❌ 禁止（非标准间距）
<div className="p-[13px]">内容</div>

// ✅ 正确（使用设计令牌对应的 Tailwind 类）
<span className="text-warning-500">警告</span>
<div className="p-4">内容</div>
```

---

[返回目录](./index.md) | [代码结构约束](./code-structure.md) ➡️
