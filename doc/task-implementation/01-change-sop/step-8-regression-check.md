---
inclusion: manual
---

## 步骤 8：回归确认

确认变更未破坏其他区域。

- TypeScript 编译无错误（`npx tsc --noEmit`）
- Vite 构建成功（`npx vite build`）
- 未修改的 Block 功能不受影响
- 页面整体布局完整

输出格式：
```
✅ 回归确认
- TypeScript 编译：通过/失败
- Vite 构建：通过/失败
- 其他 Block 影响：无/有（具体说明）
```

---
---

⬅️ [上一步：视觉验证](./step-7-visual-verification.md) | [返回目录](./index.md)
