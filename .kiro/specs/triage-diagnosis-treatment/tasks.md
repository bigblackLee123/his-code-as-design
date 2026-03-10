# 实施计划：分诊-诊疗-治疗全流程系统

## 概述

采用 UI 优先开发策略，先构建共享基础层和 Mock 数据服务，再逐终端构建页面 UI（使用 Mock 数据），最后集成路由。所有页面遵循 HIS 积木式组件架构，复用已有的 PrescriptionForm、HerbGrid、ActionBar、PatientInfoBar、MaskedText 等组件。

## 任务

- [x] 1. 共享基础层：类型定义、Mock 数据服务、工具函数
  - [x] 1.1 创建核心类型定义文件 `src/services/types.ts`
    - 定义 Patient、VitalSigns、Contraindication、ScaleTemplate、ScaleQuestion、ScaleOption、ScaleResult、AISuggestion、AISuggestedHerb、QueueItem、TreatmentRecord、ConsultationData、TreatmentPatient、PrescriptionData、TreatmentState 等全部接口和类型
    - 定义 PatientStatus 联合类型、VITAL_SIGNS_RULES 和 VITAL_SIGNS_ALERT_THRESHOLDS 常量
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.7, 6.1, 7.1, 8.1, 12.2, 13.4, 17.4_

  - [x] 1.2 创建 Mock 静态数据文件
    - 创建 `src/services/mock/data/patients.ts`：5-8 条模拟患者数据
    - 创建 `src/services/mock/data/contraindications.ts`：15-20 条禁忌症字典数据（含拼音、首字母）
    - 创建 `src/services/mock/data/scaleTemplates.ts`：2 个量表模板（含单选、多选、滑块、文本题目）
    - _需求: 1.2, 6.1, 6.3, 7.1, 7.2_

  - [x] 1.3 创建 Mock 数据服务层
    - 创建 `src/services/mock/patientService.ts`：getByInsuranceCard、create、saveVitalSigns
    - 创建 `src/services/mock/queueService.ts`：getWaitingQueue、enqueueWaiting、callNextWaiting、getTreatmentQueue、enqueueTreatment、callNextTreatment、completeTreatment、getMaxQueueSize
    - 创建 `src/services/mock/contraindicationService.ts`：search（支持拼音首字母和汉字模糊匹配）
    - 创建 `src/services/mock/scaleService.ts`：getTemplates、getTemplate、saveResult
    - 创建 `src/services/mock/aiService.ts`：getSuggestion（模拟延迟返回）
    - 创建 `src/services/mock/prescriptionService.ts`：save
    - 创建 `src/services/mock/index.ts`：统一导出所有服务
    - _需求: 1.1, 1.2, 1.4, 3.2, 3.4, 4.2, 6.2, 6.3, 7.5, 8.1, 8.4, 10.2, 11.2, 16.2_

  - [x] 1.4 创建生理数据校验工具函数 `src/lib/vitalSignsValidation.ts`
    - 实现 validateVitalSigns：范围校验（收缩压 40-300、舒张压 20-200、心率 20-300）
    - 实现 hasVitalSignsAlert：异常阈值判断（收缩压>180、舒张压>120、心率>150）
    - 实现 calculateVitalSignsChange：治疗前后变化百分比计算
    - _需求: 2.2, 2.3, 2.4, 2.5, 2.7, 5.4, 14.2, 14.5_

  - [ ]* 1.5 为生理数据校验工具编写单元测试
    - 测试 validateVitalSigns 的边界值和无效输入
    - 测试 hasVitalSignsAlert 的阈值判断
    - 测试 calculateVitalSignsChange 的变化百分比计算
    - _需求: 2.2, 2.3, 2.4, 2.7, 14.5_


- [x] 2. 检查点 - 共享基础层验证
  - 确保所有类型定义无 TypeScript 编译错误，Mock 服务可正常导入调用，生理数据校验工具测试通过。如有疑问请询问用户。

