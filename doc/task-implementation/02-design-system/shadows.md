---
inclusion: always
---

## 6. 阴影（Shadows）

阴影令牌用于表达元素的层级关系和视觉深度，统一使用 Tailwind 内置阴影类。

| 语义名称 | Tailwind 类 | 使用场景 |
|----------|-------------|----------|
| sm | `shadow-sm` | 微阴影，用于卡片悬停前的默认状态、输入框 |
| default | `shadow` | 默认阴影，用于卡片、面板 |
| md | `shadow-md` | 中等阴影，用于下拉菜单、弹出提示 |
| lg | `shadow-lg` | 大阴影，用于对话框、模态框 |
| xl | `shadow-xl` | 超大阴影，用于浮动面板、全屏遮罩上的内容 |
| none | `shadow-none` | 无阴影，用于扁平化元素、禁用态 |

使用规范（Earmersion 视觉升级后）：
- 卡片默认使用 `shadow-sm`，悬停态使用 `shadow-md`（搭配 `hover:shadow-md`）
- 侧边栏信息卡片使用 `shadow-sm`，AI 知识库卡片使用 `shadow-xl`
- 下拉菜单和弹出层使用 `shadow-md` 或 `shadow-lg`
- 对话框和模态框使用 `shadow-lg` 或 `shadow-xl`
- 脉冲动画圆（治疗播放中）使用 `shadow-2xl`
- 层级越高的元素阴影越深，保持视觉层次一致性
- 禁止使用自定义阴影值（如 `shadow-[0_2px_4px_rgba(0,0,0,0.1)]`）

### 动画令牌（Animation Tokens）

Earmersion 视觉升级引入的动画效果，用于治疗状态反馈和 AI 交互。

| 语义名称 | Tailwind 类 | 使用场景 |
|----------|-------------|----------|
| 脉冲 | `animate-pulse` | AI 就绪状态灯、治疗播放中的呼吸效果 |
| 旋转 | `animate-spin` | AI 加载中、数据请求中 |
| 弹跳 | `animate-bounce` | 新消息提示、紧急状态 |
| 淡入上移 | 自定义 `animate-fade-up` | 阶段切换时内容进场（需在 tailwind.config 中注册） |

自定义动画注册（tailwind.config.ts）：
```ts
keyframes: {
  'fade-up': {
    from: { opacity: '0', transform: 'translateY(16px)' },
    to: { opacity: '1', transform: 'translateY(0)' },
  },
},
animation: {
  'fade-up': 'fade-up 0.5s ease-out',
},
```

使用规范：
- 动画仅用于状态反馈，不用于纯装饰
- AI 加载态统一使用 `animate-spin`
- 治疗播放中的脉冲效果使用 `animate-pulse`
- 阶段切换进场使用 `animate-fade-up`
- 禁止使用自定义 `@keyframes`（除上述已注册的 `fade-up`）

---

⬅️ [上一节：圆角（Border Radius）](./border-radius.md) | [返回目录](./index.md) | [下一节：断点（Breakpoints）](./breakpoints.md) ➡️
