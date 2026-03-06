# 需求文档：Code-as-Design 工作流系统

## 简介

本系统为医院信息系统（HIS）构建一套"Code-as-Design"工作流，完全跳过 Figma 等传统设计工具，在代码环境内完成 UI 设计与开发的全流程。系统通过 Kiro 的 Steering 文件建立纯文本设计规范，通过 Agent Hooks 实现自动化质量保障，通过 Powers 封装可复用的设计系统能力，并采用"拼积木"式 Prompt 策略确保生成代码的可维护性。技术栈基于 React + TypeScript + Tailwind CSS + shadcn/ui，严格禁止手写自定义 CSS 类和内联样式。

## 术语表

- **Steering_File**: Kiro 的 Steering 文件，位于 `.kiro/steering/` 目录下的 Markdown 文件，用于定义项目级别的规则、约束和上下文，AI 在生成代码时自动遵循
- **Agent_Hook**: Kiro 的 Agent Hook，在特定事件（如文件保存、代码生成）时自动触发的检查或操作脚本
- **Power**: Kiro 的 Power，封装可复用能力的模块，可被 AI 在对话和代码生成过程中调用
- **Design_Token**: 设计令牌，以键值对形式定义的设计基础变量（颜色、间距、字号、圆角等），是设计规范的最小原子单位
- **Component_Constraint**: 组件约束规则，定义某个 UI 组件允许的属性组合、禁止的用法和推荐的模式
- **HIS**: 医院信息系统（Hospital Information System），本项目的业务领域
- **Design_Spec_Engine**: 设计规范引擎，负责解析 Steering 文件中的设计规范并提供查询能力的核心模块
- **Style_Validator**: 样式校验器，负责检查生成的 UI 代码是否符合设计规范的校验模块
- **Component_Registry**: 组件注册表，记录所有可用 UI 组件及其约束规则的数据结构
- **Prompt_Template**: Prompt 模板，用于指导 AI 按"拼积木"方式生成 UI 代码的结构化提示词模板
- **Block_Composition**: 积木式组合，将页面拆分为独立的 UI 区块（Block），每个区块独立生成、独立校验，最终组合成完整页面的策略


## 需求

### 需求 1：纯文本设计规范定义

**用户故事：** 作为 HIS 前端开发者，我希望在 Steering 文件中以纯文本方式定义完整的设计规范，以便 AI 在生成 UI 代码时自动遵循统一的视觉标准，无需依赖 Figma 等外部设计工具。

#### 验收标准

1. THE Design_Spec_Engine SHALL 从 `.kiro/steering/` 目录下的 Markdown 文件中解析 Design_Token 定义，包括颜色、间距、字号、圆角、阴影和断点六类令牌
2. WHEN 开发者在 Steering 文件中新增或修改 Design_Token 时，THE Design_Spec_Engine SHALL 在下次代码生成时使用更新后的令牌值
3. THE Design_Spec_Engine SHALL 解析 Steering 文件中定义的品牌色体系，包括主色、辅助色、语义色（成功、警告、错误、信息）和中性色阶
4. THE Design_Spec_Engine SHALL 解析 Steering 文件中定义的排版规范，包括字体族、字号阶梯（h1-h6、body、caption）和行高比例
5. THE Design_Spec_Engine SHALL 解析 Steering 文件中定义的间距系统，采用 4px 基准网格的倍数体系（4、8、12、16、20、24、32、40、48、64）
6. WHEN Steering 文件中的 Design_Token 定义存在语法错误时，THE Design_Spec_Engine SHALL 返回包含错误位置和修复建议的诊断信息
7. THE Design_Spec_Engine SHALL 将解析后的 Design_Token 映射为对应的 Tailwind CSS 工具类名称

### 需求 2：组件约束规则体系

**用户故事：** 作为 HIS 前端开发者，我希望在 Steering 文件中定义每个 UI 组件的使用约束，以便 AI 生成的代码始终遵循组件库的最佳实践，避免产生不一致或不可维护的组件用法。

#### 验收标准

