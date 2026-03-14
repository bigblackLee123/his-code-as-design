# 实施计划：前后端集成（Mock → Supabase）

## 概述

按照服务适配器模式，在 `src/services/supabase/` 目录下逐步实现 Supabase 服务层，替换现有 Mock 服务。实施顺序遵循数据流依赖：基础设施 → 映射器 → 辅助模块 → 服务适配器（分诊 → 医生 → 治疗） → 实时订阅 → 服务路由。

## Tasks

- [x] 1. 搭建 Supabase 服务基础设施
  - [x] 1.1 创建 Supabase 客户端单例 `src/services/supabase/client.ts`
    - 从 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 读取配置
    - 使用 `Database` 类型参数化 `createClient`
    - 缺少环境变量时抛出描述性错误
    - _需求: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.2 创建错误处理辅助 `src/services/supabase/errorHelper.ts`
    - 实现 `throwIfError(error, context)` 函数
    - 错误信息包含表名、操作类型和原始消息
    - _需求: 15.1, 15.3, 15.4_

  - [x] 1.3 创建 Consultation 辅助 `src/services/supabase/consultationHelper.ts`
    - 实现 `create(patientId)` — 插入 `in-progress` 状态记录
    - 实现 `getActiveId(patientId)` — 查询最近活跃 Consultation，无结果时抛错
    - 实现 `complete(consultationId)` — 更新状态为 `completed`
    - _需求: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 2. 实现字段映射器
  - [x] 2.1 创建 `src/services/supabase/mappers.ts` — 实体映射函数
    - 实现 `toPatient` / `fromPatientCreate`（Patient 双向映射）
    - 实现 `toVitalSigns` / `fromVitalSigns`（VitalSigns 双向映射，含 stage 参数）
    - 实现 `toContraindication`（Contraindication 映射）
    - 实现 `toScaleTemplate` / `toScaleQuestion`（ScaleTemplate 含关联题目映射）
    - 实现 `toScaleResult` / `fromScaleResult`（ScaleResult 双向映射，含 stage 参数）
    - 实现 `toQueueItem`（QueueItem 映射，含 JOIN 的 patients 字段）
    - 实现 `fromPrescription`（PrescriptionData → Supabase 插入格式）
    - 实现 `toTherapyProject` / `toTherapyPackage`（疗愈套餐映射）
    - 实现 `toAISuggestion`（AISuggestion 映射）
    - _需求: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 2.11, 2.12_

  - [ ]* 2.2 编写 Mapper 往返一致性属性测试
    - **属性 1: Patient 往返一致性** — `toPatient(fromPatientCreate(data))` 产生等价对象
    - **属性 2: VitalSigns 往返一致性** — `toVitalSigns(fromVitalSigns(data))` 产生等价对象
    - **属性 3: ScaleResult 往返一致性** — `toScaleResult(fromScaleResult(data))` 产生等价对象
    - **验证: 需求 2.13**

- [x] 3. 检查点 — 基础设施与映射器
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 4. 实现分诊终端相关服务适配器
  - [x] 4.1 创建 `src/services/supabase/patientService.ts`
    - 实现 `getById(patientId)` — 查询 `patients` 表，通过 Mapper 返回 `Patient | null`
    - 实现 `getByInsuranceCard(cardNo)` — 按 `insurance_card_no` 查询
    - 实现 `create(data)` — 插入 `patients` 记录（状态 `checked-in`）+ 自动创建 Consultation
    - 实现 `saveVitalSigns(patientId, vitals)` — 获取活跃 Consultation，插入 `vital_signs`（stage=pre-treatment）
    - 实现 `getVitalSigns(patientId)` — 查询最近一次生理数据
    - 所有操作使用 `throwIfError` 统一错误处理
    - _需求: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1, 14.1_

  - [x] 4.2 创建 `src/services/supabase/queueService.ts` — 候诊队列部分
    - 实现 `getWaitingQueue(departmentId)` — 查询 `queue_items`（queue_type=waiting, status=waiting），JOIN `patients` 获取姓名和医保卡号
    - 实现 `enqueueWaiting(patientId, departmentId)` — 插入候诊记录（queue_number 为当前最大值+1），更新患者状态为 `waiting`，队列满 20 条时拒绝
    - 实现 `callNextWaiting(departmentId)` — 取 queue_number 最小的 waiting 记录更新为 in-progress，更新患者状态为 `consulting`
    - _需求: 6.1, 6.2, 6.3, 6.8, 14.2, 14.3_

  - [ ]* 4.3 编写 patientService 单元测试
    - 测试 `create` 自动创建 Consultation 的行为
    - 测试 `saveVitalSigns` 关联活跃 Consultation
    - 测试无活跃 Consultation 时抛出错误
    - _需求: 4.3, 4.4, 5.1, 5.5_

