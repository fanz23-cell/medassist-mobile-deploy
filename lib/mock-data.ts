import type { SessionRecord } from "@/lib/types";

export const demoSession: SessionRecord = {
  id: "demo",
  companyName: "Acme AI",
  roleTitle: "Product Analyst Intern",
  jdText:
    "Looking for a candidate who can turn ambiguous product signals into structured recommendations, communicate cross-functionally, and ship iterative experiments.",
  interviewNotes:
    "Interviewers often ask about conflict resolution, metrics ownership, and how candidates turned user feedback into product changes.",
  questionBank: [
    {
      question: "Walk me through a project on your resume where you had ambiguous requirements.",
      priority: "high",
      category: "resume deep-dive",
      source: "profile"
    },
    {
      question: "Tell me about a time you used metrics to change a product decision.",
      priority: "high",
      category: "behavioral",
      source: "jd"
    },
    {
      question: "If your cross-functional partner strongly disagreed with your recommendation, what would you do?",
      priority: "medium",
      category: "situational",
      source: "notes"
    }
  ],
  practiceRounds: [
    {
      question:
        "Tell me about a time you used metrics to change a product decision.",
      userAnswer:
        "I analyzed funnel drop-off in our campus event app, found a major drop at onboarding, and proposed removing a mandatory profile step.",
      feedback:
        "Strong setup and impact, but the STAR framing could be clearer. Add stakeholder alignment details and quantify the result earlier.",
      followUp:
        "What tradeoff did you consider before removing that onboarding step?",
      scores: {
        structure: 7,
        relevance: 8,
        specificity: 6
      }
    }
  ],
  answerCards: [
    {
      question:
        "Tell me about a time you used metrics to change a product decision.",
      shortVersion:
        "I noticed onboarding drop-off in our campus event app and traced it to an unnecessary profile requirement. I proposed simplifying the first-run flow, aligned with design and engineering, and the completion rate improved after launch.",
      fullVersion:
        "During a student product project, I owned onboarding analysis for our campus event app. I saw a sharp funnel drop between account creation and first event signup, then used session recordings and event logs to isolate a required profile-completion step as the bottleneck. I brought the data to the team, suggested moving profile completion later in the journey, and worked with design and engineering to validate the risk. After shipping the lighter flow, onboarding completion improved and more users reached their first RSVP within the same week."
    }
  ]
};
