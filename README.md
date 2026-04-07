# ResumeProbe
> Interview prep tool for resume deep-dive questions

---

## Project Roles

| Role | Name |
|------|------|
| Proposer (Client) | Youqian Cui |
| Developer | Fan Zhang |

---

## Problem

When interviewers dig into a candidate's resume — "walk me through this project," "what was your specific role," "what would you do differently" — most candidates stumble, even when they lived through the experience, because they've never been forced to articulate it in a structured way beforehand. On top of that, real interview experiences shared online are scattered and unstructured — candidates read them once and forget them, with no way to turn them into targeted practice. The result: qualified people lose offers not because of what they did or what they knew, but because they couldn't explain themselves clearly under company-specific pressure.

---

## What It Does

A prep workflow where users upload their resume, JD, and real interview experiences per target company — each company gets its own question bank, and AI extends it by generating follow-up questions grounded in all three inputs, then runs a multi-round mock interview that probes the user's actual experiences without giving away answers, and polishes the final answers into memorizable cards.

---

## Development Contract

- **Development Fee:** 25 GIX Bucks
- **Stack:** Next.js + Supabase (see `ARCHITECTURE.md`)
- **Contract terms:** Defined in `SPEC.md`

---

## Key Documents

| Document | Description |
|----------|-------------|
| [`SPEC.md`](./SPEC.md) | User stories and acceptance criteria |
| [`ARCHITECTURE.md`](./ARCHITECTURE.md) | Data model, tech stack, agentic engineering plan |

---

## Timeline

| Date | Milestone | Required Progress |
|------|-----------|-------------------|
| Apr 20 | Check-in 1 | `ARCHITECTURE.md` merged; project scaffolding set up; Supabase schema initialized |
| May 4 | Check-in 2 | Resume/JD upload working; per-company question bank generating correctly |
| May 18 | Check-in 3 | Mock interview flow complete with scoring; answer cards saving correctly |
| Jun 1 | Final Delivery | All user stories passing acceptance criteria; app deployable and demoed |

---

## Development Progress

| PR | Feature | Status |
|----|---------|--------|
| #1 | `ARCHITECTURE.md` | 🔄 In Review |

---

## Proposer Commitments

- Review all PRs within 48 hours
- Provide specific, actionable feedback on every submission
- Respond to developer questions within 48 hours
- Conduct acceptance testing at each gate before merging
