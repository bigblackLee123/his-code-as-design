# 项目结构地图

> 曙光 HIS 代码结构速查。目标：30 秒定位到要改的文件。
> 最后更新：2026-03-23（3.22 Block 自治化重构后）

---

## 路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | → `/triage` | 默认重定向 |
| `/triage` | TriageTerminalPage | 分诊终端 |
| `/doctor` | DoctorTerminalPage | 医生终端 |
| `/treatment` | TreatmentTerminalPage | 治疗终端 |
| `/preview` | PreviewPage | 组件预览（开发用） |

---

## 前端目录

```
src/
├── App.tsx                          # 路由定义
├── main.tsx                         # 入口
├── index.css                        # Tailwind 入口
│
├── components/
│   ├── ui/                          # shadcn/ui 基础组件（10 个）
│   ├── his/                         # HIS 专用组件
│   │   ├── MaskedText.tsx           #   患者信息脱敏
│   │   └── PatientInfoCard.tsx      #   患者信息卡片
│   └── layout/                      # 布局组件
│       ├── AdminLayout.tsx          #   主布局框架
│       ├── Header.tsx               #   顶栏
│       └── Sidebar.tsx              #   侧边栏
│
├── hooks/
│   ├── useQueueRealtime.ts          # 队列 Realtime 订阅
│   └── usePrescriptionStepsRealtime.ts  # 处方步骤 Realtime 订阅
│
├── lib/
│   ├── utils.ts                     # cn() 等工具函数
│   └── vitalSignsValidation.ts      # 生理数据校验
│
├── pages/
│   ├── triage-terminal/             # ── 分诊终端 ──
│   │   ├── TriageTerminalPage.tsx   #   Page（纯编排）
│   │   └── blocks/
│   │       ├── PatientCheckIn.tsx   #     刷卡签到
│   │       ├── ManualPatientForm.tsx#     手动建档
│   │       ├── VitalSignsInput.tsx  #     生理数据录入
│   │       └── QueueAssignment.tsx  #     分配候诊队列
│   │
│   ├── doctor-terminal/             # ── 医生终端 ──
│   │   ├── DoctorTerminalPage.tsx   #   Page（纯编排）
│   │   └── blocks/
│   │       ├── CallQueue.tsx        #     叫号队列
│   │       ├── PatientInfoBar.tsx   #     患者信息条
│   │       ├── ContraindicationInput.tsx  # 禁忌症输入（自治）
│   │       ├── useContraindicationInput.ts # └─ hook
│   │       ├── SymptomInput.tsx     #     症状输入
│   │       ├── ScaleForm.tsx        #     量表评估（自治）
│   │       ├── useScaleForm.ts      #     └─ hook
│   │       ├── ScaleQuestionRenderer.tsx  # 量表题目渲染
│   │       ├── AISuggestionPanel.tsx#     AI 建议面板（自治）
│   │       ├── TherapyProjectSelector.tsx # 项目选择器
│   │       ├── TherapyProjectSelectorParts.tsx # └─ 子组件
│   │       ├── TherapyProjectList.tsx#    已选项目列表
│   │       └── StatusTransition.tsx #     状态流转（自治）
│   │
│   ├── treatment-terminal/          # ── 治疗终端 ──
│   │   ├── TreatmentTerminalPage.tsx#   Page（纯编排）
│   │   └── blocks/
│   │       ├── RegionSelector.tsx   #     房间选择
│   │       ├── TreatmentQueue.tsx   #     刷卡签到 + 队列（自治）
│   │       ├── TreatmentPatientView.tsx # 患者信息展示
│   │       ├── TreatmentAction.tsx  #     计时/开始/结束
│   │       ├── RoomCompleteCheck.tsx#     本房间完成检查（自治）
│   │       ├── PostVitalSigns.tsx   #     治疗后生理数据
│   │       ├── PostScaleForm.tsx    #     治疗后量表
│   │       └── QueueComplete.tsx    #     出队完成（自治）
│   │
│   ├── outpatient-prescription/     # 门诊处方（预留，暂空）
│   └── preview/                     # 组件预览
│       ├── PreviewPage.tsx
│       ├── registry.ts
│       └── configs/                 #   各终端预览配置
│
├── services/
│   ├── index.ts                     # 统一出口（Mock / Supabase 切换）
│   ├── types.ts                     # 全局业务类型定义
│   ├── mock/                        # Mock 实现（9 个 service + data/）
│   └── supabase/                    # Supabase 实现
│       ├── client.ts                #   Supabase 客户端单例
│       ├── errorHelper.ts           #   统一错误处理
│       ├── mappers.ts               #   DB 行 → 前端类型映射
│       ├── mappersFlow.ts           #   流转相关映射
│       ├── consultationHelper.ts    #   就诊会话生命周期
│       ├── patientService.ts        #   患者 CRUD + 签到
│       ├── contraindicationService.ts # 禁忌症搜索/保存
│       ├── scaleService.ts          #   量表模板/结果
│       ├── therapyService.ts        #   疗愈项目查询
│       ├── symptomService.ts        #   症状服务
│       ├── aiService.ts             #   AI 建议（调 Edge Function）
│       ├── prescriptionService.ts   #   处方服务
│       ├── prescriptionStepsService.ts # 处方步骤
│       ├── queueService.ts          #   队列门面（waiting + treatment）
│       ├── waitingQueueService.ts   #   候诊队列
│       └── treatmentQueueService.ts #   治疗队列
│
└── types/
    └── supabase.ts                  # Supabase 生成的 DB 类型
```

