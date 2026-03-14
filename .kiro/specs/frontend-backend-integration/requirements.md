# 需求文档：前后端集成（Mock → Supabase）

## 简介

将"曙光"HIS 系统前端从 Mock 服务切换到 Supabase 后端。当前前端 3 个终端页面（分诊、医生、治疗）使用 7 个内存 Mock 服务；本需求将逐一替换为 Supabase 实现，保持现有服务接口不变，通过环境变量 `VITE_USE_MOCK` 在 Mock 与 Supabase 之间切换。

## 术语表

- **Service_Adapter**：服务适配器，实现与 Mock 服务相同的接口，内部调用 Supabase Client
- **Supabase_Client**：Supabase JavaScript 客户端单例，负责与 Supabase 后端通信
- **Mapper**：字段映射器，负责 snake_case（数据库）与 camelCase（前端）之间的双向转换
- **Service_Router**：服务路由模块，根据 `VITE_USE_MOCK` 环境变量决定导出 Mock 或 Supabase 服务实现
- **Realtime_Subscription**：Supabase 实时订阅，监听数据库表变更并推送到前端
- **Consultation**：诊疗会话，后端 `consultations` 表记录，贯穿患者从候诊到治疗完成的全流程
- **Edge_Function**：Supabase Edge Function，用于执行 AI 处方建议等服务端逻辑
- **分诊终端**：Triage Terminal，负责患者签到、生理数据采集、入队候诊
- **医生终端**：Doctor Terminal，负责叫号、禁忌症录入、量表评估、AI 建议、开具处方
- **治疗终端**：Treatment Terminal，负责治疗叫号、治疗执行、治疗后评估


## 需求

### 需求 1：Supabase 客户端初始化

**用户故事：** 作为开发者，我希望有一个统一的 Supabase 客户端单例，以便所有服务适配器共享同一连接实例。

#### 验收标准

1. THE Supabase_Client SHALL 从环境变量 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 读取连接配置
2. THE Supabase_Client SHALL 在整个应用生命周期内保持单例
3. THE Supabase_Client SHALL 使用 `src/types/supabase.ts` 中的 `Database` 类型进行类型参数化
4. IF 环境变量 `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_ANON_KEY` 缺失，THEN THE Supabase_Client SHALL 在初始化时抛出描述性错误信息


### 需求 2：字段映射器（snake_case ↔ camelCase）

**用户故事：** 作为开发者，我希望有统一的字段映射层，以便 Supabase 数据库的 snake_case 字段与前端 camelCase 类型之间自动转换。

#### 验收标准

1. THE Mapper SHALL 将 Supabase `patients` 行转换为前端 `Patient` 类型
2. THE Mapper SHALL 将 Supabase `vital_signs` 行转换为前端 `VitalSigns` 类型
3. THE Mapper SHALL 将 Supabase `contraindications` 行转换为前端 `Contraindication` 类型
4. THE Mapper SHALL 将 Supabase `scale_templates` 行（含关联 `scale_questions`）转换为前端 `ScaleTemplate` 类型
5. THE Mapper SHALL 将 Supabase `scale_results` 行转换为前端 `ScaleResult` 类型
6. THE Mapper SHALL 将 Supabase `queue_items` 行（含关联 `patients` 姓名和医保卡号）转换为前端 `QueueItem` 类型
7. THE Mapper SHALL 将 Supabase `ai_suggestions` 行转换为前端 `AISuggestion` 类型
8. THE Mapper SHALL 将 Supabase `therapy_projects` 行转换为前端 `TherapyProject` 类型
9. THE Mapper SHALL 将 Supabase `therapy_packages` 行（含关联 `therapy_package_items` 和 `therapy_projects`）转换为前端 `TherapyPackage` 类型
10. THE Mapper SHALL 将前端 `PrescriptionData` 转换为 Supabase `prescriptions` 插入格式
11. THE Mapper SHALL 将前端 `ScaleResult` 转换为 Supabase `scale_results` 插入格式
12. THE Mapper SHALL 将前端 `VitalSigns` 转换为 Supabase `vital_signs` 插入格式
13. FOR ALL 支持的类型，将 Supabase 行映射为前端类型再映射回 Supabase 行 SHALL 产生等价对象（往返一致性）


### 需求 3：服务路由与环境切换

**用户故事：** 作为开发者，我希望通过环境变量在 Mock 服务和 Supabase 服务之间切换，以便在开发和集成测试阶段灵活选择数据源。

