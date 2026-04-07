# ARCHITECTURE.md — ResumeProbe

> Interview prep tool for resume deep-dive questions

---

## 1. Tech Stack

| Layer | Choice | Justification |
|---|---|---|
| Frontend | Next.js (App Router) | File upload, multi-step UI, and streaming AI responses all work well out of the box; easy to deploy on Vercel |
| Backend / API | Next.js Route Handlers | Keeps the project single-repo; sufficient for this scope |
| Database | Supabase (PostgreSQL) | Managed Postgres with built-in auth, storage (for uploaded files), and row-level security |
| AI | Claude API (claude-sonnet-4-20250514) | Powers all four AI features; supports multi-turn conversation needed for mock interview rounds |
| File Parsing | pdf-parse (Node.js) | Extract text from uploaded resume PDFs |
| Deployment | Vercel | Zero-config Next.js deployment; free tier sufficient for a prototype |

---

## 2. Data Model

### `users`
Managed by Supabase Auth. No custom columns needed beyond `id` and `email`.

---

### `profiles`
Stores the user's parsed resume content and extracted story materials.

```
id              uuid  PK
user_id         uuid  FK → users
resume_text     text        -- raw extracted text from uploaded PDF
story_bank      jsonb       -- AI-extracted story materials, tagged by type
                            -- e.g. [{ title, summary, tags: ["leadership", "impact"] }]
created_at      timestamp
updated_at      timestamp
```

---

### `sessions`
One session = one target company/role. Contains everything specific to that job application.

```
id                  uuid  PK
user_id             uuid  FK → users
company_name        text
jd_text             text        -- pasted or uploaded JD content
interview_notes     text        -- user-uploaded real interview experiences for this company
question_bank       jsonb       -- AI-generated question list with priority flags
                                -- e.g. [{ question, priority: "high|medium|low", source: "jd|notes|profile" }]
practice_rounds     jsonb       -- array of Q&A turns with scores
                                -- e.g. [{ question, user_answer, scores: {structure, relevance, specificity}, feedback }]
answer_cards        jsonb       -- polished final answers
                                -- e.g. [{ question, short_version, full_version }]
created_at          timestamp
updated_at          timestamp
```

> **Why only 2 tables?** All structured AI outputs (story bank, question bank, practice rounds, answer cards) are stored as `jsonb` within their parent record. This avoids over-engineering the schema while keeping all session data queryable and easy to iterate on.

---

## 3. Application Views

### View 1 — Setup (`/session/new`)
- Upload resume PDF + paste JD + paste interview notes (optional)
- On submit: parse PDF → extract story bank → analyze JD → generate per-company question bank
- User sees a prioritized question list (🔴 high / 🟡 medium / 🟢 low)

### View 2 — Practice (`/session/[id]/practice`)
- AI presents one question at a time (drawn from question bank)
- User types or speaks their answer
- AI scores response across three dimensions: **structure** (STAR), **relevance** (JD alignment), **specificity** (concrete details)
- AI follows up with probing questions based on the answer — does not reveal a model answer
- User can re-attempt; AI compares versions

### View 3 — Answer Cards (`/session/[id]/cards`)
- Displays all practiced answers as cards (short + full version)
- User can trigger "refine" to polish any answer while preserving their voice
- Cards are reviewable across sessions by company

---

## 4. Agentic Engineering Plan

ResumeProbe uses Claude in three distinct agentic roles, each called via the API with a scoped system prompt:

### Agent 1 — Profile Extractor
**Trigger:** User uploads resume + submits setup form  
**Input:** Raw resume text + JD text + interview notes  
**Task:**
1. Extract story materials from resume, tag each by type (`leadership`, `problem-solving`, `impact`, `technical`, etc.)
2. Analyze JD for hard requirements, soft signals, and interviewer risk concerns
3. Cross-reference profile against JD to identify gaps
4. Generate prioritized question bank combining: JD-driven questions + variations on uploaded interview notes + resume deep-dive probes

**Output:** Structured JSON → saved to `sessions.question_bank` and `profiles.story_bank`

---

### Agent 2 — Mock Interviewer
**Trigger:** User enters practice mode  
**Behavior:** Multi-turn conversation loop

```
System prompt instructs Claude to:
- Act as a senior interviewer at the target company
- Ask one question at a time from the question bank
- After user answers: score on structure / relevance / specificity (return as JSON)
- Generate one follow-up probe based on the answer
- Never provide a model answer unprompted
- After 2 rounds on same question: offer to move on
```

**State management:** Full conversation history passed in `messages[]` each turn  
**Output:** Each round saved to `sessions.practice_rounds`

---

### Agent 3 — Answer Refiner
**Trigger:** User requests polish on a practiced answer  
**Input:** User's best answer attempt + original question + JD context  
**Task:**
- Annotate weaknesses inline (vague phrasing, missing data, buried lede)
- Return a refined version that preserves the user's voice and sentence rhythm
- Generate short card version (3–4 sentences) and full version

**Output:** Saved to `sessions.answer_cards`

---

## 5. Key Engineering Constraints

- **AI never answers first** — the mock interviewer agent must be prompted to withhold model answers; this is enforced in the system prompt and validated before saving any round
- **Streaming responses** — use `ReadableStream` for mock interview turns so responses feel real-time
- **Per-company isolation** — each `session` is scoped to one company; question banks do not bleed across sessions
- **No fine-tuning needed** — all customization is done through prompt engineering and injecting user context (resume, JD, notes) into each API call
