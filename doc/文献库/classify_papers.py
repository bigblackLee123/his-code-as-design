#!/usr/bin/env python3
"""
文献分类脚本：将 music_neural_mechanisms_final_complete_tables.md 中的论文
按实用价值分为 A/B/C 三类。

A 类 — 直接可用于 HIS 知识库（有明确的 参数→临床效果 映射）
B 类 — 训练音乐疗愈大模型有价值（基础神经科学，无直接处方指导）
C 类 — 和音乐疗愈关系不大（纯算法/工程/信号处理）

用法: python3 classify_papers.py
输出: 同目录下 classification_result.md
"""

import re
import sys
from pathlib import Path

# ── 分类关键词 ──

# C 类强信号：临床应用列命中这些 → 大概率 C
C_KEYWORDS = [
    "音乐信息检索", "信号处理", "自动节奏", "音乐推荐系统",
    "自动伴奏", "舞蹈合成", "虚拟现实应用", "游戏",
    "音频AI", "语音识别", "声纹识别", "音乐分类",
    "音乐生成", "3D", "VR", "模拟训练",
    "音频处理算法", "音频推荐", "产品开发",
    "人工听觉系统", "听觉假体", "音频合成",
]

# A 类强信号：临床应用列命中这些 → 大概率 A
A_KEYWORDS_CLINICAL = [
    "抑郁", "焦虑", "失眠", "睡眠", "疼痛", "PTSD", "创伤",
    "情绪调节", "情绪干预", "压力管理", "压力缓解",
    "康复", "治疗", "干预", "辅助治疗",
    "ADHD", "注意力缺陷", "自闭症", "帕金森",
    "中风", "认知老化", "老年", "痴呆",
    "临床", "循证", "精神健康",
]

# A 类参数信号：具体参数列有可操作的数值
A_KEYWORDS_PARAMS = [
    "BPM", "Hz", "dB", "分钟", "周",
]

# B 类信号：神经科学基础研究
B_KEYWORDS = [
    "神经机制", "脑区", "fMRI", "EEG", "MEG",
    "神经可塑性", "功能连接", "皮层", "认知",
    "跨文化", "个体差异", "发展轨迹",
    "神经振荡", "频谱", "解码",
    "脑机接口", "BCI", "神经反馈",
    "音乐认知", "神经美学",
]


def parse_tables(text: str) -> list[dict]:
    """从 markdown 中提取所有表格行，返回结构化列表。"""
    papers = []
    current_dimension = "未知维度"

    for line in text.split("\n"):
        # 捕获维度标题
        m = re.match(r"^#{1,3}\s*\d*\.?\s*(.+?)(?:\s*[-—]\s*\d+篇)?$", line)
        if m and "总结" not in m.group(1):
            title = m.group(1).strip()
            if len(title) > 2 and "详细条目" not in title:
                current_dimension = title

        # 捕获表格数据行（以 | 数字 | 开头）
        if re.match(r"^\|\s*\d+\s*\|", line):
            cols = [c.strip() for c in line.split("|")]
            # 去掉首尾空元素
            cols = [c for c in cols if c]
            if len(cols) >= 7:
                link = cols[7].strip() if len(cols) >= 8 else ""
                papers.append({
                    "seq": cols[0],
                    "title": cols[1],
                    "source": cols[2],
                    "params": cols[3],
                    "design": cols[4],
                    "effects": cols[5],
                    "clinical": cols[6],
                    "link": link,
                    "dimension": current_dimension,
                })
    return papers


