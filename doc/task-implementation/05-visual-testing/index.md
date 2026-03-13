---
inclusion: manual
---

# HIS 视觉测试流程指南

本文档指导 AI 使用 Chrome DevTools MCP 对三终端页面执行完整的交互式视觉测试。

## 章节导航

| 章节 | 文档 | 说明 |
|------|------|------|
| 0 | [前置条件](./setup.md) | MCP 配置、开发服务器、连接确认 |
| 1 | [分诊终端](./triage-terminal.md) | `/triage` 签到→生理数据→队列分配 |
| 2 | [医生终端](./doctor-terminal.md) | `/doctor` Mock注入→叫号→工作区→量表 |
| 3 | [治疗终端](./treatment-terminal.md) | `/treatment` Mock注入→叫号→治疗→数据采集 |
| 4 | [多分辨率测试](./multi-resolution.md) | 1920×1080 / 1366×768 / 1280×1024 |
| 5 | [合规检查](./design-compliance.md) | 9 项设计规范合规检查清单 |
| 6 | [验证清单](./verification-checklist.md) | 每个终端的关键功能验证点 |
| 7 | [技术备注](./tech-notes.md) | Mock 数据、端口、注意事项 |

## 关联文档

- 本文档是 [需求变更流程](../01-change-sop/index.md) 中"步骤 7：视觉验证"的具体执行方案。
- 设计规范细节定义在 [设计规范](../02-design-system/index.md)、[组件约束](../03-components/index.md)、[页面模式](../04-patterns/index.md)。
