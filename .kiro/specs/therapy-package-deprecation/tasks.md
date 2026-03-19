# Implementation Plan: 废弃疗愈套餐，适配项目直选架构

## Overview

按依赖顺序逐步将前端从套餐模式迁移到项目直选模式：类型定义 → Mapper → 服务层 → Mock 数据/服务 → 组件层（医生终端 + 治疗终端） → 清理验证 → 文档更新。技术栈：React + TypeScript + Tailwind CSS + shadcn/ui + Supabase。

## Tasks

- [ ] 1. 类型系统重构
  - [x] 1.1 修改 `src/services/types.ts`：删除 `TherapyPackage` 接口；`TherapyProject` 新增 `contraindications: string[]` 字段；`TreatmentPatient.therapyPackage` 替换为 `projects: TherapyProject[]`；`AITherapySuggestion` 的 `packageId`/`packageName` 替换为 `projectIds: string[]`/`projectNames: string[]`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  - [ ]* 1.2 编写属性测试：Property 5 — 项目选择添加/移除往返一致性
    - **Property 5: 项目选择添加/移除往返一致性**
    - 生成随机 `TherapyProject[]` 列表和一个不在列表中的项目，验证添加后移除得到原始列表
    - **Validates: Requirements 5.3, 5.4**

- [ ] 2. Mapper 层适配
  - [x] 2.1 修改 `src/services/supabase/mappers.ts`：删除 `toTherapyPackage` 函数；修改 `toTherapyProject` 新增 `contraindications` 字段映射（JSONB → `string[]`，null 时回退为 `[]`）
    - _Requirements: 3.1, 3.2_
  - [ ]* 2.2 编写属性测试：Property 1 — toTherapyProject 正确映射 contraindications
    - **Property 1: toTherapyProject 正确映射 contraindications**
    - 生成随机 `therapy_projects` 行数据（contraindications 为随机字符串数组或 null），验证输出的 `contraindications` 始终为 `string[]`
    - **Validates: Requirements 2.5, 3.2**

- [ ] 3. Supabase 服务层重写
  - [x] 3.1 重写 `src/services/supabase/therapyService.ts`：删除 `getPackages`/`getPackageById`/`matchBySymptoms` 的套餐查询逻辑；实现 `getProjects()` 直接查 `therapy_projects` 表返回 `TherapyProject[]`；实现 `getProjectById(id)` 按 ID 查询返回 `TherapyProject | null`；实现 `matchBySymptoms(symptoms)` 在 `target_audience` 上做 ilike 匹配返回 `TherapyProject[]`
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  - [ ]* 3.2 编写属性测试：Property 2 — getProjectById 查询一致性
    - **Property 2: getProjectById 查询一致性**
    - 从 mock 项目列表中随机选取 ID 验证返回匹配项目；生成随机 UUID 验证返回 `null`
    - **Validates: Requirements 2.2**
  - [ ]* 3.3 编写属性测试：Property 3 — matchBySymptoms 返回相关项目
    - **Property 3: matchBySymptoms 返回相关项目**
    - 生成随机症状关键词，验证返回的每个项目的 `targetAudience` 包含至少一个关键词
    - **Validates: Requirements 2.3**

- [ ] 4. Mock 数据和 Mock 服务重写
  - [x] 4.1 删除 `src/services/mock/data/therapyPackages.ts`；新建 `src/services/mock/data/therapyProjects.ts`，导出 `mockTherapyProjects: TherapyProject[]`（从原套餐数据提取去重项目，每个项目补充 `contraindications` 字段，覆盖睡眠区、情志区、运动疗愈区）
    - _Requirements: 4.1, 4.2_
  - [x] 4.2 更新 `src/services/mock/data/contraindications.ts`：替换为与后端 seed 一致的 13 条禁忌症词条（7 项目级 + 4 全局通用 + 2 睡眠区通用）
    - _Requirements: 4.4_
  - [x] 4.3 重写 `src/services/mock/therapyService.ts`：提供 `getProjects()`、`getProjectById()`、`matchBySymptoms()` 方法，签名与 Supabase 实现一致
    - _Requirements: 4.3_
  - [ ]* 4.4 编写属性测试：Property 10 — 禁忌症搜索兼容性
    - **Property 10: 禁忌症搜索兼容性**
    - 生成随机关键词，验证搜索结果的 `name`/`pinyin`/`pinyinInitial` 包含该关键词
    - **Validates: Requirements 12.1**

- [x] 5. Checkpoint — 确保类型和服务层编译通过
  - 确保所有类型定义、Mapper、服务层代码无 TypeScript 编译错误，ask the user if questions arise.

