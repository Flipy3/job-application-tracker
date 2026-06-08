"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export default function LogoutPage() {
  const [message, setMessage] = useState("正在退出登录...");

  useEffect(() => {
    async function signOut() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();
        setMessage(error ? getSignOutErrorMessage(error.message) : "你已退出登录。");
      } catch (signOutError) {
        setMessage(
          signOutError instanceof Error
            ? getSignOutErrorMessage(signOutError.message)
            : "无法完成退出登录。",
        );
      }
    }

    signOut();
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-zinc-50 px-6 text-zinc-950 dark:bg-zinc-950 dark:text-zinc-50">
      <div className="absolute right-4 top-4 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <section className="w-full max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-8 text-zinc-950 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50">
        <h1 className="text-3xl font-semibold tracking-normal">退出登录</h1>
        <p className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">{message}</p>
        <Link className="inline-flex text-sm font-medium text-zinc-950 underline dark:text-zinc-50" href="/login">
          返回登录
        </Link>
      </section>
    </main>
  );
}

function getSignOutErrorMessage(message: string) {
  if (/[\u4e00-\u9fff]/.test(message)) {
    return message;
  }

  return "退出登录失败，请稍后重试。";
}
