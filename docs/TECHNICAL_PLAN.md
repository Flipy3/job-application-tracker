# Job Application Tracker - Technical Plan

> 本文件是项目的技术方案与开发执行源文件（Source of Truth）。
> 后续所有功能实现、任务拆分、代码生成、重构与进度记录，都应优先参考并更新本文档。

---

## 1. 项目概述

### 1.1 项目名称

**Job Application Tracker / 求职进度自动记录工具**

### 1.2 项目目标

本项目希望解决求职者在多平台投递岗位时，手动记录岗位信息、投递状态、沟通进展、面试安排较繁琐的问题。

第一版产品目标是：

用户在招聘网站浏览岗位时，可以通过浏览器插件自动抓取当前岗位页面的关键信息，并保存到 Web 后台中。用户可以在后台统一查看、筛选、编辑和管理自己的求职进度。

### 1.3 MVP 核心假设

当前市场中已有不少求职记录工具、Notion 模板、飞书多维表格或 Excel 模板，但大多依赖用户手动填写。

本项目的差异点是：

- 通过浏览器插件自动识别岗位页面信息
- 自动生成结构化求职记录
- 降低用户维护求职进度表的成本
- 后续可扩展 AI 岗位分析、简历匹配、面试提醒等能力

---

## 2. 产品范围

### 2.1 第一版 MVP 要做什么

第一版只做一个完整闭环，不追求覆盖所有平台。

MVP 包含以下能力：

1. 用户可以登录 Web 后台
2. 用户可以在 Web 后台查看自己的岗位记录列表
3. 用户可以新增、编辑、删除岗位记录
4. 用户可以修改岗位状态，例如：已收藏、已投递、沟通中、面试中、已拒绝、已录用
5. 用户可以添加备注
6. Chrome 插件可以读取当前招聘网站岗位页面信息
7. Chrome 插件可以将岗位信息保存到用户账户下
8. 系统可以避免明显重复记录，例如同一岗位链接重复保存

### 2.2 第一版暂时不做什么

以下功能暂不进入 MVP，避免项目过度复杂：

- 不做移动端 App
- 不做微信小程序
- 不做所有招聘网站的全量适配
- 不做完全自动监听用户是否点击“投递成功”
- 不做复杂 AI 简历匹配
- 不做复杂邮件解析
- 不做企业端功能
- 不做多人协作
- 不做付费系统

### 2.3 第一版优先适配平台

优先适配一个招聘平台，建议从 **Boss 直聘** 开始。

原因：

- 国内用户认知度高
- 岗位页面信息结构比较典型
- 产品故事更容易讲清楚
- 作为作品集项目更容易说明价值

如果 Boss 直聘页面抓取因反爬或 DOM 变动导致困难，可以临时切换到更容易抓取的招聘网站页面作为 MVP 验证对象。

---

## 3. 推荐技术栈

### 3.1 Web 前端

- Framework: **Next.js**
- Language: **TypeScript**
- UI: **React**
- Styling: **Tailwind CSS**
- Component strategy: 初期以简单自写组件为主，必要时使用 shadcn/ui
- Table: 初期可自写简单表格，后续再引入 TanStack Table

选择理由：

- Next.js 适合快速搭建真实可部署的 Web 产品
- TypeScript 便于后续维护数据结构
- Tailwind CSS 开发速度快，适合 MVP
- Vercel 部署简单

### 3.2 浏览器插件

- Chrome Extension
- Manifest Version: **Manifest V3**
- Language: **TypeScript**
- UI: 简单 Popup 页面
- Content Script: 负责读取招聘网站 DOM 信息
- Background Service Worker: 负责插件后台逻辑

插件核心模块：

- `manifest.json`
- `popup.tsx`
- `contentScript.ts`
- `background.ts`
- `jobParser.ts`
- `apiClient.ts`

当前 MVP 简化实现使用根目录下的原生 Chrome Extension 文件：

- `extension/manifest.json`
- `extension/popup.html`
- `extension/popup.js`
- `extension/content.js`
- `extension/styles.css`

### 3.3 后端与数据库

