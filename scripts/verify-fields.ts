/**
 * 前端 Mock 类型 vs Supabase 数据库字段 对照验证脚本
 * 用法: npx tsx scripts/verify-fields.ts
 */

// ============================================================
// 1. 定义前端 Mock 类型的字段（来自 src/services/types.ts）
// ============================================================

const frontendTypes: Record<string, string[]> = {
  Patient: [
    "id", "name", "gender", "age", "idNumber", "phone",
    "insuranceCardNo", "status", "createdAt",
  ],
  VitalSigns: [
    "systolicBP", "diastolicBP", "heartRate", "recordedAt", "recordedBy",
  ],
  Contraindication: [
    "code", "name", "pinyin", "pinyinInitial", "category",
  ],
  ScaleTemplate: [
    "id", "name", "description",
  ],
  ScaleQuestion: [
    "id", "text", "type", "required", "options", "sliderConfig",
  ],
  ScaleResult: [
    "templateId", "answers", "totalScore", "submittedAt",
  ],
  TherapyProject: [
    "id", "region", "name", "mechanism", "guidanceScript", "bpm",
    "mood", "energyLevel", "hasGuidance", "hasScenario", "targetAudience",
    "contraindications",
  ],
  AITherapySuggestion: [
    "id", "projectIds", "projectNames", "reason", "confidence", "generatedAt",
  ],
  QueueItem: [
    "id", "patientId", "patientName", "insuranceCardNo",
    "queueNumber", "status", "enqueuedAt", "prescriptionType",
  ],
  TreatmentRecord: [
    "patientId", "startTime", "endTime", "duration",
    "preVitals", "postVitals", "postScaleResult",
  ],
  ConsultationData: [
    "contraindications", "symptoms", "scaleResults", "aiSuggestion",
  ],
  // 旧类型（仍在 types.ts 中保留，outpatient-prescription 页面使用）
  AISuggestion: [
    "id", "herbs", "usage", "notes", "confidence", "generatedAt",
  ],
  PrescriptionData: [
    "meta", "herbs", "totalAmount",
  ],
  HerbItem: [
    "name", "dosage", "unit", "note",
  ],
};

// ============================================================
// 2. 定义 Supabase 数据库表字段（来自 migration SQL）
// ============================================================

const dbTables: Record<string, string[]> = {
  patients: [
    "id", "name", "gender", "age", "phone", "id_number",
    "insurance_card_no", "status", "created_at", "updated_at",
  ],
  vital_signs: [
    "id", "consultation_id", "stage",
    "systolic_bp", "diastolic_bp", "heart_rate",
    "recorded_at", "recorded_by",
  ],
  contraindications: [
    "id", "code", "name", "pinyin", "pinyin_initial", "category",
  ],
  scale_templates: [
    "id", "name", "description",
  ],
  scale_questions: [
    "id", "template_id", "sort_order", "text", "type",
    "required", "options", "slider_config",
  ],
  scale_results: [
    "id", "consultation_id", "stage", "template_id",
    "answers", "total_score", "submitted_at",
  ],
  therapy_projects: [
    "id", "region", "name", "mechanism", "guidance_script", "bpm",
    "mood", "energy_level", "has_guidance", "has_scenario",
    "target_audience", "notes", "is_internal", "contraindications",
  ],
  consultations: [
    "id", "patient_id", "status", "created_at",
  ],
  consultation_contraindications: [
    "consultation_id", "contraindication_id",
  ],
  ai_suggestions: [
    "id", "consultation_id", "model", "prompt_snapshot", "raw_response",
    "herbs", "usage", "notes", "confidence", "generated_at",
  ],
  prescriptions: [
    "id", "consultation_id",
    "meta", "herbs", "total_amount", "created_at",
  ],
  queue_items: [
    "id", "consultation_id", "patient_id", "queue_type",
    "queue_number", "status", "enqueued_at",
  ],
  treatment_records: [
    "id", "consultation_id", "start_time", "end_time",
    "duration", "created_at",
  ],
};

// ============================================================
// 3. 映射关系：前端类型 → DB 表
// ============================================================

/** camelCase → snake_case */
function toSnake(s: string): string {
  return s.replace(/([A-Z])/g, "_$1").toLowerCase();
}

const typeToTable: Record<string, string> = {
  Patient: "patients",
  VitalSigns: "vital_signs",
  Contraindication: "contraindications",
  ScaleTemplate: "scale_templates",
  ScaleQuestion: "scale_questions",
  ScaleResult: "scale_results",
  TherapyProject: "therapy_projects",
  QueueItem: "queue_items",
  TreatmentRecord: "treatment_records",
  AISuggestion: "ai_suggestions",
};

// 前端字段 → DB 字段的特殊映射（非简单 camelCase→snake_case 的情况）
const fieldOverrides: Record<string, Record<string, string | null>> = {
  Patient: {
    idNumber: "id_number",
    insuranceCardNo: "insurance_card_no",
    createdAt: "created_at",
  },
  VitalSigns: {
    systolicBP: "systolic_bp",
    diastolicBP: "diastolic_bp",
    heartRate: "heart_rate",
    recordedAt: "recorded_at",
    recordedBy: "recorded_by",
  },
  QueueItem: {
    patientName: null,       // 前端 join 展示用，DB 无此字段
    insuranceCardNo: null,   // 前端 join 展示用
    prescriptionType: null,  // 前端 join 展示用
    enqueuedAt: "enqueued_at",
    patientId: "patient_id",
    queueNumber: "queue_number",
  },
  TreatmentRecord: {
    patientId: null,        // DB 用 consultation_id 关联
    preVitals: null,        // 前端组合字段，DB 在 vital_signs 表
    postVitals: null,       // 同上
    postScaleResult: null,  // 前端组合字段，DB 在 scale_results 表
    startTime: "start_time",
    endTime: "end_time",
  },
  AISuggestion: {
    herbs: "herbs",         // DB 是 JSONB
    generatedAt: "generated_at",
  },
  ScaleResult: {
    templateId: "template_id",
    totalScore: "total_score",
    submittedAt: "submitted_at",
    // stage 在 DB 有但前端没有（前端通过上下文区分 pre/post）
  },
  ScaleQuestion: {
    sliderConfig: "slider_config",
  },
};

