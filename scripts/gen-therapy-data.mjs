/**
 * 从 xlsx 自动生成：
 *  1. supabase seed SQL（therapy_projects / therapy_packages / therapy_package_items）
 *  2. mock therapyPackages.ts
 *
 * Usage: node scripts/gen-therapy-data.mjs
 */
import XLSX from 'xlsx';
import { writeFileSync } from 'fs';

const wb = XLSX.readFile('doc/曙光医院-音乐疗愈空间内容梳理-1.xlsx');

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
  // "睡眠区（不仅是睡眠，包括理疗按摩）" → "睡眠区"
  // "情志区（15-20分" → "情志区"
  const m = r.match(/^([\u4e00-\u9fa5]+区)/);
  return m ? m[1] : r;
}
function pinyin(name) {
  // 简易拼音首字母：取每个汉字的首字母缩写
  // 这里用硬编码映射，因为项目名都是中文
  const map = {
    失: 's', 眠: 'm', 调: 't', 理: 'l', 套: 't', 餐: 'c',
    抑: 'y', 郁: 'y', 舒: 's', 缓: 'h',
    焦: 'j', 虑: 'l', 解: 'j',
    帕: 'p', 金: 'j', 森: 's', 康: 'k', 复: 'f',
    高: 'g', 血: 'x', 压: 'y', 节: 'j',
    肝: 'g', 火: 'h', 旺: 'w',
    腰: 'y', 部: 'b', 不: 'b', 适: 's',
    更: 'g', 年: 'n', 期: 'q', 综: 'z', 合: 'h', 征: 'z',
    术: 's', 后: 'h',
    老: 'l', 认: 'r', 知: 'z', 衰: 's', 退: 't',
    冠: 'g', 心: 'x', 病: 'b', 辅: 'f', 助: 'z',
    糖: 't', 尿: 'n',
    职: 'z', 场: 'c',
    产: 'c', 情: 'q', 绪: 'x',
  };
  let result = '';
  for (const ch of name) {
    if (map[ch]) result += map[ch];
  }
  return result || name.substring(0, 4);
}

// ─── Parse 内容 sheet → projects ───
const contentData = XLSX.utils.sheet_to_json(wb.Sheets['内容'], { header: 1 });
let curRegion = '';
const allProjects = [];
for (let i = 1; i < contentData.length; i++) {
  const r = contentData[i];
  if (!r || r.length === 0) continue;
  if (r[0]) curRegion = r[0];
  allProjects.push({
    seq: r[1],
    name: String(r[2] || ''),
    internalName: String(r[3] || ''),
    region: cleanRegion(curRegion),
    mechanism: r[6] || '',
    guidanceScript: r[8] || null,
    bpm: parseBpm(r[9]),
    mood: String(r[10] || ''),
    energyLevel: String(r[11] || ''),
    hasGuidance: bool(r[12]),
    hasScenario: bool(r[13]),
    targetAudience: String(r[14] || '18岁以上'),
    notes: r[15] || null,
  });
}

// ─── Parse 套餐 sheet → packages ───
const pkgData = XLSX.utils.sheet_to_json(wb.Sheets['套餐'], { header: 1 });
let curPkg = null;
const allPackages = [];
for (let i = 1; i < pkgData.length; i++) {
  const r = pkgData[i];
  if (!r || r.length === 0) continue;
  if (r[0]) {
    curPkg = {
      seq: r[0],
      name: String(r[1]),
      targetAudience: String(r[2] || ''),
      items: [],
      allSymptoms: [],
    };
    allPackages.push(curPkg);
  }
  if (curPkg) {
    curPkg.items.push({
      region: String(r[3] || ''),
      projectInternalName: String(r[4] || ''),
      mechanism: String(r[5] || ''),
      symptoms: String(r[6] || ''),
    });
    if (r[6]) curPkg.allSymptoms.push(String(r[6]));
  }
}

// ─── Build name lookup: internalName → project index ───
const nameToIdx = new Map();
allProjects.forEach((p, i) => {
  nameToIdx.set(p.internalName, i);
  nameToIdx.set(p.name, i);
});