#### 验收标准

1. WHEN 环境变量 `VITE_USE_MOCK` 值为 `"true"` 时，THE Service_Router SHALL 导出 Mock 服务实现
2. WHEN 环境变量 `VITE_USE_MOCK` 值为 `"false"` 或未设置时，THE Service_Router SHALL 导出 Supabase 服务实现
3. THE Service_Router SHALL 导出与当前 `src/services/mock/index.ts` 相同的 7 个服务名称：patientService、queueService、prescriptionService、scaleService、contraindicationService、aiService、therapyService
4. THE Service_Router SHALL 保证 Supabase 服务实现与 Mock 服务实现具有相同的方法签名和返回类型


### 需求 4：患者服务适配器（patientService）

**用户故事：** 作为分诊护士，我希望患者签到和生理数据采集的数据持久化到 Supabase，以便后续终端能读取真实数据。

#### 验收标准

1. WHEN 调用 `getById(patientId)` 时，THE Service_Adapter SHALL 从 Supabase `patients` 表查询并返回 `Patient` 类型或 `null`
2. WHEN 调用 `getByInsuranceCard(cardNo)` 时，THE Service_Adapter SHALL 从 Supabase `patients` 表按 `insurance_card_no` 字段查询并返回 `Patient` 类型或 `null`
3. WHEN 调用 `create(data)` 时，THE Service_Adapter SHALL 向 Supabase `patients` 表插入记录，初始状态为 `checked-in`，并返回完整 `Patient` 对象
4. WHEN 调用 `saveVitalSigns(patientId, vitals)` 时，THE Service_Adapter SHALL 查找该患者当前活跃 Consultation，向 Supabase `vital_signs` 表插入记录，stage 设为 `pre-treatment`
5. WHEN 调用 `getVitalSigns(patientId)` 时，THE Service_Adapter SHALL 从 Supabase `vital_signs` 表查询该患者最近一次记录并返回 `VitalSigns` 类型或 `null`
6. IF Supabase 查询或插入操作失败，THEN THE Service_Adapter SHALL 抛出包含原始错误信息的 Error


### 需求 5：诊疗会话管理（Consultation 生命周期）

**用户故事：** 作为开发者，我希望 Supabase 服务层自动管理 Consultation 生命周期，以便前端无需感知这一后端新增概念。

#### 验收标准

1. WHEN 患者签到创建成功后，THE Service_Adapter SHALL 自动在 `consultations` 表创建一条状态为 `in-progress` 的记录
2. WHEN 需要关联生理数据、禁忌症、量表结果、AI 建议或处方时，THE Service_Adapter SHALL 使用当前活跃 Consultation 的 ID 作为外键
3. WHEN 查询患者当前活跃 Consultation 时，THE Service_Adapter SHALL 返回该患者最近一条状态为 `in-progress` 的 Consultation 记录
4. WHEN 治疗完成时，THE Service_Adapter SHALL 将对应 Consultation 状态更新为 `completed`
5. IF 患者没有活跃的 Consultation 记录，THEN THE Service_Adapter SHALL 抛出描述性错误信息


### 需求 6：队列服务适配器（queueService）

**用户故事：** 作为分诊护士和治疗师，我希望候诊和治疗队列数据持久化到 Supabase，以便多终端共享队列状态。

#### 验收标准

1. WHEN 调用 `getWaitingQueue(departmentId)` 时，THE Service_Adapter SHALL 从 Supabase `queue_items` 表查询 `queue_type` 为 `waiting` 且 `status` 为 `waiting` 的记录，关联 `patients` 表获取姓名和医保卡号
2. WHEN 调用 `enqueueWaiting(patientId, departmentId)` 时，THE Service_Adapter SHALL 向 `queue_items` 表插入 `queue_type` 为 `waiting` 的记录，queue_number 为当前最大值加 1
3. WHEN 调用 `callNextWaiting(departmentId)` 时，THE Service_Adapter SHALL 将该队列中 queue_number 最小的 `waiting` 状态记录更新为 `in-progress` 并返回
4. WHEN 调用 `getTreatmentQueue()` 时，THE Service_Adapter SHALL 从 `queue_items` 表查询 `queue_type` 为 `treatment` 且 `status` 为 `waiting` 的记录
5. WHEN 调用 `enqueueTreatment(patientId)` 时，THE Service_Adapter SHALL 向 `queue_items` 表插入 `queue_type` 为 `treatment` 的记录
6. WHEN 调用 `callNextTreatment()` 时，THE Service_Adapter SHALL 将治疗队列中 queue_number 最小的 `waiting` 状态记录更新为 `in-progress` 并返回
7. WHEN 调用 `completeTreatment(queueItemId)` 时，THE Service_Adapter SHALL 将对应记录状态更新为 `completed`
8. IF 候诊队列中 `waiting` 状态记录数达到 20 条，THEN THE Service_Adapter SHALL 拒绝入队并抛出错误信息"候诊队列已满，请稍后再试"


