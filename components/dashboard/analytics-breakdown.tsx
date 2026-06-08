import type {
  JobAnalyticsBreakdown,
  JobBreakdownItem,
} from "@/lib/analytics/jobs";

type AnalyticsBreakdownProps = {
  breakdown: JobAnalyticsBreakdown;
};

export function AnalyticsBreakdown({ breakdown }: AnalyticsBreakdownProps) {
  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-lg font-semibold tracking-normal">数据拆解</h2>
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          按状态、来源和城市查看当前岗位记录构成。
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <BreakdownCard items={breakdown.status} title="状态分布" />
        <BreakdownCard
          emptyMessage="暂无来源数据"
          items={breakdown.sources}
          title="来源 Top 5"
        />
        <BreakdownCard
          emptyMessage="暂无城市数据"
          items={breakdown.locations}
          title="城市 Top 5"
        />
      </div>
    </section>
  );
}

type BreakdownCardProps = {
  emptyMessage?: string;
  items: JobBreakdownItem[];
  title: string;
};

function BreakdownCard({
  emptyMessage = "暂无数据",
  items,
  title,
}: BreakdownCardProps) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h3 className="text-sm font-semibold tracking-normal text-zinc-950 dark:text-zinc-50">
        {title}
      </h3>

      {items.length === 0 ? (
        <p className="mt-4 rounded-md border border-dashed border-zinc-300 px-3 py-4 text-center text-sm text-zinc-700 dark:border-zinc-700 dark:text-zinc-300">
          {emptyMessage}
        </p>
      ) : (
        <ul className="mt-4 space-y-4">
          {items.map((item) => (
            <li className="space-y-2" key={item.label}>
              <div className="flex items-center justify-between gap-3 text-sm">
                <span className="min-w-0 truncate font-medium text-zinc-900 dark:text-zinc-100">
                  {item.label}
                </span>
                <span className="shrink-0 text-zinc-700 dark:text-zinc-300">
                  {item.count} · {formatPercent(item.percentage)}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-900 dark:bg-zinc-100"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function formatPercent(value: number) {
  return `${value}%`;
}
