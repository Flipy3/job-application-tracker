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

### Milestone 3C.1 Completed

- Milestone 3C.1 - Boss 搜索结果页右侧详情面板解析已完成
- 保留 Boss 独立职位详情页 `/job_detail/` 解析逻辑
- 新增 Boss 搜索结果页 `/web/geek/jobs` 与 `/web/geek/job` 解析入口
- Popup 打开时优先读取搜索结果页当前展示的右侧详情面板
- 右侧详情面板字段不足时，会从关联的左侧岗位卡片补齐 Job Title、Company、Salary、Location
- 右侧详情面板解析失败时 fallback 到原有独立职位详情页解析
- 非 Boss 页面继续返回空字段，不报错
- 解析失败时仍允许用户手动填写
- Source 仍自动填充为 `Boss直聘`
- 未新增其他招聘网站支持
- 未新增 AI、自动投递、JD 总结或技能提取
- 未修改 Supabase 保存链路
- 未修改 Auth / RLS / Schema
- 未新增第三方依赖

### Milestone 3D Completed

- Milestone 3D - Extension Authentication UX 已完成
- `extension/manifest.json` 新增 `storage` permission，用于访问 `chrome.storage.local`
- Popup 打开时会读取本地保存的 `email` / `password` 并自动填入输入框
- Save Job 成功写入 Supabase 后，会将当前 Email / Password 保存到 `chrome.storage.local`
- Popup 新增 Clear Credentials 按钮
- Clear Credentials 会清除本地保存的 `email` / `password`，并清空 Popup 中的 Email / Password 输入框
- Clear Credentials 成功后显示 `凭据已清除`
- 保存状态提示继续保留 `Saving...`、`Saved successfully`、失败错误提示
- 已在代码与技术计划中注明：`chrome.storage.local` 保存密码仅用于本地 MVP 测试，后续应替换为更安全的 session、token 或 OAuth 方案
- 未修改 Supabase 写入链路，仍为 Chrome Extension Popup → Next.js API Route → Supabase Auth → Supabase `jobs`
- 未实现 Google OAuth、Supabase session sync、service_role、关闭 RLS 或数据库 schema 修改
- 未修改 Dashboard CRUD
- 未新增 AI、更多招聘网站解析或 Boss salary 混淆处理
- 未新增第三方依赖

### Milestone 4A Completed

- Milestone 4A - Duplicate Job URL Detection 已完成
- `POST /api/extension/jobs` 在 Supabase Auth 认证成功后、写入 `jobs` 表前检查重复链接
- 重复检测规则为同一用户下 `job_url` 完全相同
- 当请求中的 URL 为空时，保持现有行为，不执行重复检测并允许保存
- 检测到重复岗位链接时，API 返回 `409 Conflict`
- 检测到重复岗位链接时，不会插入新的 `jobs` 记录
- Chrome Extension Popup 收到 `409` 后显示 `该岗位链接已保存`
- 成功保存新岗位后，仍保留原有本地 Email / Password 记住逻辑
- 未修改 Supabase schema
- 未修改 RLS policy
- 未修改 Dashboard CRUD
- 未修改 Boss 解析逻辑
- 未新增多平台解析、AI 功能、URL canonical 处理或 query 参数清洗
- 未新增第三方依赖

## 2026-06-08

### Milestone 4B Completed

- Milestone 4B - Dashboard Search and Filter 已完成
- Dashboard Jobs List 新增 Search 输入框
- Search 使用 client-side filtering，不请求 Supabase
- Search 输入时实时过滤
- Search 不区分大小写
- Search 匹配字段包含 title、company、notes、location、source
- Dashboard Jobs List 新增 Status Filter
- Status Filter 选项包含 All、Saved、Applied、Interview、Offer、Rejected
- Status Filter 默认值为 All
- Search 和 Status Filter 可组合生效
- 原始 jobs 为空时，保留现有 `No jobs saved yet` empty state
- 原始 jobs 存在但筛选结果为空时，显示 `No matching jobs found`
- 未修改 Supabase schema
- 未修改 Auth / RLS
- 未修改 Chrome Extension
- 未修改 Boss 解析逻辑
- 未新增第三方依赖

### Milestone 4C Completed

- Milestone 4C - Dashboard Localization (ZH-CN) 已完成
- Web App 用户可见英文文案已统一替换为简体中文
- Landing Page、Login Page、Logout Page、Dashboard、Job Form、Job Cards、Search / Filter UI、Empty State、状态消息与错误兜底提示已本地化
- Dashboard 统计卡片显示为岗位总数、已收藏、已投递、面试中、已获得 Offer、已拒绝
- 状态内部值继续保持 `saved`、`applied`、`interview`、`offer`、`rejected`，仅 UI 显示改为中文
- Dashboard 日期显示 locale 调整为 `zh-CN`
- Chrome Extension Popup 的标题、字段名、placeholder、manifest 展示名称和保存失败兜底提示已本地化
- 已保留现有中文扩展文案，例如 `保存岗位`、`保存中...`、`保存成功`、`已清除登录信息`、`该岗位链接已保存`
- 未修改 TypeScript 类型、变量名、枚举值、数据库字段、文件名、URL 或路由名称
- 未修改 Supabase schema、RLS policy、Auth 核心逻辑或 API Route 保存链路
- 未新增第三方依赖
- 未提交 Git，等待用户验收

### Current Stable Version

- `e03aff6 chore: remove parser debug logs`

### Next Actions

- 下一步计划：手动验收 Milestone 4C；验收通过后等待用户决定是否提交 Git 或继续下一个子 Milestone。
- 注意：Milestone 2C 未包含搜索、筛选、图表、详情页、Chrome Extension 或 AI 功能。
- 注意：Milestone 3A 仅包含 Chrome Extension Foundation，未包含 JD 自动解析、AI 分析、搜索筛选、数据统计、飞书同步、Notion 同步或 Supabase 写入。
- 注意：Milestone 3B 仅打通手动填写后保存到 Supabase 的数据链路，未包含自动填写岗位信息。
- 注意：Milestone 3B.1 仅补齐手动填写 Location / Source 的创建、展示和 Extension 保存链路。
- 注意：Milestone 3C 仅支持 Boss 直聘职位详情页自动解析与填表，未包含多平台解析、AI 功能或重复链接提示。
- 注意：Milestone 3C.1 仅补充 Boss 搜索结果页右侧详情面板解析，不包含其他网站、AI、自动投递或保存链路变更。
- 注意：Milestone 3D 仅优化 Extension Popup 凭据输入体验，不包含 OAuth、session sync、RLS、schema、Dashboard 或保存链路变更。
- 注意：Milestone 4A 仅实现同一用户下完全相同 `job_url` 的重复保存提示，不包含 Dashboard CRUD、Boss 解析逻辑、schema、RLS、URL canonical 处理或多平台扩展。
- 注意：Milestone 4B 仅实现 Dashboard client-side 搜索和状态筛选，不包含 schema、Auth、RLS、Chrome Extension、Boss 解析逻辑、服务端搜索或第三方依赖。
- 注意：Milestone 4C 仅实现用户可见文案简体中文本地化，不包含业务逻辑、schema、Auth、API Route 保存链路、枚举值、路由或文件名修改。