def classify(paper: dict) -> tuple[str, str]:
    """返回 (分类, 一句话理由)。"""
    clinical = paper["clinical"]
    params = paper["params"]
    design = paper["design"]
    effects = paper["effects"]
    title = paper["title"]

    # 合并文本用于检测
    all_text = f"{clinical} {params} {design} {effects} {title}"

    # ── 先判 C ──
    c_hits = [kw for kw in C_KEYWORDS if kw in clinical]
    # 如果临床应用列全是工程/算法类，且没有任何临床关键词
    has_any_clinical = any(kw in all_text for kw in A_KEYWORDS_CLINICAL)
    if c_hits and not has_any_clinical:
        return "C", f"纯技术/工程应用（{c_hits[0]}）"

    # ── 再判 A ──
    a_clinical_hits = [kw for kw in A_KEYWORDS_CLINICAL if kw in clinical]
    a_param_hits = [kw for kw in A_KEYWORDS_PARAMS if kw in params]

    # 有临床应用关键词 + 有具体参数 → 强 A
    if a_clinical_hits and a_param_hits:
        return "A", f"有临床应用（{a_clinical_hits[0]}）且有可操作参数"

    # 有临床应用关键词，即使参数不明确也算 A
    if a_clinical_hits:
        return "A", f"有临床应用价值（{a_clinical_hits[0]}）"

    # 有明确 BPM/Hz 参数 + 实验涉及人类被试情绪/生理
    emotion_words = ["情绪", "愉悦", "唤醒", "放松", "焦虑", "抑郁", "疼痛", "睡眠"]
    if a_param_hits and any(w in effects for w in emotion_words):
        return "A", f"有参数-效应映射（{a_param_hits[0]}→情绪/生理）"

    # ── 剩下判 B vs C ──
    b_hits = [kw for kw in B_KEYWORDS if kw in all_text]
    if b_hits:
        return "B", f"基础神经科学研究（{b_hits[0]}）"

    # 兜底：看不出明确价值的归 C
    return "C", "未匹配到临床或神经科学关键词"


def main():
    src = Path(__file__).parent / "music_neural_mechanisms_final_complete_tables.md"
    if not src.exists():
        print(f"❌ 找不到文件: {src}")
        sys.exit(1)

    text = src.read_text(encoding="utf-8")
    papers = parse_tables(text)

    if not papers:
        print("❌ 未解析到任何论文条目，请检查文件格式")
        sys.exit(1)

    # 分类
    results = []
    for p in papers:
        cat, reason = classify(p)
        results.append({**p, "category": cat, "reason": reason})

    # 统计
    counts = {"A": 0, "B": 0, "C": 0}
    for r in results:
        counts[r["category"]] += 1

    # 输出
    out = Path(__file__).parent / "classification_result.md"
    lines = [
        "# 文献分类结果\n",
        f"总计: {len(results)} 篇\n",
        f"- A 类（HIS 知识库可用）: {counts['A']} 篇",
        f"- B 类（大模型训练有价值）: {counts['B']} 篇",
        f"- C 类（与音乐疗愈关系不大）: {counts['C']} 篇\n",
        "---\n",
    ]

    for cat, label in [
        ("A", "A 类 — 直接可用于 HIS 知识库"),
        ("B", "B 类 — 训练大模型有价值"),
        ("C", "C 类 — 与音乐疗愈关系不大"),
    ]:
        group = [r for r in results if r["category"] == cat]
        lines.append(f"\n## {label}（{len(group)} 篇）\n")
        lines.append("| # | 维度 | 论文题目 | 分类理由 | 链接 |")
        lines.append("|---|------|---------|---------|------|")
        for i, r in enumerate(group, 1):
            title = r["title"][:60] + "..." if len(r["title"]) > 60 else r["title"]
            link = r.get("link", "")
            if link:
                link_cell = f"[链接]({link})"
            else:
                link_cell = "-"
            lines.append(f"| {i} | {r['dimension']} | {title} | {r['reason']} | {link_cell} |")

    out.write_text("\n".join(lines), encoding="utf-8")
    print(f"✅ 分类完成！结果已写入: {out}")
    print(f"   A: {counts['A']}  B: {counts['B']}  C: {counts['C']}")


if __name__ == "__main__":
    main()
