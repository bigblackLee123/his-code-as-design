# Supabase 本地开发配置

> 本文档记录 Supabase 本地开发环境的连接信息和密钥。
> ⚠️ 仅用于本地开发，请勿提交到生产环境。

## 服务端点

### 管理界面
- **Studio**: http://127.0.0.1:54323
  - 数据库管理、表编辑、SQL 编辑器

### API 端点
- **REST API**: http://127.0.0.1:54321
- **GraphQL API**: http://127.0.0.1:54321/graphql/v1
- **Storage API**: http://127.0.0.1:54321/storage/v1/s3
- **MCP**: http://127.0.0.1:54321/mcp

### 邮件测试
- **Mailpit**: http://127.0.0.1:54324
  - 本地邮件测试工具，查看发送的邮件

## 数据库连接

```
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

**连接参数：**
- Host: `127.0.0.1`
- Port: `54322`
- Database: `postgres`
- Username: `postgres`
- Password: `postgres`

## 认证密钥

> 运行 `npx supabase status` 获取以下密钥，不要硬编码到代码仓库中。

### Publishable Key (公开密钥)
```
<运行 supabase status 获取 anon key>
```
- 用于前端客户端
- 可以安全地暴露在客户端代码中

### Secret Key (私密密钥)
```
<运行 supabase status 获取 service_role key>
```
- 用于服务端操作
- ⚠️ 不要暴露在客户端代码中

## S3 存储配置

用于本地文件存储测试：

- **Access Key**: `<YOUR_S3_ACCESS_KEY>`
- **Secret Key**: `<YOUR_S3_SECRET_KEY>`
- **Region**: `local`

## 前端配置示例

### 环境变量 (.env.local)

```env
# Supabase 本地开发配置
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<运行 supabase status 获取 anon key>
```

### 客户端初始化

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 常用命令

### 启动服务
```bash
supabase start
```

### 停止服务
```bash
supabase stop
```

### 重置数据库（清空所有数据）
```bash
supabase db reset
```

### 查看服务状态
```bash
supabase status
```

### 生成 TypeScript 类型
```bash
supabase gen types typescript --local > src/types/supabase.ts
```

## 数据库迁移

### 创建新迁移
```bash
supabase migration new <migration_name>
```

### 应用迁移
```bash
supabase db reset  # 重置并应用所有迁移
```

### 查看迁移历史
```bash
supabase migration list
```

## 注意事项

1. **本地开发专用**：这些密钥仅用于本地开发环境
2. **不要提交到 Git**：确保 `.env.local` 在 `.gitignore` 中
3. **生产环境**：生产环境需要使用 Supabase Cloud 或自托管实例的真实密钥
4. **端口冲突**：如果端口被占用，可以在 `supabase/config.toml` 中修改端口配置
5. **数据持久化**：本地数据存储在 Docker 卷中，`supabase stop` 不会删除数据，`supabase stop --no-backup` 会清空数据

## 更新 CLI

当前版本：v2.51.0  
最新版本：v2.75.0

```bash
# macOS (Homebrew)
brew upgrade supabase

# 或使用 npm
npm update -g supabase
```

## 相关文档

- [Supabase CLI 文档](https://supabase.com/docs/guides/cli)
- [本地开发指南](https://supabase.com/docs/guides/local-development)
- [数据库迁移](https://supabase.com/docs/guides/cli/local-development#database-migrations)
