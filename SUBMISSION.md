# Developer-02 Submission Kit

This file is a ready-to-use handoff for the `Developer-02` assignment.

## What This Submission Covers

This repo now satisfies the most reasonable interpretation of this week's deliverable based on the project timeline in `README.md`:

- `ARCHITECTURE.md` already exists
- project scaffolding is now set up
- routes exist for setup, practice, and answer cards
- mock API handlers exist so the app is no longer documentation-only
- Supabase schema exists to match the architecture doc

## Files Added For This Check-In

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `.env.example`
- `app/*`
- `components/*`
- `lib/*`
- `supabase/schema.sql`
- updated `README.md`
- updated `.gitignore`

## Step 1: Create the GitHub Issue

Suggested issue title:

`Set up Check-in 1 project scaffold`

Suggested issue body:

```md
## User Story

As a job seeker, I want the ResumeProbe app scaffolded with the core routes and project structure, so that the remaining milestones can be built and tested on a working codebase.

## Acceptance Criteria

- [ ] Next.js project structure exists in the repository
- [ ] A setup page exists for creating a company-scoped session
- [ ] Practice and answer-card routes exist for future milestones
- [ ] Mock API handlers exist for setup, practice, and cards
- [ ] Supabase schema is included for the initial data model
- [ ] README explains how to install and run the scaffold locally

## Priority

- [x] Must-have
- [ ] Nice-to-have

## Notes

This issue covers the Check-in 1 requirement from the project timeline: architecture plus project scaffolding set up.
```

## Step 2: Create the Branch and Commit

Run these commands in PowerShell from the repo root:

```powershell
git checkout -b feature/checkin-1-scaffold
git add .
git commit -m "Add Check-in 1 project scaffold"
git push -u origin feature/checkin-1-scaffold
```

If you install Node before pushing, also run:

```powershell
npm install
npm run dev
```

Then take screenshots of:

- `/`
- `/session/new`
- `/session/demo/practice`
- `/session/demo/cards`

## Step 3: Open the PR

Suggested PR title:

`Add Check-in 1 project scaffold`

Suggested PR body:

```md
## Closes

Closes #[PUT_ISSUE_NUMBER_HERE]

## What Changed

This PR sets up the initial ResumeProbe application scaffold for Check-in 1. It adds a Next.js App Router structure, scaffolded setup/practice/cards pages, mock API route handlers, shared types/demo data, and a Supabase schema aligned with the architecture document.

## How to Test

1. Pull this branch
2. Run `npm install`
3. Run `npm run dev`
4. Open `http://localhost:3000/`
5. Verify the landing page renders and links to the three core flows
6. Open `http://localhost:3000/session/new`
7. Verify the setup form renders for company name, role title, resume upload, JD, and interview notes
8. Open `http://localhost:3000/session/demo/practice`
9. Verify the practice page renders a question, score summary, and follow-up placeholder UI
10. Open `http://localhost:3000/session/demo/cards`
11. Verify answer cards render short and full polished versions

## Screenshot

Attach screenshots of `/`, `/session/new`, `/session/demo/practice`, and `/session/demo/cards`.

## AI Tools Used

| Tool | What it did | What you changed |
|------|-------------|------------------|
| Codex | Generated the initial scaffold structure, routes, mock handlers, and schema draft | Reviewed the output, aligned it with the project architecture, and prepared it for submission |

## Self-Review Checklist

- [x] No secrets (API keys, passwords) in this PR
- [x] Error handling present for new mocked API routes
- [x] Input validation on required setup fields
- [x] Loading and error states are minimal because this is scaffold work, with clear placeholders for next milestone
- [ ] Tests pass locally (`npm test` or `pytest`)
- [ ] PR is focused and <400 lines (if larger, consider splitting)
- [x] Commit messages are descriptive

## Notes

I could not run local verification in the coding environment used to prepare this PR because Node.js/npm were not installed there. Please run the test steps above after installing Node locally.
```

## Step 4: Submit on Canvas

Suggested Canvas submission text:

```md
Completed the Check-in 1 scaffold for ResumeProbe.

Issue: #[PUT_ISSUE_NUMBER_HERE]
PR: [PASTE_PR_LINK_HERE]

What I completed:
- Set up the Next.js App Router project scaffold
- Added the setup page for company-scoped session creation
- Added practice and answer-card routes for later milestones
- Added mock API routes for setup, practice, and cards
- Added shared demo data/types and a Supabase schema draft
- Updated the README with local setup and testing instructions

How to review:
1. Pull the PR branch
2. Run `npm install`
3. Run `npm run dev`
4. Visit `/`, `/session/new`, `/session/demo/practice`, and `/session/demo/cards`

Note:
This submission is a scaffold for Check-in 1 and is intended to support the next milestone implementations.
```

## Important Caveat

The code was prepared in an environment that did not have `node` or `npm` installed, so local runtime verification could not be completed there. Before submitting, install Node.js and confirm the app starts with `npm run dev`.
