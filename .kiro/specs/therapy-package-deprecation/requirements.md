# Requirements Document

## Introduction

后端已完成疗愈套餐数据架构重构（废弃 `therapy_packages` 和 `therapy_package_items` 表，处方直接关联 `therapy_project`，通过 `prescription_steps` 表实现多房间多步骤流转）。本需求覆盖步骤 7：前后端联调，让前端代码全面适配新的数据架构，包括废弃套餐相关代码、重写服务层查询、更新类型定义、适配禁忌症筛选逻辑，以及更新文档。

## Glossary

- **Doctor_Terminal**: 医生终端页面，医生在此完成接诊、录入禁忌症、选择疗愈项目、确认处方并流转
- **Treatment_Terminal**: 治疗终端页面，护士在此查看待治疗患者信息并执行治疗
- **TherapyProject**: 疗愈项目实体，包含 region（房间区域）、name、mechanism、contraindications 等字段，存储于 `therapy_projects` 表
- **TherapyProject_Selector**: 替代原 TherapyPackageSelector 的新组件，基于 TherapyProject 进行搜索和多选
- **Therapy_Service**: 前端服务层中负责查询疗愈数据的模块，包含 Supabase 实现和 Mock 实现
- **Contraindication_Service**: 前端服务层中负责禁忌症搜索的模块
- **Mapper_Module**: `src/services/supabase/mappers.ts`，负责 Supabase 行数据到前端类型的转换
- **Type_Module**: `src/services/types.ts`，前端共享类型定义文件
- **Mock_Data_Module**: `src/services/mock/data/` 下的 mock 数据文件
- **Prescription_Steps**: 处方执行步骤表，每个步骤关联一个 TherapyProject 和一个 region，实现多房间流转
- **Contraindication**: 禁忌症条目，包含 code、name、pinyin、pinyinInitial、category 字段

## Requirements

### Requirement 1: 废弃 TherapyPackage 类型定义

**User Story:** As a 开发者, I want to 从类型系统中移除所有套餐相关定义, so that 前端类型与后端新架构保持一致

#### Acceptance Criteria

1. WHEN Type_Module 被编辑后, THE Type_Module SHALL 不包含 `TherapyPackage` 接口定义
2. WHEN Type_Module 被编辑后, THE Type_Module SHALL 不包含 `AITherapySuggestion.packageId` 和 `AITherapySuggestion.packageName` 字段
3. WHEN Type_Module 被编辑后, THE `TreatmentPatient` 接口 SHALL 将 `therapyPackage: TherapyPackage` 字段替换为 `projects: TherapyProject[]`
4. WHEN Type_Module 被编辑后, THE `AITherapySuggestion` 接口 SHALL 将 packageId/packageName 替换为 `projectIds: string[]` 和 `projectNames: string[]`
5. WHEN Type_Module 被编辑后, THE `TherapyProject` 接口 SHALL 新增 `contraindications: string[]` 字段，表示该项目的禁忌症列表

### Requirement 2: 重写 Therapy_Service Supabase 实现

**User Story:** As a 开发者, I want to 将 therapyService 从查询套餐表改为直接查询 therapy_projects 表, so that 服务层与新的数据库架构对齐

#### Acceptance Criteria

1. WHEN Therapy_Service 的 Supabase 实现被重写后, THE Therapy_Service SHALL 提供 `getProjects()` 方法，直接从 `therapy_projects` 表查询所有项目并返回 `TherapyProject[]`
2. WHEN Therapy_Service 的 Supabase 实现被重写后, THE Therapy_Service SHALL 提供 `getProjectById(id: string)` 方法，按 ID 查询单个项目并返回 `TherapyProject | null`
3. WHEN Therapy_Service 的 Supabase 实现被重写后, THE Therapy_Service SHALL 提供 `matchBySymptoms(symptoms: string[])` 方法，按症状关键词在 `target_audience` 字段上做 ilike 匹配并返回 `TherapyProject[]`
4. WHEN Therapy_Service 的 Supabase 实现被重写后, THE Therapy_Service SHALL 不包含任何对 `therapy_packages` 或 `therapy_package_items` 表的引用
5. WHEN `getProjects()` 被调用时, THE Therapy_Service SHALL 将每个项目的 `contraindications` JSONB 字段映射为 `string[]` 返回

### Requirement 3: 删除 Mapper_Module 中的套餐映射函数

**User Story:** As a 开发者, I want to 移除 toTherapyPackage 映射函数, so that Mapper_Module 不再引用已废弃的数据库表

#### Acceptance Criteria

