import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { HelpEventPayload, HelpEventType } from "@/lib/types";

const eventTypes: HelpEventType[] = [
  "step_completed",
  "rest_requested",
  "staff_help",
  "family_update"
];

function isHelpEventPayload(value: unknown): value is HelpEventPayload {
  if (!value || typeof value !== "object") return false;

  const payload = value as Partial<HelpEventPayload>;
  return (
    typeof payload.visitId === "string" &&
    payload.visitId.length > 0 &&
    typeof payload.stepId === "string" &&
    payload.stepId.length > 0 &&
    typeof payload.eventType === "string" &&
    eventTypes.includes(payload.eventType as HelpEventType)
  );
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as unknown;

  if (!isHelpEventPayload(body)) {
    return NextResponse.json(
      { error: "visitId, stepId, and a valid eventType are required." },
      { status: 400 }
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({
      mode: "mock",
      saved: true,
      event: body
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data, error } = await supabase
    .from("help_events")
    .insert({
      visit_id: body.visitId,
      step_id: body.stepId,
      event_type: body.eventType,
      note: body.note ?? ""
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mode: "database", saved: true, event: data });
}
