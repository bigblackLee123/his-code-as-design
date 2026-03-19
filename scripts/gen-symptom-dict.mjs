/**
 * 症状词典生成脚本
 * 从 QASystemOnMedicalKG 的 symptom.txt 清洗并生成带拼音的 JSON
 * 用法: node scripts/gen-symptom-dict.mjs
 */
import { readFileSync, writeFileSync } from "fs";
import { pinyin } from "pinyin-pro";

const raw = readFileSync("/tmp/symptom_raw.txt", "utf-8");
const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);

// 清洗规则：
// 1. 去掉纯英文/数字（人名缩写、编码等）
// 2. 去掉包含 ... 的截断条目
// 3. 去掉长度 < 2 的条目
// 4. 去掉明显是人名的条目（2-3字且不含医学关键字）
// 5. 去重
const chineseOnly = /^[\u4e00-\u9fff\uff08\uff09\(\)（）、\/\-\u201c\u201d\u300a\u300b\d]+$/;
const hasChinese = /[\u4e00-\u9fff]/;
const truncated = /\.\.\./;

// 常见姓氏用于过滤人名
const surnames = new Set("赵钱孙李周吴郑王冯陈褚卫蒋沈韩杨朱秦尤许何吕施张孔曹严华金魏陶姜戚谢邹喻柏水窦章云苏潘葛奚范彭郎鲁韦昌马苗凤花方俞任袁柳酆鲍史唐费廉岑薛雷贺倪汤滕殷罗毕郝邬安常乐于时傅皮卞齐康伍余元卜顾孟平黄和穆萧尹姚邵湛汪祁毛禹狄米贝明臧计伏成戴谈宋茅庞熊纪舒屈项祝董梁杜阮蓝闵席季麻强贾路娄危江童颜郭梅盛林刁钟徐邱骆高夏蔡田樊胡凌霍虞万支柯昝管卢莫经房裘缪干解应宗丁宣贲邓郁单杭洪包诸左石崔吉钮龚程嵇邢滑裴陆荣翁荀羊於惠甄曲家封芮羿储靳汲邴糜松井段富巫乌焦巴弓牧隗山谷车侯宓蓬全郗班仰秋仲伊宫宁仇栾暴甘钭厉戎祖武符刘景詹束龙叶幸司韶郜黎蓟薄印宿白怀蒲邰从鄂索咸籍赖卓蔺屠蒙池乔阴鬱胥能苍双闻莘党翟谭贡劳逄姬申扶堵冉宰郦雍郤璩桑桂濮牛寿通边扈燕冀郏浦尚农温别庄晏柴瞿阎充慕连茹习宦艾鱼容向古易慎戈廖庾终暨居衡步都耿满弘匡国文寇广禄阙东欧殳沃利蔚越夔隆师巩厍聂晁勾敖融冷訾辛阚那简饶空曾毋沙乜养鞠须丰巢关蒯相查后荆红游竺权逯盖益桓公晋楚闫法汝鄢涂钦商牟佘佴伯赏墨哈谯笪年爱阳佟".split(""));

const cleaned = [];
const seen = new Set();

for (const line of lines) {
  // 跳过截断条目
  if (truncated.test(line)) continue;
  // 跳过太短
  if (line.length < 2) continue;
  // 跳过纯英文/数字
  if (!hasChinese.test(line)) continue;
  // 跳过可能的人名（2-3字，首字是姓氏，不含医学词汇）
  if (line.length <= 3 && surnames.has(line[0]) && !/(症|痛|病|炎|热|寒|虚|实|湿|燥|风|血|气|肿|瘀|痰|毒|疹|疮|癣|痒|麻|胀|酸|闷|悸|喘|咳|泻|呕|晕|厥|痉|挛|萎|瘫|盲|聋|哑)/.test(line)) continue;
  // 去重
  if (seen.has(line)) continue;
  seen.add(line);
  cleaned.push(line);
}

console.log(`原始: ${lines.length} 条, 清洗后: ${cleaned.length} 条`);

// 生成带拼音的数据
const result = cleaned.sort().map((name, i) => {
  const py = pinyin(name, { toneType: "none", type: "array" }).join("");
  const initial = pinyin(name, { pattern: "first", toneType: "none", type: "array" })
    .join("")
    .toUpperCase();
  return { name, pinyin: py, pinyinInitial: initial };
});

// 输出为 JSON
const outPath = "src/services/mock/data/symptoms.json";
writeFileSync(outPath, JSON.stringify(result, null, 2), "utf-8");
console.log(`已写入 ${outPath}，共 ${result.length} 条`);
