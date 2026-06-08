import type { Job, JobStatus } from "@/types/job";
import { cleanLocationText } from "@/lib/location";
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

export type JobAnalyticsBreakdown = {
  status: JobBreakdownItem[];
  sources: JobBreakdownItem[];
  locations: JobBreakdownItem[];
};

export type JobBreakdownItem = {
  label: string;
  count: number;
  percentage: number;
};

const statusLabels: Record<JobStatus, string> = {
  saved: "已收藏",
  applied: "已投递",
  interview: "面试中",
  offer: "已获得 Offer",
  rejected: "已拒绝",
};

const commonChineseCities = [
  "北京",
  "上海",
  "广州",
  "深圳",
  "杭州",
  "南京",
  "苏州",
  "成都",
  "重庆",
  "武汉",
  "西安",
  "长沙",
  "郑州",
  "天津",
  "青岛",
  "厦门",
  "宁波",
  "合肥",
  "佛山",
  "东莞",
];

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

export function getJobAnalyticsBreakdown(jobs: Job[]): JobAnalyticsBreakdown {
  const totalJobs = jobs.length;
  const statusCounts = getStatusCounts(jobs);

  return {
    status: JOB_STATUSES.map((status) => ({
      label: statusLabels[status],
      count: statusCounts[status],
      percentage: getRate(statusCounts[status], totalJobs),
    })),
    sources: getTopBreakdownItems(
      jobs.map((job) => job.source),
      totalJobs,
    ),
    locations: getTopBreakdownItems(
      jobs.map((job) => normalizeLocationToCity(job.location ?? "")),
      totalJobs,
    ),
  };
}

export function normalizeLocationToCity(location: string): string {
  const cleanedLocation = cleanLocationText(location);

  if (cleanedLocation === "") {
    return "未填写";
  }

  const matchedCity = commonChineseCities.find((city) =>
    cleanedLocation.startsWith(city),
  );

  return matchedCity ?? cleanedLocation;
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

function getTopBreakdownItems(values: Array<string | null>, totalJobs: number) {
  const counts = new Map<string, number>();

  values.forEach((value) => {
    const label = getBreakdownLabel(value);
    counts.set(label, (counts.get(label) ?? 0) + 1);
  });

  return Array.from(counts.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: getRate(count, totalJobs),
    }))
    .sort((firstItem, secondItem) => {
      if (secondItem.count !== firstItem.count) {
        return secondItem.count - firstItem.count;
      }

      return firstItem.label.localeCompare(secondItem.label, "zh-CN");
    })
    .slice(0, 5);
}

function getBreakdownLabel(value: string | null) {
  if (value === null || value === "") {
    return "未填写";
  }

  return value;
}

function getRate(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return Math.round((numerator / denominator) * 100);
}
