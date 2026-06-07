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

### Milestone 3B Completed

- Chrome Extension Popup 新增 Salary 输入框
- Chrome Extension Popup 新增 Email / Password 字段，用于安全认证后保存岗位
- Save Job 点击后调用 Next.js API Route 写入 Supabase `jobs` 表
- 新增 `POST /api/extension/jobs` 作为 Extension 到 Supabase 的中转接口
- API Route 使用 Supabase Email + Password Auth 获取用户认证上下文，并按 RLS 写入当前用户的 `jobs` 记录
- 写入字段包含 company、job title、job URL、salary、notes、status
- 默认 status 为 `saved`
- Popup 增加保存状态反馈：Saving、Saved successfully、失败错误提示
- Manifest 增加本地 Web App API host permission：`http://localhost:3000/*`
- Dashboard 已确认支持 salary 输入和展示，本阶段未修改 Dashboard CRUD
- 未关闭 RLS
- 未使用 service_role key
- 未将 Supabase key 写入 extension
- 未新增第三方依赖
- 未实现自动解析岗位名称、公司名称或薪资

### Milestone 3B.1 Completed

- Chrome Extension Popup 新增 Location 输入框
- Chrome Extension Popup 新增 Source 输入框，支持手动填写 Boss直聘、LinkedIn、Seek、公司官网等来源
- Extension Save Job 请求新增提交 `location` 和 `source`
- `POST /api/extension/jobs` 写入 Supabase `jobs.location` 和 `jobs.source`
- Dashboard Create form 已支持 Location / Source，本阶段仅更新 Source placeholder 示例
- Dashboard Job Card 已显示 Location / Source，本阶段无需新增展示逻辑
- 当前 Dashboard 仅支持 status update，未新增大型编辑弹窗
- 未修改数据库 Schema
- 未修改 Auth / RLS
- 未使用 service_role key
- 未新增第三方依赖
- 未实现自动解析或自动识别来源网站

### Milestone 3C Completed

- Milestone 3C - Boss Job Auto Parsing 已完成
- Chrome Extension `content.js` 新增 Boss 直聘职位详情页解析逻辑
- Popup 打开时通过 `chrome.tabs.sendMessage` 与 Content Script 通信获取解析结果
- 在 Boss 直聘职位详情页自动填充 Job Title、Company、Salary、Location
- Source 在 Boss 直聘职位详情页自动填充为 `Boss直聘`，用户仍可手动修改
- 解析失败时保持输入框为空，不阻断用户手动填写和保存
- 保留 Email、Password、Save Job 与 Supabase 保存链路
- 本阶段仅支持 Boss 直聘，未新增 LinkedIn、Seek、Indeed、猎聘、拉勾等多平台解析
- 未新增 AI 分析、JD 总结、技能提取或自动投递功能
- 未修改数据库 Schema
- 未修改 Auth / RLS
- 未新增第三方依赖

### Current Stable Version

- `c09fcbe feat: support location and source in extension`

### Next Actions

- 下一步计划：手动验收 Milestone 3C；验收通过后再进入重复链接提示或后续 Milestone。
- 注意：Milestone 2C 未包含搜索、筛选、图表、详情页、Chrome Extension 或 AI 功能。
- 注意：Milestone 3A 仅包含 Chrome Extension Foundation，未包含 JD 自动解析、AI 分析、搜索筛选、数据统计、飞书同步、Notion 同步或 Supabase 写入。
- 注意：Milestone 3B 仅打通手动填写后保存到 Supabase 的数据链路，未包含自动填写岗位信息。
- 注意：Milestone 3B.1 仅补齐手动填写 Location / Source 的创建、展示和 Extension 保存链路。
- 注意：Milestone 3C 仅支持 Boss 直聘职位详情页自动解析与填表，未包含多平台解析、AI 功能或重复链接提示。