- [x] 3. 分诊终端 UI（Mock 数据）
  - [x] 3.1 创建 PatientCheckIn Block `src/pages/triage-terminal/blocks/PatientCheckIn.tsx`
    - 实现刷卡签到按钮触发模拟读卡
    - 实现手动输入患者信息的备选表单（姓名、医保卡号、身份证号、手机号、性别、年龄）
    - 使用 MaskedText 脱敏展示患者姓名、身份证号、联系电话
    - 签到成功后通过 onCheckInComplete 回调传递 Patient 对象
    - 刷卡失败时显示错误提示并切换到手动输入模式
    - _需求: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

  - [x] 3.2 创建 VitalSignsInput Block `src/pages/triage-terminal/blocks/VitalSignsInput.tsx`
    - 实现收缩压、舒张压、心率三个必填输入字段
    - 集成 vitalSignsValidation 工具进行实时范围校验
    - 超出范围时在字段下方显示具体范围提示
    - 异常值（收缩压>180、舒张压>120、心率>150）以错误色高亮显示警告标识
    - 校验通过后通过 onSave 回调传递 VitalSigns 对象
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [x] 3.3 创建 QueueAssignment Block `src/pages/triage-terminal/blocks/QueueAssignment.tsx`
    - 显示目标科室和预估等待人数
    - 确认分配后调用 queueService.enqueueWaiting 入队
    - 显示排队序号和等待人数
    - 队列已满时显示提示并阻止分配
    - 通过 onComplete 回调通知页面入口重置流程
    - _需求: 3.1, 3.2, 3.3, 3.4_

  - [x] 3.4 创建分诊终端页面入口 `src/pages/triage-terminal/TriageTerminalPage.tsx`
    - 实现 checkin → vitals → queue 三步骤状态机
    - 组合 PatientCheckIn、VitalSignsInput、QueueAssignment 三个 Block
    - 通过 props 传递 patient 和 vitalSigns 数据
    - _需求: 17.1, 17.4, 17.5_

  - [ ]* 3.5 为分诊终端 Block 编写单元测试
    - 测试 PatientCheckIn 的刷卡成功/失败流程
    - 测试 VitalSignsInput 的校验和异常高亮逻辑
    - 测试 QueueAssignment 的队列满阻止逻辑
    - _需求: 1.5, 2.5, 2.7, 3.4_

- [x] 4. 检查点 - 分诊终端 UI 验证
  - 确保分诊终端三个 Block 可独立渲染，步骤流转正常，Mock 数据交互正确。如有疑问请询问用户。

