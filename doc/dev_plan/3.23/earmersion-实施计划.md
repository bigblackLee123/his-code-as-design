# Earmersion 视觉升级 — 实施计划

> 分两条线并行推进，Part A 纯视觉零风险，Part B 涉及新组件和插槽。
> 关联文档：
> - `doc/dev_plan/3.23/earmersion-视觉升级清单.md`
> - `doc/dev_plan/3.23/earmersion-假数据对接表.md`（已更名为数据对接表）
> - `doc/task-implementation/02-design-system/color-tokens.md`（已更新为 indigo 主色）
> - `doc/task-implementation/02-design-system/border-radius.md`（已更新圆角规范）
> - `doc/task-implementation/02-design-system/shadows.md`（已更新，含动画令牌）

---

## Part A — 纯视觉换肤

不涉及数据变更、不改状态机、不加新组件。可以直接开干。

### A1. 全局 Token 变更 ✅

| 步骤 | 文件 | 改动 | 状态 |
|------|------|------|------|
| A1.1 | `tailwind.config.ts` | primary 色阶从 sky → indigo + HIS 语义色同步更新 | ✅ |
| A1.2 | `tailwind.config.ts` | 新增 `keyframes.fade-up` + `animation.fade-up` | ✅ |
| A1.3 | `src/index.css` | 确认 CSS 变量无冲突 | ✅ |

> A1 改完后全站主色立刻生效，所有用 `primary-*` 的地方自动变色。

### A2. 布局组件换肤 ✅

| 步骤 | 文件 | 改动要点 | 状态 |
|------|------|---------|------|
| A2.1 | `components/layout/Header.tsx` | `bg-primary-900` 深底 + "耳界 Earmersion 智能诊室控制中心" 大标题(`text-2xl`) + 英文副标题 + AI 就绪胶囊状态灯 | ✅ |
| A2.2 | `components/layout/Sidebar.tsx` | 白底 `rounded-2xl` 卡片式 + 导航项 `rounded-xl` 大 padding + 激活态 `border-l-4 border-primary-600 bg-primary-50` + 底部说明区 | ✅ |
| A2.3 | `components/layout/AdminLayout.tsx` | Header 全宽贯穿顶部 + Sidebar/内容区并排 `rounded-2xl` 卡片 + `gap-6` + `p-6` 灰底衬托 | ✅ |

### A3. 医生终端 Block 换肤 ✅

| 步骤 | 文件 | 改动要点 | 状态 |
|------|------|---------|------|
| A3.1 | `ContraindicationInput.tsx` | `rounded-xl` amber 色系分类网格 + 分类标题 `text-warning-700` + 底部安全提示条 | ✅ |
| A3.2 | `ScaleForm.tsx` | `rounded-xl` indigo 卡片题组 + `rounded-xl` 绿色完成条 | ✅ |
| A3.3 | `AISuggestionPanel.tsx` | `bg-neutral-900` 深色终端风 + sparkle 装饰标题栏 + 深色 loading 动画 + `text-primary-300` | ✅ |
| A3.4 | `TherapyProjectSelector.tsx` | **重写**为区域 tab pill 筛选 + 卡片网格 + 禁忌冲突标红 + 已选 tag 组（对齐 demo RxSelector） | ✅ |

### A4. 治疗终端 Block 换肤 ✅

| 步骤 | 文件 | 改动要点 | 状态 |
|------|------|---------|------|
| A4.1 | `RegionSelector.tsx` | `rounded-2xl` 大卡片 + `h-10 w-10` 大图标 + 统一 primary/success 色系 | ✅ |
| A4.2 | `TreatmentAction.tsx` | `rounded-xl` 计时器 + 脉冲动画圆(`animate-ping` + 实心圆 + Music 图标) + "闭环调控中"标签 | ✅ |
| A4.3 | `TreatmentWarnings.tsx` | `rounded-xl` amber 色系 + 紧急停止红色按钮(`onEmergencyStop` 可选 prop) | ✅ |
| A4.4 | `QueueComplete.tsx` | 全部容器 `rounded-xl` + 数据区块 `rounded-xl` | ✅ |