使用 **Supabase**。

Supabase 负责：

- 用户认证 Auth
- PostgreSQL 数据库
- Row Level Security 数据权限控制
- API 数据访问

第一版不单独自建复杂后端服务。

### 3.4 部署

- Web App: **Vercel**
- Database/Auth: **Supabase**
- Extension: 本地加载 unpacked extension，后续再考虑发布 Chrome Web Store

---

## 4. 系统架构

### 4.1 总体架构

```text
招聘网站页面
   ↓
Chrome Extension Content Script
   ↓ 读取页面 DOM
Chrome Extension Popup / Background
   ↓ 调用 Supabase API
Supabase Auth + Database
   ↓
Next.js Web Dashboard
```

### 4.2 数据流

#### 场景一：用户手动新增记录

1. 用户登录 Web 后台
2. 用户点击“新增岗位”
3. 填写岗位名称、公司、城市、薪资、链接等信息
4. 前端调用 Supabase 插入数据
5. 数据保存到 `job_applications` 表
6. 页面刷新列表

#### 场景二：用户通过插件保存岗位

1. 用户登录 Web 后台，并在插件中完成认证或复用 Supabase session
2. 用户打开招聘网站岗位详情页
3. 用户点击插件按钮“保存当前岗位”
4. Content Script 读取页面中的岗位信息
5. Popup 展示识别结果，让用户确认
6. 用户点击保存
7. 插件调用 Supabase 插入数据
8. Web 后台显示新增记录

---

## 5. 数据库设计

### 5.1 表：`jobs`

用于存储用户的求职记录。

| 字段名 | 类型 | 必填 | 说明 |
|---|---|---:|---|
| id | uuid | 是 | 主键，默认生成 |
| user_id | uuid | 是 | 关联 Supabase Auth 用户 |
| company_name | text | 是 | 公司名称 |
| job_title | text | 是 | 岗位名称 |
| job_url | text | 否 | 岗位链接 |
| salary | text | 否 | 薪资文本，例如 10-15K |
| location | text | 否 | 工作城市 |
| status | text | 是 | 当前状态 |
| notes | text | 否 | 用户备注 |
| source | text | 否 | 来源平台，例如 boss, liepin, zhaopin |
| created_at | timestamptz | 是 | 创建时间 |
| updated_at | timestamptz | 是 | 更新时间 |

### 5.2 `status` 枚举建议

第一版可以先用 text，避免数据库 enum 修改麻烦。

推荐状态值：

- `saved`：已收藏
- `applied`：已投递
- `communicating`：沟通中
- `interviewing`：面试中
- `offer`：已录用 / Offer
- `rejected`：已拒绝
- `closed`：岗位关闭

### 5.3 去重规则

第一版去重逻辑：

同一用户下，如果 `job_url` 完全相同，则认为是重复记录。

后续可扩展：

- 同一用户 + 公司名 + 岗位名 + 城市 相同，提示可能重复
- 对 URL 做 canonical 处理，去掉 tracking query params

### 5.4 Row Level Security 策略

必须开启 RLS。

规则：

- 用户只能读取自己的记录
- 用户只能新增自己的记录
- 用户只能修改自己的记录
- 用户只能删除自己的记录

示意 SQL：

```sql
create table jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  company_name text not null,
  job_title text not null,
  job_url text,
  salary text,
  location text,
  status text not null default 'saved',
  notes text,
  source text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table jobs enable row level security;

create policy "Users can view own jobs"
on jobs for select
using (auth.uid() = user_id);

create policy "Users can insert own jobs"
on jobs for insert
with check (auth.uid() = user_id);

create policy "Users can update own jobs"
on jobs for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own jobs"
on jobs for delete
using (auth.uid() = user_id);
```

---

## 6. 前端页面设计

### 6.1 页面结构

建议页面：

```text
/
  Landing Page / 项目介绍页
/login
  登录页
/dashboard
  求职记录列表页
/dashboard/applications/[id]
  求职记录详情页，可选
/settings
  设置页，可后置
```

### 6.2 MVP 页面优先级

最高优先级：

