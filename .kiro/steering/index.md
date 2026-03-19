---
inclusion: always
---

# HIS 项目规范入口

> "曙光"医院信息系统（HIS）项目的核心规范索引。
> 技术栈：React + TypeScript + Tailwind CSS + shadcn/ui。

## ⚠️ AI 行为指令

你在执行任何任务前，必须遵循以下读取策略：

1. 先读本文档，理解全貌和强制规则
2. 根据任务类型，定位到下方「任务路由表」对应的模块
3. 先读该模块的 `index.md`（轻量导航），再按需读取具体子文件
4. **禁止一次性读取整个模块的所有文件** — 只读当前步骤需要的那个子文件
5. 生成 UI 代码时，必须同时遵守「强制规则」中的所有约束

---

## 🚨 强制规则（生成任何 UI 代码时必须遵守）

- 禁止内联样式 `style={}`，只用 Tailwind 工具类
- 禁止自定义 CSS 类，只用 Tailwind + shadcn/ui 内部类
- 禁止引入 shadcn/ui 以外的 UI 库
- 样式值必须来源于 Design Token（禁止 `text-[#ff6600]`、`p-[13px]` 等任意值）
- 患者姓名/身份证/手机号必须使用 `MaskedText` 组件脱敏
- HIS 默认紧凑模式：`text-xs` + `leading-tight`
- 图标只用 `lucide-react`，默认 `h-4 w-4`
- 每个 Block 文件 ≤ 200 行
- 文档编辑类任务（`.md` 文件的新增/修改），不要直接写文件，而是返回纯文本内容 + 目标文件路径，由用户手动粘贴

---

## 🗺️ 任务路由表

根据你要做的事，读取对应模块。每个模块的 `index.md` 会告诉你具体该读哪个子文件。

| 任务类型 | 模块入口 | 何时读取 |
|----------|---------|---------|
| 用户提出新需求/修改功能 | `doc/task-implementation/01-change-sop/index.md` | 按 8 步流程逐步读取对应步骤文件 |
| 需要查颜色/字号/间距/圆角/阴影 | `doc/task-implementation/02-design-system/index.md` | 只读涉及的主题子文件（如只改颜色就只读 `color-tokens.md`） |
| 需要用/开发 UI 组件 | `doc/task-implementation/03-components/index.md` | 按需读通用组件/HIS专用/层级/互斥/示例 |
| 创建新页面/修改页面结构 | `doc/task-implementation/04-patterns/index.md` | 先读 `block-composition.md`，再读对应模板文件 |
| 视觉测试验证 | `doc/task-implementation/05-visual-testing/index.md` | 按终端逐个读取（分诊/医生/治疗） |
| 检查 UI 是否符合规范 | `doc/task-implementation/06-ui-rules/index.md` | 按约束类型读取（样式/结构/业务） |
| 百炼平台 AI 对接 | `doc/official_API_Doc/aliyun/` | 大模型请求体、响应对象、知识库 API 示例 |

