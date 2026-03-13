---
inclusion: manual
---

## 关键技术备注

- Mock 数据存储在模块级内存中，页面刷新或路由导航会导致状态丢失
- 跨终端测试时必须通过 `evaluate_script` 重新注入队列数据
- 医生终端 CallQueue 硬编码 `DEPARTMENT_ID = "DEPT001"`
- 截图统一保存到 `doc/screenshots/` 目录
- 开发服务器端口可能变化（5173-5176），以实际启动端口为准

---

⬅️ [验证清单](./verification-checklist.md) | [返回目录](./index.md)