### 需求 7：禁忌症服务适配器（contraindicationService）

**用户故事：** 作为医生，我希望禁忌症搜索从 Supabase 获取数据，以便使用完整的禁忌症字典。

#### 验收标准

1. WHEN 调用 `search(keyword)` 且 keyword 非空时，THE Service_Adapter SHALL 从 Supabase `contraindications` 表查询 `name` 包含关键字、或 `pinyin_initial` 包含关键字、或 `pinyin` 包含关键字的记录（大小写不敏感）
2. WHEN 调用 `search(keyword)` 且 keyword 为空或仅含空白字符时，THE Service_Adapter SHALL 返回空数组
3. THE Service_Adapter SHALL 将查询结果通过 Mapper 转换为 `Contraindication[]` 类型返回


### 需求 8：量表服务适配器（scaleService）

**用户故事：** 作为医生和治疗师，我希望量表模板和评估结果持久化到 Supabase，以便治疗前后的量表数据可追溯。

#### 验收标准

1. WHEN 调用 `getTemplates()` 时，THE Service_Adapter SHALL 从 Supabase `scale_templates` 表查询所有模板并返回 `ScaleTemplate[]` 类型
2. WHEN 调用 `getTemplate(templateId)` 时，THE Service_Adapter SHALL 从 `scale_templates` 表查询指定模板，关联 `scale_questions` 表按 `sort_order` 排序获取题目，返回完整 `ScaleTemplate` 类型
3. WHEN 调用 `saveResult(patientId, result)` 时，THE Service_Adapter SHALL 查找该患者当前活跃 Consultation，向 `scale_results` 表插入记录
4. IF 指定的量表模板不存在，THEN THE Service_Adapter SHALL 抛出错误信息"量表模板不存在: {templateId}"


### 需求 9：处方服务适配器（prescriptionService）

**用户故事：** 作为医生，我希望开具的处方持久化到 Supabase，以便治疗终端和后续流程可以读取处方数据。

#### 验收标准

1. WHEN 调用 `save(patientId, prescription)` 时，THE Service_Adapter SHALL 查找该患者当前活跃 Consultation，将 `PrescriptionData` 通过 Mapper 转换后插入 Supabase `prescriptions` 表
2. THE Service_Adapter SHALL 将 `PrescriptionData.meta` 存储到 `prescriptions.meta` JSON 字段
3. THE Service_Adapter SHALL 将 `PrescriptionData.herbs` 存储到 `prescriptions.herbs` JSON 字段
4. THE Service_Adapter SHALL 将 `PrescriptionData.totalAmount` 存储到 `prescriptions.total_amount` 字段
5. IF 插入操作失败，THEN THE Service_Adapter SHALL 抛出包含原始错误信息的 Error


### 需求 10：AI 服务适配器（aiService）

**用户故事：** 作为医生，我希望 AI 疗愈套餐建议通过 Supabase Edge Function 获取，以便使用真实的 AI 推理能力。

#### 验收标准

1. WHEN 调用 `getTherapySuggestion(data)` 时，THE Service_Adapter SHALL 调用 Supabase Edge Function 传入生理数据、禁忌症和量表结果
2. THE Service_Adapter SHALL 将 Edge Function 返回结果转换为 `AITherapySuggestion` 类型
3. THE Service_Adapter SHALL 将 AI 建议结果同时写入 Supabase `ai_suggestions` 表，关联当前活跃 Consultation
4. IF Edge Function 调用失败或超时，THEN THE Service_Adapter SHALL 抛出包含错误原因的 Error


### 需求 11：疗愈服务适配器（therapyService）

**用户故事：** 作为治疗师，我希望疗愈套餐数据从 Supabase 获取，以便使用后台维护的完整套餐库。

#### 验收标准

