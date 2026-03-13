---
inclusion: manual
---

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

---

⬅️ [分诊终端测试](./triage-terminal.md) | [返回目录](./index.md) | [治疗终端测试](./treatment-terminal.md) ➡️