// 手动映射：套餐 sheet 中的名称 → 内容 sheet 中的 internalName
const manualMap = {
  '舒曼波（同痰湿质）': '舒曼波',
  '心率平复催眠曲': '心率牵引-01',
  'theta 禅意脑波音乐': 'theta脑波音乐',
  '古风纯音乐': '古风《做个神仙》',
  '平和质（同森林冥想）': '平和质（同森林冥想）',
  '432hz 助眠古典乐': '432hz',
  '海洋冥想（同特禀质）': '海洋冥想（同特禀质）',
  '阴虚质（溪水）': '阴虚质（溪水）',
  '湿热质（星空）': '湿热质（星空）',
  '瘀血质（身体扫描）': '瘀血质（身体扫描）',
  '气郁质（花丛）': '气郁质（花丛）',
  '重回母体冥想（同气虚质）': '重回母体冥想（同气虚质）',
  // 以下无法确定，暂映射到最接近的
  '静心纯音乐': 'A1',           // TODO: 需确认
  'delta脑波音乐': 'alpha脑波音乐', // TODO: 需确认（内容sheet无delta，用alpha代替）
  '情景冥想': '动物陪伴冥想《吸猫》', // TODO: 需确认
  '助眠冥想': '海洋冥想',        // TODO: 需确认（情志区版海洋冥想）
};
for (const [alias, target] of Object.entries(manualMap)) {
  const idx = nameToIdx.get(target);
  if (idx != null) nameToIdx.set(alias, idx);
}

// ─── Resolve package items to project indices ───
for (const pkg of allPackages) {
  for (const item of pkg.items) {
    // Try exact match first, then fuzzy
    let idx = nameToIdx.get(item.projectInternalName);
    if (idx == null) {
      // fuzzy: find project whose internalName contains the item name or vice versa
      const found = allProjects.findIndex(
        (p) =>
          p.internalName.includes(item.projectInternalName) ||
          item.projectInternalName.includes(p.internalName) ||
          p.name.includes(item.projectInternalName) ||
          item.projectInternalName.includes(p.name),
      );
      idx = found >= 0 ? found : null;
    }
    item.projectIdx = idx;
    if (idx == null) {
      console.warn(`⚠️  Package "${pkg.name}" item "${item.projectInternalName}" not found in 内容 sheet`);
    }
  }
}

// ─── Generate UUIDs (deterministic) ───
function uuid(prefix, n) {
  const hex = n.toString(16).padStart(12, '0');
  // Standard UUID: 8-4-4-4-12
  return `${prefix}-0000-0000-0000-${hex}`;
}
const projUUIDs = allProjects.map((_, i) => uuid('e0000000', i + 1));
const pkgUUIDs = allPackages.map((_, i) => uuid('f0000000', i + 1));

// ═══════════════════════════════════════════
// 1. Generate seed SQL
// ═══════════════════════════════════════════
let sql = `-- ============================================================
-- 疗愈内容库 Seed（自动生成，勿手动编辑）
-- 来源: doc/曙光医院-音乐疗愈空间内容梳理-1.xlsx
-- 项目数: ${allProjects.length}  套餐数: ${allPackages.length}
-- ============================================================

-- 清理旧数据
DELETE FROM therapy_package_items;
DELETE FROM therapy_packages;
DELETE FROM therapy_projects;

`;

// projects
sql += '-- ── 疗愈项目 ──\n';
for (let i = 0; i < allProjects.length; i++) {
  const p = allProjects[i];
  const id = projUUIDs[i];
  const script = p.guidanceScript ? `'${esc(p.guidanceScript)}'` : 'NULL';
  const notes = p.notes ? `'${esc(p.notes)}'` : 'NULL';
  sql += `INSERT INTO therapy_projects (id, region, name, mechanism, guidance_script, bpm, mood, energy_level, has_guidance, has_scenario, target_audience, notes)
VALUES ('${id}', '${esc(p.region)}', '${esc(p.internalName || p.name)}', '${esc(p.mechanism)}', ${script}, ${p.bpm || 'NULL'}, '${esc(p.mood)}', '${esc(p.energyLevel)}', ${p.hasGuidance}, ${p.hasScenario}, '${esc(p.targetAudience)}', ${notes});\n\n`;
}

