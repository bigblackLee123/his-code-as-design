---
inclusion: always
---

# HIS 页面模式与积木式生成策略

> AI 在生成任何页面级 UI 代码时必须严格遵循以下规则。
> 技术栈：React + TypeScript + Tailwind CSS + shadcn/ui。

## 章节导航

| 章节 | 文档 | 说明 |
|------|------|------|
| 1 | [积木式开发规则](./block-composition.md) | Block 拆分、通信、组合的核心原则 |
| 2.1 | [列表页模板](./template-list.md) | 医嘱列表、患者列表等数据密集型页面 |
| 2.2 | [详情页模板](./template-detail.md) | 患者详情、医嘱详情等信息展示页面 |
| 2.3 | [表单页模板](./template-form.md) | 入院登记、医嘱开立等表单录入页面 |
| 2.4 | [仪表盘页模板](./template-dashboard.md) | 科室首页、运营看板等概览页面 |
| 3 | [数据脱敏规则](./data-masking.md) | MaskedText 组件使用规范 |
| 4 | [图标规范](./icon-spec.md) | lucide-react 图标库使用规范 |

## 关联文档

- 页面中的具体组件需遵循 [HIS 组件约束规则](../03-components/index.md)。
- 所有 Block 的开发都始于 [需求变更流程](../01-change-sop/index.md) 的第一步。