1. WHEN 调用 `getPackages()` 时，THE Service_Adapter SHALL 从 Supabase `therapy_packages` 表查询所有套餐，关联 `therapy_package_items` 和 `therapy_projects` 表获取完整项目列表，返回 `TherapyPackage[]` 类型
2. WHEN 调用 `getPackageById(id)` 时，THE Service_Adapter SHALL 从 `therapy_packages` 表查询指定套餐（含关联项目），返回 `TherapyPackage` 类型或 `null`
3. WHEN 调用 `matchBySymptoms(symptoms)` 时，THE Service_Adapter SHALL 从 `therapy_packages` 表查询 `matched_symptoms` 字段包含任一症状关键词的套餐
4. THE Service_Adapter SHALL 按 `therapy_package_items.sort_order` 排序返回套餐内的项目列表


### 需求 12：实时队列订阅（Realtime）

**用户故事：** 作为分诊护士和治疗师，我希望队列状态变更能实时推送到前端，以便无需手动刷新即可看到最新队列。

#### 验收标准

1. THE Realtime_Subscription SHALL 订阅 Supabase `queue_items` 表的 INSERT、UPDATE 和 DELETE 事件
2. WHEN `queue_items` 表发生变更时，THE Realtime_Subscription SHALL 通过回调函数通知订阅方，传递变更后的 `QueueItem` 数据
3. THE Realtime_Subscription SHALL 提供 `subscribe(callback)` 方法用于注册变更回调
4. THE Realtime_Subscription SHALL 提供 `unsubscribe()` 方法用于取消订阅并释放资源
5. IF 实时连接断开，THEN THE Realtime_Subscription SHALL 自动尝试重新连接


### 需求 13：治疗记录服务

**用户故事：** 作为治疗师，我希望治疗过程的开始、结束时间和时长持久化到 Supabase，以便治疗记录可追溯。

#### 验收标准

1. WHEN 治疗开始时，THE Service_Adapter SHALL 向 Supabase `treatment_records` 表插入记录，设置 `start_time` 为当前时间，关联当前活跃 Consultation
2. WHEN 治疗结束时，THE Service_Adapter SHALL 更新对应 `treatment_records` 记录的 `end_time` 和 `duration` 字段
3. WHEN 治疗后采集生理数据时，THE Service_Adapter SHALL 向 `vital_signs` 表插入 stage 为 `post-treatment` 的记录
4. WHEN 治疗后提交量表评估时，THE Service_Adapter SHALL 向 `scale_results` 表插入 stage 为 `post` 的记录
5. WHEN 治疗全部完成时，THE Service_Adapter SHALL 将患者状态更新为 `completed`，并将 Consultation 状态更新为 `completed`


### 需求 14：患者状态流转

**用户故事：** 作为系统使用者，我希望患者状态在各终端操作时自动更新到 Supabase，以便所有终端看到一致的患者状态。

#### 验收标准

1. WHEN 患者签到成功时，THE Service_Adapter SHALL 将 `patients.status` 设为 `checked-in`
2. WHEN 患者入候诊队列时，THE Service_Adapter SHALL 将 `patients.status` 更新为 `waiting`
3. WHEN 医生叫号开始就诊时，THE Service_Adapter SHALL 将 `patients.status` 更新为 `consulting`
4. WHEN 医生开具处方并转入治疗队列时，THE Service_Adapter SHALL 将 `patients.status` 更新为 `pending-treatment`
5. WHEN 治疗师叫号开始治疗时，THE Service_Adapter SHALL 将 `patients.status` 更新为 `treating`
6. WHEN 治疗完成时，THE Service_Adapter SHALL 将 `patients.status` 更新为 `completed`


### 需求 15：错误处理与网络容错

**用户故事：** 作为系统使用者，我希望网络异常或 Supabase 服务不可用时系统能给出明确提示，以便我了解问题并采取措施。

#### 验收标准

1. IF Supabase 查询返回错误，THEN THE Service_Adapter SHALL 抛出包含表名、操作类型和原始错误消息的 Error
2. IF 网络请求超时，THEN THE Service_Adapter SHALL 抛出包含"网络超时"描述的 Error
3. THE Service_Adapter SHALL 在所有数据库操作中检查 Supabase 响应的 `error` 字段，非空时立即抛出错误
4. IF 插入操作违反数据库约束（如外键、唯一性），THEN THE Service_Adapter SHALL 抛出包含约束名称的描述性 Error