- [x] 5. 实现医生终端相关服务适配器
  - [x] 5.1 创建 `src/services/supabase/contraindicationService.ts`
    - 实现 `search(keyword)` — 空关键字返回空数组；非空时按 name/pinyin/pinyin_initial 模糊搜索（ilike），通过 Mapper 返回 `Contraindication[]`
    - _需求: 7.1, 7.2, 7.3_

  - [x] 5.2 创建 `src/services/supabase/scaleService.ts`
    - 实现 `getTemplates()` — 查询所有量表模板
    - 实现 `getTemplate(templateId)` — 查询模板 + 关联 `scale_questions`（按 sort_order 排序），模板不存在时抛错
    - 实现 `saveResult(patientId, result)` — 获取活跃 Consultation，插入 `scale_results`
    - _需求: 8.1, 8.2, 8.3, 8.4_

  - [x] 5.3 创建 `src/services/supabase/aiService.ts`
    - 实现 `getTherapySuggestion(data)` — 调用 Supabase Edge Function，转换返回结果为 `AITherapySuggestion`，同时写入 `ai_suggestions` 表关联活跃 Consultation
    - Edge Function 调用失败时抛出包含错误原因的 Error
    - _需求: 10.1, 10.2, 10.3, 10.4_

  - [x] 5.4 创建 `src/services/supabase/prescriptionService.ts`
    - 实现 `save(patientId, prescription)` — 获取活跃 Consultation，通过 Mapper 转换 `PrescriptionData`，插入 `prescriptions` 表（meta/herbs 为 JSON，total_amount 为数值）
    - _需求: 9.1, 9.2, 9.3, 9.4, 9.5_

  - [ ]* 5.5 编写 contraindicationService 和 scaleService 单元测试
    - 测试空关键字搜索返回空数组
    - 测试量表模板不存在时抛出正确错误信息
    - _需求: 7.2, 8.4_

- [x] 6. 检查点 — 分诊与医生终端服务
  - 确保所有测试通过，如有疑问请向用户确认。

- [x] 7. 实现治疗终端相关服务适配器
  - [x] 7.1 创建 `src/services/supabase/therapyService.ts`
    - 实现 `getPackages()` — 查询 `therapy_packages`，关联 `therapy_package_items` + `therapy_projects`，按 sort_order 排序
    - 实现 `getPackageById(id)` — 按 ID 查询套餐（含关联项目），返回 `TherapyPackage | null`
    - 实现 `matchBySymptoms(symptoms)` — 查询 `matched_symptoms` 包含任一症状关键词的套餐
    - _需求: 11.1, 11.2, 11.3, 11.4_

  - [x] 7.2 扩展 `queueService.ts` — 治疗队列与治疗记录
    - 实现 `getTreatmentQueue()` — 查询治疗队列（queue_type=treatment, status=waiting）
    - 实现 `enqueueTreatment(patientId)` — 插入治疗队列记录，更新患者状态为 `pending-treatment`
    - 实现 `callNextTreatment()` — 治疗叫号，更新患者状态为 `treating`，同时向 `treatment_records` 插入 start_time
    - 实现 `completeTreatment(queueItemId)` — 更新队列状态为 completed，更新 `treatment_records` 的 end_time 和 duration，更新患者状态为 `completed`，完成 Consultation
    - _需求: 6.4, 6.5, 6.6, 6.7, 13.1, 13.2, 13.5, 14.4, 14.5, 14.6_

  - [x] 7.3 扩展 `patientService.ts` 和 `scaleService.ts` — 治疗后数据采集
    - `saveVitalSigns` 支持 stage 参数传递 `post-treatment`
    - `saveResult` 支持 stage 参数传递 `post`
    - _需求: 13.3, 13.4_

  - [ ]* 7.4 编写治疗流程单元测试
    - 测试 `completeTreatment` 同时更新患者状态和 Consultation 状态
    - 测试候诊队列满 20 条时拒绝入队
    - _需求: 6.8, 13.5_

- [x] 8. 实现实时队列订阅
  - [x] 8.1 创建 `src/hooks/useQueueRealtime.ts`
    - 实现 `useQueueRealtime(callback)` Hook
    - 订阅 `queue_items` 表的 INSERT/UPDATE/DELETE 事件
    - 通过 Mapper 转换变更数据为 `QueueItem` 类型
    - 组件卸载时自动取消订阅释放资源
    - _需求: 12.1, 12.2, 12.3, 12.4, 12.5_

- [x] 9. 服务路由与统一导出
  - [x] 9.1 创建 `src/services/supabase/index.ts` — 统一导出 7 个 Supabase 服务
    - 导出 patientService、queueService、prescriptionService、scaleService、contraindicationService、aiService、therapyService
    - _需求: 3.3, 3.4_

  - [x] 9.2 创建 `src/services/index.ts` — 服务路由
    - 根据 `VITE_USE_MOCK` 环境变量动态导入 Mock 或 Supabase 服务
    - `VITE_USE_MOCK=true` 导出 Mock 实现，否则导出 Supabase 实现
    - 使用动态 `import()` 实现 tree-shaking
    - _需求: 3.1, 3.2, 3.3_

- [x] 10. 最终检查点 — 全量验证
  - 确保所有测试通过，如有疑问请向用户确认。
  - 验证 `VITE_USE_MOCK=true` 和 `VITE_USE_MOCK=false` 两种模式下服务均可正常导出
  - 验证患者状态流转完整链路：checked-in → waiting → consulting → pending-treatment → treating → completed

## 备注

- 标记 `*` 的子任务为可选，可跳过以加速 MVP 交付
- 每个任务引用了具体需求编号以确保可追溯性
- 检查点用于阶段性验证，确保增量集成的正确性
- 属性测试验证 Mapper 的往返一致性（需求 2.13）
- 实施顺序遵循数据流依赖：基础设施 → 分诊 → 医生 → 治疗 → 实时 → 路由
