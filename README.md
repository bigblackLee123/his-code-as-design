# HIS Code-as-Design 工作流系统

> 100% 在代码环境内完成 UI 设计与开发的医院信息系统（HIS）前端项目。  
> 无需 Figma，用 Steering 规范 + Agent Hook + Chrome DevTools MCP 替代传统设计工具。

## 技术栈

- React 18 + TypeScript
- Tailwind CSS 3 + shadcn/ui
- Vite 6
- @tanstack/react-table + react-hook-form + zod
- lucide-react 图标库

## 快速开始

```bash
npm install
npm run dev
```

浏览器打开 `http://localhost:5173`。

## 项目结构

```
├── .kiro/
│   ├── steering/              # 设计规范（Steering 文件）
│   │   ├── his-design-system.md   # Design Token：颜色、排版、间距、密度
│   │   ├── his-ui-rules.md        # UI 生成规则：禁止内联样式、必须用 Tailwind
│   │   ├── his-components.md      # 组件约束：层级关系、互斥规则、使用示例
│   │   └── his-patterns.md        # 页面模式：积木式拆分、4 种页面模板、脱敏规则
│   ├── hooks/                 # Agent Hook（自动校验）
│   │   ├── his-style-validator.kiro.hook       # 样式规范校验
│   │   ├── his-codegen-quality.kiro.hook       # 代码生成质量保障
│   │   ├── his-visual-review.kiro.hook         # 视觉设计审查（手动触发）
│   │   └── his-visual-check-reminder.kiro.hook # 视觉验证提醒
│   └── specs/                 # Spec 文档
│       └── code-as-design-workflow/
├── src/
│   ├── components/
│   │   ├── his/               # HIS 业务组件
│   │   │   ├── MaskedText.tsx     # 数据脱敏组件
│   │   │   └── PatientInfoCard.tsx # 患者信息卡片（示例）
│   │   └── layout/            # 布局组件
│   │       ├── AdminLayout.tsx    # 管理后台主布局
│   │       ├── Header.tsx         # 顶部导航栏
│   │       └── Sidebar.tsx        # 可折叠侧边导航
│   └── lib/
│       └── utils.ts           # cn() 工具函数
└── tailwind.config.ts         # Tailwind 配置（完整 Design Token 映射）
```

## Code-as-Design 工作流

本项目用纯文本规范替代 Figma，通过 Kiro 的三大能力实现闭环：

### 1. Steering 规范（设计系统）

4 个 Steering 文件定义了完整的设计约束，AI 生成代码时自动遵循：

| 文件 | 职责 |
|------|------|
| `his-design-system.md` | 颜色体系、排版、间距、数据密度、圆角、阴影、断点 |
| `his-ui-rules.md` | 禁止内联样式、禁止自定义 CSS、必须用 shadcn/ui |
| `his-components.md` | 组件约束、层级关系、互斥规则、HIS 专用组件规范 |
| `his-patterns.md` | 积木式拆分策略、4 种页面模板、数据脱敏、图标规范 |

### 2. Agent Hook（自动校验）

| Hook | 触发时机 | 作用 |
|------|----------|------|
| 样式规范校验 | 保存 .tsx/.jsx 文件 | 检查内联样式、自定义 CSS、非法颜色/间距值 |
| 代码生成质量保障 | AI 写入文件后 | 验证 Design Token、组件使用、200 行上限 |
| 视觉设计审查 | 手动触发 | Chrome DevTools 截图 → 多分辨率测试 → AI 对比规范 |
| 视觉验证提醒 | AI 写入 UI 文件后 | 提醒开发者触发视觉审查 |

### 3. Chrome DevTools MCP（视觉验证）

需手动配置 `.kiro/settings/mcp.json`：

```json
{
  "mcpServers": {
    "chrome-devtools-mcp": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/chrome-devtools-mcp@latest"],
      "env": { "CHROME_HEADLESS": "true" },
      "disabled": false,
      "autoApprove": ["screenshot", "take_screenshot", "navigate", "evaluate", "dom_snapshot"]
    }
  }
}
```

## 开发规范

- 所有样式通过 Tailwind CSS 工具类表达，禁止内联样式和自定义 CSS
- 间距必须符合 4px 网格（p-1 到 p-16）
- HIS 默认使用紧凑模式（text-xs、leading-tight）
- 患者姓名、身份证号、手机号必须使用 `MaskedText` 脱敏组件
- 单个组件文件不超过 200 行，超过时拆分为子 Block
- 图标统一使用 lucide-react

## 页面模板

项目预置 4 种 HIS 页面模板，开发新页面时按模板的 Block 方案拆分：

- **列表页**：FilterBar + DataTable + ActionBar
- **详情页**：HeaderInfo + TabNavigation + ContentPanel + ActionPanel
- **表单页**：FormHeader + FormBody + FormFooter
- **仪表盘**：StatsRow + ChartPanel + ActivityFeed + QuickActions

## License

MIT