- [ ] 6. 医生终端组件改造
  - [x] 6.1 新建 `TherapyProjectSelector` 组件替换 `TherapyPackageSelector`：接收 `selectedProjects: TherapyProject[]`、`patientContraindications: Contraindication[]`、`onSelect: (projects: TherapyProject[]) => void`；实现关键词搜索过滤（name/region/targetAudience/mood）；实现多选添加/移除；实现禁忌症匹配过滤（项目 `contraindications` vs 患者禁忌症 name，匹配项标记禁用并显示原因）
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 12.2, 12.3_
  - [ ]* 6.2 编写属性测试：Property 4 — 关键词过滤正确性
    - **Property 4: 关键词过滤正确性**
    - 生成随机关键词和项目列表，验证过滤结果中每个项目的 name/region/targetAudience/mood 至少有一个包含关键词
    - **Validates: Requirements 5.2**
  - [ ]* 6.3 编写属性测试：Property 6 — 禁忌症过滤正确性
    - **Property 6: 禁忌症过滤正确性**
    - 生成随机患者禁忌症和项目列表（含随机 contraindications），验证禁用集合恰好等于存在交集的项目集合
    - **Validates: Requirements 5.5, 12.2, 12.3**
  - [x] 6.4 改造 `TherapyProjectList` 组件：props 从 `selectedPackage: TherapyPackage | null` 改为 `selectedProjects: TherapyProject[]`；空数组时显示「请先选择疗愈项目」占位提示；非空时按列表顺序渲染项目卡片
    - _Requirements: 7.1, 7.2, 7.3_
  - [x] 6.5 改造 `StatusTransition` 组件：props 从 `selectedPackage` 改为 `selectedProjects: TherapyProject[]`；流转确认页显示已选项目数量和名称标签；移除所有 `TherapyPackage` 引用
    - _Requirements: 8.1, 8.2, 8.3_
  - [x] 6.6 改造 `AISuggestionPanel` 组件：将 `suggestion.packageName` 改为显示 `suggestion.projectNames`；采纳逻辑从读取 `packageId` 改为读取 `projectIds`
    - _Requirements: 1.4, 6.2_
  - [x] 6.7 改造 `DoctorTerminalPage`：`selectedPackage` 状态替换为 `selectedProjects: TherapyProject[]`；`handleAdoptSuggestion` 改为根据 `projectIds` 批量查询项目填充 `selectedProjects`；`handleConfirmPrescription` 在 `selectedProjects` 非空时才允许流转；传递 `patientContraindications` 给 `TherapyProjectSelector`；移除所有 `TherapyPackage` 引用；创建处方时不传 `therapy_package_id`
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 12.4_
  - [ ]* 6.8 编写属性测试：Property 7 — AI 建议采纳填充 selectedProjects
    - **Property 7: AI 建议采纳填充 selectedProjects**
    - 生成随机 `projectIds` 子集，验证采纳后 `selectedProjects` 包含恰好 N 个项目且 ID 匹配
    - **Validates: Requirements 6.2**
  - [ ]* 6.9 编写属性测试：Property 8 — 空选择阻止流转
    - **Property 8: 空选择阻止流转**
    - 验证 `selectedProjects` 为空数组时流转按钮不可点击或不可见
    - **Validates: Requirements 6.3**
  - [ ]* 6.10 编写属性测试：Property 9 — 渲染项目信息完整性
    - **Property 9: 渲染项目信息完整性**
    - 生成随机 `TherapyProject[]` 列表，验证渲染输出包含每个项目的名称和 region 标签
    - **Validates: Requirements 7.3, 8.2, 9.2**

- [ ] 7. 治疗终端组件改造
  - [x] 7.1 改造 `TreatmentPatientView`：从 `patient.projects` 读取项目列表替代 `patient.therapyPackage`；渲染每个项目的名称、region 标签、引导语标记和 BPM；移除所有 `TherapyPackage` 引用
    - _Requirements: 9.1, 9.2, 9.3_
  - [x] 7.2 改造 `TreatmentQueue`：`buildMockTreatmentPatient` 中 `therapyPackage` 改为 `projects`，引用 `mockTherapyProjects` 替代 `mockTherapyPackages`；移除对 `therapyPackages.ts` 的 import
    - _Requirements: 9.4_

- [x] 8. Checkpoint — 确保所有组件编译通过且无 TherapyPackage 残留引用
  - 确保所有组件无 TypeScript 编译错误，全局搜索确认无 `TherapyPackage`、`therapy_packages`、`toTherapyPackage`、`getPackages`、`getPackageById` 等已废弃引用，ask the user if questions arise.

- [ ] 9. 清理验证脚本和服务导出
  - [x] 9.1 更新 `scripts/verify-fields.ts`：移除对 `therapy_packages` 和 `therapy_package_items` 表的验证逻辑
    - _Requirements: 11.1_
  - [x] 9.2 更新 `src/services/index.ts` 和 `src/services/supabase/index.ts`（如有）：确保 `therapyService` 导出的方法签名与新接口一致
    - _Requirements: 2.1_

- [ ] 10. 更新数据模块设计文档
  - [x] 10.1 更新 `doc/backend/数据模块设计.md`：补充 `prescription_steps` 和 `system_config` 表描述；删除 `therapy_packages` 和 `therapy_package_items` 表描述；更新 `therapy_projects` 表新增 `contraindications` JSONB 字段；更新 `treatment_records` 表新增 `region` 字段和 `consultation_id` 索引变更；更新 `queue_items` 表新增 `region` 字段
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

- [x] 11. Final checkpoint — 确保所有测试通过
  - 确保所有属性测试和单元测试通过，全项目 TypeScript 编译无错误，ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- 每个任务引用了具体的 requirements 条款，确保可追溯
- Checkpoints 在服务层完成后和组件层完成后各设一个，确保增量验证
- 属性测试使用 `fast-check` 库，每个属性至少 100 次迭代
- Preview 配置文件（`src/pages/preview/configs/`）在当前项目中不存在，跳过 Requirement 10
- `src/types/supabase.ts` 的重新生成（Requirement 11.2）需要运行 `supabase gen types` 命令，在 checkpoint 中由用户手动执行
