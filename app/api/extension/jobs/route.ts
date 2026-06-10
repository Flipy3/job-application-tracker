import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Job } from "@/types/job";

type ExtensionJobRequest = {
  email?: string;
  password?: string;
  title?: string;
  company?: string;
  salary?: string;
  location?: string;
  source?: string;
  url?: string;
  notes?: string;
};

type ExtensionJobResponse =
  | {
      job: Job;
      message: string;
    }
  | {
      error: string;
    };

const selectedJobFields =
  "id,user_id,company_name,job_title,job_url,salary,location,status,notes,source,created_at,updated_at";
const productionWebOrigin = "https://www.jobtrackerzephyr.xyz";

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request.headers.get("origin")),
  });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse(
        { error: "Missing Supabase environment variables." },
        500,
        origin,
      );
    }

    const body = (await request.json()) as ExtensionJobRequest;
    const email = toTrimmedString(body.email);
    const password = toTrimmedString(body.password);
    const title = toTrimmedString(body.title);
    const company = toTrimmedString(body.company);
    const jobUrl = toNullableString(body.url);

    if (!email || !password) {
      return jsonResponse(
        { error: "Email and password are required." },
        400,
        origin,
      );
    }

    if (!title || !company) {
      return jsonResponse(
        { error: "Job title and company are required." },
        400,
        origin,
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !user) {
      return jsonResponse(
        { error: authError?.message ?? "Unable to authenticate user." },
        401,
        origin,
      );
    }

    if (jobUrl) {
      const { data: existingJobs, error: duplicateCheckError } = await supabase
        .from("jobs")
        .select("id")
        .eq("user_id", user.id)
        .eq("job_url", jobUrl)
        .limit(1);

      if (duplicateCheckError) {
        return jsonResponse({ error: duplicateCheckError.message }, 500, origin);
      }

      if (existingJobs && existingJobs.length > 0) {
        return jsonResponse({ error: "该岗位链接已保存" }, 409, origin);
      }
    }

    const { data, error: insertError } = await supabase
      .from("jobs")
      .insert({
        user_id: user.id,
        company_name: company,
        job_title: title,
        job_url: jobUrl,
        salary: toNullableString(body.salary),
        location: toNullableString(body.location),
        notes: toNullableString(body.notes),
        source: toNullableString(body.source),
        status: "saved",
      })
      .select(selectedJobFields)
      .single();

    if (insertError) {
      return jsonResponse({ error: insertError.message }, 500, origin);
    }

    return jsonResponse(
      {
        job: data as Job,
        message: "Job saved successfully.",
      },
      201,
      origin,
    );
  } catch (error) {
    return jsonResponse(
      {
        error:
          error instanceof Error ? error.message : "Unable to save job.",
      },
      500,
      origin,
    );
  }
}

function toTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function toNullableString(value: unknown) {
  const trimmedValue = toTrimmedString(value);

  return trimmedValue || null;
}

function jsonResponse(
  body: ExtensionJobResponse,
  status: number,
  origin: string | null,
) {
  return NextResponse.json(body, {
    status,
    headers: getCorsHeaders(origin),
  });
}

function getCorsHeaders(origin: string | null) {
  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS, POST",
    "Access-Control-Allow-Origin": origin?.startsWith("chrome-extension://")
      ? origin
      : productionWebOrigin,
  };
}
