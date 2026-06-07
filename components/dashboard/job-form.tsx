"use client";

import { FormEvent, useState } from "react";
import type { CreateJobInput } from "@/types/job";

const initialFormState: CreateJobInput = {
  company_name: "",
  job_title: "",
  job_url: "",
  salary: "",
  location: "",
  notes: "",
  source: "",
};

type JobFormProps = {
  isSubmitting: boolean;
  onCreate: (input: CreateJobInput) => Promise<boolean>;
};

export function JobForm({ isSubmitting, onCreate }: JobFormProps) {
  const [formState, setFormState] = useState<CreateJobInput>(initialFormState);

  function updateField(field: keyof CreateJobInput, value: string) {
    setFormState((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wasCreated = await onCreate(formState);

    if (wasCreated) {
      setFormState(initialFormState);
    }
  }

  return (
    <form
      className="space-y-5 rounded-lg border border-zinc-200 bg-white p-6"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal">Add job</h2>
        <p className="mt-1 text-sm text-zinc-600">
          Create a manual job record for the current account.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Job title</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="job_title"
            onChange={(event) => updateField("job_title", event.target.value)}
            required
            value={formState.job_title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Company</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="company_name"
            onChange={(event) =>
              updateField("company_name", event.target.value)
            }
            required
            value={formState.company_name}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Location</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="location"
            onChange={(event) => updateField("location", event.target.value)}
            value={formState.location}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Salary</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="salary"
            onChange={(event) => updateField("salary", event.target.value)}
            value={formState.salary}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Source</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="source"
            onChange={(event) => updateField("source", event.target.value)}
            placeholder="Boss直聘, LinkedIn, Seek, 公司官网"
            value={formState.source}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium">Job URL</span>
          <input
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
            name="job_url"
            onChange={(event) => updateField("job_url", event.target.value)}
            type="url"
            value={formState.job_url}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Notes</span>
        <textarea
          className="min-h-24 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none focus:border-zinc-900"
          name="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          value={formState.notes}
        />
      </label>

      <button
        className="rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "Saving..." : "Save job"}
      </button>
    </form>
  );
}
