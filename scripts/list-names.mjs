import XLSX from 'xlsx';
const wb = XLSX.readFile('doc/曙光医院-音乐疗愈空间内容梳理-1.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets['内容'], { header: 1 });
for (let i = 1; i < data.length; i++) {
  const r = data[i];
  if (!r) continue;
  console.log(`${i}: [${r[3] || ''}] | [${r[2] || ''}]`);
}
