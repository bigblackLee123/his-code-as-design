---
inclusion: always
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

---

⬅️ [表单页模板](./template-form.md) | [返回目录](./index.md) | [数据脱敏规则](./data-masking.md) ➡️