---

## 后端目录

```
supabase/
├── config.toml                      # 本地 Supabase 配置
├── seed.sql                         # 基础种子数据
├── seed_therapy.sql                 # 疗愈项目种子数据
├── seed-secrets.sql                 # 密钥种子（百炼 API Key 等）
├── migrations/
│   ├── 20260313_create_his_tables   # 建表（患者/禁忌/量表/疗愈/就诊/队列）
│   ├── 20260314_add_pinyin_initial  # 疗愈包拼音首字母
│   ├── 20260319_restructure_multi_room  # 多房间治疗重构
│   ├── 20260319_drop_packages_cleanup   # 清理旧疗愈包
│   ├── 20260320_enable_realtime_queue   # 队列 Realtime
│   └── 20260320_enable_realtime_steps   # 处方步骤 Realtime
└── functions/
    └── ai-therapy-suggestion/       # Edge Function：AI 疗愈建议
        ├── index.ts                 #   入口（App 模式 / 直连模式）
        └── _shared/
            ├── config.ts            #   环境变量 + Supabase 客户端
            ├── cors.ts              #   CORS 头
            ├── patient.ts           #   患者上下文加载
            ├── projects.ts          #   候选项目 + 禁忌过滤
            └── prompt.ts            #   提示词构建
```

---

## 数据流

```
Page（状态机 + 编排）
  │
  ├── Block.tsx（UI + 回调）
  │     └── useXxx.ts（hook：service 调用 + loading/error）
  │           └── xxxService（Supabase 客户端 / Mock）
  │                 └── Supabase DB / Edge Function
  │
  └── Block 之间通过 Page 传递 ID（patientId、consultationId）
```

**Service 切换：** `VITE_USE_MOCK=true` → Mock 实现 | `false` → Supabase 实现

---

## 终端 × Block 对照表

| Block | 分诊 | 医生 | 治疗 | 自治 |
|-------|:----:|:----:|:----:|:----:|
| PatientCheckIn | ✓ | | | ✓ |
| ManualPatientForm | ✓ | | | — |
| VitalSignsInput | ✓ | | | ✓ |
| QueueAssignment | ✓ | | | ✓ |
| CallQueue | | ✓ | | ✓ |
| PatientInfoBar | | ✓ | | — |
| ContraindicationInput | | ✓ | | ✓ |
| SymptomInput | | ✓ | | — |
| ScaleForm | | ✓ | | ✓ |
| AISuggestionPanel | | ✓ | | ✓ |
| TherapyProjectSelector | | ✓ | | — |
| TherapyProjectList | | ✓ | | — |
| StatusTransition | | ✓ | | ✓ |
| RegionSelector | | | ✓ | — |
| TreatmentQueue | | | ✓ | ✓ |
| TreatmentPatientView | | | ✓ | — |
| TreatmentAction | | | ✓ | — |
| RoomCompleteCheck | | | ✓ | ✓ |
| PostVitalSigns | | | ✓ | — |
| PostScaleForm | | | ✓ | — |
| QueueComplete | | | ✓ | ✓ |

> 自治 = Block 内部自己调 service，Page 不代劳
```

---

然后给 `index.md` 加一行路由：