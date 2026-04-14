"use client";

import { useState } from "react";

const initialMessage =
  "Form scaffold is ready. Hook this up to Supabase and Claude next.";

export function SessionForm() {
  const [status, setStatus] = useState(initialMessage);

  async function handleSubmit(formData: FormData) {
    const payload = {
      companyName: String(formData.get("companyName") ?? ""),
      roleTitle: String(formData.get("roleTitle") ?? ""),
      jdText: String(formData.get("jdText") ?? ""),
      interviewNotes: String(formData.get("interviewNotes") ?? ""),
      resumeFileName:
        (formData.get("resume") as File | null)?.name ?? "resume.pdf"
    };

    const response = await fetch("/api/session/setup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = (await response.json()) as {
      message: string;
      nextSessionId?: string;
    };

    setStatus(
      data.nextSessionId
        ? `${data.message} Demo session id: ${data.nextSessionId}`
        : data.message
    );
  }

  return (
    <form className="panel stack" action={handleSubmit}>
      <div className="grid-2">
        <div className="field">
          <label htmlFor="companyName">Target company</label>
          <input
            id="companyName"
            name="companyName"
            placeholder="Acme AI"
            required
          />
        </div>
        <div className="field">
          <label htmlFor="roleTitle">Role title</label>
          <input
            id="roleTitle"
            name="roleTitle"
            placeholder="Product Analyst Intern"
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="resume">Resume PDF</label>
        <input id="resume" name="resume" type="file" accept=".pdf" />
      </div>

      <div className="field">
        <label htmlFor="jdText">Job description</label>
        <textarea
          id="jdText"
          name="jdText"
          placeholder="Paste the JD here..."
          required
        />
      </div>

      <div className="field">
        <label htmlFor="interviewNotes">Interview notes</label>
        <textarea
          id="interviewNotes"
          name="interviewNotes"
          placeholder="Paste interview experiences for this company..."
        />
      </div>

      <div className="actions">
        <button type="submit" className="button">
          Generate Question Bank
        </button>
      </div>

      <div className="note">{status}</div>
    </form>
  );
}
