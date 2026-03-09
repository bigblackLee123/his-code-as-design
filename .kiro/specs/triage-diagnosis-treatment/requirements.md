# 需求文档：分诊-诊疗-治疗全流程系统

## 简介

本功能为中医门诊构建完整的「分诊→诊疗→治疗」三终端协作流程，覆盖护士分诊台、医生诊疗终端、治疗室护士终端三个工作站。系统通过队列机制串联三个终端，实现患者从分诊签到、生理测量、医生问诊开方、到治疗执行的全流程闭环管理。技术栈为 React + TypeScript + Tailwind CSS + shadcn/ui，遵循 HIS 紧凑模式设计规范。

## 术语表

- **分诊终端（Triage_Terminal）**：护士/分诊台使用的工作站页面，负责患者签到、生理数据采集和候诊队列分配
- **医生终端（Doctor_Terminal）**：门诊医生使用的工作站页面，负责叫号、问诊、症状录入、量表采集、AI 辅助开方和处方提交
- **治疗终端（Treatment_Terminal）**：治疗室护士使用的工作站页面，负责治疗叫号、治疗执行、治疗后评估和出队
- **候诊队列（Waiting_Queue）**：患者在分诊后等待医生叫号的排队列表
- **治疗队列（Treatment_Queue）**：患者在医生开方后等待治疗室叫号的排队列表
- **生理数据（Vital_Signs）**：患者的血压（收缩压/舒张压）和心率测量值
- **禁忌症（Contraindications）**：中医诊疗中通过问诊采集的患者禁忌症信息，使用标准化禁忌症字典进行编码
- **禁忌症字典（Contraindication_Dictionary）**：预定义的标准化中医禁忌症术语库，支持首字母/拼音检索
- **量表（Scale_Questionnaire）**：结构化的评估问卷，用于采集患者主观感受和功能状态的量化数据
- **AI 处方建议（AI_Suggestion）**：云端 AI 根据患者生理数据、症状和量表信息生成的中药处方参考建议
- **医保卡（Insurance_Card）**：患者的医疗保险卡，通过刷卡器读取患者身份和医保信息
- **刷卡器（Card_Reader）**：联网的医保卡读取设备，用于读取患者医保卡信息


## 需求

### 需求 1：患者医保卡签到与档案匹配

**用户故事：** 作为分诊台护士，我希望通过刷医保卡快速完成患者签到和档案匹配，以便高效地将患者纳入就诊流程。

#### 验收标准

1. WHEN 护士在分诊终端触发刷卡操作, THE Triage_Terminal SHALL 调用 Card_Reader 读取医保卡信息并返回患者身份数据（姓名、医保卡号、身份证号）
2. WHEN Card_Reader 返回患者身份数据, THE Triage_Terminal SHALL 在系统中检索是否存在匹配的患者档案
3. WHEN 系统中存在匹配的患者档案, THE Triage_Terminal SHALL 自动加载该患者的历史档案信息并显示在签到界面
4. WHEN 系统中不存在匹配的患者档案, THE Triage_Terminal SHALL 基于医保卡读取的信息自动创建新患者档案
5. IF Card_Reader 读取失败或超时, THEN THE Triage_Terminal SHALL 显示错误提示并提供手动输入患者信息的备选方式
6. THE Triage_Terminal SHALL 在签到界面使用 MaskedText 脱敏组件展示患者姓名、身份证号和联系电话

### 需求 2：生理数据采集

**用户故事：** 作为分诊台护士，我希望能够录入患者的血压和心率等生理数据，以便医生在诊疗时参考。

#### 验收标准