1. THE Component_Registry SHALL 从 Steering 文件中解析组件约束规则，每条规则包含组件名称、允许的属性列表、禁止的属性组合和推荐的默认值
2. WHEN 开发者定义一个组件约束规则时，THE Component_Registry SHALL 校验规则格式的完整性，缺少必填字段时返回具体的缺失字段名称
3. THE Component_Registry SHALL 支持定义组件的层级关系，明确哪些组件只能作为特定父组件的子组件使用
4. THE Component_Registry SHALL 支持定义组件的互斥规则，明确哪些组件属性不能同时使用
5. WHEN AI 生成 UI 代码引用了 Component_Registry 中未注册的组件时，THE Style_Validator SHALL 标记该组件为未知组件并给出最相似的已注册组件建议
6. THE Component_Registry SHALL 为 HIS 场景预置高密度数据展示组件的约束规则，包括数据表格、统计卡片、时间线和表单布局四类组件


### 需求 3：样式代码自动校验（Agent Hook）

**用户故事：** 作为 HIS 前端开发者，我希望每次生成或保存 UI 代码时自动检查是否符合设计规范，以便在开发过程中即时发现并修复违规样式，保持代码库的一致性。

#### 验收标准

1. WHEN 开发者保存包含 JSX/TSX 的文件时，THE Style_Validator SHALL 自动触发样式校验检查
2. WHEN 生成的代码中包含内联 `style` 属性时，THE Style_Validator SHALL 将其标记为违规并提供等效的 Tailwind CSS 工具类替代方案
3. WHEN 生成的代码中包含自定义 CSS 类名（非 Tailwind 工具类、非 shadcn/ui 组件类）时，THE Style_Validator SHALL 将其标记为违规并提供等效的 Tailwind CSS 工具类替代方案
4. WHEN 生成的代码中使用的颜色值未在 Design_Token 中定义时，THE Style_Validator SHALL 将其标记为违规并推荐最接近的已定义颜色令牌
5. WHEN 生成的代码中使用的间距值不符合 4px 基准网格时，THE Style_Validator SHALL 将其标记为违规并推荐最接近的合规间距值
6. THE Style_Validator SHALL 在校验完成后生成结构化的校验报告，包含违规总数、各违规项的文件路径、行号、违规类型和修复建议
7. IF Style_Validator 在校验过程中遇到无法解析的文件格式，THEN THE Style_Validator SHALL 跳过该文件并在校验报告中记录跳过原因
8. WHEN 校验报告中存在违规项时，THE Style_Validator SHALL 按严重程度（错误、警告、提示）对违规项进行分级

### 需求 4：可复用设计系统能力封装（Power）

**用户故事：** 作为 HIS 前端开发者，我希望通过 Kiro Power 快速查询设计系统中的令牌、组件和模式，以便在开发过程中高效获取设计规范信息，减少查阅文档的时间。

#### 验收标准

1. THE Design_Spec_Engine SHALL 提供 Design_Token 查询能力，支持按类别（颜色、间距、字号等）和关键词检索令牌定义
2. THE Component_Registry SHALL 提供组件浏览能力，支持列出所有已注册组件及其约束摘要
3. WHEN 开发者通过 Power 查询某个具体组件时，THE Component_Registry SHALL 返回该组件的完整约束规则、使用示例代码和禁止用法列表
4. THE Design_Spec_Engine SHALL 提供设计模式推荐能力，WHEN 开发者描述一个 HIS 业务场景（如"患者列表页"、"医嘱录入表单"）时，THE Design_Spec_Engine SHALL 返回推荐的页面布局结构和组件组合方案
5. WHEN Power 查询未匹配到结果时，THE Design_Spec_Engine SHALL 返回空结果集并附带相关的搜索建议


### 需求 5：积木式 Prompt 策略与代码生成

**用户故事：** 作为 HIS 前端开发者，我希望通过"拼积木"式的 Prompt 策略生成 UI 代码，以便将复杂页面拆分为独立的 UI 区块逐一生成，避免 AI 一次性生成大量不可维护的代码。

#### 验收标准

