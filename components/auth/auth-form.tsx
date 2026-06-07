"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignup = mode === "signup";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    setIsSubmitting(true);

    try {
      const supabase = createSupabaseBrowserClient();
      const authAction = isSignup
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password });

      const { error: authError } = await authAction;

      if (authError) {
        setError(authError.message);
      } else {
        if (!isSignup) {
          setIsSubmitting(false);
          router.push("/dashboard");
          return;
        }

        setMessage(
          "Signup submitted. Check your email if confirmation is enabled.",
        );
      }
    } catch (authError) {
      setError(
        authError instanceof Error
          ? authError.message
          : "Unable to complete auth request.",
      );
    }


    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md space-y-8 rounded-lg border border-zinc-200 bg-white p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">Milestone 2A</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            {isSignup ? "Create account" : "Log in"}
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            Use email and password authentication with Supabase.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              name="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium">Password</span>
            <input
              className="w-full rounded-md border border-zinc-300 px-3 py-2 outline-none focus:border-zinc-900"
              minLength={6}
              name="password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>

          {error ? (
            <p className="rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-900">
              {error}
            </p>
          ) : null}

          {message ? (
            <p className="rounded-md border border-zinc-300 bg-zinc-50 p-3 text-sm text-zinc-900">
              {message}
            </p>
          ) : null}

          <button
            className="w-full rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting
              ? "Please wait..."
              : isSignup
                ? "Create account"
                : "Log in"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <Link
            className="font-medium underline"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "Log in instead" : "Create an account"}
          </Link>
          <Link className="text-zinc-600 underline" href="/logout">
            Log out
          </Link>
        </div>
      </section>
    </main>
  );
}