1. THE Triage_Terminal SHALL 提供生理数据录入表单，包含收缩压、舒张压和心率三个必填字段
2. WHEN 护士输入收缩压值, THE Triage_Terminal SHALL 验证输入值为 40 至 300 之间的整数（单位：mmHg）
3. WHEN 护士输入舒张压值, THE Triage_Terminal SHALL 验证输入值为 20 至 200 之间的整数（单位：mmHg）
4. WHEN 护士输入心率值, THE Triage_Terminal SHALL 验证输入值为 20 至 300 之间的整数（单位：次/分）
5. IF 输入值超出有效范围, THEN THE Triage_Terminal SHALL 在对应字段下方显示具体的范围提示信息
6. WHEN 生理数据录入完成且全部校验通过, THE Triage_Terminal SHALL 将生理数据与当前患者档案关联保存
7. WHEN 收缩压大于 180 或舒张压大于 120 或心率大于 150, THE Triage_Terminal SHALL 在数据旁以错误色高亮显示异常警告标识

### 需求 3：候诊队列分配

**用户故事：** 作为分诊台护士，我希望在完成签到和生理数据采集后将患者分配到候诊队列，以便医生按序叫号接诊。

#### 验收标准

1. WHEN 患者签到完成且生理数据已保存, THE Triage_Terminal SHALL 显示队列分配确认界面，包含目标科室和预估等待人数
2. WHEN 护士确认队列分配, THE Triage_Terminal SHALL 将患者加入 Waiting_Queue 并生成排队序号
3. THE Triage_Terminal SHALL 在队列分配确认后显示患者的排队序号和预估等待人数
4. IF 目标科室的 Waiting_Queue 已满（超过系统配置的最大排队人数）, THEN THE Triage_Terminal SHALL 显示队列已满提示并阻止分配操作

### 需求 4：医生叫号与候诊队列管理

**用户故事：** 作为门诊医生，我希望能够查看候诊队列并叫号，以便按序接诊患者。

#### 验收标准

1. THE Doctor_Terminal SHALL 显示当前医生对应科室的 Waiting_Queue 列表，包含排队序号、患者姓名（脱敏）和等待时长
2. WHEN 医生点击叫号按钮, THE Doctor_Terminal SHALL 从 Waiting_Queue 中取出排序最前的患者并加载该患者的完整信息
3. WHEN 叫号成功, THE Doctor_Terminal SHALL 将该患者状态从「候诊」更新为「就诊中」
4. WHILE 医生正在接诊一位患者, THE Doctor_Terminal SHALL 禁用叫号按钮，防止同时接诊多位患者
5. THE Doctor_Terminal SHALL 在候诊列表中使用 MaskedText 脱敏组件展示患者姓名
6. WHEN 候诊队列为空, THE Doctor_Terminal SHALL 在叫号面板显示「暂无候诊患者」的空状态提示


### 需求 5：患者信息与生理数据加载

**用户故事：** 作为门诊医生，我希望在叫号后能自动加载患者的基本信息和分诊台采集的生理数据，以便快速了解患者状况开始问诊。

#### 验收标准

1. WHEN 医生叫号成功或刷医保卡读取患者信息, THE Doctor_Terminal SHALL 加载并显示患者基本信息（姓名、性别、年龄、医保卡号）和分诊台录入的 Vital_Signs 数据
2. THE Doctor_Terminal SHALL 使用 PatientInfoBar 组件（已有）展示患者基本信息，并扩展显示 Vital_Signs 数据区域
3. THE Doctor_Terminal SHALL 使用 MaskedText 脱敏组件展示患者姓名、身份证号和联系电话
4. WHEN Vital_Signs 数据中存在异常值（收缩压大于 180 或舒张压大于 120 或心率大于 150）, THE Doctor_Terminal SHALL 在生理数据区域以错误色高亮显示异常指标并附带警告图标

### 需求 6：禁忌症录入与禁忌症字典检索

**用户故事：** 作为门诊医生，我希望通过禁忌症字典快速检索和录入患者的禁忌症信息，以便高效完成问诊记录。

#### 验收标准

