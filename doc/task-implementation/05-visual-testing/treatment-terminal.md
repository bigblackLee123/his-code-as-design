---
inclusion: manual
---

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

---

⬅️ [医生终端测试](./doctor-terminal.md) | [返回目录](./index.md) | [多分辨率测试](./multi-resolution.md) ➡️
