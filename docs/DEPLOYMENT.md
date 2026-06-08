# Deployment Notes

本文件记录项目公开上传 GitHub 和部署到 Vercel 前的基本步骤。当前项目仍是 MVP，本说明不替代正式生产安全审计。

## 1. GitHub 上传步骤

1. 确认本地没有要上传的真实密钥：

   ```bash
   git status --short --ignored
   git check-ignore -v .env .env.local .env.development.local node_modules .next
   ```

2. 确认 `.env.local` 没有被 Git 跟踪：

   ```bash
   git ls-files .env .env.local '.env.*.local'
   ```

3. 确认 README 和部署说明已经更新：

   ```bash
   git diff -- README.md docs/DEPLOYMENT.md .gitignore
   ```

4. 在 GitHub 手动创建空仓库。

5. 按 GitHub 页面提示添加远程仓库地址：

   ```bash
   git remote add origin git@github.com:<your-username>/<your-repo>.git
   ```

6. 检查远程地址：

   ```bash
   git remote -v
   ```

7. 验收通过后再提交并推送：

   ```bash
   git add README.md docs/DEPLOYMENT.md
   git commit -m "docs: prepare github upload"
   git push -u origin main
   ```

## 2. Vercel 部署步骤

1. 将项目推送到 GitHub。
2. 在 Vercel 新建项目并导入该 GitHub 仓库。
3. Framework Preset 选择 Next.js。
4. Build Command 使用默认 `npm run build`。
5. Install Command 使用默认 `npm install`。
6. 在 Vercel 项目设置中添加 Supabase 环境变量。
7. 部署后访问 Vercel 生成的域名，验证登录、注册和 Dashboard 读取。

## 3. 环境变量配置

Vercel 中需要配置：

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

说明：

- `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 应保留在环境变量中。
- `.env.local` 只用于本地开发，不能上传 GitHub。
- `.env.example` 可以上传，但只能包含空值或占位值。
- Supabase `service_role` key 绝不能上传 GitHub，不能放进浏览器端代码，也不能放进 Chrome Extension。
- 当前项目不需要 `service_role` key。

## 4. Extension API 地址切换说明

当前 Chrome Extension 的 API 地址写在：

```text
extension/popup.js
```

本地开发配置：

```js
const API_BASE_URL = "http://localhost:3000";
```

如果 Web App 部署到 Vercel，需要把它改成线上地址：

```js
const API_BASE_URL = "https://your-vercel-domain.vercel.app";
```

同时需要更新：

```text
extension/manifest.json
```

本地 host permission：

```json
"host_permissions": ["http://localhost:3000/*"]
```

线上 host permission 示例：

```json
"host_permissions": ["https://your-vercel-domain.vercel.app/*"]
```

修改后需要在 Chrome Extensions 页面重新加载 unpacked extension。

当前 CORS 逻辑允许 `chrome-extension://` 来源调用 API Route；如果未来改为公开发布 Extension，应重新检查 API 地址、CORS、认证方式和密码存储策略。
