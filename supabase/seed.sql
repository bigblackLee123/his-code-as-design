-- ============================================================
-- HIS Seed 数据：模拟一个完整就诊流程
-- 分诊签到 → 生理数据 → 候诊 → 医生接诊 → 禁忌症 → 量表 → AI建议 → 处方 → 治疗队列 → 治疗记录
-- ============================================================

-- 固定 UUID 方便关联
DO $$
DECLARE
  v_patient_id UUID := 'a0000000-0000-0000-0000-000000000001';
  v_consultation_id UUID := 'b0000000-0000-0000-0000-000000000001';
  v_contra_1 UUID := 'c0000000-0000-0000-0000-000000000001';
  v_contra_2 UUID := 'c0000000-0000-0000-0000-000000000002';
  v_scale_tpl_id UUID := 'd0000000-0000-0000-0000-000000000001';
  -- 疗愈数据已迁移到 seed_therapy.sql，此处仅引用套餐 UUID
  v_therapy_pkg_id UUID := 'f0000000-0000-0000-0000-000000000001'; -- 失眠调理套餐
BEGIN

-- 模块一：基建数据
-- 患者
INSERT INTO patients (id, name, gender, age, phone, id_number, insurance_card_no, status)
VALUES (v_patient_id, '张三', 'male', 45, '13800138000', '310101197801010011', 'YB2024001', 'completed');

-- 禁忌症字典
INSERT INTO contraindications (id, code, name, pinyin, pinyin_initial, category) VALUES
(v_contra_1, 'CI001', '高血压', 'gaoxueya', 'gxy', '心血管'),
(v_contra_2, 'CI002', '糖尿病', 'tangniaobing', 'tnb', '内分泌');

-- 量表模板 + 题目
INSERT INTO scale_templates (id, name, description)
VALUES (v_scale_tpl_id, '匹兹堡睡眠质量指数(PSQI)', '评估近一个月的睡眠质量');

INSERT INTO scale_questions (template_id, sort_order, text, type, required, options) VALUES
(v_scale_tpl_id, 1, '近一个月，您通常几点上床睡觉？', 'text', true, NULL),
(v_scale_tpl_id, 2, '近一个月，您的睡眠质量如何？', 'single-choice', true,
  '[{"value":"0","label":"很好","score":0},{"value":"1","label":"较好","score":1},{"value":"2","label":"较差","score":2},{"value":"3","label":"很差","score":3}]'
),
(v_scale_tpl_id, 3, '近一个月，您的日间精神状态如何？', 'slider', true, NULL);

UPDATE scale_questions SET slider_config = '{"min":0,"max":10,"step":1}'
WHERE template_id = v_scale_tpl_id AND type = 'slider';

-- 模块二：疗愈内容库（完整数据见 seed_therapy.sql）

-- 模块三：业务流转
-- 就诊记录
INSERT INTO consultations (id, patient_id, status)
VALUES (v_consultation_id, v_patient_id, 'completed');

-- 就诊-禁忌症关联
INSERT INTO consultation_contraindications (consultation_id, contraindication_id) VALUES
(v_consultation_id, v_contra_1),
(v_consultation_id, v_contra_2);

-- 分诊时生理数据
INSERT INTO vital_signs (consultation_id, stage, systolic_bp, diastolic_bp, heart_rate, recorded_by)
VALUES (v_consultation_id, 'pre-treatment', 135, 85, 78, '护士王');

-- 治疗后生理数据
INSERT INTO vital_signs (consultation_id, stage, systolic_bp, diastolic_bp, heart_rate, recorded_by)
VALUES (v_consultation_id, 'post-treatment', 125, 80, 72, '护士王');

-- 诊前量表
INSERT INTO scale_results (consultation_id, stage, template_id, answers, total_score)
VALUES (v_consultation_id, 'pre', v_scale_tpl_id,
  '{"q1":"23:30","q2":"2","q3":6}', 12);

-- 治疗后量表
INSERT INTO scale_results (consultation_id, stage, template_id, answers, total_score)
VALUES (v_consultation_id, 'post', v_scale_tpl_id,
  '{"q1":"22:30","q2":"1","q3":8}', 7);

-- AI 建议
INSERT INTO ai_suggestions (consultation_id, model, prompt_snapshot, raw_response, herbs, usage, notes, confidence)
VALUES (v_consultation_id, 'qwen3.5-plus',
  '## 患者信息\n收缩压: 135 mmHg\n舒张压: 85 mmHg\n心率: 78\n## 禁忌症\n高血压、糖尿病\n## 量表\nPSQI总分: 12',
  '{"herbs":[...],"usage":"..."}',
  '[{"name":"酸枣仁","dosage":30,"unit":"g","reason":"养心安神"},{"name":"茯苓","dosage":15,"unit":"g","reason":"健脾宁心"},{"name":"知母","dosage":10,"unit":"g","reason":"清热除烦"}]',
  '水煎服，每日一剂，睡前一小时温服',
  '忌浓茶、咖啡，睡前避免剧烈运动',
  0.82);

-- 处方
INSERT INTO prescriptions (consultation_id, therapy_package_id, meta, herbs, total_amount)
VALUES (v_consultation_id, v_therapy_pkg_id,
  '{"route":"口服","usage":"水煎服","frequency":"每日一剂","dosage":"睡前一小时","orderType":"中药","department":"中医内科","doses":7}',
  '[{"name":"酸枣仁","dosage":30,"unit":"g"},{"name":"茯苓","dosage":15,"unit":"g"},{"name":"知母","dosage":10,"unit":"g"}]',
  55.00);

-- 模块四：队列与治疗
-- 候诊队列（已完成）
INSERT INTO queue_items (consultation_id, patient_id, queue_type, queue_number, status)
VALUES (v_consultation_id, v_patient_id, 'waiting', 1, 'completed');

-- 治疗队列（已完成）
INSERT INTO queue_items (consultation_id, patient_id, queue_type, queue_number, status)
VALUES (v_consultation_id, v_patient_id, 'treatment', 1, 'completed');

-- 治疗记录
INSERT INTO treatment_records (consultation_id, start_time, end_time, duration)
VALUES (v_consultation_id,
  now() - interval '2 hours',
  now() - interval '1 hour 30 minutes',
  1800);

END $$;
