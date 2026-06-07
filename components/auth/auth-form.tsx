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
        setError(getAuthErrorMessage(authError.message));
      } else {
        if (!isSignup) {
          setIsSubmitting(false);
          router.push("/dashboard");
          return;
        }

        setMessage(
          "注册已提交。如已开启邮箱确认，请查看你的邮箱。",
        );
      }
    } catch (authError) {
      setError(
        authError instanceof Error
          ? getAuthErrorMessage(authError.message)
          : "无法完成认证请求。",
      );
    }


    setIsSubmitting(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md space-y-8 rounded-lg border border-zinc-200 bg-white p-8">
        <div className="space-y-2">
          <p className="text-sm font-medium text-zinc-500">里程碑 2B</p>
          <h1 className="text-3xl font-semibold tracking-normal">
            {isSignup ? "注册" : "登录"}
          </h1>
          <p className="text-sm leading-6 text-zinc-600">
            使用邮箱和密码访问你的求职记录。
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium">邮箱</span>
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
            <span className="text-sm font-medium">密码</span>
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
              ? "请稍候..."
              : isSignup
                ? "注册"
                : "登录"}
          </button>
        </form>

        <div className="flex items-center justify-between text-sm">
          <Link
            className="font-medium underline"
            href={isSignup ? "/login" : "/signup"}
          >
            {isSignup ? "改为登录" : "注册账户"}
          </Link>
          <Link className="text-zinc-600 underline" href="/logout">
            退出登录
          </Link>
        </div>
      </section>
    </main>
  );
}

function getAuthErrorMessage(message: string) {
  const normalizedMessage = message.toLowerCase();

  if (normalizedMessage.includes("invalid login credentials")) {
    return "邮箱或密码不正确。";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "邮箱尚未完成确认，请先查看确认邮件。";
  }

  if (normalizedMessage.includes("user already registered")) {
    return "该邮箱已注册，请直接登录。";
  }

  if (normalizedMessage.includes("password")) {
    return "密码不符合要求，请检查后重试。";
  }

  if (/[\u4e00-\u9fff]/.test(message)) {
    return message;
  }

  return "认证请求失败，请稍后重试。";
}
