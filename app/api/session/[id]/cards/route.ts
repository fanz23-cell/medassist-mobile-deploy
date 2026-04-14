import { NextResponse } from "next/server";
import { demoSession } from "@/lib/mock-data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  return NextResponse.json({
    sessionId: id,
    cards: demoSession.answerCards
  });
}
