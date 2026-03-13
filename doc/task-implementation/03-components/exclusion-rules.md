---
inclusion: always
---

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

---

⬅️ [组件层级关系汇总](./hierarchy.md) | [返回目录](./index.md) | [使用示例与禁止用法](./examples.md) ➡️
