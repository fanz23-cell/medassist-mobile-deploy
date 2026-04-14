import Link from "next/link";
import { SessionForm } from "@/components/session-form";

export default function NewSessionPage() {
  return (
    <div className="stack">
      <section className="hero">
        <span className="eyebrow">Session setup</span>
        <h1>Create one company-scoped prep session.</h1>
        <p>
          This screen matches the architecture flow: upload resume PDF, paste
          the JD, add interview notes, then generate a per-company question
          bank.
        </p>
      </section>

      <SessionForm />

      <div className="panel stack">
        <div className="split">
          <div>
            <h2>What is mocked right now?</h2>
            <p>
              The submit action calls a local route handler and returns a demo
              session id. The plumbing is ready for real PDF parsing and
              Supabase persistence.
            </p>
          </div>
          <Link href="/session/demo/practice" className="button-secondary">
            Preview practice flow
          </Link>
        </div>
      </div>
    </div>
  );
}
