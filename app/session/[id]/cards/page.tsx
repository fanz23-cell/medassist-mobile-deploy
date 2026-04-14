import { demoSession } from "@/lib/mock-data";

export default async function CardsPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="stack">
      <section className="hero">
        <span className="eyebrow">Answer cards</span>
        <h1>Review polished answers for session {id}.</h1>
        <p>
          This view displays the short and full versions the answer-refiner
          agent will eventually save per session.
        </p>
      </section>

      <section className="section">
        {demoSession.answerCards.map((card) => (
          <article key={card.question} className="panel stack">
            <div className="split">
              <h2>{card.question}</h2>
              <span className="pill">Voice-preserving polish</span>
            </div>
            <div className="grid-2">
              <div className="card stack">
                <h3>Short version</h3>
                <p>{card.shortVersion}</p>
              </div>
              <div className="card stack">
                <h3>Full version</h3>
                <p>{card.fullVersion}</p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
