export type HelpEventType = "step_completed" | "rest_requested" | "staff_help" | "family_update";

export type HelpEventPayload = {
  visitId: string;
  stepId: string;
  eventType: HelpEventType;
  note?: string;
};
