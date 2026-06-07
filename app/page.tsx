export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <main className="w-full max-w-2xl space-y-6">
        <p className="text-sm font-medium text-zinc-500">Milestone 0</p>
        <h1 className="text-4xl font-semibold tracking-normal">
          Job Application Tracker
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          Project foundation is ready. Business features will be implemented in
          later milestones according to docs/TECHNICAL_PLAN.md.
        </p>
      </main>
    </div>
  );
}