1. THE Doctor_Terminal SHALL 提供 Contraindications 录入区域，支持从 Contraindication_Dictionary 中检索和选择禁忌症条目
2. WHEN 医生在禁忌症输入框中输入文字, THE Doctor_Terminal SHALL 在 200ms 内从 Contraindication_Dictionary 中检索匹配的禁忌症条目并以下拉列表形式展示
3. THE Doctor_Terminal SHALL 支持按禁忌症名称的拼音首字母和汉字进行模糊检索
4. WHEN 医生从下拉列表中选择一个禁忌症条目, THE Doctor_Terminal SHALL 将该禁忌症添加到已选禁忌症列表中
5. WHEN 医生点击已选禁忌症列表中某个禁忌症的移除按钮, THE Doctor_Terminal SHALL 从已选列表中移除该禁忌症
6. THE Doctor_Terminal SHALL 在已选禁忌症列表中以标签（Badge）形式展示每个已选禁忌症

### 需求 7：量表问卷数据采集

**用户故事：** 作为门诊医生，我希望通过结构化量表问卷采集患者的主观感受和功能状态数据，以便为 AI 处方建议提供完整的输入信息。

#### 验收标准

1. THE Doctor_Terminal SHALL 提供 Scale_Questionnaire 数据采集表单，支持渲染不同类型的量表题目（单选、多选、数值滑块、文本输入）
2. WHEN 医生选择一个量表模板, THE Doctor_Terminal SHALL 根据量表模板定义动态渲染对应的题目列表
3. WHEN 医生完成所有必填题目的填写, THE Doctor_Terminal SHALL 启用提交按钮
4. IF 医生尝试提交量表但存在未填写的必填题目, THEN THE Doctor_Terminal SHALL 高亮显示未填写的题目并滚动到第一个未填写题目的位置
5. WHEN 量表数据提交成功, THE Doctor_Terminal SHALL 将量表结果与当前患者的就诊记录关联保存

### 需求 8：AI 处方建议

**用户故事：** 作为门诊医生，我希望系统能将患者数据上传至云端 AI 并返回处方建议，以便辅助我进行开方决策。

#### 验收标准

1. WHEN 医生点击获取 AI 建议按钮, THE Doctor_Terminal SHALL 将患者的 Vital_Signs、Contraindications 和 Scale_Questionnaire 数据打包上传至云端 AI 接口
2. WHILE AI 接口请求处理中, THE Doctor_Terminal SHALL 在 AI_Suggestion 面板显示加载状态指示器
3. WHEN 云端 AI 返回处方建议, THE Doctor_Terminal SHALL 在 AI_Suggestion 面板中展示建议的药材列表、剂量和用法说明
4. IF 云端 AI 接口请求失败或超时（超过 30 秒）, THEN THE Doctor_Terminal SHALL 在 AI_Suggestion 面板显示错误提示并提供重试按钮
5. THE Doctor_Terminal SHALL 将 AI_Suggestion 面板设置为仅医生可见区域，该面板的内容在患者端不可见
6. WHEN 医生点击采纳建议按钮, THE Doctor_Terminal SHALL 将 AI 建议的药材和剂量预填充到 PrescriptionForm 和 HerbGrid 组件中


### 需求 9：处方调整与提交

**用户故事：** 作为门诊医生，我希望在 AI 建议的基础上调整处方参数并提交最终处方，以便患者进入治疗流程。

#### 验收标准

1. THE Doctor_Terminal SHALL 复用已有的 PrescriptionForm 组件展示处方元数据（用药途径、使用方式、帖药方式、用药频次等）
2. THE Doctor_Terminal SHALL 复用已有的 HerbGrid 组件展示和编辑中药处方明细（药品名称、剂量、单位、备注）
3. WHEN 医生修改 HerbGrid 中的药品剂量, THE Doctor_Terminal SHALL 实时重新计算并更新处方金额
4. THE Doctor_Terminal SHALL 复用已有的 ActionBar 组件提供处方审核、处方上传等操作按钮
5. WHEN 医生点击处方上传按钮且审核通过, THE Doctor_Terminal SHALL 保存处方数据并将患者状态更新为「待治疗」

