import type { Priority } from "@/lib/types";

export function formatPriority(priority: Priority) {
  if (priority === "high") return "High";
  if (priority === "medium") return "Medium";
  return "Low";
}
