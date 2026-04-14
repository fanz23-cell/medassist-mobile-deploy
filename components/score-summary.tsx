import type { PracticeScore } from "@/lib/types";

export function ScoreSummary({ scores }: { scores: PracticeScore }) {
  return (
    <ul className="score-list">
      <li>Structure (STAR): {scores.structure}/10</li>
      <li>Relevance (JD alignment): {scores.relevance}/10</li>
      <li>Specificity (concrete details): {scores.specificity}/10</li>
    </ul>
  );
}