1. 登录页
2. Dashboard 列表页
3. 新增 / 编辑岗位弹窗或表单

可以后置：

1. Landing Page 美化
2. 单独详情页
3. 设置页
4. 数据统计页

### 6.3 Dashboard 列表字段

列表建议展示：

- 岗位名称
- 公司
- 城市
- 薪资
- 平台
- 状态
- 更新时间
- 操作：编辑、删除、打开原链接

### 6.4 筛选与搜索

MVP 筛选：

- 状态筛选
- 平台筛选
- 关键词搜索：岗位名 / 公司名

可后置：

- 城市筛选
- 薪资筛选
- 日期范围筛选

### 6.5 Milestone 4B - Dashboard Search and Filter

目标：为 Dashboard 增加岗位搜索和状态筛选能力，方便管理通过 Chrome Extension 或手动方式保存的岗位记录。

当前实现：

- Dashboard Jobs List 增加 Search 输入框
- Search 使用 client-side filtering，不请求 Supabase
- Search 输入时实时过滤
- Search 不区分大小写
- Search 匹配字段：`job_title`、`company_name`、`notes`、`location`、`source`
- Dashboard Jobs List 增加 Status Filter
- Status Filter 选项：All、Saved、Applied、Interview、Offer、Rejected
- Status Filter 默认值为 All
- Search 和 Status Filter 组合生效
- 原始 `jobs` 为空时，保留现有 `No jobs saved yet` empty state
- 原始 `jobs` 存在但筛选结果为空时，显示 `No matching jobs found`

本阶段明确不做：

- Supabase schema 修改
- Auth / RLS 修改
- Chrome Extension 修改
- Boss 解析逻辑修改
- 服务端搜索或数据库查询过滤
- 第三方依赖引入

### 6.6 Milestone 4C - Dashboard Localization (ZH-CN)

目标：将 Web App 与 Chrome Extension 中的用户可见英文文案统一替换为简体中文，减少中英混搭，提升中文用户的使用一致性。

当前实现：

- Landing Page、Login Page、Logout Page、Dashboard 页面用户可见文案已统一为简体中文
- Dashboard 顶部统计卡片显示为：岗位总数、已收藏、已投递、面试中、已获得 Offer、已拒绝
- Job Form 字段显示为：岗位名称、公司名称、薪资、工作地点、来源、岗位链接、备注
- Jobs List、Job Card、Search / Status Filter、Empty State、状态更新、删除确认和操作按钮文案已本地化
- Dashboard 状态内部值继续保持 `saved`、`applied`、`interview`、`offer`、`rejected`，仅 UI label 显示为中文
- 日期显示 locale 调整为 `zh-CN`
- Web Auth 和 Dashboard 中来自 Supabase 或运行时的英文错误，在 UI 显示层增加中文兜底提示
- Chrome Extension Popup 的标题、字段、placeholder、manifest 展示名称和保存失败兜底提示已本地化
- 已保留已完成的中文文案，例如 `保存岗位`、`保存中...`、`保存成功`、`已清除登录信息`、`该岗位链接已保存`

本阶段明确不做：

- TypeScript 类型修改
- 状态枚举值修改
- 数据库字段修改
- Supabase schema 修改
- RLS / Auth 修改
- API Route 保存链路修改
- 文件名、URL 或路由名称修改
- 新增依赖
- 组件重构或业务逻辑重构

---

## 7. 浏览器插件设计

### 7.1 插件核心目标

插件第一版只解决一个问题：

从招聘网站当前页面中读取岗位信息，并保存到数据库。

### 7.2 插件交互流程

1. 用户打开岗位详情页
2. 点击浏览器插件图标
3. 插件弹窗显示“读取当前岗位”按钮
4. 用户点击按钮
5. Content Script 提取页面信息
6. 插件弹窗展示识别结果
7. 用户可以手动修改识别结果
8. 用户点击“保存到求职记录”
9. 保存成功后显示成功提示

### 7.3 岗位信息提取字段

第一版提取：

- `job_title`
- `company_name`
- `city`
- `salary_text`
- `job_url`
- `platform`
- `job_description`