### A 线执行顺序

```
A1（全局 Token）→ A2（布局）→ A3（医生终端）→ A4（治疗终端）
每步改完可单独验证，互不依赖。
```

---

## Part B — 新组件 + 插槽

涉及新建 4 个组件 + TreatmentTerminalPage 插槽调整。

### B1. TreatmentTerminalPage 插槽设计

现有状态机流程不变：
```
region-select → idle → checked-in → treating → room-completing → post-vitals → post-scale → completing
```

改动点：
- `TreatmentAction` 增加 `region` 和 `projects` prop
- `treating` 状态下，TreatmentAction 内部根据 region 渲染 StaticZonePanel / ActiveZonePanel
- `completing` 状态下，QueueComplete 前插入 TreatmentReport
- AIKnowledgeCard 嵌入治疗面板右侧或底部（treating 状态时显示）

| 步骤 | 文件 | 改动 |
|------|------|------|
| B1.1 | `TreatmentTerminalPage.tsx` | 传 `region` + `currentPatient.projects` 给 TreatmentAction |
| B1.2 | `TreatmentTerminalPage.tsx` | completing 状态插入 TreatmentReport |
| B1.3 | `TreatmentTerminalPage.tsx` | treating 状态插入 AIKnowledgeCard |

### B2. 新建组件

| 步骤 | 文件 | 数据来源 | 说明 |
|------|------|---------|------|
| B2.1 | `StaticZonePanel.tsx` | patient.projects（bpm/mood/energyLevel/mechanism） | 静区面板：节律参数 / 情绪导向 / 计时器三栏 + 脉冲动画 + 配方条。region = 睡眠区/情志区 |
| B2.2 | `ActiveZonePanel.tsx` | patient.projects（bpm/mechanism） | 动区面板：BPM 滑块 + 传感器占位 `--` + 训练阶段进度。region = 运动疗愈区 |
| B2.3 | `TreatmentReport.tsx` | treatmentState + preVitals + postVitals + scaleResults + projects | 结诊报告：编号前端生成 `EM-{YYYYMMDD}-{4位随机}` + 数据汇总 + 家庭建议模板 |
| B2.4 | `AIKnowledgeCard.tsx` | 硬编码 | AI 知识库卡：`bg-primary-900` 深底 + 4 条文献 + 品牌装饰 |

### B3. TreatmentAction 改造

| 步骤 | 改动 |
|------|------|
| B3.1 | 新增 props: `region: string`, `projects: TherapyProject[]` |
| B3.2 | `treating` 状态下：`region === "睡眠区" \|\| "情志区"` → 渲染 StaticZonePanel；`"运动疗愈区"` → 渲染 ActiveZonePanel |
| B3.3 | 开始/结束按钮逻辑不变 |

### B 线执行顺序

```
B1.1（Page 传 prop）→ B3（TreatmentAction 改造）→ B2.1 + B2.2（静区/动区面板）→ B2.4（知识卡）→ B1.3（插入知识卡）→ B2.3（报告）→ B1.2（插入报告）
```

---

## Part C — 医生终端布局重构

纯前端改动，不涉及数据/状态机。目标：对齐 demo 的三栏布局风格。

### C1. 整体布局重构

当前布局：`[候诊队列 w-80] [纵向堆叠所有 Block]`
目标布局：`[主工作区 flex-1] [右边栏 w-80]`

