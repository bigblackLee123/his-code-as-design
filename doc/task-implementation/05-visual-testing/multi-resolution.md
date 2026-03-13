---
inclusion: manual
---

## 多分辨率测试

对每个终端页面，在以下三种分辨率下截图并检查布局：

| 分辨率 | 说明 | 检查重点 |
|--------|------|----------|
| 1920×1080 | 医生工作站 | 完整布局，充分利用横向空间 |
| 1366×768 | 护士站 | 横向空间有限，确认无溢出 |
| 1280×1024 | 老旧终端 4:3 | 纵向空间利用，确认无截断 |

使用 `mcp_chrome_devtools_resize_page` 切换分辨率：
```
resize_page({ width: 1920, height: 1080 })
resize_page({ width: 1366, height: 768 })
resize_page({ width: 1280, height: 1024 })
```

每次切换后截图保存到 `doc/screenshots/`，命名格式：`{terminal}-{width}x{height}.png`

---

⬅️ [治疗终端测试](./treatment-terminal.md) | [返回目录](./index.md) | [设计规范合规检查](./design-compliance.md) ➡️
