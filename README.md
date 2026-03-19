好，完整内容如下，目标文件：`README.md`

```markdown
# 曙光医院 音乐疗愈 HIS 系统

> 医院信息系统（HIS）前端项目，覆盖分诊、医生诊疗、治疗三个终端。
> 采用 Code-as-Design 工作流，100% 在代码环境内完成 UI 设计与开发。

## 技术栈

- React 18 + TypeScript
- Tailwind CSS 3 + shadcn/ui
- Vite 6
- Supabase（本地开发：PostgreSQL + PostgREST + Realtime）
- lucide-react 图标库

## 快速开始

### 前端

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

### Supabase 本地后端

```bash
supabase start
```

启动后在 `.env` 中配置：

```env
VITE_USE_MOCK=false
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<supabase status 输出的 anon key>
```

设置 `VITE_USE_MOCK=true` 可切换回纯前端 Mock 模式，无需后端。

## 业务终端

| 终端 | 路由 | 职责 |
|------|------|------|
| 分诊终端 | `/triage` | 患者签到、生理数据录入、候诊队列分配 |
| 医生终端 | `/doctor` | 叫号候诊、量表评估、禁忌症录入、疗愈套餐处方、AI 建议、转治疗队列 |
| 治疗终端 | `/treatment` | 治疗叫号、治疗计时、治后生理数据、治后量表、出队 |

## 项目结构

```
├── .kiro/
│   ├── steering/              # 设计规范（Steering 文件）
│   ├── hooks/                 # Agent Hook（自动校验）
│   └── specs/                 # Spec 文档
├── src/
│   ├── components/
│   │   ├── his/               # HIS 业务组件（MaskedText 等）
│   │   ├── layout/            # 布局组件
│   │   └── ui/                # shadcn/ui 基础组件
│   ├── hooks/                 # 自定义 Hook（useQueueRealtime 等）
│   ├── pages/
│   │   ├── triage-terminal/   # 分诊终端页面 + Blocks
│   │   ├── doctor-terminal/   # 医生终端页面 + Blocks
│   │   └── treatment-terminal/# 治疗终端页面 + Blocks
│   ├── services/
│   │   ├── mock/              # Mock 数据服务
│   │   ├── supabase/          # Supabase 后端服务
│   │   ├── types.ts           # 共享类型定义
│   │   └── index.ts           # 服务路由（根据 VITE_USE_MOCK 切换）
│   └── types/
│       └── supabase.ts        # Supabase 生成的数据库类型
├── supabase/
│   ├── config.toml            # Supabase 本地配置
│   └── migrations/            # 数据库 Migration 文件
├── doc/
│   ├── backend/               # 后端设计文档
│   └── task-implementation/   # 开发规范与流程文档
└── tailwind.config.ts         # Tailwind 配置（Design Token 映射）
```

## 数据流

```
分诊终端                    医生终端                     治疗终端
┌──────────┐  入候诊队列   ┌──────────┐  入治疗队列    ┌──────────┐
│ 患者签到  │ ──────────→ │ 叫号诊疗  │ ──────────→  │ 叫号治疗  │
│ 生理数据  │  Realtime   │ 量表/禁忌  │  Realtime    │ 计时/出队  │
└──────────┘  队列同步    │ 套餐处方  │  队列同步    └──────────┘
                          └──────────┘
```

队列通过 Supabase Realtime 订阅实时同步，Mock 模式下使用轮询。

## 服务层架构

服务路由 `src/services/index.ts` 根据 `VITE_USE_MOCK` 环境变量动态切换：

| 服务 | 职责 |
|------|------|
| `patientService` | 患者 CRUD、状态管理 |
| `queueService` | 候诊队列 + 治疗队列（拆分为 waitingQueue / treatmentQueue） |
| `scaleService` | 量表模板加载、结果提交 |
| `contraindicationService` | 禁忌症词库检索（拼音首字母） |
| `therapyService` | 疗愈套餐查询（拼音首字母） |
| `aiService` | AI 疗愈建议（Edge Function，待部署） |
| `prescriptionService` | 处方保存 |

## 开发规范

- 所有样式通过 Tailwind CSS 工具类，禁止内联样式和自定义 CSS
- 间距符合 4px 网格（p-1 到 p-16）
- HIS 默认紧凑模式（text-xs、leading-tight）
- 患者姓名/身份证/手机号必须使用 `MaskedText` 脱敏组件
- 单个 Block 文件不超过 200 行
- 图标统一使用 lucide-react，默认 h-4 w-4
- 详细规范见 `doc/task-implementation/` 目录

## License

MIT
```