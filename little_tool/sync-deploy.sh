#!/bin/bash
# ============================================================
# 同步后端部署文件到 shuguang.earmersion.com 仓库
# 用法:
#   bash little_tool/sync-deploy.sh              # 同步文件，不推送
#   bash little_tool/sync-deploy.sh --push       # 同步并 git push
#   bash little_tool/sync-deploy.sh -m "消息"    # 自定义 commit message
# ============================================================

set -e

# ---- 路径配置 ----
# 主项目根目录（脚本所在位置往上一级）
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
# 后端部署仓库
DEST="$PROJECT_ROOT/shuguang.earmersion.com"

# ---- 颜色 ----
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ---- 参数解析 ----
DO_PUSH=false
COMMIT_MSG="sync: update deploy and supabase files"

while [[ $# -gt 0 ]]; do
  case $1 in
    --push) DO_PUSH=true; shift ;;
    -m) COMMIT_MSG="$2"; shift 2 ;;
    *) echo -e "${RED}未知参数: $1${NC}"; exit 1 ;;
  esac
done

# ---- 检查路径 ----
if [ ! -d "$PROJECT_ROOT/deploy" ]; then
  echo -e "${RED}❌ deploy/ 不存在: $PROJECT_ROOT/deploy${NC}"
  exit 1
fi
if [ ! -d "$PROJECT_ROOT/supabase" ]; then
  echo -e "${RED}❌ supabase/ 不存在: $PROJECT_ROOT/supabase${NC}"
  exit 1
fi
if [ ! -d "$DEST/.git" ]; then
  echo -e "${RED}❌ 部署仓库不存在: $DEST${NC}"
  echo -e "${YELLOW}请先 clone:${NC}"
  echo "  cd $PROJECT_ROOT"
  echo "  git clone https://github.com/earmersion/shuguang.earmersion.com.git"
  exit 1
fi

echo ""
echo "🔄 同步后端部署文件"
echo "   源: $PROJECT_ROOT"
echo "   目标: $DEST"
echo ""

# ---- 同步 deploy/ ----
echo -e "  📁 同步 ${YELLOW}deploy/${NC} ..."
rsync -av --delete \
  --exclude '.env' \
  "$PROJECT_ROOT/deploy/" "$DEST/deploy/"

# ---- 同步 supabase/ ----
echo -e "  📁 同步 ${YELLOW}supabase/${NC} ..."
rsync -av --delete \
  --exclude '.branches' \
  --exclude '.temp' \
  --exclude 'seed-secrets.sql' \
  "$PROJECT_ROOT/supabase/" "$DEST/supabase/"

echo ""
echo -e "${GREEN}✅ 文件同步完成${NC}"

# ---- Git 操作 ----
cd "$DEST"

CHANGES=$(git status --short deploy/ supabase/ 2>/dev/null)
if [ -z "$CHANGES" ]; then
  echo -e "${YELLOW}ℹ️  没有变更，无需提交${NC}"
  exit 0
fi

echo ""
echo "📝 变更文件:"
echo "$CHANGES"
echo ""

git add deploy/ supabase/
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
