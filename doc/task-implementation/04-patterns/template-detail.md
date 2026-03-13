---
inclusion: always
---

### 2.2 详情页模板（Detail Page）

适用场景：患者详情、医嘱详情、检验报告详情、病历详情等信息展示页面。

#### Block 拆分方案

| Block 名称 | 职责 | 文件路径 |
|------------|------|----------|
| HeaderInfo | 实体基本信息卡片（患者姓名、ID、状态等） | `blocks/HeaderInfo.tsx` |
| TabNavigation | 标签页导航，切换不同内容区域 | `blocks/TabNavigation.tsx` |
| ContentPanel | 根据当前标签页动态展示内容 | `blocks/ContentPanel.tsx` |
| ActionPanel | 操作按钮区（编辑、打印、转科等） | `blocks/ActionPanel.tsx` |

#### 推荐组件列表

- `Card`、`CardHeader`、`CardContent`：信息卡片容器
- `Tabs`、`TabsList`、`TabsTrigger`、`TabsContent`：标签页导航（shadcn/ui）
- `Badge`：状态标签（使用 HIS 患者状态色）
- `Button`：操作按钮
- `HISTimeline`：就诊记录时间线（在 ContentPanel 中使用）
- `HISDataTable`：关联数据列表（如医嘱列表、检验列表）

#### 数据流定义

```
HeaderInfo ──(entityId: string)──→ 页面入口（提供实体 ID）
TabNavigation ──(activeTab: string)──→ ContentPanel（控制显示内容）
ActionPanel ←──(entityData: Entity)──── 页面入口（提供实体数据）
```

- HeaderInfo 展示实体基本信息，数据由页面入口通过 props 注入
- TabNavigation 通过 `onTabChange` 回调通知页面入口当前选中的标签
- ContentPanel 根据 `activeTab` prop 动态渲染对应内容
- ActionPanel 根据实体数据和权限状态决定可用操作

#### 代码示例

```tsx
// pages/patient-detail/PatientDetailPage.tsx
import { HeaderInfo } from "./blocks/HeaderInfo";
import { TabNavigation } from "./blocks/TabNavigation";
import { ContentPanel } from "./blocks/ContentPanel";
import { ActionPanel } from "./blocks/ActionPanel";

export function PatientDetailPage({ patientId }: { patientId: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const patient = usePatientData(patientId);

  return (
    <div className="flex flex-col gap-3">
      <HeaderInfo patient={patient} />
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          <ActionPanel patient={patient} />
        </div>
        <ContentPanel activeTab={activeTab} patientId={patientId} />
      </div>
    </div>
  );
}
```

---

---

⬅️ [列表页模板](./template-list.md) | [返回目录](./index.md) | [表单页模板](./template-form.md) ➡️
