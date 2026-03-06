# 实现任务：Code-as-Design 工作流系统

## 任务 1：创建 Steering 目录结构与全局规则文件
- [x] 创建 `.kiro/steering/` 目录结构，包含 `his-design-system.md`（主设计规范）和 `his-ui-rules.md`（UI 生成规则）
- [x] 在 `his-ui-rules.md` 中定义全局 UI 约束：禁止内联样式、禁止自定义 CSS 类、必须使用 shadcn/ui 组件、必须使用 Tailwind CSS 工具类
- [x] 验证 Steering 文件的 front-matter 配置正确（inclusion 模式设置）

**需求映射：** 需求 1（AC 1-2）、需求 7（AC 1）

## 任务 2：创建 Design Token Steering 文件（颜色体系）
- [x] 在 `his-design-system.md` 中定义品牌色体系：主色（医疗蓝 #0284c7）、辅助色、语义色（成功/警告/错误/信息）、中性色阶
- [x] 定义 HIS 专用语义色：患者状态色（入院-蓝、在院-绿、出院-灰、危急-红）和医嘱状态色（待执行-橙、执行中-蓝、已完成-绿、已取消-灰）
- [x] 为每个颜色令牌标注对应的 Tailwind CSS 类名映射

**需求映射：** 需求 1（AC 3, 7）、需求 6（AC 2）

## 任务 3：创建 Design Token Steering 文件（排版、间距、其他）
- [x] 定义排版规范：字体族、字号阶梯（h1-h6、body、caption）、行高比例
- [x] 定义间距系统：4px 基准网格倍数体系（4, 8, 12, 16, 20, 24, 32, 40, 48, 64），标注 Tailwind 映射
- [x] 定义 HIS 数据密度模式：紧凑/标准/宽松三种级别的行高、间距、字号组合
- [x] 定义圆角、阴影、断点令牌

**需求映射：** 需求 1（AC 4, 5, 7）、需求 6（AC 1）

## 任务 4：创建组件约束 Steering 文件
- [x] 创建 `his-components.md` Steering 文件，定义 shadcn/ui 组件的使用约束
- [x] 定义 HIS 数据表格组件约束：必须支持列固定、行选择、单元格编辑、虚拟滚动
- [x] 定义 HIS 统计卡片、时间线、表单布局组件约束
- [x] 定义表单布局约束：单列/双列/三列布局，标签右对齐
- [x] 定义组件层级关系和互斥规则
- [x] 为每个组件提供使用示例代码和禁止用法列表

**需求映射：** 需求 2（AC 1-4, 6）、需求 6（AC 3-4）

## 任务 5：创建 HIS 页面模式 Steering 文件
- [x] 创建 `his-patterns.md` Steering 文件，定义四种 HIS 预置页面模板：列表页、详情页、表单页、仪表盘页
- [x] 每种模板包含 Block 拆分方案、推荐组件列表、数据流定义
- [x] 定义积木式 Prompt 策略规则：单个 Block 不超过 200 行、每个 Block 为独立 React 组件
- [x] 定义数据脱敏规则：患者姓名、身份证号、联系方式字段必须使用脱敏展示
- [x] 定义 HIS 图标规范：医疗场景常用图标的使用场景和尺寸约束

**需求映射：** 需求 5（AC 1-3, 6-7）、需求 6（AC 5-6）

## 任务 6：配置样式校验 Agent Hook
- [x] 创建 `fileEdited` 类型的 Agent Hook，监听 `*.tsx, *.jsx` 文件保存事件
- [x] Hook 的 askAgent prompt 中包含：检查内联 style 属性、检查自定义 CSS 类名、检查颜色值是否在 Design Token 中定义、检查间距值是否符合 4px 网格
- [x] prompt 中要求 AI 按严重程度（错误/警告/提示）分级报告违规项，并提供 Tailwind CSS 替代方案

**需求映射：** 需求 3（AC 1-8）

## 任务 7：配置代码生成质量保障 Agent Hook
- [x] 创建 `postToolUse` 类型的 Agent Hook，监听 write 类型工具调用
- [x] Hook 的 askAgent prompt 中包含：验证生成的 UI 代码是否遵循 his-design-system.md 中的 Design Token、是否使用了 his-components.md 中注册的组件、是否符合积木式拆分策略
- [x] 当生成的单个组件超过 200 行时，提示开发者拆分

**需求映射：** 需求 3（AC 1）、需求 5（AC 4, 6）

## 任务 8：配置 Chrome DevTools MCP 与视觉验证 Hook
- [x] 在 `.kiro/settings/mcp.json` 中配置 `chrome-devtools-mcp` 服务，启用 headless 模式，autoApprove 截图和快照相关工具
- [x] 创建 `userTriggered` 类型的 "Visual Design Review" Hook，prompt 中编排完整的视觉验证流程：导航 → 截图 → DOM 快照 → 多分辨率测试 → Lighthouse 审计 → AI 对比设计规范 → 输出报告
- [x] 创建 `postToolUse` 类型的 "Post-Generate Visual Check Reminder" Hook，在 AI 写入 UI 文件后提醒开发者触发视觉验证
- [x] 在视觉验证 prompt 中明确检查维度：品牌色合规性、间距网格合规性、组件变体正确性、HIS 数据密度、布局结构
- [x] 配置多分辨率验证：1920x1080、1366x768、1280x1024

**需求映射：** 需求 8（AC 1-9）、需求 10（AC 1-2）

## 任务 9：创建 Tailwind CSS 配置文件
- [x] 创建 `tailwind.config.ts`，将 Steering 文件中定义的 Design Token 映射为 Tailwind 主题扩展
- [x] 配置 HIS 专用颜色（患者状态色、医嘱状态色）为 Tailwind 自定义颜色
- [x] 配置数据密度模式对应的 fontSize 和 spacing 扩展

**需求映射：** 需求 1（AC 7）、需求 6（AC 1-2）

## 任务 10：创建项目基础结构与示例组件
- [x] 初始化 React + TypeScript 项目结构（package.json、tsconfig.json）
- [x] 安装 Tailwind CSS 和 shadcn/ui 依赖配置
- [x] 创建一个示例 HIS 组件（PatientInfoCard.tsx）验证整个工作流：Steering 规范 → AI 生成 → Hook 校验 → Chrome DevTools 视觉验证
- [x] 创建管理后台 Layout 骨架组件（可折叠导航栏 + Header + 内容区）

**需求映射：** 需求 5（AC 3, 5）、需求 2（AC 6）、需求 10（AC 2-3）