1. THE Prompt_Template SHALL 将页面生成任务拆分为独立的 Block 级别任务，每个 Block 对应页面中一个语义完整的 UI 区域
2. WHEN 开发者指定一个页面布局时，THE Prompt_Template SHALL 生成该页面的 Block 拆分方案，每个 Block 包含名称、职责描述和预期使用的组件列表
3. THE Prompt_Template SHALL 为每个 Block 生成独立的代码文件，每个文件为一个自包含的 React 组件
4. WHEN 生成单个 Block 的代码时，THE Prompt_Template SHALL 在 Prompt 中注入该 Block 相关的 Design_Token 子集和 Component_Constraint 子集，限制 AI 的生成范围
5. THE Prompt_Template SHALL 生成 Block 之间的组合代码，通过 props 和 context 定义 Block 间的数据流
6. WHEN 生成的单个 Block 代码超过 200 行时，THE Prompt_Template SHALL 提示开发者将该 Block 进一步拆分为子 Block
7. THE Prompt_Template SHALL 为 HIS 场景预置常用页面模板，包括列表页、详情页、表单页和仪表盘页四种布局模板

### 需求 6：HIS 场景专用设计规范

**用户故事：** 作为 HIS 前端开发者，我希望设计规范中包含医院信息系统特有的 UI 模式和约束，以便生成的界面符合医疗行业的信息展示标准和操作习惯。

#### 验收标准

1. THE Design_Spec_Engine SHALL 定义 HIS 专用的数据密度模式，支持"紧凑"、"标准"和"宽松"三种密度级别，每种级别对应不同的行高、间距和字号组合
2. THE Design_Spec_Engine SHALL 定义 HIS 专用的语义色彩规范，包括患者状态色（入院-蓝、在院-绿、出院-灰、危急-红）和医嘱状态色（待执行-橙、执行中-蓝、已完成-绿、已取消-灰）
3. THE Component_Registry SHALL 定义 HIS 数据表格组件的约束规则，包括必须支持列固定、行选择、单元格编辑和虚拟滚动四项能力
4. THE Component_Registry SHALL 定义 HIS 表单布局组件的约束规则，支持单列、双列和三列布局，表单标签统一采用右对齐方式
5. WHEN 开发者生成包含患者信息的 UI 区块时，THE Prompt_Template SHALL 自动注入数据脱敏提示，要求对姓名、身份证号和联系方式字段使用脱敏展示组件
6. THE Design_Spec_Engine SHALL 定义 HIS 专用的图标规范，明确医疗场景常用图标（如听诊器、药品、病床、心电图等）的使用场景和尺寸约束


### 需求 7：Steering 文件结构与管理

**用户故事：** 作为 HIS 前端开发者，我希望 Steering 文件有清晰的组织结构和版本管理机制，以便团队成员能够高效地维护和扩展设计规范。

#### 验收标准

1. THE Design_Spec_Engine SHALL 定义标准的 Steering 文件目录结构，包括 `tokens/`（设计令牌）、`components/`（组件约束）、`patterns/`（页面模式）和 `rules/`（校验规则）四个子目录
2. WHEN 开发者新建一个 Steering 文件时，THE Design_Spec_Engine SHALL 提供该文件类型对应的模板，模板包含必填字段和示例内容
3. THE Design_Spec_Engine SHALL 校验 Steering 文件之间的引用关系，WHEN 组件约束引用了未定义的 Design_Token 时，THE Design_Spec_Engine SHALL 报告引用错误并指出缺失的令牌名称
4. THE Design_Spec_Engine SHALL 支持 Steering 文件的模块化导入，允许一个 Steering 文件引用另一个 Steering 文件中定义的令牌或规则
5. WHEN 多个 Steering 文件中定义了同名的 Design_Token 时，THE Design_Spec_Engine SHALL 报告命名冲突并要求开发者解决冲突后才能继续使用

### 需求 8：视觉验证闭环（Chrome DevTools MCP 集成）

**用户故事：** 作为 HIS 前端开发者，我希望在代码生成后能自动截取实际渲染效果的截图，并由 AI 对比设计规范进行视觉评估，以便在不依赖人工肉眼检查的情况下发现视觉偏差和布局问题。

