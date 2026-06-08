"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { trackEvent } from "@/lib/analytics";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CreateFeedbackInput, FeedbackType } from "@/types/feedback";
import { FEEDBACK_TYPES } from "@/types/feedback";

const feedbackTypeLabels: Record<FeedbackType, string> = {
  bug: "Bug",
  feature: "功能建议",
  general: "一般反馈",
};

const initialFormState: CreateFeedbackInput = {
  content: "",
  title: "",
  type: "general",
};

export function FeedbackPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formState, setFormState] =
    useState<CreateFeedbackInput>(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadFeedbackPage() {
      setIsLoading(true);
      setError("");

      try {
        const supabase = createSupabaseBrowserClient();
        const {
          data: { user: currentUser },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !currentUser) {
          router.replace("/login");
          return;
        }

        if (isMounted) {
          setUser(currentUser);
          trackEvent("page_view", { page: "feedback" });
        }
      } catch (feedbackError) {
        if (isMounted) {
          setError(
            feedbackError instanceof Error
              ? getFeedbackErrorMessage(
                  feedbackError.message,
                  "无法加载反馈页面。",
                )
              : "无法加载反馈页面。",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFeedbackPage();

    return () => {
      isMounted = false;
    };
  }, [router]);

  function updateField<Key extends keyof CreateFeedbackInput>(
    field: Key,
    value: CreateFeedbackInput[Key],
  ) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      router.replace("/login");
      return;
    }

    const title = formState.title.trim();
    const content = formState.content.trim();

    if (!title || !content) {
      setError("请填写反馈标题和内容。");
      setMessage("");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: insertError } = await supabase
        .from("feedback")
        .insert({
          content,
          title,
          type: formState.type,
          user_id: user.id,
        })
        .select("id,type")
        .single();

      if (insertError) {
        throw insertError;
      }

      setFormState(initialFormState);
      setMessage("反馈已提交，感谢你帮助我们改进产品。");
      trackEvent("feedback_submitted", {
        feedback_id: data?.id,
        type: data?.type ?? formState.type,
      });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? getFeedbackErrorMessage(submitError.message, "无法提交反馈。")
          : "无法提交反馈。",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <DashboardShell
      description="提交 Bug、功能建议或一般产品反馈。"
      title="Feedback"
      userEmail={user?.email}
    >
      {error ? (
        <p className="rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          {error}
        </p>
      ) : null}

      {message ? (
        <p className="rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
          {message}
        </p>
      ) : null}

      {isLoading ? (
        <section className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
          正在加载反馈页面...
        </section>
      ) : (
        <form
          className="max-w-3xl space-y-5 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          onSubmit={handleSubmit}
        >
          <div>
            <h2 className="text-lg font-semibold tracking-normal">
              提交产品反馈
            </h2>
            <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
              你的反馈会直接保存到当前账户下。
            </p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              类型
            </span>
            <select
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:focus:border-zinc-300"
              name="type"
              onChange={(event) =>
                updateField("type", event.target.value as FeedbackType)
              }
              value={formState.type}
            >
              {FEEDBACK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {feedbackTypeLabels[type]}
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              标题
            </span>
            <input
              className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
              maxLength={120}
              name="title"
              onChange={(event) => updateField("title", event.target.value)}
              required
              value={formState.title}
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              内容
            </span>
            <textarea
              className="min-h-40 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
              name="content"
              onChange={(event) => updateField("content", event.target.value)}
              required
              value={formState.content}
            />
          </label>

          <button
            className="rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-300"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "提交中..." : "提交反馈"}
          </button>
        </form>
      )}
    </DashboardShell>
  );
}

function getFeedbackErrorMessage(message: string, fallback: string) {
  if (/[\u4e00-\u9fff]/.test(message)) {
    return message;
  }

  return fallback;
}
