# Hook 分离重构清单

> 目标：所有 Block 的 service 调用统一抽到独立 `use*.ts` hook 中，Block `.tsx` 只负责渲染。
> 已完成的不动：`ContraindicationInput` → `useContraindicationInput.ts`、`ScaleForm` → `useScaleForm.ts`

## 医生终端（6 个）

### 1. CallQueue.tsx → useCallQueue.ts

**抽出逻辑：**
- `queueService.getWaitingQueue(DEPARTMENT_ID)` — 加载队列
- `queueService.callNextWaiting(DEPARTMENT_ID)` — 叫号
- `patientService.getById(id)` — 获取患者信息
- `useQueueRealtime` 订阅刷新

**hook 签名：**
```ts
function useCallQueue() → {
  queue: QueueItem[];
  calling: boolean;
  callNext: () => Promise<Patient | null>;
}
```

### 2. PatientInfoBar.tsx → usePatientVitals.ts

**抽出逻辑：**
- `patientService.getVitalSigns(patientId)` — 加载生理数据

**hook 签名：**
```ts
function usePatientVitals(patientId: string) → {
  vitalSigns: VitalSigns | null;
}
```

### 3. AISuggestionPanel.tsx → useAISuggestion.ts

**抽出逻辑：**
- `consultationHelper.getActiveId(patientId)` — 获取 consultationId
- `aiService.getTherapySuggestion(...)` — 请求 AI 建议
- `therapyService.getProjectById(id)` — 采纳时解析项目
- 超时控制 + AbortController

**hook 签名：**
```ts
function useAISuggestion(patientId: string) → {
  suggestion: AITherapySuggestion | null;
  loading: boolean;
  error: string | null;
  fetch: () => void;
  adoptProjects: () => Promise<TherapyProject[]>;
}
```

### 4. TherapyProjectSelector.tsx → useTherapyProjects.ts

**抽出逻辑：**
- `therapyService.getProjects()` — 加载全部项目列表

**hook 签名：**
```ts
function useTherapyProjects() → {
  allProjects: TherapyProject[];
}
```

### 5. SymptomInput.tsx → useSymptomSearch.ts

**抽出逻辑：**
- `symptomService.search(term)` — 搜索症状（含 debounce）

**hook 签名：**
```ts
function useSymptomSearch(selected: Symptom[]) → {
  keyword: string;
  setKeyword: (v: string) => void;
  results: Symptom[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}
```

### 6. StatusTransition.tsx → useStatusTransition.ts

**抽出逻辑：**
- `prescriptionService.saveWithSteps(...)` — 保存处方
- `queueService.enqueueTreatment(patientId)` — 入治疗队列

**hook 签名：**
```ts
function useStatusTransition(patientId: string, selectedProjects: TherapyProject[]) → {
  state: "confirm" | "loading" | "success" | "error";
  queueItem: QueueItem | null;
  errorMsg: string;
  confirm: () => Promise<void>;
}
```

---

## 治疗终端（2 个）

### 7. TreatmentQueue.tsx → useTreatmentQueue.ts

**抽出逻辑：**
- `queueService.getTreatmentQueue()` — 加载队列
- `treatmentQueueService.checkInByRoom(cardSuffix, region)` — 刷卡签到
- `consultationHelper.getActiveId(patientId)` — 获取 consultationId
- `useQueueRealtime` 订阅刷新

**hook 签名：**
```ts
function useTreatmentQueue(region: string) → {
  queue: QueueItem[];
  checking: boolean;
  errorMsg: string;
  checkIn: (cardSuffix: string) => Promise<{ checkIn: RoomCheckIn; consultationId: string } | null>;
}
```

### 8. QueueComplete.tsx → useQueueComplete.ts

**抽出逻辑：**
- `treatmentQueueService.completeTreatment(...)` — 出队

**hook 签名：**
```ts
function useQueueComplete(patientId: string) → {
  state: "confirm" | "loading" | "success" | "error";
  errorMsg: string;
  confirm: (postVitals?: VitalSigns, postScaleResult?: ScaleResult) => Promise<void>;
}
```

---

## 分诊终端（3 个）

### 9. PatientCheckIn.tsx → usePatientCheckIn.ts

**抽出逻辑：**
- `patientService.getByInsuranceCard(cardNo)` — 刷卡查询
- `patientService.create(...)` — 新建患者
- `patientService.checkIn(id)` — 老患者复诊签到

**hook 签名：**
```ts
function usePatientCheckIn() → {
  mode: "idle" | "reading" | "success" | "manual";
  patient: Patient | null;
  error: string | null;
  simulateCardRead: () => Promise<void>;
  setMode: (m: Mode) => void;
  setPatientFromManual: (p: Patient) => void;
}
```

### 10. ManualPatientForm.tsx → useManualPatientForm.ts

**抽出逻辑：**
- `patientService.create(...)` — 创建患者
- 表单校验逻辑

**hook 签名：**
```ts
function useManualPatientForm(onSubmit: (p: Patient) => void) → {
  form: FormData;
  errors: Record<string, string>;
  submitting: boolean;
  updateField: (field: string, value: string) => void;
  handleSubmit: () => Promise<void>;
}
```

### 11. VitalSignsInput.tsx → useVitalSignsInput.ts

**抽出逻辑：**
- `patientService.saveVitalSigns(patientId, vitals)` — 保存生理数据
- 输入校验逻辑

**hook 签名：**
```ts
function useVitalSignsInput(patientId: string, onSave: (v: VitalSigns) => void) → {
  values: Record<VitalField, string>;
  validation: ValidationResult;
  saving: boolean;
  canSave: boolean;
  handleChange: (field: VitalField, raw: string) => void;
  handleSave: () => Promise<void>;
}
```

---

## Page 级清理

### DoctorTerminalPage.tsx

- 移除 `import { therapyService, patientService } from "@/services"`
- mock 预填逻辑移到一个 `useMockInit.ts` hook 或直接删除（如果不再需要 mock 模式）

---

## 执行顺序建议

1. 医生终端 1-6（改动最多，先统一）
2. 治疗终端 7-8
3. 分诊终端 9-11
4. DoctorTerminalPage 清理
5. 全量 `getDiagnostics` 验证