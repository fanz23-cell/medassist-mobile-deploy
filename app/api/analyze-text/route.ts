import { normalizeCareInsight } from "@/lib/ai-schema";
import { NextResponse } from "next/server";

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string" },
    doctorAdvice: { type: "array", items: { type: "string" } },
    nextAction: { type: "string" },
    nextPlace: { type: "string" },
    medication: { type: "array", items: { type: "string" } },
    questions: { type: "array", items: { type: "string" } }
  },
  required: ["title", "doctorAdvice", "nextAction", "nextPlace", "medication", "questions"]
};

export async function POST(request: Request) {
  const { text, stepTitle, place } = await request.json();
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY. Check .env.local and restart." }, { status: 500 });
  }

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Please enter text to analyze first." }, { status: 400 });
  }

  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/responses`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content:
            "You are a senior-friendly hospital assistant. Turn the Chinese medical conversation into a structured result in English. Keep doctorAdvice for care advice such as daily habits, diet, nursing, medicine precautions, and follow-up reminders; nextAction and nextPlace for the next destination only; questions for any follow-up questions the patient should ask the doctor or pharmacist."
        },
        {
          role: "user",
          content: `Current page: ${stepTitle || "Unknown"}\nCurrent location: ${place || "Unknown"}\nRecognized text: ${text}`
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "care_insight",
          schema: jsonSchema,
          strict: true
        }
      }
    })
  });

  const data = await response.json();
  if (!response.ok) {
    return NextResponse.json(
      { error: data.error?.message || "Text analysis failed. Please try again later." },
      { status: response.status }
    );
  }

  const outputText = data.output_text ?? data.output?.[0]?.content?.[0]?.text ?? "{}";
  return NextResponse.json(normalizeCareInsight(JSON.parse(outputText)));
}
