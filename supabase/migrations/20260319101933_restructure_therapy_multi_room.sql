-- Migration: 疗愈套餐数据架构重构 + 多房间治疗流转
-- 对应任务：3.19 任务三

-- ============================================================
-- 1. 新增枚举
-- ============================================================
CREATE TYPE prescription_step_status AS ENUM (
  'pending', 'in-progress', 'completed', 'skipped'
);

-- ============================================================
-- 2. 新增表：prescription_steps（处方执行步骤）
-- ============================================================
CREATE TABLE prescription_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_id UUID NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES therapy_projects(id),
  region VARCHAR(50) NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  status prescription_step_status NOT NULL DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  treatment_record_id UUID REFERENCES treatment_records(id)
);

CREATE INDEX idx_prescription_steps_prescription ON prescription_steps(prescription_id);
CREATE INDEX idx_prescription_steps_region_status ON prescription_steps(region, status);

-- ============================================================
-- 3. 新增表：system_config（系统配置）
-- ============================================================
CREATE TABLE system_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER system_config_updated_at
  BEFORE UPDATE ON system_config
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 4. 修改 therapy_projects：新增禁忌症字段
-- ============================================================
ALTER TABLE therapy_projects
  ADD COLUMN contraindications JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN therapy_projects.contraindications IS '项目级禁忌症列表，如 ["癫痫患者","严重心律失常"]';

-- ============================================================
-- 5. 修改 therapy_package_items：新增匹配症状字段
-- ============================================================
ALTER TABLE therapy_package_items
  ADD COLUMN matched_symptoms TEXT;

COMMENT ON COLUMN therapy_package_items.matched_symptoms IS '该项目在此套餐中的匹配症状';

-- ============================================================
-- 6. 修改 treatment_records：去 UNIQUE 约束，新增 region
-- ============================================================
-- 去掉 consultation_id 的 UNIQUE 约束（改为 1:N）
ALTER TABLE treatment_records
  DROP CONSTRAINT treatment_records_consultation_id_key;

ALTER TABLE treatment_records
  ADD COLUMN region VARCHAR(50);

CREATE INDEX idx_treatment_records_consultation ON treatment_records(consultation_id);
CREATE INDEX idx_treatment_records_region ON treatment_records(region);

-- ============================================================
-- 7. 修改 queue_items：新增 region 字段
-- ============================================================
ALTER TABLE queue_items
  ADD COLUMN region VARCHAR(50);

CREATE INDEX idx_queue_items_region ON queue_items(region);
