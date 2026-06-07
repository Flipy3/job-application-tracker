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
      <section className="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold tracking-normal">No jobs yet</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Add your first job record to start tracking applications.
        </p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <div className="border-b border-zinc-200 px-6 py-4">
        <h2 className="text-lg font-semibold tracking-normal">Jobs</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] text-left text-sm">
          <thead className="bg-zinc-50 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Job</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Salary</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Link</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-4 py-3 font-medium text-zinc-950">
                  {job.job_title}
                </td>
                <td className="px-4 py-3 text-zinc-700">{job.company_name}</td>
                <td className="px-4 py-3 text-zinc-700">
                  {job.location || "-"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {job.salary || "-"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {job.source || "-"}
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  <select
                    className="w-32 rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-100"
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
                </td>
                <td className="px-4 py-3 text-zinc-700">
                  {formatDate(job.created_at)}
                </td>
                <td className="px-4 py-3">
                  {job.job_url ? (
                    <a
                      className="font-medium text-zinc-950 underline"
                      href={job.job_url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Open
                    </a>
                  ) : (
                    <span className="text-zinc-500">-</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <button
                    className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm font-medium text-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500"
                    disabled={deletingJobId === job.id}
                    onClick={() => onDelete(job)}
                    type="button"
                  >
                    {deletingJobId === job.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
