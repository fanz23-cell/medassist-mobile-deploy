export type CareInsightPayload = {
  title: string;
  doctorAdvice: string[];
  nextAction: string;
  nextPlace: string;
  medication: string[];
  questions: string[];
};

export function normalizeCareInsight(value: Partial<CareInsightPayload>): CareInsightPayload {
  return {
    title: value.title || "Key information identified",
    doctorAdvice: Array.isArray(value.doctorAdvice) ? value.doctorAdvice.filter(Boolean) : [],
    nextAction: value.nextAction || "Please confirm the next step at the nearest service desk",
    nextPlace: value.nextPlace || "Nearby service desk",
    medication: Array.isArray(value.medication) ? value.medication.filter(Boolean) : [],
    questions: Array.isArray(value.questions) ? value.questions.filter(Boolean) : []
  };
}
