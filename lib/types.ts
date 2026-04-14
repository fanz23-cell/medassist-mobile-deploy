export type Priority = "high" | "medium" | "low";

export type QuestionCategory =
  | "behavioral"
  | "situational"
  | "resume deep-dive"
  | "follow-up";

export type QuestionBankItem = {
  question: string;
  priority: Priority;
  category: QuestionCategory;
  source: "jd" | "notes" | "profile";
};

export type PracticeScore = {
  structure: number;
  relevance: number;
  specificity: number;
};

export type PracticeRound = {
  question: string;
  userAnswer: string;
  feedback: string;
  followUp: string;
  scores: PracticeScore;
};

export type AnswerCard = {
  question: string;
  shortVersion: string;
  fullVersion: string;
};

export type SessionRecord = {
  id: string;
  companyName: string;
  roleTitle: string;
  jdText: string;
  interviewNotes: string;
  questionBank: QuestionBankItem[];
  practiceRounds: PracticeRound[];
  answerCards: AnswerCard[];
};
