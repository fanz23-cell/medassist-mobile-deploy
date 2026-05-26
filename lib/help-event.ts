import type { HelpEventPayload, HelpEventType } from "@/lib/types";

export const eventTypes: HelpEventType[] = [
  "step_completed",
  "rest_requested",
  "staff_help",
  "family_update"
];

export function isHelpEventPayload(value: unknown): value is HelpEventPayload {
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

export function buildHelpEventMockResponse(payload: HelpEventPayload) {
  return {
    mode: "mock" as const,
    saved: true as const,
    event: payload
  };
}
