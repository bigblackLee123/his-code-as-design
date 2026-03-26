# Earmersion 视觉升级清单

> 来源：`doc/汇报/3.23/earmersion-demo.html`
> 目标：正式项目换肤至 demo 风格 + 补齐 demo 中有但正式项目没有的界面（假数据即可）

---

## 一、视觉换肤（已有组件 → demo 风格）— ✅ 全部完成

| # | 组件 | 文件路径 | 换肤要点 | 状态 |
|---|------|---------|---------|------|
| 1 | Header | `components/layout/Header.tsx` | `bg-primary-900` + `text-2xl` 大标题 "耳界 Earmersion 智能诊室控制中心" + 英文副标题 + AI 就绪胶囊 | ✅ |
| 2 | Sidebar | `components/layout/Sidebar.tsx` | 白底 `rounded-2xl` 卡片式 + 大 padding 导航项 `rounded-xl` + 激活态 `border-l-4` + 底部说明区 | ✅ |
| 3 | ContraindicationInput | `doctor-terminal/blocks/ContraindicationInput.tsx` | `rounded-xl` amber 色系分类网格 + 安全提示条 | ✅ |
| 4 | ScaleForm | `doctor-terminal/blocks/ScaleForm.tsx` | `rounded-xl` indigo 卡片题组 + 绿色完成条 | ✅ |
| 5 | AISuggestionPanel | `doctor-terminal/blocks/AISuggestionPanel.tsx` | `bg-neutral-900` 深色终端风 + sparkle 标题栏 + 深色 loading | ✅ |
| 6 | TherapyProjectSelector | `doctor-terminal/blocks/TherapyProjectSelector.tsx` | **重写**为区域 tab pill + 卡片网格 + 禁忌冲突标红 + 已选 tag 组 | ✅ |
| 7 | TreatmentAction | `treatment-terminal/blocks/TreatmentAction.tsx` | 脉冲动画圆(`animate-ping`) + `rounded-xl` 计时器 + "闭环调控中"标签 | ✅ |
| 8 | TreatmentWarnings | `treatment-terminal/blocks/TreatmentWarnings.tsx` | `rounded-xl` amber 色系 + 紧急停止红色按钮(`onEmergencyStop`) | ✅ |

---

## 二、新建假界面（demo 有、正式项目没有）

> 静区/动区沿用现有治疗终端流程（选房间 → 签到 → 治疗 → 出队），
> 不改状态机，只在 `treating` 阶段根据 region 展示不同的视觉面板。
>
> 区域判断逻辑：
> - `region === "睡眠区" || region === "情志区"` → 静区面板（StaticZonePanel）
> - `region === "运动疗愈区"` → 动区面板（ActiveZonePanel）

### 2.1 实现方式

现有 `TreatmentAction` 组件负责「开始/计时/结束」，改造思路：
- 给 `TreatmentAction` 增加 `region` prop
- `treating` 状态下，根据 region 渲染不同的子面板：
  - 睡眠区 / 情志区 → `StaticZonePanel`（静区面板）
  - 运动疗愈区 → `ActiveZonePanel`（动区面板）
- 开始/结束按钮逻辑不变，面板只是视觉包装

### 2.2 组件清单

| # | 组件名 | 文件路径 | 说明 |
|---|--------|---------|------|
| 1 | StaticZonePanel | `treatment-terminal/blocks/StaticZonePanel.tsx` | 静区干预面板（region = 睡眠区 / 情志区）：节律参数(bpm+energyLevel) / 情绪导向(mood+mechanism) / 计时器三栏 + 脉冲动画圆 + 当前配方条。全部使用已有字段，零新增，是真数据的新展示形式 |
| 2 | ActiveZonePanel | `treatment-terminal/blocks/ActiveZonePanel.tsx` | 动区康复面板（region = 运动疗愈区）：BPM 直接取项目已有的 `bpm` 字段 + 滑块可拖（纯展示）+ 传感器进度条（步幅对称性/节奏同步率/平衡稳定度，假数据）+ 四阶段训练进度 |
| 3 | TreatmentReport | `treatment-terminal/blocks/TreatmentReport.tsx` | 结诊报告面板：在 QueueComplete 流程中展示，用治疗前后数据拼接一份结构化报告（诊断概述/量表/治疗方案/效果对比/家庭建议），纯前端拼接假文案 |
| 4 | AIKnowledgeCard | `treatment-terminal/blocks/AIKnowledgeCard.tsx` | AI 知识库匹配卡：`bg-primary-900` 深底 + 文献条目列表（硬编码 4 条）+ 品牌装饰。嵌入治疗面板侧边或底部 |

### 2.3 改动点

| 文件 | 改动 | 说明 |
|------|------|------|
| `TreatmentTerminalPage.tsx` | 传 `region` 给 `TreatmentAction` | 1 行 prop 传递 |
| `TreatmentAction.tsx` | 接收 `region`，treating 时按区域渲染 StaticZonePanel / ActiveZonePanel | 增加条件渲染分支 |
| `QueueComplete.tsx` | 在确认出队前插入 `TreatmentReport` 展示 | 增加一个渲染区块 |

### 2.4 已砍掉

- ~~患者状态看板（心率/HRV 实时）~~ — 实时生理数据不好录，砍掉

---

## 三、全局视觉 Token 变更 — ✅ 已完成

| 维度 | 当前 | 目标（demo 风格） | 状态 |
|------|------|-----------------|------|
| 主色 | ~~sky~~ → indigo | indigo-900 / indigo-600 | ✅ |
| 圆角 | `rounded-xl` ~ `rounded-2xl` | `rounded-xl` ~ `rounded-3xl` | ✅ |
| 卡片 | 白底 `rounded-2xl` + `shadow-sm` + `border-neutral-200` | 白底 + `shadow-sm` + `border-slate-200` | ✅ |
| 导航激活 | `border-l-4 border-primary-600 bg-primary-50` | `border-l-4 border-indigo-600` + `bg-indigo-50` | ✅ |
| 动画 | `animate-pulse` / `animate-ping` / `animate-spin` / `fade-up` | 脉冲 / 呼吸 / 旋转 / 淡入上移 | ✅ |
| 深色面板 | `bg-neutral-900` | AI 相关区域用 `bg-slate-900` | ✅ |
| 品牌元素 | Header "耳界 Earmersion" + sparkle | "耳界 Earmersion" 标识 + sparkle 图标 | ✅ |
| 布局 | Header 全宽贯穿 + Sidebar/内容区卡片并排 | 对齐 demo 三栏布局 | ✅ |

---

## 四、Part C 补充项（医生终端布局重构）

> 原标记"不涉及"的右侧摘要卡现已纳入 Part C 计划。

- 医生终端整体布局从"左队列+右堆叠"改为"左工作区+右边栏"
- PatientInfoBar 改为竖向圆角卡片放右边栏顶部
- 候诊队列精简为紧凑版（叫号+前 2-3 位患者），放右边栏
- 新建 SidebarSummary 组件：禁忌症/量表/配方摘要卡
- AISuggestionPanel 深色终端风美化
- 图标升级（Activity / ShieldAlert / Brain）

不涉及项：
- Footer 底栏 — 不做