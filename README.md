# ResumeProbe

Interview prep tool for resume deep-dive questions.

## Project Roles

| Role | Name |
|------|------|
| Client | Youqian Cui |
| Developer | Fan Zhang |

## Problem

Candidates often struggle to explain their own experience clearly under interview pressure, especially when interviewers ask resume deep-dive questions or company-specific follow-ups. ResumeProbe turns resume content, job descriptions, and real interview notes into a structured prep workflow.

## Current Status

This repository now includes the Check-in 1 scaffold:

- Next.js App Router project structure
- Setup page at `/session/new`
- Practice page at `/session/[id]/practice`
- Answer cards page at `/session/[id]/cards`
- Mock API routes for setup, practice, and cards
- Shared types and demo data
- Supabase schema at `supabase/schema.sql`

## Tech Stack

- Next.js
- React
- TypeScript
- Supabase

## Getting Started

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Fill in your Supabase and Anthropic keys in `.env.local`.
5. Run the dev server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Milestones

| Date | Milestone | Required Progress |
|------|-----------|-------------------|
| Apr 20 | Check-in 1 | `ARCHITECTURE.md` and project scaffolding set up |
| May 4 | Check-in 2 | Resume/JD upload working and per-company question bank generating correctly |
| May 18 | Check-in 3 | Mock interview flow complete with scoring and answer cards saving correctly |
| Jun 1 | Final Delivery | All user stories passing acceptance criteria and app deployable |

## Suggested Next PRs

1. Wire `/api/session/setup` to real PDF parsing and Supabase inserts.
2. Persist question banks and session retrieval by `id`.
3. Connect the practice route to the Claude mock interviewer prompt.
4. Add answer-card persistence and refine action.

## Submission Notes

For this scaffold PR, use the repository PR template and reference the GitHub issue this work closes. In the PR testing steps, include:

1. `npm install`
2. `npm run dev`
3. Open `/`
4. Open `/session/new`
5. Open `/session/demo/practice`
6. Open `/session/demo/cards`
