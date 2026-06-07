export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <main className="w-full max-w-2xl space-y-6">
        <p className="text-sm font-medium text-zinc-500">Milestone 2B</p>
        <h1 className="text-4xl font-semibold tracking-normal">
          Job Application Tracker
        </h1>
        <p className="text-lg leading-8 text-zinc-600">
          Supabase auth is ready, and the Dashboard can create, read, update,
          and delete job records for the current user.
        </p>
        <div className="flex gap-3 text-sm font-medium">
          <a className="underline" href="/dashboard">
            Dashboard
          </a>
          <a className="underline" href="/login">
            Log in
          </a>
          <a className="underline" href="/signup">
            Create account
          </a>
        </div>
      </main>
    </div>
  );
}