### 需求 10：患者状态流转与治疗队列分配

**用户故事：** 作为门诊医生，我希望在提交处方后将患者从候诊队列转入治疗队列，以便治疗室护士按序安排治疗。

#### 验收标准

1. WHEN 处方提交成功, THE Doctor_Terminal SHALL 显示状态流转确认界面，包含患者信息摘要和处方摘要
2. WHEN 医生确认状态流转, THE Doctor_Terminal SHALL 将患者从 Waiting_Queue 移除并加入 Treatment_Queue
3. WHEN 患者成功加入 Treatment_Queue, THE Doctor_Terminal SHALL 显示流转成功提示，包含治疗队列排队序号
4. THE Doctor_Terminal SHALL 在状态流转完成后自动重新启用叫号按钮，允许医生接诊下一位患者
5. IF 状态流转过程中发生网络错误, THEN THE Doctor_Terminal SHALL 显示错误提示并保留当前患者数据，允许医生重试流转操作

### 需求 11：治疗叫号与队列管理

**用户故事：** 作为治疗室护士，我希望能够查看治疗队列并叫号，以便按序安排患者治疗。

#### 验收标准

1. THE Treatment_Terminal SHALL 显示当前 Treatment_Queue 列表，包含排队序号、患者姓名（脱敏）、处方类型和等待时长
2. WHEN 护士点击叫号按钮, THE Treatment_Terminal SHALL 从 Treatment_Queue 中取出排序最前的患者并加载该患者的完整信息
3. WHEN 叫号成功, THE Treatment_Terminal SHALL 将该患者状态从「待治疗」更新为「治疗中」
4. WHILE 护士正在为一位患者执行治疗, THE Treatment_Terminal SHALL 禁用叫号按钮，防止同时处理多位患者
5. THE Treatment_Terminal SHALL 在治疗队列列表中使用 MaskedText 脱敏组件展示患者姓名
6. WHEN 治疗队列为空, THE Treatment_Terminal SHALL 在叫号面板显示「暂无待治疗患者」的空状态提示

### 需求 12：治疗患者综合信息展示

**用户故事：** 作为治疗室护士，我希望在叫号后能查看患者的全部诊疗信息（基本信息、生理数据、处方、症状），以便准确执行治疗方案。

#### 验收标准

1. WHEN 治疗叫号成功或护士刷医保卡, THE Treatment_Terminal SHALL 加载并展示患者的完整信息视图
2. THE Treatment_Terminal SHALL 在综合信息视图中分区展示以下信息：患者基本信息、分诊 Vital_Signs 数据、Contraindications 列表、处方明细
3. THE Treatment_Terminal SHALL 使用 MaskedText 脱敏组件展示患者姓名、身份证号和联系电话
4. WHEN 处方明细中包含特殊用法说明, THE Treatment_Terminal SHALL 以警告色高亮显示特殊用法说明文字


### 需求 13：治疗执行与时间记录

**用户故事：** 作为治疗室护士，我希望能够确认开始治疗并自动记录治疗时间，以便准确追踪治疗过程。

#### 验收标准

1. WHEN 护士点击开始治疗按钮, THE Treatment_Terminal SHALL 记录治疗开始时间并将患者状态更新为「治疗中」
2. WHILE 患者处于「治疗中」状态, THE Treatment_Terminal SHALL 显示治疗计时器，实时展示已治疗时长
3. WHEN 护士点击结束治疗按钮, THE Treatment_Terminal SHALL 记录治疗结束时间并计算总治疗时长
4. THE Treatment_Terminal SHALL 将治疗开始时间、结束时间和总时长保存到患者的治疗记录中
5. IF 护士在未点击开始治疗的情况下尝试点击结束治疗, THEN THE Treatment_Terminal SHALL 禁用结束治疗按钮并提示需先开始治疗

### 需求 14：治疗后生理数据采集

**用户故事：** 作为治疗室护士，我希望在治疗完毕后录入患者的血压和心率数据，以便对比治疗前后的生理变化。

