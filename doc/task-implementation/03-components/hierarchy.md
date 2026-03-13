---
inclusion: always
---

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

---

⬅️ [HIS 专用组件约束](./his-specialized.md) | [返回目录](./index.md) | [互斥规则汇总](./exclusion-rules.md) ➡️
