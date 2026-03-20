#!/bin/bash
# ============================================================
# Supabase Edge Functions 部署脚本
# 用法: bash little_tool/supabase/deploy-functions.sh [函数名]
#
# 示例:
#   bash little_tool/supabase/deploy-functions.sh                    # 部署全部
#   bash little_tool/supabase/deploy-functions.sh ai-therapy-suggestion  # 部署指定函数
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

FUNCTIONS_DIR="supabase/functions"

# 颜色
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "🚀 Supabase Edge Functions 部署"
echo "   项目目录: $PROJECT_ROOT"
echo ""

# 检查 supabase CLI
if ! command -v supabase &> /dev/null; then
  echo -e "${RED}❌ 未找到 supabase CLI，请先安装: brew install supabase/tap/supabase${NC}"
  exit 1
fi

# 收集要部署的函数
if [ -n "$1" ]; then
  # 指定函数名
  if [ ! -d "$FUNCTIONS_DIR/$1" ]; then
    echo -e "${RED}❌ 函数不存在: $FUNCTIONS_DIR/$1${NC}"
    exit 1
  fi
  TARGETS=("$1")
else
  # 全部函数（排除 _shared 等非函数目录）
  TARGETS=()
  for dir in "$FUNCTIONS_DIR"/*/; do
    name=$(basename "$dir")
    # 跳过下划线开头的目录
    [[ "$name" == _* ]] && continue
    # 必须有 index.ts
    [ -f "$dir/index.ts" ] && TARGETS+=("$name")
  done
fi

if [ ${#TARGETS[@]} -eq 0 ]; then
  echo -e "${YELLOW}⚠️  未找到可部署的函数${NC}"
  exit 0
fi

echo "📦 待部署函数: ${TARGETS[*]}"
echo ""

# 逐个部署
SUCCESS=0
FAIL=0

for fn in "${TARGETS[@]}"; do
  echo -e "  ⏳ 部署 ${YELLOW}${fn}${NC} ..."
  if supabase functions deploy "$fn" --no-verify-jwt 2>&1; then
    echo -e "  ${GREEN}✅ ${fn} 部署成功${NC}"
    ((SUCCESS++))
  else
    echo -e "  ${RED}❌ ${fn} 部署失败${NC}"
    ((FAIL++))
  fi
  echo ""
done

# 汇总
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "  ${GREEN}成功: ${SUCCESS}${NC}  ${RED}失败: ${FAIL}${NC}  总计: ${#TARGETS[@]}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

[ $FAIL -eq 0 ] && echo "🎉 全部部署完成" || exit 1
