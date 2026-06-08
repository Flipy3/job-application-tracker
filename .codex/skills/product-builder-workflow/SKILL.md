---
name: product-builder-workflow
description: Standardized product development workflow for taking SaaS products, Chrome Extensions, AI tools, job-search tools, operational tools, and indie products from idea to launch. Use when the user asks Codex to plan, implement, review, or ship features or milestones for Product Builder style projects, especially Job Application Tracker using Next.js, TypeScript, Supabase, PostgreSQL, Vercel, and Chrome Extension code.
---

# Product Builder Workflow

Use Chinese in user-facing replies. Explain for a junior developer. Prefer shipping useful product increments over over-engineering.

## Core Principles

- Read the existing project structure before development.
- Check git status before development.
- Prefer small iterations and avoid broad refactors.
- Tie every feature to clear user value.
- Keep every milestone independently verifiable.
- After each development task, provide a Git commit suggestion.
- For database changes, output the exact SQL that must be manually executed.
- For user-facing features, provide manual acceptance steps.
- Never expose environment variables, secrets, tokens, or sensitive data.
- Prioritize getting the product online and usable.

## Project Audit

Before writing code for a product feature, inspect the repository first.

Read relevant files and folders when they exist:

- `README.md`
- `docs/CHANGELOG.md`
- `package.json`
- `app/`
- `components/`
- `lib/`
- `types/`
- `supabase/schema.sql`
- Chrome Extension files such as `manifest.json`, popup code, and content scripts when the task touches the extension

Run or inspect:

- `git status --short`
- Existing scripts in `package.json`

Then summarize:

- Current project state
- Current milestone
- Implemented features
- Missing features
- Scope impacted by this task

## Requirement Definition

Before editing code, state the requirement briefly:

- User problem: what pain or workflow gap the user has
- Feature goal: what this change solves
- Success criteria: what must work for the task to count as done
- Non-goals: what will intentionally not be done now
- Expected files: files likely to change
- Database impact: new table, field, index, RLS, or no database change
- Analytics impact: new event or no analytics change
- Resume value: how this feature can be described in a project/resume

If the request is small and obvious, keep this concise and proceed.

## Implementation Plan

Plan and execute in small steps:

- UI: pages, components, states, forms, empty/loading/error states
- Data: TypeScript types, validation, queries, mutations
- Supabase: tables, indexes, RLS, policies, migrations or manual SQL
- Analytics: key `trackEvent()` calls only
- Chrome Extension: permissions, content script, popup, parsing logic, packaging impact
- Docs: README, changelog, or manual setup notes when useful

Follow the existing code style, dashboard style, and project boundaries. Do not introduce unnecessary dependencies. Do not break Auth or RLS.

## Database Rules

When adding or changing database objects:

- Include `id` and `created_at` for new tables.
- Add indexes based on expected query patterns.
- Enable RLS with `alter table ... enable row level security`.
- Add policies so users can only access their own data.
- Output only the SQL the user must manually run for this task.
- Do not ask the user to rerun the full `supabase/schema.sql` unless that is explicitly necessary.

## Analytics Rules

For important product behaviors, prefer `trackEvent()` when the project already uses analytics.

Track only key events, such as:

- `page_view`
- `job_created`
- `job_updated`
- `job_deleted`
- `feedback_submitted`

Analytics failures must not block the main user flow.

## Chrome Extension Rules

When modifying extension behavior, inspect:

- `manifest.json`
- `host_permissions`
- content scripts
- popup files

Keep permissions minimal. Do not expose secrets. Ensure the extension can be installed in Chrome developer mode.

When relevant, explain:

- How to package it
- How to test it internally
- Whether the change affects Chrome Web Store readiness

## Validation

After implementation, run:

```bash
npm run lint
npm run build
```

If a command fails, fix the issue when feasible. If it cannot be fixed in the current task, report the exact blocker and residual risk.

Also verify:

- TypeScript has no new errors
- Relevant routes load
- The target user flow works
- Existing core flows remain intact

## Final Response Format

After completing a task, answer in Chinese with these sections:

```markdown
### 本次完成内容

### 修改文件

### 新增 SQL

### 新增埋点

### 验证结果

### 手动验收步骤

### Git 提交建议

### 后续建议
```

For Git suggestions, provide concrete commands such as:

```bash
git add .
git commit -m "feat: add feedback system"
git push
```

If there is no SQL or no analytics change, explicitly say `无`.

## Milestone Reference

- Milestone 1: 用户认证
- Milestone 2: Job CRUD
- Milestone 3: 搜索、筛选、排序
- Milestone 4: Analytics Dashboard
- Milestone 5A: Chrome Extension MVP
- Milestone 5B: Boss直聘职位解析
- Milestone 5C: 用户行为埋点
- Milestone 5D: 用户反馈系统
- Milestone 6: 内测与用户验证
- Milestone 7: Chrome Web Store 上架
- Milestone 8: 增长与运营
- Milestone 9: 简历与项目包装