- [x] 5. 医生终端 UI（Mock 数据）
  - [x] 5.1 创建 CallQueue Block `src/pages/doctor-terminal/blocks/CallQueue.tsx`
    - 显示候诊队列列表（排队序号、患者姓名脱敏、等待时长）
    - 叫号按钮调用 queueService.callNextWaiting
    - 正在接诊时禁用叫号按钮（通过 disabled prop 控制）
    - 队列为空时显示「暂无候诊患者」空状态
    - 使用 MaskedText 脱敏展示患者姓名
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 5.2 创建 PatientInfoBar Block `src/pages/doctor-terminal/blocks/PatientInfoBar.tsx`
    - 扩展已有的 PatientInfoBar 组件，增加 Vital_Signs 数据展示区域
    - 使用 MaskedText 脱敏展示患者姓名、身份证号、联系电话
    - 异常生理数据以错误色高亮并附带警告图标
    - _需求: 5.1, 5.2, 5.3, 5.4_

  - [x] 5.3 创建 ContraindicationInput Block `src/pages/doctor-terminal/blocks/ContraindicationInput.tsx`
    - 实现禁忌症搜索输入框，200ms 内从字典检索匹配结果
    - 支持拼音首字母和汉字模糊检索
    - 下拉列表展示匹配结果，选择后添加到已选列表
    - 已选禁忌症以 Badge 标签形式展示，支持移除
    - 通过 onChange 回调传递已选禁忌症数组
    - _需求: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [x] 5.4 创建 ScaleForm Block `src/pages/doctor-terminal/blocks/ScaleForm.tsx`
    - 实现量表模板选择下拉
    - 根据模板动态渲染题目（单选 RadioGroup、多选 Checkbox、数值滑块 Slider、文本输入 Input）
    - 必填题目校验，未填写时高亮并滚动到第一个未填写题目
    - 全部必填完成后启用提交按钮
    - 通过 onSubmit 回调传递 ScaleResult
    - _需求: 7.1, 7.2, 7.3, 7.4, 7.5_

  - [x] 5.5 创建 AISuggestionPanel Block `src/pages/doctor-terminal/blocks/AISuggestionPanel.tsx`
    - 获取 AI 建议按钮，调用 aiService.getSuggestion
    - 请求中显示加载状态指示器
    - 返回后展示建议药材列表、剂量和用法说明
    - 请求失败或超时（30秒）显示错误提示和重试按钮
    - 采纳建议按钮，通过 onAdopt 回调传递 AISuggestion
    - _需求: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_

  - [x] 5.6 创建 StatusTransition Block `src/pages/doctor-terminal/blocks/StatusTransition.tsx`
    - 显示状态流转确认界面（患者信息摘要、处方摘要）
    - 确认后调用 queueService.enqueueTreatment 将患者加入治疗队列
    - 显示流转成功提示和治疗队列排队序号
    - 网络错误时显示错误提示并允许重试
    - 流转完成后通过 onComplete 回调重置页面状态
    - _需求: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 5.7 创建医生终端页面入口 `src/pages/doctor-terminal/DoctorTerminalPage.tsx`
    - 左侧叫号面板 + 右侧诊疗工作区布局
    - 组合 CallQueue、PatientInfoBar、ContraindicationInput、ScaleForm、AISuggestionPanel、PrescriptionForm（已有）、HerbGrid（已有）、ActionBar（已有）、StatusTransition
    - 管理 currentPatient 和 consultationData 状态
    - AI 采纳建议后预填 PrescriptionForm 和 HerbGrid
    - 处方提交后触发 StatusTransition 流转
    - _需求: 9.1, 9.2, 9.3, 9.4, 9.5, 17.2, 17.4, 17.5_

  - [ ]* 5.8 为医生终端 Block 编写单元测试
    - 测试 CallQueue 的叫号和禁用逻辑
    - 测试 ContraindicationInput 的搜索和选择/移除流程
    - 测试 ScaleForm 的必填校验和动态渲染
    - 测试 AISuggestionPanel 的加载/错误/重试状态
    - _需求: 4.4, 6.2, 7.4, 8.4_

- [x] 6. 检查点 - 医生终端 UI 验证
  - 确保医生终端所有 Block 可独立渲染，叫号→问诊→开方→流转全流程 Mock 数据交互正确。如有疑问请询问用户。


