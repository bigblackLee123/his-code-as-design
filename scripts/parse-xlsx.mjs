import XLSX from 'xlsx';

const wb = XLSX.readFile('doc/曙光医院-音乐疗愈空间内容梳理-1.xlsx');

// 内容 sheet - all projects
const contentWs = wb.Sheets['内容'];
const contentData = XLSX.utils.sheet_to_json(contentWs, { header: 1 });
console.log('=== 内容 sheet: total rows (excl header):', contentData.length - 1);

let currentRegion = '';
const projects = [];
for (let i = 1; i < contentData.length; i++) {
  const r = contentData[i];
  if (!r || r.length === 0) continue;
  if (r[0]) currentRegion = r[0];
  projects.push({
    region: currentRegion,
    seq: r[1],
    name: r[2],
    internalName: r[3],
    mechanism: r[6],
    guidanceAbout: r[7],
    guidanceScript: r[8],
    bpm: r[9],
    mood: r[10],
    energyLevel: r[11],
    hasGuidance: r[12],
    hasScenario: r[13],
    targetAudience: r[14],
    notes: r[15],
  });
}
console.log('Total projects:', projects.length);
projects.forEach((p, i) =>
  console.log(
    i + 1,
    p.region?.substring(0, 10),
    '|',
    p.name,
    '|',
    p.bpm,
    '|',
    p.mood,
    '|',
    p.energyLevel,
    '|',
    p.hasGuidance,
    '|',
    p.hasScenario,
  ),
);

// 套餐 sheet
console.log('\n=== 套餐 sheet ===');
const pkgWs = wb.Sheets['套餐'];
const pkgData = XLSX.utils.sheet_to_json(pkgWs, { header: 1 });
let currentPkg = null;
const packages = [];
for (let i = 1; i < pkgData.length; i++) {
  const r = pkgData[i];
  if (!r || r.length === 0) continue;
  if (r[0]) {
    currentPkg = { seq: r[0], name: r[1], targetAudience: r[2], items: [], matchedSymptoms: [] };
    packages.push(currentPkg);
  }
  if (currentPkg) {
    currentPkg.items.push({ region: r[3], projectName: r[4], mechanism: r[5], symptoms: r[6] });
    if (r[6]) currentPkg.matchedSymptoms.push(r[6]);
  }
}
console.log('Total packages:', packages.length);
packages.forEach((p) => {
  console.log('Pkg', p.seq, ':', p.name, '| audience:', p.targetAudience);
  p.items.forEach((it) => console.log('  -', it.region, ':', it.projectName, '| symptoms:', it.symptoms));
});
