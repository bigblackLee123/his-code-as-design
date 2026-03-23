#!/bin/bash
# ============================================================
# 同步前端代码到 shuguang-hospital-client 仓库
# 用法:
#   bash little_tool/sync-client.sh              # 同步，不推送
#   bash little_tool/sync-client.sh --push       # 同步并推送
#   bash little_tool/sync-client.sh -m "消息"    # 自定义 commit message
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$PROJECT_ROOT/shuguang-hospital-client"

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

DO_PUSH=false
COMMIT_MSG="sync: update frontend code"

while [[ $# -gt 0 ]]; do
  case $1 in
    --push) DO_PUSH=true; shift ;;
    -m) COMMIT_MSG="$2"; shift 2 ;;
    *) echo -e "${RED}未知参数: $1${NC}"; exit 1 ;;
  esac
done

if [ ! -d "$DEST/.git" ]; then
  echo -e "${RED}❌ 前端仓库不存在: $DEST${NC}"
  exit 1
fi

echo ""
echo "🔄 同步前端代码"
echo "   源: $PROJECT_ROOT"
echo "   目标: $DEST"
echo ""


echo -e "  📁 同步 ${YELLOW}src/${NC} ..."
rsync -av --delete "$PROJECT_ROOT/src/" "$DEST/src/"

echo -e "  📁 同步 ${YELLOW}scripts/${NC} ..."
rsync -av --delete "$PROJECT_ROOT/scripts/" "$DEST/scripts/"

echo -e "  📄 同步根目录配置文件 ..."
for f in index.html package.json package-lock.json tsconfig.json \
         vite.config.ts tailwind.config.ts postcss.config.js \
         components.json README.md .gitignore .env; do
  [ -f "$PROJECT_ROOT/$f" ] && cp "$PROJECT_ROOT/$f" "$DEST/$f"
done

echo ""
echo -e "${GREEN}✅ 文件同步完成${NC}"

cd "$DEST"
CHANGES=$(git status --short 2>/dev/null)
if [ -z "$CHANGES" ]; then
  echo -e "${YELLOW}ℹ️  没有变更，无需提交${NC}"
  exit 0
fi

echo ""
echo "📝 变更文件:"
echo "$CHANGES"
echo ""

git add -A
git commit -m "$COMMIT_MSG"
echo -e "${GREEN}✅ 已提交: $COMMIT_MSG${NC}"

if [ "$DO_PUSH" = true ]; then
  echo -e "  ⏳ 推送到远程..."
  git push origin main
  echo -e "${GREEN}✅ 推送完成${NC}"
else
  echo -e "${YELLOW}ℹ️  未推送。加 --push 参数自动推送${NC}"
fi

echo ""
echo "🎉 完成"