### 7.4 解析器设计

建议建立独立解析器模块：

```text
extension/src/parsers/
  boss.ts
  generic.ts
```

接口示意：

```ts
export type ParsedJob = {
  jobTitle: string;
  companyName: string;
  city?: string;
  salaryText?: string;
  jobUrl?: string;
  platform?: string;
  jobDescription?: string;
};

export type JobParser = {
  canParse: (url: string) => boolean;
  parse: () => ParsedJob;
};
```

### 7.5 解析策略

优先级：

1. 使用稳定 CSS selector
2. 使用页面结构和文本语义兜底
3. 使用通用解析器提取标题、公司、薪资等明显文本
4. 如果无法识别，允许用户手动填写

必须注意：

招聘网站 DOM 可能变化，所以解析逻辑不能写得太死。MVP 可以接受有限适配，但代码结构要允许后续扩展。

### 7.6 Milestone 3C - Boss Job Auto Parsing

目标：当用户打开 Boss 直聘职位详情页并点击插件 Popup 时，自动解析并填充岗位基础信息。

本阶段仅支持 Boss 直聘，不支持 LinkedIn、Seek、Indeed、猎聘、拉勾或其他平台。

当前实现：

- `extension/content.js` 监听 Popup 消息并解析当前页面 DOM
- `extension/popup.js` 打开时通过 `chrome.tabs.sendMessage` 获取解析结果
- 自动填充 Job Title、Company、Salary、Location
- Source 自动填充为 `Boss直聘`，用户仍可修改
- 如果解析失败，返回空字段并保留手动填写能力
- 保留 Email、Password、Save Job 和 Supabase 保存链路

Boss 直聘 DOM 选择器：

- Job Title：`.job-detail .job-name`、`.job-banner .job-name`、`.job-primary .name h1`、`.job-title .job-name`、`.job-name`、`h1`
- Company：`.job-detail .company-name`、`.job-banner .company-name`、`.company-info .company-name`、`.company-info .name`、`.job-sec-company .name`、`.job-company .name`、`.company-card .name`
- Salary：`.job-detail .job-salary`、`.job-banner .job-salary`、`.job-primary .salary`、`.job-salary`、`.salary`、`.red`
- Location：`.job-address .location-address`、`.job-location`、`.job-primary .job-area`、`.job-area`、`.company-location`
- Location fallback：`.job-primary .info-primary p`、`.job-banner .info-primary p`、`.job-detail .job-base-info`、`.job-detail .job-basic-info` 的首段城市信息

本阶段明确不做：

- AI 分析
- JD 总结
- 技能提取
- 自动投递
- 多网站解析
- 重复链接提示

### 7.7 Milestone 3C.1 - Boss Search Result Detail Panel Parsing

目标：当用户在 Boss 直聘搜索结果页点击左侧岗位并打开右侧详情面板时，Popup 自动读取当前面板中的岗位信息。

本阶段继续仅支持 Boss 直聘，不支持 LinkedIn、Seek、Indeed、猎聘、拉勾或其他平台。

当前实现：

- 保留 Milestone 3C 的 `/job_detail/` 独立职位详情页解析逻辑
- 新增 `/web/geek/jobs` 和 `/web/geek/job` 搜索结果页解析入口
- Popup 打开时优先解析当前可见的右侧详情面板
- 如果右侧详情面板字段不完整，从关联或标题匹配到的左侧 `.job-card-wrapper` 岗位卡片补齐字段
- 如果搜索页右侧详情面板解析失败，再 fallback 到原有独立详情页解析
- 如果仍无法解析，返回空字段并保留用户手动填写能力
- Source 自动填充为 `Boss直聘`
- 不修改 Supabase 保存链路、Auth、RLS 或 Schema

Boss 搜索结果页新增 DOM 选择器：

