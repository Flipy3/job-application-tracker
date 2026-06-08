import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function Home() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <main className="w-full max-w-2xl space-y-6">
        <h1 className="text-4xl font-semibold tracking-normal">
          求职进度追踪器
        </h1>
        <p className="text-lg leading-8 text-zinc-700 dark:text-zinc-300">
          认证能力已就绪，求职看板可以为当前用户创建、查看、更新和删除岗位记录。
        </p>
        <div className="flex gap-3 text-sm font-medium">
          <a className="underline dark:text-zinc-50" href="/dashboard">
            求职看板
          </a>
          <a className="underline dark:text-zinc-50" href="/login">
            登录
          </a>
          <a className="underline dark:text-zinc-50" href="/signup">
            注册
          </a>
        </div>
      </main>
    </div>
  );
}
