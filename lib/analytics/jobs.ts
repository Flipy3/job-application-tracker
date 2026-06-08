import type { Job, JobStatus } from "@/types/job";
import { JOB_STATUSES } from "@/types/job";

export type JobAnalyticsOverview = {
  totalJobs: number;
  appliedJobs: number;
  interviewJobs: number;
  interviewRate: number;
  offerJobs: number;
  offerRate: number;
  statusCounts: Record<JobStatus, number>;
};

export function getJobAnalyticsOverview(jobs: Job[]): JobAnalyticsOverview {
  const statusCounts = getStatusCounts(jobs);
  const appliedJobs =
    statusCounts.applied +
    statusCounts.interview +
    statusCounts.offer +
    statusCounts.rejected;
  const interviewJobs = statusCounts.interview + statusCounts.offer;
  const offerJobs = statusCounts.offer;

  return {
    totalJobs: jobs.length,
    appliedJobs,
    interviewJobs,
    interviewRate: getRate(interviewJobs, appliedJobs),
    offerJobs,
    offerRate: getRate(offerJobs, appliedJobs),
    statusCounts,
  };
}

function getStatusCounts(jobs: Job[]) {
  const statusCounts = JOB_STATUSES.reduce<Record<JobStatus, number>>(
    (counts, status) => ({
      ...counts,
      [status]: 0,
    }),
    {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0,
    },
  );

  jobs.forEach((job) => {
    statusCounts[job.status] += 1;
  });

  return statusCounts;
}

function getRate(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}