- Panel root：`.user-center-job-detail-box`、`.job-detail-card`、`.job-detail-box`、`.job-detail-panel`、`.job-detail-container`、`.job-detail-content`
- Panel Job Title：`.job-detail-info .job-name`、`.job-detail-header .job-name`、`.job-detail-header .title`、`.job-header-info .job-name`、`.job-name`、`.job-title`
- Panel Company：`.company-name a`、`.company-name`、`.company-info .name`、`.job-company .name`、`.company-card .name`、`.job-detail-header .intro`
- Panel Salary：`.job-detail-info .job-salary`、`.job-detail-header .job-salary`、`.job-salary`、`.salary`、`.red`
- Panel Location：`.job-address .job-address-desc`、`.job-address-desc`、`.job-detail-header .job-area`、`.job-detail-info .job-area`、`.tag-list li:first-child`、`.job-area`、`.location`
- Card fallback：`.job-card-wrapper` 内的 `.job-card-left .job-title .job-name`、`.job-card-left .salary`、`.job-card-left .job-area-wrapper .job-area`、`.job-card-right .company-name a`；当面板与卡片不是父子关系时，用面板岗位标题匹配左侧卡片

本阶段明确不做：

- AI 分析
- JD 总结
- 技能提取
- 自动投递
- 多网站解析
- Supabase 保存链路变更

### 7.8 Milestone 3D - Extension Authentication UX

目标：优化 Chrome Extension Popup 的登录体验，避免用户每次保存岗位都重复手动输入 Email / Password。

当前实现：

- `extension/manifest.json` 增加 `storage` permission
- Popup 打开时从 `chrome.storage.local` 读取 `email` 和 `password`
- 如果本地已保存凭据，自动填充 Email / Password 输入框
- 点击 Save Job 且 Next.js API Route 保存成功后，将当前 Email / Password 保存到 `chrome.storage.local`
- Popup 新增 Clear Credentials 按钮
- 点击 Clear Credentials 后清除 `chrome.storage.local` 中保存的 `email` / `password`，并清空 Popup 输入框
- Clear Credentials 成功后显示 `凭据已清除`
- 保存状态提示继续支持 `保存中...`、`保存成功`、`保存失败，请稍后重试`
- Supabase 写入链路保持不变：Chrome Extension Popup → Next.js API Route → Supabase Auth → Supabase `jobs`

安全说明：

- `chrome.storage.local` 保存密码仅用于本地 MVP 测试便利
- 后续生产版本应替换为更安全的 session、token 或 OAuth 方案

本阶段明确不做：

- Google OAuth
- Supabase session sync
- service_role
- 关闭 RLS
- 数据库 schema 修改
- Dashboard CRUD 修改
- AI 功能
- 更多招聘网站解析
- Boss salary 字体混淆重新研究

---

### 7.9 Milestone 4A - Duplicate Job URL Detection

目标：避免同一用户重复保存相同岗位链接，补齐 MVP 中“明显重复记录”检测能力。

当前实现：

- `POST /api/extension/jobs` 在用户认证成功后、插入 `jobs` 表前检查重复链接
- 仅当请求中的 `url` 非空时执行重复检测
- 重复检测规则：同一 `user_id` 下存在完全相同的 `job_url`
- 如果检测到重复记录，API 返回 `409 Conflict`
- 重复时不会插入新的 `jobs` 记录
- Chrome Extension Popup 收到 `409` 后显示 `该岗位链接已保存`
- 空 URL 保持现有行为，不做重复检测，仍允许保存

本阶段明确不做：

- 数据库 schema 修改
- RLS policy 修改
- Dashboard CRUD 修改
- Boss 解析逻辑修改
- 多平台解析
- AI 功能
- URL canonical 处理或 tracking query 参数清洗

---

## 8. 认证方案

### 8.1 Web 登录

使用 Supabase Auth。

MVP 可选方案：

- Email Magic Link
- Email + Password

建议第一版使用 Email + Password，因为更容易理解和测试。

### 8.2 插件认证

第一版建议简化处理。

可选方案：

#### 方案 A：插件内登录 Supabase

插件弹窗提供登录表单，直接调用 Supabase Auth。

优点：

- 插件独立工作
- 逻辑清晰

缺点：

- 插件内处理 session 稍复杂

#### 方案 B：Web 后台生成用户 API Token

用户在 Web 后台复制一个 token 到插件中。

