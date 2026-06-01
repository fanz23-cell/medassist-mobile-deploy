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
  const formData = await request.formData();
  const file = formData.get("file");
  const stepTitle = String(formData.get("stepTitle") || "");
  const place = String(formData.get("place") || "");
  const apiKey = process.env.OPENAI_API_KEY;
  const baseUrl = process.env.OPENAI_BASE_URL || "https://api.openai.com/v1";
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OPENAI_API_KEY. Check .env.local and restart." }, { status: 500 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Please upload an image first." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const imageUrl = `data:${file.type || "image/png"};base64,${buffer.toString("base64")}`;

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
            "You are a senior-friendly hospital assistant. Read the hospital document, prescription, test order, or message screenshot and return a structured result in English. Keep doctorAdvice for care advice and precautions only; nextAction and nextPlace for the next destination only; medication for medicine names, dosage, and timing; questions for any follow-up questions to ask the doctor or pharmacist."
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Current page: ${stepTitle || "Unknown"}\nCurrent location: ${place || "Unknown"}`
            },
            {
              type: "input_image",
              image_url: imageUrl
            }
          ]
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
    const message = String(data.error?.message || data.error || "");
    if (/limit|size|large|payload/i.test(message)) {
      return NextResponse.json(
        { error: "The image is too large. Please upload a smaller image or screenshot." },
        { status: 413 }
      );
    }
    return NextResponse.json(
      { error: data.error?.message || "Image analysis failed. Please try again later." },
      { status: response.status }
    );
  }

  const outputText = data.output_text ?? data.output?.[0]?.content?.[0]?.text ?? "{}";
  return NextResponse.json(normalizeCareInsight(JSON.parse(outputText)));
}
