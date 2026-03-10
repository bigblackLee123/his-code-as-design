---
inclusion: manual
---

# HIS 视觉测试流程指南

本文档指导 AI 使用 Chrome DevTools MCP 对三终端页面执行完整的交互式视觉测试。

## 前置条件

1. Chrome DevTools MCP 已配置（`.kiro/settings/mcp.json`）
2. 开发服务器已启动（`npx vite`），记录实际端口号
3. 通过 `mcp_chrome_devtools_list_pages` 确认 MCP 连接正常

## 测试流程

### 第一阶段：分诊终端 `/triage`

**步骤 1：签到**
- 导航到 `/triage`
- 截图：初始状态（签到按钮）
- 点击「刷医保卡签到」
- `wait_for` 等待「签到成功」出现
- 截图：签到成功状态
- 验证：患者姓名显示为 `张**`（脱敏），身份证 `110***********1234`，电话 `138****5678`
- 点击「确认签到」

**步骤 2：生理数据采集**
- `wait_for` 等待「收缩压」出现
- 使用 `fill_form` 填入：收缩压=135, 舒张压=85, 心率=78
- 截图：填写后状态
- 点击「保存生理数据」

**步骤 3：队列分配**
- `wait_for` 等待「候诊队列分配」出现
- 截图：分配确认界面（显示患者摘要和预估等待人数）
- 点击「确认分配」
- `wait_for` 等待「分配成功」出现
- 截图：分配成功状态（显示排队序号）

### 第二阶段：医生终端 `/doctor`

**数据准备（Mock 队列注入）**

医生终端的叫号队列依赖分诊终端写入的数据。跨页面导航后内存状态会丢失，需通过 `evaluate_script` 注入 mock 数据：

```javascript
() => {
  const { queueService } = window.__mockServices || {};
  // 如果 mock 服务未挂载到 window，需要通过模块导入
  // 以下为直接操作内存队列的方式：
  const mod = import('/src/services/mock/queueService.ts');
  return mod.then(m => {
    m.queueService.enqueueWaiting({
      patientId: 'P001',
      departmentId: 'DEPT001',
      priority: 'normal'
    });
    m.queueService.enqueueWaiting({
      patientId: 'P002',
      departmentId: 'DEPT001',
      priority: 'normal'
    });
    m.queueService.enqueueWaiting({
      patientId: 'P003',
      departmentId: 'DEPT001',
      priority: 'urgent'
    });
    return 'OK: 3 patients enqueued';
  });
}
```

> 注意：医生终端 CallQueue 组件使用硬编码的 `DEPARTMENT_ID = "DEPT001"` 查询队列。

**步骤 1：叫号**
- 导航到 `/doctor`
- 执行上述 `evaluate_script` 注入队列数据
- 截图：队列列表（应显示 3 名候诊患者）
- 点击「叫号」按钮
- `wait_for` 等待患者信息栏出现

**步骤 2：验证完整工作区**
- 截图：完整工作区
- 验证以下 Block 均已渲染：
  - PatientInfoBar：患者信息栏（姓名脱敏 `张**`）
  - ContraindicationInput：禁忌症搜索
  - ScaleForm：量表评估表单
  - AISuggestionPanel：AI 辅助建议面板
  - StatusTransition：状态流转按钮

**步骤 3：量表填写（可选）**
- 在 ScaleForm 中填写量表问题
- 验证 AI 建议面板是否根据量表结果更新

### 第三阶段：治疗终端 `/treatment`

**数据准备（Mock 治疗队列注入）**

治疗终端依赖医生终端开立的治疗医嘱。同样需要通过 `evaluate_script` 注入：

```javascript
() => {
  return import('/src/services/mock/queueService.ts').then(m => {
    m.queueService.enqueueTreatment({
      patientId: 'P001',
      treatmentType: 'acupuncture',
      doctorName: '李医生'
    });
    m.queueService.enqueueTreatment({
      patientId: 'P002',
      treatmentType: 'tuina',
      doctorName: '王医生'
    });
    return 'OK: 2 patients enqueued for treatment';
  });
}
```

**步骤 1：叫号**
- 导航到 `/treatment`
- 执行上述 `evaluate_script` 注入治疗队列
- 截图：治疗队列列表
- 点击「叫号」
- `wait_for` 等待患者视图出现

**步骤 2：治疗流程**
- 截图：患者治疗视图（TreatmentPatientView + TreatmentAction）
- 点击「开始治疗」
- 截图：计时器运行中状态
- 等待几秒后点击「结束治疗」
- `wait_for` 等待「治疗后生理数据」出现

**步骤 3：治疗后数据采集**
- 截图：治疗后生理数据表单（PostVitalSigns）
- 使用 `fill_form` 填入：收缩压=125, 舒张压=80, 心率=72
- 截图：填写后状态（应显示与治疗前的变化百分比）
- 验证变化百分比计算正确
- 点击保存

**步骤 4：治疗后量表（可选）**
- 如果出现 PostScaleForm，填写量表
- 验证治疗前后量表对比

**步骤 5：完成**
- `wait_for` 等待 QueueComplete 出现
- 截图：治疗完成状态

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

## 验证清单

| 检查项 | 终端 | 预期结果 |
|--------|------|----------|
| 医保卡签到 | 分诊 | 显示脱敏患者信息 |
| 生理数据校验 | 分诊 | 异常值显示警告色 |
| 队列分配 | 分诊 | 显示排队序号 |
| 叫号队列 | 医生 | 显示候诊患者列表 |
| 患者信息脱敏 | 医生 | 姓名/身份证/电话脱敏 |
| 量表评估 | 医生 | 表单可填写，AI 建议更新 |
| 治疗计时器 | 治疗 | 开始/结束治疗，时间记录 |
| 治疗后对比 | 治疗 | 生理数据变化百分比正确 |
| 1920×1080 布局 | 全部 | 完整无溢出 |
| 1366×768 布局 | 全部 | 紧凑但完整 |
| 1280×1024 布局 | 全部 | 4:3 比例适配正常 |

## 关键技术备注

- Mock 数据存储在模块级内存中，页面刷新或路由导航会导致状态丢失
- 跨终端测试时必须通过 `evaluate_script` 重新注入队列数据
- 医生终端 CallQueue 硬编码 `DEPARTMENT_ID = "DEPT001"`
- 截图统一保存到 `doc/screenshots/` 目录
- 开发服务器端口可能变化（5173-5176），以实际启动端口为准