// packages
sql += '-- ── 疗愈套餐 ──\n';
for (let i = 0; i < allPackages.length; i++) {
  const pkg = allPackages[i];
  const id = pkgUUIDs[i];
  const symptoms = [...new Set(pkg.allSymptoms)].join(',');
  const py = pinyin(pkg.name);
  sql += `INSERT INTO therapy_packages (id, name, target_audience, matched_symptoms, pinyin_initial)
VALUES ('${id}', '${esc(pkg.name)}', '${esc(pkg.targetAudience)}', '${esc(symptoms)}', '${py}');\n\n`;
}

// package_items
sql += '-- ── 套餐-项目关联 ──\n';
for (let i = 0; i < allPackages.length; i++) {
  const pkg = allPackages[i];
  const pkgId = pkgUUIDs[i];
  pkg.items.forEach((item, sortIdx) => {
    if (item.projectIdx != null) {
      const projId = projUUIDs[item.projectIdx];
      sql += `INSERT INTO therapy_package_items (package_id, project_id, sort_order) VALUES ('${pkgId}', '${projId}', ${sortIdx + 1});\n`;
    }
  });
  sql += '\n';
}

writeFileSync('supabase/seed_therapy.sql', sql, 'utf-8');
console.log(`✅ supabase/seed_therapy.sql written (${allProjects.length} projects, ${allPackages.length} packages)`);

// ═══════════════════════════════════════════
// 2. Generate mock therapyPackages.ts
// ═══════════════════════════════════════════

let ts = `import type { TherapyPackage } from "../../types";

export const mockTherapyPackages: TherapyPackage[] = [\n`;

for (let i = 0; i < allPackages.length; i++) {
  const pkg = allPackages[i];
  const symptoms = [...new Set(pkg.allSymptoms)].join(',');
  const py = pinyin(pkg.name);
  ts += `  {
    id: "pkg-${String(i + 1).padStart(3, '0')}",
    name: "${pkg.name}",
    targetAudience: "${pkg.targetAudience}",
    matchedSymptoms: "${symptoms}",
    pinyinInitial: "${py}",
    projects: [\n`;

  for (const item of pkg.items) {
    if (item.projectIdx == null) continue;
    const p = allProjects[item.projectIdx];
    const projId = `proj-${String(item.projectIdx + 1).padStart(3, '0')}`;
    const script = p.guidanceScript
      ? `"${String(p.guidanceScript).replace(/"/g, '\\"').replace(/\n/g, '\\n').substring(0, 80)}..."`
      : 'null';
    ts += `      {
        id: "${projId}",
        region: "${p.region}",
        name: "${p.internalName || p.name}",
        mechanism: "${String(p.mechanism).replace(/"/g, '\\"').replace(/\n/g, '\\n')}",
        guidanceScript: ${script},
        bpm: ${p.bpm || 'null'},
        mood: "${p.mood}",
        energyLevel: "${p.energyLevel}",
        hasGuidance: ${p.hasGuidance},
        hasScenario: ${p.hasScenario},
        targetAudience: "${p.targetAudience}",
      },\n`;
  }

  ts += `    ],
  },\n`;
}

ts += `];\n`;

writeFileSync('src/services/mock/data/therapyPackages.ts', ts, 'utf-8');
console.log(`✅ src/services/mock/data/therapyPackages.ts written (${allPackages.length} packages)`);

// cleanup
console.log('\n📋 Summary:');
console.log(`   Projects: ${allProjects.length}`);
console.log(`   Packages: ${allPackages.length}`);
const unmatched = allPackages.flatMap((pkg) => pkg.items.filter((it) => it.projectIdx == null));
if (unmatched.length > 0) {
  console.log(`   ⚠️  ${unmatched.length} unmatched items:`);
  unmatched.forEach((it) => console.log(`      - "${it.projectInternalName}"`));
}
