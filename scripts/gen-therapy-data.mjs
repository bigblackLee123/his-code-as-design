/**
 * 从 xlsx 自动生成 supabase seed SQL：
 *  - therapy_projects（36 个治疗项目）
 *  - contraindications（禁忌症字典，聚合项目级 + 通用）
 *
 * v3: 废弃套餐概念，处方直接关联 project
 *     通用禁忌症合并到每个 project 的 contraindications JSONB
 *
 * Usage: node scripts/gen-therapy-data.mjs
 */
import XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const wb = XLSX.readFile('doc/曙光医院-音乐疗愈空间内容梳理-2.xlsx');

// ─── helpers ───
function parseBpm(raw) {
  if (!raw) return null;
  const m = String(raw).match(/(\d+)/);
  return m ? Number(m[1]) : null;
}
function bool(v) {
  return v === '有';
}
function esc(s) {
  if (s == null) return null;
  return String(s).replace(/'/g, "''").replace(/\n/g, '\\n');
}
function cleanRegion(r) {
  if (!r) return '';
  const m = r.match(/^([\u4e00-\u9fa5]+区)/);
  return m ? m[1] : r;
}

// ─── 通用禁忌症定义 ───
const GLOBAL_CONTRAINDICATIONS = ['听力损失', '耳鸣', '急性精神病状态', '严重心律失常'];
const SLEEP_REGION_CONTRAINDICATIONS = ['身体疼痛/疾病', '创伤患者'];

// ─── Parse 内容 sheet → projects ───
const contentData = XLSX.utils.sheet_to_json(wb.Sheets['内容'], { header: 1 });
let curRegion = '';
const allProjects = [];
for (let i = 1; i < contentData.length; i++) {
  const r = contentData[i];
  if (!r || r.length === 0) continue;
  if (r[0]) curRegion = r[0];

  const name = String(r[2] || '').trim();
  const internalName = String(r[3] || '').trim();
  // 过滤空 name 行（通用禁忌症等非项目行）
  if (!name && !internalName) continue;

  const rawNotes = r[15] || null;
  const projectContra = rawNotes
    ? String(rawNotes).split(/[，,、]/).map(s => s.trim()).filter(Boolean)
    : [];

  const region = cleanRegion(curRegion);

  // 合并通用禁忌症
  const merged = [...projectContra, ...GLOBAL_CONTRAINDICATIONS];
  if (region === '睡眠区') {
    merged.push(...SLEEP_REGION_CONTRAINDICATIONS);
  }
  const contraindications = [...new Set(merged)];

  allProjects.push({
    seq: r[1],
    name,
    internalName,
    region,
    mechanism: r[6] || '',
    guidanceScript: r[8] || null,
    bpm: parseBpm(r[9]),
    mood: String(r[10] || ''),
    energyLevel: String(r[11] || ''),
    hasGuidance: bool(r[12]),
    hasScenario: bool(r[13]),
    targetAudience: String(r[14] || '18岁以上'),
    notes: rawNotes,
    contraindications,
  });
}

// ─── 聚合所有禁忌症词条（去重）→ contraindications 字典表 ───
const allContraSet = new Set([...GLOBAL_CONTRAINDICATIONS, ...SLEEP_REGION_CONTRAINDICATIONS]);
for (const p of allProjects) {
  for (const c of p.contraindications) {
    allContraSet.add(c);
  }
}
const allContraList = [...allContraSet].sort();

// 简易拼音映射（覆盖禁忌症常用字）
const pinyinMap = {
  创: 'chuang', 伤: 'shang', 后: 'hou', 应: 'ying', 激: 'ji', 障: 'zhang', 碍: 'ai',
  严: 'yan', 重: 'zhong', 抑: 'yi', 郁: 'yu', 患: 'huan', 者: 'zhe',
  精: 'jing', 神: 'shen', 病: 'bing', 性: 'xing',
  分: 'fen', 裂: 'lie', 症: 'zheng',
  癫: 'dian', 痫: 'xian',
  心: 'xin', 血: 'xue', 管: 'guan', 疾: 'ji',
  物: 'wu', 质: 'zhi', 滥: 'lan', 用: 'yong',
  听: 'ting', 力: 'li', 损: 'sun', 失: 'shi',
  耳: 'er', 鸣: 'ming',
  急: 'ji', 状: 'zhuang', 态: 'tai',
  律: 'lv', 常: 'chang',
  身: 'shen', 体: 'ti', 疼: 'teng', 痛: 'tong',
};

function toPinyin(name) {
  let full = '';
  let initials = '';
  for (const ch of name) {
    const py = pinyinMap[ch];
    if (py) {
      full += py;
      initials += py[0].toUpperCase();
    } else if (/[a-zA-Z]/.test(ch)) {
      full += ch.toLowerCase();
      initials += ch.toUpperCase();
    }
  }
  return { pinyin: full, pinyinInitial: initials };
}

// 禁忌症分类映射
function getCategory(name) {
  if (['听力损失', '耳鸣'].includes(name)) return '感官';
  if (['心血管疾病患者', '严重心律失常'].includes(name)) return '心血管';
  if (['癫痫患者'].includes(name)) return '神经系统';
  if (['物质滥用患者'].includes(name)) return '成瘾';
  if (['身体疼痛/疾病', '创伤患者'].includes(name)) return '睡眠区通用';
  return '精神心理';
}

// ─── Generate UUIDs (deterministic) ───
function uuid(prefix, n) {
  const hex = n.toString(16).padStart(12, '0');
  return `${prefix}-0000-0000-0000-${hex}`;
}
const projUUIDs = allProjects.map((_, i) => uuid('e0000000', i + 1));

// ═══════════════════════════════════════════
// Generate seed SQL
// ═══════════════════════════════════════════
let sql = `-- ============================================================
-- 疗愈内容库 Seed（自动生成，勿手动编辑）
-- 来源: doc/曙光医院-音乐疗愈空间内容梳理-2.xlsx
-- 项目数: ${allProjects.length}
-- 禁忌症词条数: ${allContraList.length}
-- v3: 废弃套餐，处方直接关联 project
-- ============================================================

-- 清理旧数据
DELETE FROM consultation_contraindications;
DELETE FROM contraindications;
DELETE FROM therapy_projects;

`;

// projects
sql += '-- ── 疗愈项目 ──\n';
for (let i = 0; i < allProjects.length; i++) {
  const p = allProjects[i];
  const id = projUUIDs[i];
  const script = p.guidanceScript ? `'${esc(p.guidanceScript)}'` : 'NULL';
  const notes = p.notes ? `'${esc(p.notes)}'` : 'NULL';
  const contraJson = JSON.stringify(p.contraindications);
  sql += `INSERT INTO therapy_projects (id, region, name, mechanism, guidance_script, bpm, mood, energy_level, has_guidance, has_scenario, target_audience, notes, contraindications)
VALUES ('${id}', '${esc(p.region)}', '${esc(p.internalName || p.name)}', '${esc(p.mechanism)}', ${script}, ${p.bpm || 'NULL'}, '${esc(p.mood)}', '${esc(p.energyLevel)}', ${p.hasGuidance}, ${p.hasScenario}, '${esc(p.targetAudience)}', ${notes}, '${contraJson}'::jsonb);\n\n`;
}

// contraindications 字典
sql += '-- ── 禁忌症字典 ──\n';
allContraList.forEach((name, i) => {
  const code = `CI${String(i + 1).padStart(3, '0')}`;
  const id = uuid('c0000000', i + 1);
  const { pinyin: py, pinyinInitial: pyInit } = toPinyin(name);
  const cat = getCategory(name);
  sql += `INSERT INTO contraindications (id, code, name, pinyin, pinyin_initial, category)
VALUES ('${id}', '${code}', '${esc(name)}', '${py}', '${pyInit}', '${cat}');\n`;
});
sql += '\n';

writeFileSync('supabase/seed_therapy.sql', sql, 'utf-8');
console.log(`✅ supabase/seed_therapy.sql written (${allProjects.length} projects, ${allContraList.length} contraindications)`);

// Summary
console.log('\n📋 Summary:');
console.log(`   Projects: ${allProjects.length}`);
console.log(`   Contraindications: ${allContraList.length}`);
console.log(`   Global: ${GLOBAL_CONTRAINDICATIONS.join(', ')}`);
console.log(`   Sleep region: ${SLEEP_REGION_CONTRAINDICATIONS.join(', ')}`);
