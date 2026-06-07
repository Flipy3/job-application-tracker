export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <main className="w-full max-w-2xl space-y-6">
        <p className="text-sm font-medium text-zinc-500">里程碑 2B</p>
        <h1 className="text-4xl font-semibold tracking-normal">
          求职进度追踪器
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          认证能力已就绪，求职看板可以为当前用户创建、查看、更新和删除岗位记录。
        </p>
        <div className="flex gap-3 text-sm font-medium">
          <a className="underline" href="/dashboard">
            求职看板
          </a>
          <a className="underline" href="/login">
            登录
          </a>
          <a className="underline" href="/signup">
            注册
          </a>
        </div>
      </main>
    </div>
  );
}
