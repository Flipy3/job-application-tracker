"use client";

import type { Job, JobStatus } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

const statusLabels: Record<JobStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
};

const statusStyles: Record<
  JobStatus,
  {
    badge: string;
    dot: string;
    select: string;
  }
> = {
  saved: {
    badge: "border-slate-200 bg-slate-50 text-slate-700",
    dot: "bg-slate-400",
    select: "border-slate-300 bg-slate-50 text-slate-800",
  },
  applied: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    dot: "bg-blue-500",
    select: "border-blue-300 bg-blue-50 text-blue-800",
  },
  interview: {
    badge: "border-amber-200 bg-amber-50 text-amber-800",
    dot: "bg-amber-500",
    select: "border-amber-300 bg-amber-50 text-amber-900",
  },
  offer: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dot: "bg-emerald-500",
    select: "border-emerald-300 bg-emerald-50 text-emerald-800",
  },
  rejected: {
    badge: "border-rose-200 bg-rose-50 text-rose-700",
    dot: "bg-rose-500",
    select: "border-rose-300 bg-rose-50 text-rose-800",
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
  if (jobs.length === 0) {
    return (
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm font-medium text-zinc-500">Job list</p>
        <h2 className="mt-2 text-xl font-semibold tracking-normal">
          No jobs saved yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-600">
          Use the Add job form to create your first record. Once saved, each job
          will appear here with its company, role, status, and notes.
        </p>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-normal">Jobs</h2>
          <p className="text-sm text-zinc-600">
            {jobs.length} saved {jobs.length === 1 ? "record" : "records"}
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {jobs.map((job) => {
          const styles = statusStyles[job.status];

          return (
            <article
              className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
              key={job.id}
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-normal text-zinc-950">
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
                  <p className="mt-1 text-sm font-medium text-zinc-700">
                    {job.company_name}
                  </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <select
                    aria-label={`Update status for ${job.job_title}`}
                    className={`w-full rounded-md border px-3 py-2 text-sm font-medium outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-100 sm:w-36 ${styles.select}`}
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
                    className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                    disabled={deletingJobId === job.id}
                    onClick={() => onDelete(job)}
                    type="button"
                  >
                    {deletingJobId === job.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 border-t border-zinc-100 pt-4 sm:grid-cols-2 xl:grid-cols-4">
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">
                    Location
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800">
                    {job.location || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">
                    Salary
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800">
                    {job.salary || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">
                    Source
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800">
                    {job.source || "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase text-zinc-500">
                    Created
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-800">
                    {formatDate(job.created_at)}
                  </dd>
                </div>
              </dl>

              <div className="mt-4 grid gap-4 border-t border-zinc-100 pt-4 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <p className="text-xs font-medium uppercase text-zinc-500">
                    Notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-zinc-800">
                    {job.notes || "No notes added."}
                  </p>
                </div>

                <div className="flex lg:justify-end">
                  {job.job_url ? (
                    <a
                      className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-950 hover:bg-zinc-50"
                      href={job.job_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open job
                    </a>
                  ) : (
                    <span className="text-sm text-zinc-500">No job link</span>
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

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}
