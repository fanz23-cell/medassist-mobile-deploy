# SPEC.md — ResumeProbe

> Interview prep tool for resume deep-dive questions

---

## Project Info

| | |
|---|---|
| Proposer | [Your Name] |
| Developer | Fan Zhang |
| Development Fee | 25 GIX Bucks |
| Start Date | April 6, 2025 |
| End Date | June 1, 2025 |

---

## Overview

ResumeProbe is a structured interview prep workflow. Users upload their resume, a job description, and real interview experiences they've collected for a target company. The AI builds a per-company question bank, runs a multi-round mock interview that probes the user's actual experiences without revealing model answers, and polishes final answers into memorizable cards.

---

## User Stories

### 1. Resume & JD Upload
**As a** job seeker,  
**I want to** upload my resume and paste a job description,  
**So that** the AI can understand my background and what the role requires.

**Acceptance Criteria:**
- User can upload a PDF resume
- User can paste or upload a JD as text
- System extracts and stores resume content and JD content
- User sees a confirmation that inputs were processed successfully

---

### 2. Interview Experience Upload
**As a** job seeker,  
**I want to** paste real interview experiences I've found for a specific company,  
**So that** my prep is informed by what that company has actually asked before.

**Acceptance Criteria:**
- User can paste interview notes/experiences as free text
- Each set of notes is scoped to a specific company session
- System acknowledges the notes were saved

---

### 3. Per-Company Question Bank
**As a** job seeker,  
**I want to** see a prioritized list of questions tailored to my target company,  
**So that** I know what to focus on instead of preparing 100 generic questions.

**Acceptance Criteria:**
- AI generates a question list combining JD signals, resume gaps, and uploaded interview notes
- Questions are tagged by priority: 🔴 High / 🟡 Medium / 🟢 Low
- Questions are categorized: behavioral / situational / resume deep-dive / follow-up
- Each company session has its own isolated question bank

---

### 4. Mock Interview — AI Asks First
**As a** job seeker,  
**I want to** practice answering questions with an AI interviewer that probes my responses,  
**So that** I build the habit of articulating my real experiences under pressure.

**Acceptance Criteria:**
- AI presents one question at a time from the question bank
- User submits a text answer before receiving any feedback
- AI never reveals a model answer unprompted
- AI generates at least one follow-up probe based on the user's answer
- User can attempt the same question again after feedback

---

### 5. Answer Scoring
**As a** job seeker,  
**I want to** receive structured feedback on my answers,  
**So that** I know specifically what to improve.

**Acceptance Criteria:**
- Each answer is scored across three dimensions: Structure (STAR), Relevance (JD alignment), Specificity (concrete details)
- Scores are displayed clearly after each attempt
- Feedback is specific and actionable, not generic

---

### 6. Answer Cards
**As a** job seeker,  
**I want to** save polished versions of my best answers as cards,  
**So that** I can review and memorize them before the interview.

**Acceptance Criteria:**
- User can request a "polish" on any practiced answer
- System returns a short version (3–4 sentences) and a full version
- Cards are saved per session and viewable at any time
- Polished answer preserves the user's original voice and style

---

## Out of Scope (v1)

- Voice / speech input
- Browser extension or mobile app
- Scraping interview experiences from the web automatically
- Multiple user accounts / team features

---

## Non-Functional Requirements

- AI responses should stream in real-time during mock interview turns
- Each company session's data must be isolated from other sessions
- The app should work without login for MVP (single-user prototype is acceptable)