// ============================================================
// 4. 验证逻辑
// ============================================================

interface Issue {
  type: "missing_in_db" | "missing_in_frontend" | "no_table" | "info";
  typeName: string;
  field?: string;
  detail: string;
}

const issues: Issue[] = [];
let checkedCount = 0;
let matchedCount = 0;

for (const [typeName, fields] of Object.entries(typeToTable)) {
  const frontendFields = frontendTypes[typeName];
  const dbFields = dbTables[fields];

  if (!frontendFields) {
    issues.push({ type: "info", typeName, detail: `前端类型 ${typeName} 未在验证列表中定义` });
    continue;
  }
  if (!dbFields) {
    issues.push({ type: "no_table", typeName, detail: `DB 表 ${fields} 不存在` });
    continue;
  }

  const overrides = fieldOverrides[typeName] ?? {};

  // 检查前端字段是否在 DB 中有对应
  for (const feField of frontendFields) {
    checkedCount++;

    if (feField in overrides) {
      const mapped = overrides[feField];
      if (mapped === null) {
        // 明确标记为前端专用字段
        matchedCount++;
        continue;
      }
      if (dbFields.includes(mapped)) {
        matchedCount++;
        continue;
      }
      issues.push({
        type: "missing_in_db",
        typeName,
        field: feField,
        detail: `前端 ${typeName}.${feField} 映射到 ${fields}.${mapped}，但 DB 中无此字段`,
      });
      continue;
    }

    const snakeField = toSnake(feField);
    if (dbFields.includes(snakeField)) {
      matchedCount++;
    } else {
      issues.push({
        type: "missing_in_db",
        typeName,
        field: feField,
        detail: `前端 ${typeName}.${feField} → ${fields}.${snakeField} 在 DB 中未找到`,
      });
    }
  }

  // 检查 DB 字段是否在前端有对应（排除 id, created_at, updated_at 等通用字段）
  const skipDbFields = new Set(["id", "created_at", "updated_at", "consultation_id", "sort_order", "stage"]);
  const allMappedDbFields = new Set<string>();
  for (const feField of frontendFields) {
    if (feField in overrides) {
      const mapped = overrides[feField];
      if (mapped) allMappedDbFields.add(mapped);
    } else {
      allMappedDbFields.add(toSnake(feField));
    }
  }

  for (const dbField of dbFields) {
    if (skipDbFields.has(dbField)) continue;
    if (allMappedDbFields.has(dbField)) continue;

    // 特殊：DB 有额外字段是正常的（如 model, prompt_snapshot, raw_response 等 AI 内部字段）
    issues.push({
      type: "missing_in_frontend",
      typeName,
      field: dbField,
      detail: `DB ${fields}.${dbField} 在前端 ${typeName} 中无对应字段`,
    });
  }
}

// ============================================================
// 5. 额外检查：前端独有类型（无直接 DB 表对应）
// ============================================================

const frontendOnlyTypes = ["ConsultationData", "PrescriptionData", "HerbItem", "AITherapySuggestion"];
for (const t of frontendOnlyTypes) {
  issues.push({
    type: "info",
    typeName: t,
    detail: `前端组合类型，无直接 DB 表对应（通过 join/JSONB 组装）`,
  });
}

// ============================================================
// 6. 输出报告
// ============================================================

console.log("═══════════════════════════════════════════════════");
console.log("  HIS 前端 Mock 类型 vs Supabase DB 字段验证报告");
console.log("═══════════════════════════════════════════════════\n");

console.log(`检查字段数: ${checkedCount}`);
console.log(`匹配字段数: ${matchedCount}`);
console.log(`匹配率: ${((matchedCount / checkedCount) * 100).toFixed(1)}%\n`);

const missingInDb = issues.filter((i) => i.type === "missing_in_db");
const missingInFe = issues.filter((i) => i.type === "missing_in_frontend");
const infos = issues.filter((i) => i.type === "info");

if (missingInDb.length > 0) {
  console.log("❌ 前端有但 DB 缺失的字段:");
  for (const i of missingInDb) {
    console.log(`   ${i.detail}`);
  }
  console.log();
}

if (missingInFe.length > 0) {
  console.log("⚠️  DB 有但前端未映射的字段（可能是后端内部字段）:");
  for (const i of missingInFe) {
    console.log(`   ${i.detail}`);
  }
  console.log();
}

if (infos.length > 0) {
  console.log("ℹ️  信息:");
  for (const i of infos) {
    console.log(`   ${i.typeName}: ${i.detail}`);
  }
  console.log();
}

if (missingInDb.length === 0) {
  console.log("✅ 所有前端字段在 DB 中均有对应，字段映射完整。\n");
}

// 退出码：有 missing_in_db 则失败
process.exit(missingInDb.length > 0 ? 1 : 0);