优点：

- 实现简单
- 适合 MVP 和作品集演示

缺点：

- 安全性与体验不如标准 OAuth / Auth Flow
- 后续需要重构

#### 推荐 MVP 方案

先采用 **方案 A：插件内登录 Supabase**。

如果实现过程中卡住，可以临时退回方案 B。

---

## 9. 项目目录结构建议

推荐使用 monorepo：

```text
job-application-tracker/
  apps/
    web/
      app/
      components/
      lib/
      types/
      package.json
    extension/
      src/
        popup/
        content/
        background/
        parsers/
        lib/
      manifest.json
      package.json
  packages/
    shared/
      types/
      constants/
  supabase/
    migrations/
  docs/
    TECHNICAL_PLAN.md
    PRODUCT_PLAN.md
  README.md
  package.json
```

如果 Codex 或开发环境处理 monorepo 太复杂，也可以先简化为：

```text
job-application-tracker/
  web/
  extension/
  supabase/
  docs/
```

---

## 10. 开发里程碑

### Milestone 0：项目初始化

目标：搭好项目骨架。

任务：

- 创建 Git 仓库
- 创建 Next.js 项目
- 配置 TypeScript
- 配置 Tailwind CSS
- 创建 Supabase 项目
- 配置环境变量
- 创建基础 README
- 创建 `docs/TECHNICAL_PLAN.md`

验收标准：

- 本地可以启动 Web 项目
- 页面可以正常访问
- Supabase 连接配置完成

---

### Milestone 1：数据库与认证

目标：用户可以登录，数据表可用。

任务：

- 创建 `job_applications` 数据表
- 开启 RLS
- 添加 RLS policies
- 实现注册 / 登录 / 登出
- 登录后跳转 Dashboard
- 未登录访问 Dashboard 自动跳转登录页

验收标准：

- 用户可以注册和登录
- 用户登录后能看到 Dashboard
- 不同用户之间不能看到彼此数据

---

### Milestone 2：Web Dashboard CRUD

目标：用户可以手动管理求职记录。

任务：

- 实现求职记录列表
- 实现新增岗位记录
- 实现编辑岗位记录
- 实现删除岗位记录
- 实现状态切换
- 实现基础搜索和筛选

验收标准：

- 用户可以完整管理自己的岗位记录
- 数据刷新后仍然存在
- 状态修改能正常保存

---

### Milestone 3：Chrome 插件基础版

目标：插件可以运行并读取当前页面 URL。

任务：

- 创建 Chrome Extension 项目
- 配置 Manifest V3
- 实现 Popup 页面
- 实现 Content Script
- 插件可以读取当前页面 URL 和标题
- 插件可以展示识别结果

验收标准：

- Chrome 可以本地加载插件
- 点击插件后可以看到当前页面基本信息

---

### Milestone 4：岗位页面解析与保存

目标：插件可以从招聘网站页面抓取岗位信息并保存。

任务：

- 实现 Boss 直聘解析器
- 解析岗位名称、公司、城市、薪资、描述、链接
- 插件弹窗展示解析结果
- 用户可编辑解析结果
- 插件调用 Supabase 保存记录
- 实现重复链接提示

验收标准：

- 在目标招聘网站岗位页点击插件，可以自动填充岗位信息
- 点击保存后，Web Dashboard 可以看到记录
- 重复保存时有提示或阻止

---

### Milestone 5：打磨与作品集展示

目标：让项目变成可展示作品。

任务：

- 优化 Dashboard UI
- 添加空状态页面
- 添加加载状态与错误提示
- 添加基础统计卡片，例如总投递数、面试中数量、Offer 数量
- 编写 README
- 添加项目截图
- 部署 Web 到 Vercel
- 录制或准备项目演示说明

验收标准：

- 项目可以公开展示
- README 能说明项目背景、功能、技术栈、演示方式
- 面试时可以清楚讲出项目价值和实现方式

---

## 11. Codex 执行规则

后续使用 Codex 实现时，必须遵守以下规则：

