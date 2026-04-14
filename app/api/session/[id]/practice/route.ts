import { NextResponse } from "next/server";
import { demoSession } from "@/lib/mock-data";

type PracticePayload = {
  answer?: string;
};

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = (await request.json()) as PracticePayload;

  if (!body.answer) {
    return NextResponse.json(
      { message: "answer is required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    sessionId: id,
    question: demoSession.questionBank[0].question,
    scores: {
      structure: 7,
      relevance: 8,
      specificity: 6
    },
    feedback:
      "Mock response: add clearer STAR framing and quantify impact earlier.",
    followUp:
      "Mock follow-up: what tradeoff or risk did you consider before acting?"
  });
}
