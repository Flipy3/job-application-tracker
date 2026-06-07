"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LogoutPage() {
  const [message, setMessage] = useState("Signing out...");

  useEffect(() => {
    async function signOut() {
      try {
        const supabase = createSupabaseBrowserClient();
        const { error } = await supabase.auth.signOut();
        setMessage(error ? error.message : "You are signed out.");
      } catch (signOutError) {
        setMessage(
          signOutError instanceof Error
            ? signOutError.message
            : "Unable to complete sign out.",
        );
      }
    }

    signOut();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <section className="w-full max-w-md space-y-6 rounded-lg border border-zinc-200 bg-white p-8">
        <p className="text-sm font-medium text-zinc-500">Milestone 2A</p>
        <h1 className="text-3xl font-semibold tracking-normal">Log out</h1>
        <p className="text-sm leading-6 text-zinc-600">{message}</p>
        <Link className="inline-flex text-sm font-medium underline" href="/login">
          Back to login
        </Link>
      </section>
    </main>
  );
}
