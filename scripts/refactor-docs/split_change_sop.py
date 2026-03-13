#!/usr/bin/env python3
"""拆分 change-sop.md 为 8 个步骤文件 + index.md"""

import os
import re

SRC = "doc/task-implementation/change-sop.md"
DEST_DIR = "doc/task-implementation/01-change-sop"

FRONT_MATTER = """---
inclusion: manual
---

"""

INDEX_CONTENT = FRONT_MATTER + """# 需求变更标准操作流程（Change SOP）

> 当面对需求变更时，AI 和开发者必须按以下 8 个步骤顺序执行，不可跳步。
> 每个步骤完成后在对话中简要输出该步骤的结论，再进入下一步。

## 步骤导航

| 步骤 | 文档 | 说明 |
|------|------|------|
| 1 | [需求分析](./step-1-requirement-analysis.md) | 明确变更的业务意图和技术范围 |
| 2 | [影响评估](./step-2-impact-assessment.md) | 判断变更的影响范围和修改策略 |
| 3 | [设计规范检查](./step-3-design-check.md) | 确认变更是否需要扩展设计规范 |
| 4 | [技术先验](./step-4-tech-validation.md) | 对新技术/新依赖进行独立验证 |
| 5 | [实施修改](./step-5-implementation.md) | 按积木式策略执行代码变更 |
| 6 | [静态校验](./step-6-static-validation.md) | 自动触发代码合规检查 |
| 7 | [视觉验证](./step-7-visual-verification.md) | Chrome DevTools 截图验证 |
| 8 | [回归确认](./step-8-regression-check.md) | 确认变更未破坏其他区域 |

## 快速参考：常见变更场景

| 场景 | 典型步骤路径 |
|------|-------------|
| 改某个 Block 的 UI 样式 | 1→2→3→4(跳过)→5→6→7→8 |
| 新增一个功能区域 | 1→2→3→4(适用时)→5→6→7→8 |
| 调整 Block 间的数据传递 | 1→2→3→4(跳过)→5→6→8 |
| 新增一种患者状态色 | 1→2→3→4(跳过)→5(改steering+tailwind)→6→7→8 |
| 修复视觉验证发现的问题 | 5→6→7→8（从步骤5开始迭代） |
"""


def read_source():
    with open(SRC, "r", encoding="utf-8") as f:
        return f.read()


def extract_steps(content):
    """从原文中提取每个步骤的内容"""
    # 去掉 front matter
    content = re.sub(r'^---\n.*?\n---\n', '', content, flags=re.DOTALL)
    
    # 按 ## 步骤 拆分
    step_pattern = r'(## 步骤 \d+：.*?)(?=## 步骤 \d+：|## 快速参考|$)'
    steps = re.findall(step_pattern, content, re.DOTALL)
    return steps


STEP_FILES = {
    1: "step-1-requirement-analysis.md",
    2: "step-2-impact-assessment.md",
    3: "step-3-design-check.md",
    4: "step-4-tech-validation.md",
    5: "step-5-implementation.md",
    6: "step-6-static-validation.md",
    7: "step-7-visual-verification.md",
    8: "step-8-regression-check.md",
}

STEP_TITLES = {
    1: "需求分析",
    2: "影响评估",
    3: "设计规范检查",
    4: "技术先验",
    5: "实施修改",
    6: "静态校验",
    7: "视觉验证",
    8: "回归确认",
}


def build_step_nav(step_num):
    """生成步骤底部的前后导航"""
    lines = ["\n---\n"]
    nav_parts = []
    if step_num > 1:
        prev_file = STEP_FILES[step_num - 1]
        prev_title = STEP_TITLES[step_num - 1]
        nav_parts.append(f"⬅️ [上一步：{prev_title}](./{prev_file})")
    nav_parts.append("[返回目录](./index.md)")
    if step_num < 8:
        next_file = STEP_FILES[step_num + 1]
        next_title = STEP_TITLES[step_num + 1]
        nav_parts.append(f"[下一步：{next_title}](./{next_file}) ➡️")
    lines.append(" | ".join(nav_parts))
    return "\n".join(lines)


def main():
    os.makedirs(DEST_DIR, exist_ok=True)
    content = read_source()
    steps = extract_steps(content)

    # 写 index.md
    with open(os.path.join(DEST_DIR, "index.md"), "w", encoding="utf-8") as f:
        f.write(INDEX_CONTENT)
    print(f"✅ 写入 {DEST_DIR}/index.md")

    # 写每个步骤文件
    for i, step_content in enumerate(steps, 1):
        if i > 8:
            break
        filename = STEP_FILES.get(i)
        if not filename:
            continue
        
        step_text = FRONT_MATTER
        step_text += step_content.strip()
        step_text += build_step_nav(i)
        step_text += "\n"

        filepath = os.path.join(DEST_DIR, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(step_text)
        print(f"✅ 写入 {filepath}")

    print(f"\n🎉 change-sop.md 拆分完成！共 {min(len(steps), 8)} 个步骤文件 + 1 个 index.md")


if __name__ == "__main__":
    main()
