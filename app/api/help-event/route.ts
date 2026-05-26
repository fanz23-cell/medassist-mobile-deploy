import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { buildHelpEventMockResponse, isHelpEventPayload } from "@/lib/help-event";

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
    return NextResponse.json(buildHelpEventMockResponse(body));
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
