#!/usr/bin/env python3
"""一键运行所有文档拆分脚本"""

import subprocess
import sys
import os

SCRIPTS_DIR = os.path.dirname(os.path.abspath(__file__))

SCRIPTS = [
    "split_change_sop.py",
    "split_design_system.py",
    "split_components.py",
    "split_patterns.py",
    "split_visual_testing.py",
    "split_ui_rules.py",
]


def main():
    failed = []
    for script in SCRIPTS:
        path = os.path.join(SCRIPTS_DIR, script)
        print(f"\n{'='*60}")
        print(f"▶ 运行 {script}")
        print(f"{'='*60}")
        result = subprocess.run([sys.executable, path], cwd=os.path.join(SCRIPTS_DIR, "../.."))
        if result.returncode != 0:
            failed.append(script)
            print(f"❌ {script} 失败！")

    print(f"\n{'='*60}")
    if failed:
        print(f"⚠️  {len(failed)} 个脚本失败: {', '.join(failed)}")
        sys.exit(1)
    else:
        print(f"🎉 全部 {len(SCRIPTS)} 个拆分脚本执行成功！")
        print("\n下一步：")
        print("  1. 检查 doc/task-implementation/01-06 文件夹的内容")
        print("  2. 确认无误后删除原始大文件")
        print("  3. 更新 .kiro/steering/index.md 中的链接")


if __name__ == "__main__":
    main()
