"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { JobForm } from "@/components/dashboard/job-form";
import { JobsList } from "@/components/dashboard/jobs-list";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { CreateJobInput, Job, JobStatus } from "@/types/job";

export function JobDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [updatingJobId, setUpdatingJobId] = useState<string | null>(null);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
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

        const { data, error: jobsError } = await supabase
          .from("jobs")
          .select(
            "id,user_id,company_name,job_title,job_url,salary,location,status,notes,source,created_at,updated_at",
          )
          .order("created_at", { ascending: false });

        if (jobsError) {
          throw jobsError;
        }

        if (isMounted) {
          setUser(currentUser);
          setJobs((data ?? []) as Job[]);
        }
      } catch (dashboardError) {
        if (isMounted) {
          setError(
            dashboardError instanceof Error
              ? dashboardError.message
              : "Unable to load dashboard.",
          );
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handleCreateJob(input: CreateJobInput) {
    if (!user) {
      router.replace("/login");
      return false;
    }

    setIsCreating(true);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: createError } = await supabase
        .from("jobs")
        .insert({
          user_id: user.id,
          company_name: input.company_name.trim(),
          job_title: input.job_title.trim(),
          job_url: toNullable(input.job_url),
          salary: toNullable(input.salary),
          location: toNullable(input.location),
          notes: toNullable(input.notes),
          source: toNullable(input.source),
          status: "saved",
        })
        .select(
          "id,user_id,company_name,job_title,job_url,salary,location,status,notes,source,created_at,updated_at",
        )
        .single();

      if (createError) {
        throw createError;
      }

      setJobs((currentJobs) => [data as Job, ...currentJobs]);
      setMessage("Job saved.");
      return true;
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Unable to save job.",
      );
      return false;
    } finally {
      setIsCreating(false);
    }
  }

  async function handleUpdateStatus(job: Job, status: JobStatus) {
    if (!user) {
      router.replace("/login");
      return;
    }

    if (job.status === status) {
      return;
    }

    setUpdatingJobId(job.id);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: updateError } = await supabase
        .from("jobs")
        .update({ status })
        .eq("id", job.id)
        .eq("user_id", user.id)
        .select(
          "id,user_id,company_name,job_title,job_url,salary,location,status,notes,source,created_at,updated_at",
        )
        .single();

      if (updateError) {
        throw updateError;
      }

      setJobs((currentJobs) =>
        currentJobs.map((currentJob) =>
          currentJob.id === job.id ? (data as Job) : currentJob,
        ),
      );
      setMessage("Job status updated.");
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Unable to update job status.",
      );
    } finally {
      setUpdatingJobId(null);
    }
  }

  async function handleDeleteJob(job: Job) {
    if (!user) {
      router.replace("/login");
      return;
    }

    const shouldDelete = window.confirm(
      `Delete ${job.job_title} at ${job.company_name}?`,
    );

    if (!shouldDelete) {
      return;
    }

    setDeletingJobId(job.id);
    setError("");
    setMessage("");

    try {
      const supabase = createSupabaseBrowserClient();
      const { error: deleteError } = await supabase
        .from("jobs")
        .delete()
        .eq("id", job.id)
        .eq("user_id", user.id);

      if (deleteError) {
        throw deleteError;
      }

      setJobs((currentJobs) =>
        currentJobs.filter((currentJob) => currentJob.id !== job.id),
      );
      setMessage("Job deleted.");
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete job.",
      );
    } finally {
      setDeletingJobId(null);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium text-zinc-500">Milestone 2B</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-normal">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Create, read, update, and delete job records saved to Supabase.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {user?.email ? (
              <span className="text-zinc-600">{user.email}</span>
            ) : null}
            <Link className="font-medium underline" href="/logout">
              Log out
            </Link>
          </div>
        </header>

        {error ? (
          <p className="rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900">
            {error}
          </p>
        ) : null}

        {message ? (
          <p className="rounded-md border border-zinc-300 bg-white p-3 text-sm text-zinc-900">
            {message}
          </p>
        ) : null}

        {isLoading ? (
          <section className="rounded-lg border border-zinc-200 bg-white p-8 text-sm text-zinc-600">
            Loading dashboard...
          </section>
        ) : (
          <>
            <JobForm isSubmitting={isCreating} onCreate={handleCreateJob} />
            <JobsList
              deletingJobId={deletingJobId}
              jobs={jobs}
              onDelete={handleDeleteJob}
              onStatusChange={handleUpdateStatus}
              updatingJobId={updatingJobId}
            />
          </>
        )}
      </div>
    </main>
  );
}

function toNullable(value: string) {
  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : null;
}