- [x] 7. 治疗终端 UI（Mock 数据）
  - [x] 7.1 创建 TreatmentQueue Block `src/pages/treatment-terminal/blocks/TreatmentQueue.tsx`
    - 显示治疗队列列表（排队序号、患者姓名脱敏、处方类型、等待时长）
    - 叫号按钮调用 queueService.callNextTreatment
    - 正在治疗时禁用叫号按钮（通过 disabled prop 控制）
    - 队列为空时显示「暂无待治疗患者」空状态
    - 使用 MaskedText 脱敏展示患者姓名
    - _需求: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 7.2 创建 TreatmentPatientView Block `src/pages/treatment-terminal/blocks/TreatmentPatientView.tsx`
    - 分区展示患者基本信息、分诊生理数据、禁忌症列表、处方明细
    - 使用 MaskedText 脱敏展示患者姓名、身份证号、联系电话
    - 处方中特殊用法说明以警告色高亮显示
    - _需求: 12.1, 12.2, 12.3, 12.4_

  - [x] 7.3 创建 TreatmentAction Block `src/pages/treatment-terminal/blocks/TreatmentAction.tsx`
    - 开始治疗按钮，点击后记录开始时间并通过 onStart 回调通知
    - 治疗中显示实时计时器（显示已治疗时长）
    - 结束治疗按钮，点击后记录结束时间并通过 onEnd 回调通知
    - 未开始治疗时禁用结束治疗按钮
    - _需求: 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 7.4 创建 PostVitalSigns Block `src/pages/treatment-terminal/blocks/PostVitalSigns.tsx`
    - 治疗后生理数据录入表单（收缩压、舒张压、心率），校验规则与分诊终端一致
    - 并排展示治疗前生理数据用于对比
    - 集成 vitalSignsValidation 工具进行校验
    - 变化超过 20% 时以警告色标注变化幅度
    - 通过 onSave 回调传递治疗后 VitalSigns
    - _需求: 14.1, 14.2, 14.3, 14.4, 14.5_

  - [x] 7.5 创建 PostScaleForm Block `src/pages/treatment-terminal/blocks/PostScaleForm.tsx`
    - 复用与医生终端 ScaleForm 相同的量表渲染逻辑（单选、多选、滑块、文本）
    - 必填校验，未填写时高亮并滚动到第一个未填写题目
    - 全部必填完成后启用提交按钮
    - 通过 onSubmit 回调传递 ScaleResult
    - _需求: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 7.6 创建 QueueComplete Block `src/pages/treatment-terminal/blocks/QueueComplete.tsx`
    - 显示出队确认界面（治疗时长、治疗前后生理数据对比摘要）
    - 确认出队后调用 queueService.completeTreatment
    - 网络错误时显示错误提示并允许重试
    - 通过 onComplete 回调重置页面状态并重新启用叫号
    - _需求: 16.1, 16.2, 16.3, 16.4_

  - [x] 7.7 创建治疗终端页面入口 `src/pages/treatment-terminal/TreatmentTerminalPage.tsx`
    - 左侧叫号面板 + 右侧治疗工作区布局
    - 组合 TreatmentQueue、TreatmentPatientView、TreatmentAction、PostVitalSigns、PostScaleForm、QueueComplete
    - 管理 currentPatient 和 treatmentState 状态机（idle → treating → post-vitals → post-scale → completing）
    - 根据 treatmentState.status 条件渲染对应 Block
    - _需求: 17.3, 17.4, 17.5, 17.6_

  - [ ]* 7.8 为治疗终端 Block 编写单元测试
    - 测试 TreatmentAction 的计时器和按钮禁用逻辑
    - 测试 PostVitalSigns 的前后对比和变化幅度警告
    - 测试 QueueComplete 的出队和错误重试流程
    - _需求: 13.5, 14.5, 16.4_

- [x] 8. 检查点 - 治疗终端 UI 验证
  - 确保治疗终端所有 Block 可独立渲染，叫号→治疗→评估→出队全流程 Mock 数据交互正确。如有疑问请询问用户。

- [x] 9. 路由集成与页面串联
  - [x] 9.1 配置三终端路由
    - 在 `src/App.tsx` 中添加分诊终端、医生终端、治疗终端的路由配置
    - 路由路径：`/triage`、`/doctor`、`/treatment`
    - _需求: 17.4_

  - [x] 9.2 更新导航菜单
    - 在 Sidebar 或导航组件中添加三个终端的入口链接
    - _需求: 17.4_

- [x] 10. 最终检查点 - 全流程验证
  - 确保三个终端页面可通过路由正常访问，各终端内部流程完整，Mock 数据在三终端间通过队列机制正确串联。如有疑问请询问用户。

## 备注

- 标记 `*` 的任务为可选任务，可跳过以加速 MVP 开发
- 每个任务引用了对应的需求编号，确保需求可追溯
- 检查点任务用于阶段性验证，确保增量开发质量
- Supabase 后端集成不在本次 Spec 范围内，后续通过替换 `src/services/mock/` 为 `src/services/supabase/` 实现切换
- 已有组件（PrescriptionForm、HerbGrid、ActionBar、PatientInfoBar、MaskedText）直接复用，不重复创建