1. 每次只实现一个明确任务，不要一次性大改全项目
2. 实现前先阅读 `docs/TECHNICAL_PLAN.md`
3. 如果发现当前代码与本文档冲突，先说明冲突，再提出修改建议
4. 完成一个任务后，更新本文档中的任务状态
5. 不要擅自引入大型依赖
6. 不要为了炫技引入复杂架构
7. 所有核心数据类型应使用 TypeScript 定义
8. 数据库字段变更必须同步更新本文档
9. 插件解析逻辑必须模块化，不能全部写死在 popup 文件里
10. 遇到不确定的产品决策时，优先保持 MVP 简单

---

## 12. 当前任务状态

| Milestone | 状态 | 说明 |
|---|---|---|
| Milestone 0：项目初始化 | Completed | Next.js + TypeScript + Tailwind CSS + ESLint 基础骨架已完成 |
| Milestone 1：数据库与认证 | Completed | Supabase client、Auth 基础页面、jobs schema 与 RLS 策略已完成 |
| Milestone 2A：Create / Read Jobs | Completed | Dashboard、Create Job、Read Jobs、Supabase `jobs` 表读写与路由保护已完成 |
| Milestone 2B：Update / Delete Jobs | Completed | Job Status 更新、删除确认、删除记录与 Dashboard CRUD 闭环已完成 |
| Milestone 2C：Dashboard Polish | Completed | 统计卡片、状态徽章、卡片式列表、Empty State 与 Dashboard 布局优化已完成 |
| Milestone 3A：Chrome Extension Foundation | Completed | Manifest V3、Popup 基础表单、当前标签页 URL 填充与 Content Script 基础文件已完成 |
| Milestone 3B：Chrome Extension Save to Supabase | Completed | Extension 通过 Next.js API Route 认证并写入 Supabase `jobs` 表，默认 status 为 `saved` |
| Milestone 3B.1：Location and Source Field Support | Completed | Extension Popup 和保存 API 已支持手动填写并保存 Location / Source；Dashboard Create 与 Job Card 已支持对应字段 |
| Milestone 3C：Boss Job Auto Parsing | Completed | Boss 直聘职位详情页可通过 Content Script 自动解析 Job Title、Company、Salary、Location，并在 Popup 中自动填充 |
| Milestone 3C.1：Boss Search Result Detail Panel Parsing | Completed | Boss 搜索结果页右侧详情面板可优先解析；字段不足时从关联左侧岗位卡片补齐 |
| Milestone 3D：Extension Authentication UX | Completed | Popup 可通过 `chrome.storage.local` 本地恢复 Email / Password，并支持 Clear Credentials 清除本地凭据 |
| Milestone 4A：Duplicate Job URL Detection | Completed | Extension 保存 API 已在插入前检查同一用户下相同 `job_url`；重复时返回 `409`，Popup 显示 `该岗位链接已保存` |
| Milestone 4B：Dashboard Search and Filter | Completed | Dashboard Jobs List 已支持按关键词实时搜索，并支持 All / Saved / Applied / Interview / Offer / Rejected 状态筛选 |
| Milestone 4C：Dashboard Localization (ZH-CN) | Completed | Web App 与 Chrome Extension 用户可见文案已统一为简体中文，状态内部枚举值保持不变 |
| Milestone 4：岗位页面解析与保存 | In Progress | 已完成 Boss 解析、Extension 保存、M4A 重复链接提示、M4B Dashboard 搜索筛选与 M4C 简体中文本地化；后续继续按子 Milestone 推进 |
| Milestone 5：打磨与作品集展示 | Not Started | 待开始 |

---

## 13. 后续可扩展方向

MVP 完成后，可以考虑以下方向：

### 13.1 多平台支持

- Boss 直聘
- 猎聘
- 智联招聘
- 前程无忧
- 拉勾
- LinkedIn

### 13.2 AI 功能

- JD 总结
- 简历匹配度分析
- 打招呼语生成
- 面试问题预测
- 投递复盘总结

### 13.3 自动提醒

- 面试时间提醒
- 长时间未跟进提醒
- 状态停滞提醒

### 13.4 数据分析

