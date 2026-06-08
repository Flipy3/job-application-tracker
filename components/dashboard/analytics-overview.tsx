import type { JobAnalyticsOverview } from "@/lib/analytics/jobs";

type AnalyticsOverviewProps = {
  overview: JobAnalyticsOverview;
};

export function AnalyticsOverview({ overview }: AnalyticsOverviewProps) {
  const cards = [
    {
      label: "岗位总数",
      value: overview.totalJobs,
      helper: "全部已保存岗位",
    },
    {
      label: "投递总数",
      value: overview.appliedJobs,
      helper: "已投递及后续状态",
    },
    {
      label: "面试数",
      value: overview.interviewJobs,
      helper: "面试中和 Offer",
    },
    {
      label: "面试率",
      value: formatPercent(overview.interviewRate),
      helper: "面试数 / 投递总数",
    },
    {
      label: "Offer 数",
      value: overview.offerJobs,
      helper: "已获得 Offer",
    },
    {
      label: "Offer 率",
      value: formatPercent(overview.offerRate),
      helper: "Offer 数 / 投递总数",
    },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <div
          className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          key={card.label}
        >
          <p className="text-xs font-medium uppercase text-zinc-600 dark:text-zinc-400">
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
            {card.value}
          </p>
          <p className="mt-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400">{card.helper}</p>
        </div>
      ))}
    </section>
  );
}

function formatPercent(value: number) {
  return `${value}%`;
}
