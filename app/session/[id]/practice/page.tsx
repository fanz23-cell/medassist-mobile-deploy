import Link from "next/link";
import { QuestionBank } from "@/components/question-bank";
import { ScoreSummary } from "@/components/score-summary";
import { demoSession } from "@/lib/mock-data";

export default async function PracticePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const latestRound = demoSession.practiceRounds[0];

  return (
    <div className="stack">
      <section className="hero">
        <span className="eyebrow">Practice mode</span>
        <div className="split">
          <div className="stack">
            <h1>{demoSession.companyName} mock interview</h1>
            <p>
              Session <span className="mono">{id}</span> is currently wired to
              demo data. Replace the mocked loader with a database fetch once
              Supabase is connected.
            </p>
          </div>
          <div className="row">
            <span className="pill">AI asks first</span>
            <span className="pill">One question at a time</span>
          </div>
        </div>
      </section>

      <section className="grid-2">
        <div className="panel stack">
          <h2>Current question</h2>
          <p>{demoSession.questionBank[0].question}</p>

          <div className="field">
            <label htmlFor="practice-answer">Your answer</label>
            <textarea
              id="practice-answer"
              placeholder="Type your answer here. In the next milestone this will post to /api/session/[id]/practice."
            />
          </div>

          <div className="actions">
            <button className="button" type="button">
              Submit Answer
            </button>
            <button className="button-secondary" type="button">
              Ask for Follow-up
            </button>
          </div>
        </div>

        <div className="panel stack">
          <h2>Latest scored attempt</h2>
          <p className="muted">
            <strong>Question:</strong> {latestRound.question}
          </p>
          <p className="muted">
            <strong>Your answer:</strong> {latestRound.userAnswer}
          </p>
          <ScoreSummary scores={latestRound.scores} />
          <div className="note">
            <strong>Feedback:</strong> {latestRound.feedback}
            <br />
            <strong>Follow-up:</strong> {latestRound.followUp}
          </div>
          <Link href="/session/demo/cards" className="button-secondary">
            Open answer cards
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Question bank</h2>
        <QuestionBank items={demoSession.questionBank} />
      </section>
    </div>
  );
}
