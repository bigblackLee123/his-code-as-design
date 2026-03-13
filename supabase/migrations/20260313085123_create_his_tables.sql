-- ============================================================
-- HIS 数据库建表 Migration
-- ============================================================

-- 自定义枚举类型
CREATE TYPE patient_status AS ENUM (
  'checked-in', 'waiting', 'consulting',
  'pending-treatment', 'treating', 'completed'
);
CREATE TYPE vital_stage AS ENUM ('pre-treatment', 'post-treatment');
CREATE TYPE scale_stage AS ENUM ('pre', 'post');
CREATE TYPE question_type AS ENUM ('single-choice', 'multi-choice', 'slider', 'text');
CREATE TYPE queue_type AS ENUM ('waiting', 'treatment');
CREATE TYPE queue_status AS ENUM ('waiting', 'in-progress', 'completed');

-- ============================================================
-- 模块一：核心基建
-- ============================================================

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

-- =================================================  required BOOLEAN NOT NULL DEFAULT true,