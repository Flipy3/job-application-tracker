"use client";

import type { Job } from "@/types/job";

const statusLabels: Record<Job["status"], string> = {
  saved: "Saved",
  applied: "Applied",
  communicating: "Communicating",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  closed: "Closed",
};

type JobsListProps = {
  jobs: Job[];
};

export function JobsList({ jobs }: JobsListProps) {
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
                  {statusLabels[job.status] ?? job.status}
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
