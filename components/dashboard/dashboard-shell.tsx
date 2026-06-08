"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigationItems = [
  {
    href: "/dashboard",
    label: "求职看板",
    shortLabel: "D",
  },
  {
    href: "/dashboard/feedback",
    label: "Feedback",
    shortLabel: "F",
  },
];

type DashboardShellProps = {
  children: ReactNode;
  description: string;
  title: string;
  userEmail?: string | null;
};

export function DashboardShell({
  children,
  description,
  title,
  userEmail,
}: DashboardShellProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div
        className={`mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 transition-[grid-template-columns] duration-200 sm:px-6 lg:py-8 ${
          isSidebarCollapsed
            ? "lg:grid-cols-[4.5rem_minmax(0,1fr)]"
            : "lg:grid-cols-[14rem_minmax(0,1fr)]"
        }`}
      >
        <aside
          className={`border-b border-zinc-200 pb-4 dark:border-zinc-800 lg:min-h-[calc(100vh-4rem)] lg:border-b-0 lg:border-r lg:pb-0 ${
            isSidebarCollapsed ? "lg:pr-3" : "lg:pr-6"
          }`}
        >
          <div className="flex flex-col gap-4 lg:sticky lg:top-8">
            <div
              className={`flex items-center gap-3 ${
                isSidebarCollapsed ? "lg:justify-center" : "lg:justify-between"
              }`}
            >
              <Link
                className={`min-w-0 text-base font-semibold tracking-normal text-zinc-950 dark:text-zinc-50 ${
                  isSidebarCollapsed ? "lg:hidden" : ""
                }`}
                href="/dashboard"
              >
                求职进度追踪器
              </Link>
              <button
                aria-expanded={!isSidebarCollapsed}
                aria-label={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:focus:ring-zinc-600"
                onClick={() =>
                  setIsSidebarCollapsed((currentValue) => !currentValue)
                }
                title={isSidebarCollapsed ? "展开侧边栏" : "收起侧边栏"}
                type="button"
              >
                {isSidebarCollapsed ? "›" : "☰"}
              </button>
            </div>
            <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
              {navigationItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));

                return (
                  <Link
                    aria-label={item.label}
                    className={`inline-flex h-10 shrink-0 items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors ${
                      isSidebarCollapsed
                        ? "w-10 justify-center px-0 lg:w-full"
                        : "px-3"
                    } ${
                      isActive
                        ? "bg-zinc-950 text-white dark:bg-zinc-100 dark:text-zinc-950"
                        : "text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                    }`}
                    href={item.href}
                    key={item.href}
                    title={item.label}
                  >
                    <span className={isSidebarCollapsed ? "lg:hidden" : ""}>
                      {item.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className={isSidebarCollapsed ? "hidden lg:inline" : "hidden"}
                    >
                      {item.shortLabel}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-normal">{title}</h1>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                {description}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <ThemeToggle />
              {userEmail ? (
                <span className="text-zinc-700 dark:text-zinc-300">
                  {userEmail}
                </span>
              ) : null}
              <Link
                className="font-medium text-zinc-950 underline dark:text-zinc-50"
                href="/logout"
              >
                退出登录
              </Link>
            </div>
          </header>

          <div className="mt-6 flex flex-col gap-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
