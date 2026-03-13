---
inclusion: always
---

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

---

[返回目录](./index.md) | [列表页模板](./template-list.md) ➡️
