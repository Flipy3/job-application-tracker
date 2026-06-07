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

### Milestone 2C Completed

- Dashboard 顶部增加统计卡片：Total Jobs、Saved、Applied、Interview、Offer、Rejected
- Job Status 增加视觉区分：saved、applied、interview、offer、rejected 使用不同徽章和状态下拉样式
- Job List 从表格优化为卡片式列表
- Job 卡片显示 company、job title、location、salary、source、status、notes
- 保留原有状态更新和删除功能入口
- Empty State 优化为更清晰的空列表提示，并引导用户添加第一条岗位
- Dashboard 页面布局轻微优化为统计区、表单区、列表区
- 未新增数据库表，未修改 `supabase/schema.sql`
- 未修改 Auth 核心逻辑
- 未引入新的 UI 库

### Milestone 3A Completed

- 新增 Chrome Extension 基础目录文件：`manifest.json`、`popup.html`、`popup.js`、`content.js`、`styles.css`
- 配置 Manifest V3
- Popup 页面包含 Job Title、Company、Job URL、Notes 和 Save Job Button
- 打开 Popup 时自动读取当前标签页 URL，并填入 Job URL
- Save Job Button 当前仅通过 `console.log` 打印 title、company、url、notes
- `content.js` 仅作为后续页面读取逻辑的基础文件，当前不实现 JD 解析
- 未连接 Supabase
- 未修改数据库 Schema
- 未修改 Auth 核心逻辑
- 未修改已有 Dashboard CRUD 功能
- 未新增第三方依赖

### Current Stable Version

- `879d790 style: polish dashboard UI`

### Next Actions

- 下一步计划：Milestone 3B / Milestone 4，根据 TECHNICAL_PLAN 逐步实现岗位页面读取、解析与保存。
- 注意：Milestone 2C 未包含搜索、筛选、图表、详情页、Chrome Extension 或 AI 功能。
- 注意：Milestone 3A 仅包含 Chrome Extension Foundation，未包含 JD 自动解析、AI 分析、搜索筛选、数据统计、飞书同步、Notion 同步或 Supabase 写入。
