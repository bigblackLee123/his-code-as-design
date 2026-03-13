---
inclusion: always
---

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

---

⬅️ [积木式开发规则](./block-composition.md) | [返回目录](./index.md) | [详情页模板](./template-detail.md) ➡️
