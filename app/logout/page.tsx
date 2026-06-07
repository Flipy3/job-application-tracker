"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

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
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-8">
        <p className="text-sm font-medium text-zinc-500">里程碑 2B</p>
        <h1 className="text-3xl font-semibold tracking-normal">退出登录</h1>
        <p className="text-sm leading-6 text-zinc-600">{message}</p>
        <Link className="inline-flex text-sm font-medium underline" href="/login">
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
