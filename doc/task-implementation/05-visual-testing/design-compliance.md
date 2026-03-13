---
inclusion: manual
---

## 设计规范合规检查

在截图和 DOM 快照基础上，逐项检查以下规范：

1. **颜色令牌**：主色 `primary-600`（#0284c7），语义色（success/warning/error/info），HIS 状态色（admitted/pending/completed 等）
2. **间距网格**：所有间距为 4px 倍数，紧凑模式使用 `p-1`/`p-2`/`gap-1`/`gap-2`
3. **字号**：紧凑模式正文 `text-xs`，标题 `text-sm`，辅助 `text-[10px]`
4. **行高**：紧凑模式 `leading-tight`
5. **组件使用**：shadcn/ui 组件，Button `size="sm"`，Card `rounded-lg shadow-sm`
6. **数据脱敏**：所有患者姓名/身份证/手机号使用 `MaskedText` 组件
7. **图标**：仅 `lucide-react`，默认 `h-4 w-4`
8. **无内联样式**：DOM 中无 `style` 属性
9. **无自定义 CSS 类**：仅 Tailwind 工具类

---

⬅️ [多分辨率测试](./multi-resolution.md) | [返回目录](./index.md) | [验证清单](./verification-checklist.md) ➡️