#### 验收标准

1. WHEN 护士点击结束治疗按钮, THE Treatment_Terminal SHALL 显示治疗后生理数据录入表单
2. THE Treatment_Terminal SHALL 在治疗后生理数据录入表单中提供收缩压、舒张压和心率三个必填字段，校验规则与分诊终端一致（需求 2）
3. THE Treatment_Terminal SHALL 在录入表单旁并排展示治疗前（分诊阶段）的 Vital_Signs 数据，方便护士对比
4. WHEN 治疗后生理数据录入完成且校验通过, THE Treatment_Terminal SHALL 将治疗后生理数据保存到患者的治疗记录中
5. WHEN 治疗后的收缩压或舒张压或心率与治疗前相比变化超过 20%, THE Treatment_Terminal SHALL 以警告色标注变化幅度

### 需求 15：治疗后量表评估

**用户故事：** 作为治疗室护士，我希望在治疗后通过量表问卷评估患者状态，以便记录治疗效果。

#### 验收标准

1. WHEN 治疗后生理数据保存成功, THE Treatment_Terminal SHALL 显示治疗后 Scale_Questionnaire 评估表单
2. THE Treatment_Terminal SHALL 支持渲染与医生终端相同类型的量表题目（单选、多选、数值滑块、文本输入）
3. WHEN 护士完成所有必填题目的填写, THE Treatment_Terminal SHALL 启用提交按钮
4. IF 护士尝试提交量表但存在未填写的必填题目, THEN THE Treatment_Terminal SHALL 高亮显示未填写的题目并滚动到第一个未填写题目的位置
5. WHEN 量表数据提交成功, THE Treatment_Terminal SHALL 将治疗后量表结果与患者的治疗记录关联保存

### 需求 16：治疗完成与出队

**用户故事：** 作为治疗室护士，我希望在完成所有治疗后评估后将患者从治疗队列移除，以便接诊下一位患者。

#### 验收标准

1. WHEN 治疗后生理数据和量表评估均已保存, THE Treatment_Terminal SHALL 显示出队确认界面，包含治疗摘要（治疗时长、治疗前后生理数据对比）
2. WHEN 护士确认出队, THE Treatment_Terminal SHALL 将患者从 Treatment_Queue 移除并将患者状态更新为「已完成」
3. THE Treatment_Terminal SHALL 在出队完成后自动重新启用叫号按钮，允许护士接诊下一位患者
4. IF 出队过程中发生网络错误, THEN THE Treatment_Terminal SHALL 显示错误提示并保留当前数据，允许护士重试出队操作

### 需求 17：三终端页面布局与积木式组件架构

**用户故事：** 作为开发者，我希望三个终端页面遵循 HIS 积木式组件架构规范，以便代码可维护、可测试、可复用。

#### 验收标准

1. THE Triage_Terminal SHALL 按积木式架构拆分为 PatientCheckIn、VitalSignsInput、QueueAssignment 三个独立 Block 组件
2. THE Doctor_Terminal SHALL 按积木式架构拆分为 CallQueue、PatientInfoBar（已有，扩展）、ContraindicationInput、ScaleForm、AISuggestionPanel、PrescriptionForm（已有）、HerbGrid（已有）、ActionBar（已有）、StatusTransition 等独立 Block 组件
3. THE Treatment_Terminal SHALL 按积木式架构拆分为 TreatmentQueue、TreatmentPatientView、TreatmentAction、PostVitalSigns、PostScaleForm、QueueComplete 等独立 Block 组件
4. THE 三个终端页面 SHALL 各自提供一个页面入口组件负责组合所有 Block、定义数据流和布局结构
5. THE 所有 Block 组件 SHALL 通过 props 和 context 进行通信，禁止 Block 之间直接操作 DOM 或共享可变状态
6. THE 每个 Block 组件文件 SHALL 保持在 200 行以内，超过时拆分为子 Block
