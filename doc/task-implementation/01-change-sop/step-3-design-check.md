---
inclusion: manual
---

## 步骤 3：设计规范检查

确认变更是否需要扩展设计规范。

逐项检查：

1. 是否需要新增颜色令牌？→ 改 `his-design-system.md` + `tailwind.config.ts`
2. 是否需要新增组件或组件约束？→ 改 `his-components.md`
3. 是否需要新增页面模式？→ 改 `his-patterns.md`
4. 是否涉及新的敏感数据字段？→ 确认是否需要 MaskedText 脱敏
5. 是否需要新的图标？→ 确认 lucide-react 中是否有对应图标

输出格式：
```
📐 设计规范检查
- 需要新增 Design Token：是/否（具体说明）
- 需要新增组件约束：是/否（具体说明）
- 需要数据脱敏：是/否（哪些字段）
- 需要新图标：是/否（哪些图标）
```
---

⬅️ [上一步：影响评估](./step-2-impact-assessment.md) | [返回目录](./index.md) | [下一步：技术先验](./step-4-tech-validation.md) ➡️
