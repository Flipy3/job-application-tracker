export const JOB_STATUSES = [
  "saved",
  "applied",
  "interview",
  "offer",
  "rejected",
] as const;

export type JobStatus = (typeof JOB_STATUSES)[number];

export type Job = {
  id: string;
  user_id: string;
  company_name: string;
  job_title: string;
  job_url: string | null;
  salary: string | null;
  location: string | null;
  status: JobStatus;
  notes: string | null;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CreateJobInput = {
  company_name: string;
  job_title: string;
  job_url: string;
  salary: string;
  location: string;
  notes: string;
  source: string;
};
