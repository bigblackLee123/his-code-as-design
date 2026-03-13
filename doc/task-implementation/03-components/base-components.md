---
inclusion: always
---

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

---

[返回目录](./index.md) | [HIS 专用组件约束](./his-specialized.md) ➡️