- 投递转化率
- 不同平台反馈率
- 不同行业投递效果
- 面试率与 Offer 率统计

### 13.5 数据导出

- CSV 导出
- Excel 导出
- Notion 导入 / 导出

---

## 14. 面试讲述重点

如果将本项目写入简历或用于面试，可以强调：

1. 发现求职记录高度依赖手动维护，存在真实用户痛点
2. 通过 Chrome 插件自动采集岗位信息，降低用户记录成本
3. 使用 Next.js + Supabase 快速构建完整产品闭环
4. 使用 RLS 保证用户数据隔离
5. 通过模块化 parser 设计支持后续多招聘平台扩展
6. MVP 先做单平台验证，避免过度设计
7. 后续可以接入 AI 做 JD 分析和求职策略建议

---

## 15. 下一步行动

当前最优先的下一步是：

**手动验收 Milestone 4C：Dashboard Localization (ZH-CN)。**

建议给 Codex 的下一条指令：

```text
请根据 docs/TECHNICAL_PLAN.md 和 docs/CHANGELOG.md，协助我验收 Milestone 4C。
要求：
1. 不提交 Git
2. 检查 Web App 页面用户可见文案是否为简体中文
3. 确认 Dashboard 状态显示为已收藏、已投递、面试中、已获得 Offer、已拒绝
4. 确认 Search / Filter UI 已显示为搜索、状态、全部等中文文案
5. 确认 Chrome Extension Popup 不再残留用户可见英文文案
```



---

# V3 ADDITIONS

## Milestone Roadmap

### Milestone 0 — Project Foundation
Goal: Create a runnable development environment.

Tasks:
- Initialize Git repository
- Create GitHub repository
- Create Next.js application
- Configure TypeScript
- Configure Tailwind CSS
- Configure ESLint and Prettier
- Create docs folder
- Create initial README

Acceptance Criteria:
- Project runs locally
- Git repository connected to GitHub
- First stable commit completed

### Milestone 1 — Authentication & Database
Goal: User accounts and cloud storage.

Tasks:
- Create Supabase project
- Configure authentication
- Create database schema
- Enable Row Level Security
- Create user profile table

Acceptance Criteria:
- User can register
- User can login
- User data is isolated

### Milestone 2 — Job Tracker Dashboard
Goal: Core CRUD system.

Tasks:
- Dashboard layout
- Job table
- Create record
- Edit record
- Delete record
- Search and filtering

Acceptance Criteria:
- Full CRUD works
- Data persists in Supabase

### Milestone 3 — Chrome Extension MVP
Goal: Capture job information.

Tasks:
- Create extension project
- Manifest V3 setup
- Content script
- Job extraction logic
- Manual save button

Acceptance Criteria:
- Capture job information from target site
- Save to database

### Milestone 4 — Integration
Goal: End-to-end workflow.

Tasks:
- Connect extension to backend
- User authentication in extension
- Record synchronization
- Error handling

Acceptance Criteria:
- User can save jobs directly from extension

### Milestone 5 — Production Launch
Goal: Public deployment.

Tasks:
- Deploy frontend
- Production environment variables
- Monitoring
- Bug fixes
- Documentation review

Acceptance Criteria:
- Stable public deployment

---

## Change Log Format

For every milestone update:

### Date
YYYY-MM-DD

### Completed
- Item 1
- Item 2

### Problems Encountered
- Problem
- Solution

### Next Actions
- Item 1
- Item 2

---

## Codex Working Rules

Codex must:

1. Read TECHNICAL_PLAN.md before making changes.
2. Work on only one task at a time.
3. Never skip milestones.
4. Explain all major code changes.
5. Update documentation when architecture changes.
6. Suggest a Git commit after every completed task.
7. Avoid large unreviewed refactors.
8. Prefer simple solutions over complex abstractions.

---

## Resume Value Goal

This project should demonstrate:

- Product thinking
- Full-stack engineering
- Browser extension development
- Database design
- AI-assisted development workflow
- Real-world deployment experience

The project should be strong enough to be discussed during Product Operations, Product Manager, Growth, Operations, and AI-related interviews.
