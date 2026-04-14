import type { QuestionBankItem } from "@/lib/types";
import { formatPriority } from "@/lib/utils";

export function QuestionBank({ items }: { items: QuestionBankItem[] }) {
  return (
    <ul className="question-list">
      {items.map((item) => (
        <li key={`${item.question}-${item.priority}`}>
          <div className="split">
            <strong>{item.question}</strong>
            <span className={`pill ${item.priority}`}>
              {formatPriority(item.priority)}
            </span>
          </div>
          <p className="muted">
            {item.category} · source: {item.source}
          </p>
        </li>
      ))}
    </ul>
  );
}