| 步骤 | 文件 | 改动 | 状态 |
|------|------|------|------|
| C1.1 | `DoctorTerminalPage.tsx` | 布局从"左队列+右堆叠"改为"左工作区+右边栏"，右边栏包含：患者信息卡 → 候诊队列（精简版）→ 禁忌症摘要 → 量表摘要 → 已选配方摘要 | |
| C1.2 | `DoctorTerminalPage.tsx` | 主工作区去掉 PatientInfoBar，保留：ContraindicationInput → SymptomInput → ScaleForm → AISuggestionPanel → TherapyProjectSelector → 确认处方按钮 | |

### C2. PatientInfoBar → PatientInfoCard

| 步骤 | 文件 | 改动 | 状态 |
|------|------|------|------|
| C2.1 | `PatientInfoBar.tsx` | 从横向长条改为竖向圆角卡片（`rounded-2xl`），姓名大字 + 性别年龄 + 生理数据竖排，放右边栏顶部，类似 demo 右侧"患者状态看板"风格 | |

### C3. 候诊队列精简

| 步骤 | 文件 | 改动 | 状态 |
|------|------|------|------|
| C3.1 | `CallQueue.tsx` | 精简为右边栏紧凑版：叫号按钮 + 只显示前 2-3 位候诊患者简要信息（序号、姓名、等候时长），隐藏过号/移出按钮，可展开查看完整列表 | |

### C4. 右边栏摘要卡片（新建）

| 步骤 | 文件 | 说明 | 状态 |
|------|------|------|------|
| C4.1 | `blocks/SidebarSummary.tsx`（新建） | 右边栏摘要组件，接收 contraindications / scaleResults / selectedProjects，展示：禁忌症 tag 组 + 量表得分 + 已选配方 tag 组，跟随主区域联动 | |

### C5. AISuggestionPanel 美化

| 步骤 | 文件 | 改动 | 状态 |
|------|------|------|------|
| C5.1 | `AISuggestionPanel.tsx` | 保持 `bg-neutral-900` 深色终端风 + sparkle/Brain 装饰标题栏 + loading 旋转图标+呼吸动画文字 + 建议结果 markdown 渲染（标题/列表/表格）+ 底部"采纳建议"按钮 | |

### C6. 图标升级

| 组件 | 当前图标 | 目标图标 |
|------|---------|---------|
| 患者信息 | `HeartPulse` | `Activity`（心电图风格） |
| 禁忌症 | `AlertTriangle` | `ShieldAlert`（更专业） |
| AI 面板标题 | `Sparkles` | `Sparkles` + `Brain` 装饰 |
| 其余 | 不变 | 不变 |

### C 线执行顺序

```
C1（布局重构）→ C2（PatientInfoCard）→ C3（队列精简）→ C4（摘要卡片）→ C5（AI 美化）→ C6（图标）
```

---

## 执行建议

| 顺序 | 任务 | 预估 | 前置依赖 |
|------|------|------|---------|
| 1 | A1 全局 Token | 10min | 无 |
| 2 | A2 布局换肤 | 20min | A1 |
| 3 | A3 医生终端换肤 | 30min | A1 |
| 4 | A4 治疗终端换肤 | 20min | A1 |
| 5 | B1.1 Page 传 prop | 5min | 无 |
| 6 | B3 TreatmentAction 改造 | 15min | B1.1 |
| 7 | B2.1 StaticZonePanel | 30min | B3 + A1 |
| 8 | B2.2 ActiveZonePanel | 30min | B3 + A1 |
| 9 | B2.4 AIKnowledgeCard | 15min | A1 |
| 10 | B2.3 TreatmentReport | 30min | B1.1 |
| 11 | B1.2 + B1.3 插入新组件 | 10min | B2.3 + B2.4 |

> Part A（步骤 1-4）和 Part B（步骤 5-6）可以并行。
> 总预估：~3.5h，分多个会话逐步推进。

---

## 后续计划

Part B 的具体实现已合并到 3.24 开发任务中，与新增的 Part C（医生终端布局重构）和 Part D（治疗终端功能补全）一起规划。

→ 详见 `doc/dev_plan/3.24/3.24开发任务.md`