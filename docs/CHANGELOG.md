# Changelog

## 2026-06-07

### Completed

- Milestone 0 已完成：Next.js、TypeScript、Tailwind CSS、ESLint、Git、基础目录结构。
- Milestone 1 已完成：Supabase Auth、环境变量、登录、注册、登出、`jobs` 表、RLS 策略。

### Milestone 2A Completed

- Dashboard 页面
- 登录后进入 Dashboard
- Create Job
- Read Jobs
- Supabase `jobs` 表读写
- Dashboard 路由保护
- 手动验收通过
- Create/Read/Persistence 验证通过

### Milestone 2B Completed

- 用户可以修改 Job Status
- 状态枚举固定为 `saved`、`applied`、`interview`、`offer`、`rejected`
- Jobs List 中显示状态下拉框
- 状态修改后立即更新 Supabase
- 更新成功后同步刷新 UI
- 用户可以删除 Job
- 删除前进行确认
- 删除成功后同步刷新 UI
- Dashboard CRUD 闭环完成

### Current Stable Version

- `9e3d619 docs: record milestone 2A completion`

### Next Actions

- 下一步计划：Milestone 2C。
- 注意：Milestone 2B 未包含搜索、筛选、统计、图表、详情页、Chrome Extension 或 AI 功能。