#### 验收标准

1. THE 工作流 SHALL 集成 Chrome DevTools MCP Server，通过 `.kiro/settings/mcp.json` 配置 `chrome-devtools-mcp` 服务
2. WHEN 开发者完成一个 UI 组件或页面的代码编写后，THE 工作流 SHALL 支持通过 Agent Hook（postToolUse 或 userTriggered）自动启动浏览器预览并截取当前页面截图
3. THE 工作流 SHALL 利用 Chrome DevTools MCP 的 `take_screenshot` 工具获取页面渲染截图，并利用 `take_snapshot` 工具获取 DOM 结构快照
4. WHEN 截图和 DOM 快照获取完成后，THE 工作流 SHALL 通过 askAgent Hook 将截图与 Steering 文件中的设计规范（Design Token、组件约束、数据密度模式）进行对比评估
5. THE 视觉评估 SHALL 检查以下维度：颜色是否符合品牌色体系、间距是否符合 4px 网格、组件是否使用了正确的 shadcn/ui 变体、数据密度是否符合 HIS 紧凑模式要求、布局是否符合页面模式定义
6. THE 工作流 SHALL 生成结构化的视觉评估报告，包含截图引用、各维度的合规/违规状态、具体偏差描述和修复建议
7. WHEN 视觉评估发现违规项时，THE 工作流 SHALL 将违规信息以对话消息的形式呈现给开发者，由开发者决定是否让 AI 自动修复
8. THE 工作流 SHALL 支持通过 Chrome DevTools MCP 的 `lighthouse_audit` 工具对页面进行无障碍性（Accessibility）审计，确保 HIS 界面符合基本的可访问性标准
9. THE 工作流 SHALL 支持通过 Chrome DevTools MCP 的 `resize_page` 工具模拟不同屏幕尺寸，验证响应式布局在 HIS 常用分辨率（1920x1080、1366x768、1280x1024）下的表现

### 需求 9：设计规范解析与令牌映射的往返一致性

**用户故事：** 作为 HIS 前端开发者，我希望设计规范的解析和序列化过程是可逆的，以便确保规范文件在读取和写回后内容保持一致，防止规范信息在处理过程中丢失。

#### 验收标准

1. THE Design_Spec_Engine SHALL 提供 Steering 文件的序列化能力，将内存中的 Design_Token 数据结构格式化输出为合法的 Steering Markdown 文件
2. FOR ALL 合法的 Steering 文件，解析后再序列化再解析 SHALL 产生与首次解析等价的 Design_Token 数据结构（往返一致性）
3. THE Design_Spec_Engine SHALL 在序列化时保留 Steering 文件中的注释内容和原始格式
4. WHEN Design_Token 数据结构包含所有必填字段时，THE Design_Spec_Engine SHALL 序列化为合法的 Steering Markdown 文件，且该文件可被重新解析而不产生错误

### 需求 10：端到端工作流编排

**用户故事：** 作为 HIS 前端开发者，我希望整个 Code-as-Design 工作流（规范定义 → 代码生成 → 静态校验 → 视觉验证 → 反馈修复）能够通过 Kiro 的 Hook 体系自动编排，以便形成一个无缝的开发闭环。

#### 验收标准

1. THE 工作流 SHALL 定义完整的 Hook 链路：preToolUse（生成前注入规范）→ postToolUse（生成后静态校验）→ userTriggered（视觉验证）
2. WHEN 开发者触发视觉验证 Hook 时，THE 工作流 SHALL 自动执行：启动/连接浏览器 → 导航到预览页面 → 截图 → DOM 快照 → AI 评估 → 输出报告
3. THE 工作流 SHALL 支持"自动修复"模式：WHEN AI 评估发现可自动修复的违规项（如颜色值替换、间距调整）时，THE 工作流 SHALL 生成修复代码并再次触发视觉验证，形成迭代闭环
4. THE 工作流 SHALL 在迭代修复超过 3 轮仍未通过视觉验证时，停止自动修复并将问题报告给开发者进行人工决策
