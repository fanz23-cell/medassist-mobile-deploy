import Link from "next/link";
import { QuestionBank } from "@/components/question-bank";
import { demoSession } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div className="stack">
      <section className="hero">
        <span className="eyebrow">Check-in 1 scaffold</span>
        <div className="hero-grid">
          <div className="stack">
            <h1>Practice resume deep-dive interviews with structure.</h1>
            <p>
              This scaffold turns the architecture doc into a real Next.js app
              shell with setup, practice, and answer-card views ready for
              Supabase and AI integration.
            </p>
            <div className="actions">
              <Link href="/session/new" className="button">
                Start a Session
              </Link>
              <Link href="/session/demo/practice" className="button-secondary">
                View Demo Practice
              </Link>
            </div>
          </div>
          <div className="panel stack">
            <div>
              <strong>Current milestone coverage</strong>
              <p className="muted">
                Routes, UI scaffold, mock API handlers, shared types, and DB
                schema are included so the repo is no longer docs-only.
              </p>
            </div>
            <div className="row">
              <span className="pill">Next.js App Router</span>
              <span className="pill">Supabase-ready</span>
              <span className="pill">Mock AI flows</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section grid-3">
        <article className="card stack">
          <h3>1. Setup</h3>
          <p>
            Upload resume, paste JD, and add interview notes for one target
            company session.
          </p>
        </article>
        <article className="card stack">
          <h3>2. Practice</h3>
          <p>
            Present one question at a time, score the answer, then ask a
            follow-up probe without revealing a model answer.
          </p>
        </article>
        <article className="card stack">
          <h3>3. Cards</h3>
          <p>
            Save short and full polished answers per session for memorization
            and review.
          </p>
        </article>
      </section>

      <section className="section">
        <div className="split">
          <div>
            <h2>Demo Question Bank</h2>
            <p>Seed data mirrors the acceptance criteria in the spec.</p>
          </div>
          <Link href="/session/demo/cards" className="button-secondary">
            Open Answer Cards
          </Link>
        </div>
        <QuestionBank items={demoSession.questionBank} />
      </section>
    </div>
  );
}