1. WHEN Mapper_Module 被编辑后, THE Mapper_Module SHALL 不包含 `toTherapyPackage` 函数
2. WHEN Mapper_Module 被编辑后, THE `toTherapyProject` 函数 SHALL 将 `contraindications` JSONB 字段映射为 `string[]` 并包含在返回的 TherapyProject 对象中

### Requirement 4: 重写 Mock 数据和 Mock 服务

**User Story:** As a 开发者, I want to 将 mock 数据从套餐结构改为项目列表结构, so that mock 模式下的开发和预览与新架构一致

#### Acceptance Criteria

1. WHEN Mock_Data_Module 被更新后, THE `therapyPackages.ts` 文件 SHALL 被删除
2. WHEN Mock_Data_Module 被更新后, THE Mock_Data_Module SHALL 包含一个新的 `therapyProjects.ts` 文件，导出 `mockTherapyProjects: TherapyProject[]`，包含代表性的项目数据（覆盖睡眠区、情志区、运动疗愈区）
3. WHEN Mock 服务被更新后, THE `src/services/mock/therapyService.ts` SHALL 提供与 Supabase 实现相同签名的 `getProjects()`、`getProjectById()`、`matchBySymptoms()` 方法
4. WHEN Mock 禁忌症数据被更新后, THE `src/services/mock/data/contraindications.ts` SHALL 包含与后端 seed 数据一致的 13 条禁忌症词条（7 项目级 + 4 全局通用 + 2 睡眠区通用）

### Requirement 5: 替换 TherapyPackageSelector 为 TherapyProject_Selector

**User Story:** As a 医生, I want to 直接搜索和多选疗愈项目, so that 我可以为患者灵活组合处方而不受套餐限制

#### Acceptance Criteria

1. WHEN TherapyProject_Selector 替换原组件后, THE TherapyProject_Selector SHALL 接收 `selectedProjects: TherapyProject[]` 和 `onSelect: (projects: TherapyProject[]) => void` 作为 props
2. WHEN 医生在搜索框输入关键词时, THE TherapyProject_Selector SHALL 按项目名称、region、targetAudience、mood 进行模糊过滤
3. WHEN 医生点击一个项目时, THE TherapyProject_Selector SHALL 将该项目添加到已选列表（多选模式）
4. WHEN 医生点击已选项目的移除按钮时, THE TherapyProject_Selector SHALL 将该项目从已选列表中移除
5. WHEN 患者已录入禁忌症时, THE TherapyProject_Selector SHALL 根据每个 TherapyProject 的 `contraindications` 字段过滤掉与患者禁忌症匹配的项目，并在 UI 上标记为不可选

### Requirement 6: 改造 Doctor_Terminal 页面状态管理

**User Story:** As a 开发者, I want to 将 DoctorTerminalPage 的状态从单个套餐改为项目列表, so that 页面逻辑与新的多项目选择模式一致

#### Acceptance Criteria

1. WHEN Doctor_Terminal 页面被改造后, THE Doctor_Terminal SHALL 使用 `selectedProjects: TherapyProject[]` 状态替代 `selectedPackage: TherapyPackage | null`
2. WHEN 医生采纳 AI 建议时, THE Doctor_Terminal SHALL 根据 `AITherapySuggestion.projectIds` 批量查询项目并设置到 `selectedProjects`
3. WHEN 医生点击「确认处方并流转」时, THE Doctor_Terminal SHALL 在 `selectedProjects` 非空时才允许流转
4. WHEN Doctor_Terminal 页面被改造后, THE Doctor_Terminal SHALL 不包含任何对 `TherapyPackage` 类型的引用

### Requirement 7: 改造 TherapyProjectList 组件 props

**User Story:** As a 开发者, I want to 将 TherapyProjectList 的 props 从 selectedPackage 改为 selectedProjects, so that 组件直接接收项目列表而非套餐对象

#### Acceptance Criteria

1. WHEN TherapyProjectList 被改造后, THE TherapyProjectList SHALL 接收 `selectedProjects: TherapyProject[]` 作为 props 替代 `selectedPackage: TherapyPackage | null`
2. WHEN `selectedProjects` 为空数组时, THE TherapyProjectList SHALL 显示「请先选择疗愈项目」的占位提示
3. WHEN `selectedProjects` 包含项目时, THE TherapyProjectList SHALL 按列表顺序渲染每个项目的详情卡片

### Requirement 8: 改造 StatusTransition 组件

**User Story:** As a 开发者, I want to 将 StatusTransition 的 props 从 selectedPackage 改为 selectedProjects, so that 流转确认页展示项目列表而非套餐信息

