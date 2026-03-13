-- HIS 数据库建表
-- 枚举类型
CREATE TYPE patient_status AS ENUM (
  'checked-in','waiting','consulting','pending-treatment','treating','completed'
);
CREATE TYPE vital_stage AS ENUM ('pre-treatment','post-treatment');
CREATE TYPE scale_stage AS ENUM ('pre','post');
CREATE TYPE question_type AS ENUM ('single-choice','multi-choice','slider','text');
CREATE TYPE queue_type AS ENUM ('waiting','treatment');
CREATE TYPE queue_status AS ENUM ('waiting','in-progress','completed');

-- 模块一：核心基建
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  age INTEGER NOT NULL,
  phone VARCHAR(20),
  id_number VARCHAR(30),
  insurance_card_no VARCHAR(50) UNIQUE,
  status patient_status NOT NULL DEFAULT 'checked-in',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE contraindications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  pinyin VARCHAR(200),
  pinyin_initial VARCHAR(50),
  category VARCHAR(50)
);

CREATE TABLE scale_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT
);

CREATE TABLE scale_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES scale_templates(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  text TEXT NOT NULL,
  type question_type NOT NULL DEFAULT 'single-choice',
  required BOOLEAN NOT NULL DEFAULT true,
  options JSONB,
  slider_config JSONB
);

-- 模块二：疗愈内容库
CREATE TABLE therapy_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  region VARCHAR(50),
  name VARCHAR(200) NOT NULL,
  mechanism TEXT,
  guidance_script TEXT,
  bpm INTEGER,
  mood VARCHAR(100),
  energy_level VARCHAR(100),
  has_guidance BOOLEAN NOT NULL DEFAULT false,
  has_scenario BOOLEAN NOT NULL DEFAULT false,
  target_audience VARCHAR(200),
  notes TEXT,
  is_internal BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE therapy_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  target_audience TEXT,
  matched_symptoms TEXT
);

CREATE TABLE therapy_package_items (
  package_id UUID NOT NULL REFERENCES therapy_packages(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES therapy_projects(id) ON DELETE CASCADE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (package_id, project_id)
);

-- 模块三：业务流转核心
CREATE TABLE consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id),
  status VARCHAR(30) NOT NULL DEFAULT 'created',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE consultation_contraindications (
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  contraindication_id UUID NOT NULL REFERENCES contraindications(id),
  PRIMARY KEY (consultation_id, contraindication_id)
);

CREATE TABLE vital_signs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  stage vital_stage NOT NULL,
  systolic_bp INTEGER NOT NULL,
  diastolic_bp INTEGER NOT NULL,
  heart_rate INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_by VARCHAR(50)
);

CREATE TABLE scale_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  stage scale_stage NOT NULL,
  template_id UUID NOT NULL REFERENCES scale_templates(id),
  answers JSONB NOT NULL DEFAULT '{}',
  total_score INTEGER,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE ai_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  model VARCHAR(50),
  prompt_snapshot TEXT,
  raw_response TEXT,
  herbs JSONB,
  usage TEXT,
  notes TEXT,
  confidence DECIMAL(3,2),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  therapy_package_id UUID REFERENCES therapy_packages(id),
  meta JSONB,
  herbs JSONB,
  total_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 模块四：队列与治疗执行
CREATE TABLE queue_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id),
  queue_type queue_type NOT NULL,
  queue_number INTEGER NOT NULL,
  status queue_status NOT NULL DEFAULT 'waiting',
  enqueued_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE treatment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id UUID UNIQUE NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  duration INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 索引
CREATE INDEX idx_patients_insurance ON patients(insurance_card_no);
CREATE INDEX idx_patients_status ON patients(status);
CREATE INDEX idx_consultations_patient ON consultations(patient_id);
CREATE INDEX idx_vital_signs_consultation ON vital_signs(consultation_id);
CREATE INDEX idx_scale_results_consultation ON scale_results(consultation_id);
CREATE INDEX idx_queue_items_type_status ON queue_items(queue_type, status);
CREATE INDEX idx_queue_items_consultation ON queue_items(consultation_id);
CREATE INDEX idx_contraindications_pinyin ON contraindications(pinyin_initial);
CREATE INDEX idx_scale_questions_template ON scale_questions(template_id);

-- updated_at 自动更新触发器
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
