import { NextResponse } from "next/server";
import { demoSession } from "@/lib/mock-data";

type SetupPayload = {
  companyName?: string;
  roleTitle?: string;
  jdText?: string;
  interviewNotes?: string;
  resumeFileName?: string;
};

export async function POST(request: Request) {
  const body = (await request.json()) as SetupPayload;

  if (!body.companyName || !body.roleTitle || !body.jdText) {
    return NextResponse.json(
      { message: "companyName, roleTitle, and jdText are required." },
      { status: 400 }
    );
  }

  return NextResponse.json({
    message:
      "Scaffold submission received. Replace this mocked route with PDF parsing, prompt orchestration, and Supabase inserts.",
    nextSessionId: demoSession.id
  });
}
