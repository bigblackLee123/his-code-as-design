---
inclusion: always
---

# HIS 组件约束规则（Component Constraints）

> 本文件定义 HIS 前端项目中所有 UI 组件的使用约束规则。AI 在生成任何 UI 代码时必须严格遵循以下约束。
> 技术栈：React + TypeScript + Tailwind CSS + shadcn/ui + @tanstack/react-table。

## 章节导航

| 章节 | 文档 | 说明 |
|------|------|------|
| 1 | [通用组件](./base-components.md) | Button / Input / Card / Dialog / Table 约束 |
| 2 | [HIS 专用组件](./his-specialized.md) | HISDataTable / HISStatCard / HISTimeline / HISFormLayout |
| 3 | [层级关系](./hierarchy.md) | 所有组件的父子层级约束汇总表 |
| 4 | [互斥规则](./exclusion-rules.md) | 禁止同时使用的属性组合汇总表 |
| 5 | [使用示例](./examples.md) | 每个核心组件的正确用法和禁止用法 |

## 关联文档

- 所有组件的视觉表现由 [设计规范](../02-design-system/index.md) 定义。
- 如何将组件组装成完整页面，请参考 [页面模式](../04-patterns/index.md)。
