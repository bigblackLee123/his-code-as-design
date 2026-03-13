---
inclusion: always
---

## 2. 代码结构约束（Code Structure Constraints）

### 2.1 组件文件规范

- 每个 UI 组件为独立的 `.tsx` 文件
- 组件使用函数式组件 + TypeScript 类型定义
- Props 接口必须显式定义并导出
- 组件文件不超过 200 行，超过时应拆分为子组件

### 2.2 导入规范

- shadcn/ui 组件从 `@/components/ui/` 路径导入
- 工具函数从 `@/lib/utils` 导入（包括 `cn()` 函数）
- 图标从 `lucide-react` 导入

### 2.3 无障碍性要求

- 交互元素必须有 `aria-label` 或可见文本标签
- 图片必须有 `alt` 属性
- 表单控件必须关联 `<label>`
- 颜色对比度需满足 WCAG AA 标准

---

⬅️ [样式约束](./style-constraints.md) | [返回目录](./index.md) | [HIS 业务约束](./business-constraints.md) ➡️
