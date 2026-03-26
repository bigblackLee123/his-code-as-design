-- Migration: 疗愈项目新增频率字段
-- 用于治疗终端静区干预面板展示

-- 1. 新增字段
ALTER TABLE therapy_projects
  ADD COLUMN frequency VARCHAR(50),
  ADD COLUMN frequency_band VARCHAR(100);

COMMENT ON COLUMN therapy_projects.frequency IS '声波频率，如 7.83Hz、8-12Hz、432Hz';
COMMENT ON COLUMN therapy_projects.frequency_band IS '频段描述，如 舒曼波/Alpha波段、Theta波';

-- 2. 填入已知数据（从 mechanism 字段提取）
UPDATE therapy_projects SET frequency = '7.83Hz', frequency_band = '舒曼波/Alpha波段'
  WHERE id = 'e0000000-0000-0000-0000-000000000001'; -- 舒曼波

UPDATE therapy_projects SET frequency = '8-12Hz', frequency_band = 'Alpha波'
  WHERE id = 'e0000000-0000-0000-0000-000000000012'; -- 温泉水疗音乐冥想

UPDATE therapy_projects SET frequency = '8-12Hz', frequency_band = 'Alpha波'
  WHERE id = 'e0000000-0000-0000-0000-000000000016'; -- 暖阳安驻

UPDATE therapy_projects SET frequency = '8-12Hz', frequency_band = 'Alpha波'
  WHERE id = 'e0000000-0000-0000-0000-00000000001d'; -- alpha脑波音乐

UPDATE therapy_projects SET frequency = '4-8Hz', frequency_band = 'Theta波'
  WHERE id = 'e0000000-0000-0000-0000-00000000001e'; -- theta脑波音乐

UPDATE therapy_projects SET frequency = '432Hz', frequency_band = '自然共振'
  WHERE id = 'e0000000-0000-0000-0000-000000000021'; -- 432hz
