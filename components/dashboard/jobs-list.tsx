"use client";

import { useMemo, useState } from "react";
import { cleanLocationText } from "@/lib/location";
import type { Job, JobStatus } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

const statusLabels: Record<JobStatus, string> = {
  saved: "已收藏",
  applied: "已投递",
  interview: "面试中",
  offer: "已获得 Offer",
  rejected: "已拒绝",
};

type SortOption =
  | "default"
  | "newest"
  | "oldest"
  | "company-asc"
  | "company-desc";

const sortOptions: Array<{
  label: string;
  value: SortOption;
}> = [
  {
    label: "默认排序",
    value: "default",
  },
  {
    label: "最新优先",
    value: "newest",
  },
  {
    label: "最早优先",
    value: "oldest",
  },
  {
    label: "公司名称 A-Z",
    value: "company-asc",
  },
  {
    label: "公司名称 Z-A",
    value: "company-desc",
  },
];

const statusStyles: Record<
  JobStatus,
  {
    badge: string;
    dot: string;
    select: string;
  }
> = {
  saved: {
    badge: "border-slate-300 bg-slate-50 text-slate-800 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
    dot: "bg-slate-500",
    select: "border-slate-400 bg-slate-50 text-slate-900 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
  },
  applied: {
    badge: "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-100",
    dot: "bg-blue-500",
    select: "border-blue-400 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-100",
  },
  interview: {
    badge: "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100",
    dot: "bg-amber-500",
    select: "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-950 dark:text-amber-100",
  },
  offer: {
    badge: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100",
    dot: "bg-emerald-500",
    select: "border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-100",
  },
  rejected: {
    badge: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-100",
    dot: "bg-rose-500",
    select: "border-rose-400 bg-rose-50 text-rose-900 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-100",
  },
};

type JobsListProps = {
  jobs: Job[];
  deletingJobId: string | null;
  onDelete: (job: Job) => Promise<void>;
  onStatusChange: (job: Job, status: JobStatus) => Promise<void>;
  updatingJobId: string | null;
};

export function JobsList({
  deletingJobId,
  jobs,
  onDelete,
  onStatusChange,
  updatingJobId,
}: JobsListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const filteredJobs = useMemo(
    () => getVisibleJobs(jobs, searchQuery, statusFilter, sortOption),
    [jobs, searchQuery, statusFilter, sortOption],
  );

  if (jobs.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">岗位列表</p>
        <h2 className="mt-2 text-xl font-semibold tracking-normal">
          暂无岗位记录
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          使用新增岗位表单创建第一条记录。保存后，每个岗位都会在这里显示公司、职位、状态和备注。
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-normal">岗位</h2>
          <p className="text-sm text-zinc-700 dark:text-zinc-300">
            {filteredJobs.length === jobs.length
              ? `已保存 ${jobs.length} 条记录`
              : `共 ${jobs.length} 条，当前显示 ${filteredJobs.length} 条`}
          </p>
        </div>
      </div>

      <div className="grid gap-3 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 lg:grid-cols-[1fr_13rem_13rem]">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">搜索</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="搜索岗位、公司、备注、工作地点、来源"
            type="search"
            value={searchQuery}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">状态</span>
          <select
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300"
            onChange={(event) =>
              setStatusFilter(event.target.value as JobStatus | "all")
            }
            value={statusFilter}
          >
            <option value="all">全部</option>
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">排序</span>
          <select
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300"
            onChange={(event) =>
              setSortOption(event.target.value as SortOption)
            }
            value={sortOption}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-10 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            未找到符合条件的岗位
          </p>
        </div>
      ) : null}

      <div className="grid gap-4">
        {filteredJobs.map((job) => {
          const styles = statusStyles[job.status];

          return (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              key={job.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
                      {job.job_title}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${styles.badge}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${styles.dot}`}
                      />
                      {statusLabels[job.status]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    {getDisplayCompanyName(job.company_name)}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    aria-label={`更新「${job.job_title}」的状态`}
                    className={`w-full rounded-md border px-3 py-2 text-sm font-medium outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-100 dark:focus:border-zinc-300 dark:disabled:bg-zinc-800 sm:w-36 ${styles.select}`}
                    disabled={updatingJobId === job.id}
                    onChange={(event) =>
                      onStatusChange(job, event.target.value as JobStatus)
                    }
                    value={job.status}
                  >
                    {JOB_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {statusLabels[status]}
                      </option>
                    ))}
                  </select>

                  <button
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
                    disabled={deletingJobId === job.id}
                    onClick={() => onDelete(job)}
                    type="button"
                  >
                    {deletingJobId === job.id ? "删除中..." : "删除"}
                  </button>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                    工作地点
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                    {formatDisplayLocation(job.location)}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                    薪资
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                    {job.salary || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                    来源
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                    {job.source || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                    创建时间
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800 dark:text-zinc-200">
                    {formatDate(job.created_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid gap-4 border-t border-zinc-100 pt-4 dark:border-zinc-800 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
                    备注
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-800 dark:text-zinc-200">
                    {job.notes || "暂无备注。"}
                  </p>
                </div>

                <div className="flex lg:justify-end">
                  {job.job_url ? (
                    <a
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
                      href={job.job_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      打开岗位
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-600 dark:text-zinc-400">暂无岗位链接</span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return new Intl.DateTimeFormat("zh-CN", {
    dateStyle: "medium",
  }).format(new Date(value));
}

function getVisibleJobs(
  jobs: Job[],
  searchQuery: string,
  statusFilter: JobStatus | "all",
  sortOption: SortOption,
) {
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const matchesStatus =
      statusFilter === "all" || job.status === statusFilter;
    const matchesSearch =
      !normalizedQuery ||
      [
        job.job_title,
        job.company_name,
        job.notes,
        formatDisplayLocation(job.location),
        job.source,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);

    return matchesStatus && matchesSearch;
  });

  return sortJobs(filteredJobs, sortOption);
}

function sortJobs(jobs: Job[], sortOption: SortOption) {
  if (sortOption === "default") {
    return jobs;
  }

  return [...jobs].sort((firstJob, secondJob) => {
    if (sortOption === "oldest") {
      return getCreatedAtTime(firstJob) - getCreatedAtTime(secondJob);
    }

    if (sortOption === "company-asc") {
      return compareCompanyNames(firstJob, secondJob);
    }

    if (sortOption === "company-desc") {
      return compareCompanyNames(secondJob, firstJob);
    }

    return getCreatedAtTime(secondJob) - getCreatedAtTime(firstJob);
  });
}

function getCreatedAtTime(job: Job) {
  return job.created_at ? new Date(job.created_at).getTime() : 0;
}

function compareCompanyNames(firstJob: Job, secondJob: Job) {
  return getDisplayCompanyName(firstJob.company_name).localeCompare(
    getDisplayCompanyName(secondJob.company_name),
    "en",
    {
      sensitivity: "base",
    },
  );
}

function getDisplayCompanyName(companyName: string) {
  return companyName.replace(/^公司名称\s*/, "").trim();
}

function formatDisplayLocation(location: string | null) {
  if (!location) {
    return "-";
  }

  return cleanLocationText(location) || "-";
}
