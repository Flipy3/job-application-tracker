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
      className="space-y-5 rounded-lg border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      onSubmit={handleSubmit}
    >
      <div>
        <h2 className="text-lg font-semibold tracking-normal">新增岗位</h2>
        <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">
          为当前账户手动创建一条岗位记录。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">岗位名称</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="job_title"
            onChange={(event) => updateField("job_title", event.target.value)}
            required
            value={formState.job_title}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">公司名称</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="company_name"
            onChange={(event) =>
              updateField("company_name", event.target.value)
            }
            required
            value={formState.company_name}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">工作地点</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="location"
            onChange={(event) => updateField("location", event.target.value)}
            value={formState.location}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">薪资</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="salary"
            onChange={(event) => updateField("salary", event.target.value)}
            value={formState.salary}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">来源</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="source"
            onChange={(event) => updateField("source", event.target.value)}
            placeholder="Boss直聘、LinkedIn、Seek、公司官网"
            value={formState.source}
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">岗位链接</span>
          <input
            className="w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
            name="job_url"
            onChange={(event) => updateField("job_url", event.target.value)}
            type="url"
            value={formState.job_url}
          />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">备注</span>
        <textarea
          className="min-h-24 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950 outline-none placeholder:text-zinc-500 focus:border-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:placeholder:text-zinc-500 dark:focus:border-zinc-300"
          name="notes"
          onChange={(event) => updateField("notes", event.target.value)}
          value={formState.notes}
        />
      </label>

      <button
        className="rounded-md bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:bg-zinc-400 dark:bg-zinc-100 dark:text-zinc-950 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-300"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? "保存中..." : "保存岗位"}
      </button>
    </form>
  );
}