#### Acceptance Criteria

1. WHEN StatusTransition 被改造后, THE StatusTransition SHALL 接收 `selectedProjects: TherapyProject[]` 作为 props 替代 `selectedPackage: TherapyPackage | null`
2. WHEN 流转确认页展示时, THE StatusTransition SHALL 显示已选项目的数量和每个项目的名称标签
3. WHEN StatusTransition 被改造后, THE StatusTransition SHALL 不包含任何对 `TherapyPackage` 类型的引用

### Requirement 9: 改造 Treatment_Terminal 患者视图

**User Story:** As a 护士, I want to 在治疗终端看到患者的疗愈项目列表而非套餐名称, so that 我可以清楚了解需要执行的具体治疗项目

#### Acceptance Criteria

1. WHEN TreatmentPatientView 被改造后, THE TreatmentPatientView SHALL 从 `patient.projects` 读取项目列表替代 `patient.therapyPackage`
2. WHEN TreatmentPatientView 渲染项目列表时, THE TreatmentPatientView SHALL 显示每个项目的名称、region 标签、引导语标记和 BPM
3. WHEN TreatmentPatientView 被改造后, THE TreatmentPatientView SHALL 不包含任何对 `TherapyPackage` 类型的引用
4. WHEN TreatmentQueue 的 mock 数据被更新后, THE TreatmentQueue SHALL 使用 `projects: TherapyProject[]` 替代 `therapyPackage: TherapyPackage`

### Requirement 10: 更新 Preview 配置

**User Story:** As a 开发者, I want to 更新 preview 配置中的 mock 数据, so that 组件预览页面在新架构下正常工作

#### Acceptance Criteria

1. WHEN `src/pages/preview/configs/treatment.tsx` 被更新后, THE Preview 配置 SHALL 使用 `projects: TherapyProject[]` 替代 `therapyPackage: TherapyPackage`
2. WHEN `src/pages/preview/configs/doctor.tsx` 被更新后, THE Preview 配置 SHALL 使用 `selectedProjects: TherapyProject[]` 替代 `selectedPackage: TherapyPackage`

### Requirement 11: 清理验证脚本和 Supabase 类型

**User Story:** As a 开发者, I want to 移除验证脚本中的套餐相关检查并重新生成 Supabase 类型, so that 工具链与新架构一致

#### Acceptance Criteria

1. WHEN `scripts/verify-fields.ts` 被更新后, THE 验证脚本 SHALL 不包含对 `therapy_packages` 或 `therapy_package_items` 表的验证逻辑
2. WHEN `src/types/supabase.ts` 被重新生成后, THE Supabase 类型文件 SHALL 反映当前数据库 schema（包含 `prescription_steps`、`system_config`，不包含 `therapy_packages`、`therapy_package_items`）

### Requirement 12: 禁忌症筛选兼容性

**User Story:** As a 医生, I want to 在选择疗愈项目时自动过滤掉有禁忌症冲突的项目, so that 我不会为患者开出有禁忌症风险的处方

#### Acceptance Criteria

1. THE Contraindication_Service 的 `search` 方法 SHALL 兼容新的 13 条禁忌症词条数据，无需修改查询逻辑
2. WHEN 医生在 TherapyProject_Selector 中浏览项目列表时, THE TherapyProject_Selector SHALL 将患者已录入的禁忌症名称与每个 TherapyProject 的 `contraindications` 数组进行匹配
3. WHEN 某个 TherapyProject 的 `contraindications` 数组中包含患者已录入的任一禁忌症名称时, THE TherapyProject_Selector SHALL 将该项目标记为禁用状态并显示匹配的禁忌症原因
4. WHEN 前端创建处方时, THE Doctor_Terminal SHALL 不传递 `therapy_package_id` 字段

### Requirement 13: 更新数据模块设计文档

**User Story:** As a 开发者, I want to 更新数据模块设计文档, so that 文档准确反映当前数据库架构

#### Acceptance Criteria

1. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 包含 `prescription_steps` 表的完整字段描述
2. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 包含 `system_config` 表的完整字段描述
3. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 不包含 `therapy_packages` 和 `therapy_package_items` 表的描述
4. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 反映 `therapy_projects` 表新增的 `contraindications` JSONB 字段
5. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 反映 `treatment_records` 表新增的 `region` 字段和 `consultation_id` 从 UNIQUE 改为普通索引
6. WHEN `doc/backend/数据模块设计.md` 被更新后, THE 文档 SHALL 反映 `queue_items` 表新增的 `region` 字段
