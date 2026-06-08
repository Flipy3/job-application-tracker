import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type EventProperties = Record<string, unknown>;

export function trackEvent(
  eventName: string,
  properties: EventProperties = {},
) {
  void insertEvent(eventName, properties);
}

async function insertEvent(eventName: string, properties: EventProperties) {
  try {
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.warn("Analytics event user lookup failed:", userError.message);
    }

    const { error: insertError } = await supabase.from("events").insert({
      user_id: user?.id ?? null,
      event_name: eventName,
      properties,
    });

    if (insertError) {
      console.warn("Analytics event insert failed:", insertError.message);
    }
  } catch (error) {
    console.warn(
      "Analytics event tracking failed:",
      error instanceof Error ? error.message : error,
    );
  }
}
