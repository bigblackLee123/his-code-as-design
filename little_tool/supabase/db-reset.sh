#!/bin/bash
# ============================================================
# Supabase 本地数据库重置脚本
# 用法: bash little_tool/supabase/db-reset.sh
#
# 执行顺序:
#   1. 合并 seed_therapy.sql + seed.sql → seed_combined.sql
#   2. 临时替换 seed.sql
#   3. supabase db reset
#   4. 还原 seed.sql
#   5. 验证关键表数据
# ============================================================

set -e

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$PROJECT_ROOT"

echo "🔄 重置 Supabase 本地数据库..."
echo "   项目目录: $PROJECT_ROOT"
echo ""

# 合并 seed 文件：疗愈数据必须在业务数据之前（外键依赖）
echo "📦 合并 seed 文件..."
cp supabase/seed.sql supabase/seed.sql.bak
cat supabase/seed_therapy.sql supabase/seed.sql.bak > supabase/seed.sql

# 重置数据库
supabase db reset

# 还原原始 seed.sql
mv supabase/seed.sql.bak supabase/seed.sql

echo ""
echo "✅ 数据库重置完成"
echo ""

# 验证关键表（通过 psql 连接本地 Supabase Postgres）
echo "📊 数据验证:"
psql "postgresql://postgres:postgres@127.0.0.1:54322/postgres" -c "
  SELECT '  patients' AS table_name, count(*) AS rows FROM patients
  UNION ALL
  SELECT '  therapy_projects', count(*) FROM therapy_projects
  UNION ALL
  SELECT '  contraindications', count(*) FROM contraindications
  UNION ALL
  SELECT '  prescriptions', count(*) FROM prescriptions
  UNION ALL
  SELECT '  prescription_steps', count(*) FROM prescription_steps
  UNION ALL
  SELECT '  system_config', count(*) FROM system_config
  ORDER BY table_name;
"

echo ""
echo "🎉 全部完成"
