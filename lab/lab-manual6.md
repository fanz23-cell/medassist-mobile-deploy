# Week 6 Lab Manual: Full-Stack Applications


## Table of Contents

1. [Overview](#overview)
2. [Learning Objectives](#learning-objectives)
3. [Pre-Lab Checklist](#pre-lab-checklist)
4. [Component A: Staff Interview](#component-a-staff-interview)
5. [Component B: Lab](#component-b-lab)
6. [Component C: System Architecture & Design](#component-c-system-architecture--design)
7. [Component D: Testing & Validation](#component-d-testing--validation)
8. [Troubleshooting Matrix](#troubleshooting-matrix)
9. [Submission](#submission)
10. [Reflection](#reflection)

---

## Overview

You will build a Next.js app with multiple pages, connect it to Supabase for data storage and authentication, implement Row Level Security so users can only see their own data, and validate all user input before it reaches the database.
---

## Learning Objectives

After completing this lab, you will be able to:

1. **Build** a multi-page Next.js application using App Router with shared navigation and layout components
2. **Implement** user authentication using Supabase Auth, including sign-up, sign-in, and protected routes
3. **Perform** Create, Read, Update, and Delete operations against a Supabase database from a Next.js frontend
4. **Configure** Row Level Security policies so that each user can only access their own records
5. **Validate** user input on all forms before database insertion, including required fields, email format, and length limits
6. **Sketch** a data model from a stakeholder interview, identifying entities, fields, and relationships
7. **Design a data model** by identifying entities, fields, and relationships from a stakeholder interview, and justify the schema choices with reference to the user's workflow

---

## Component A: Staff Interview

### Guest: Katelin Cannon, Director of Partnerships — Sponsor Meeting Notes

**Focus:** Katelin digitizes notes from meetings with prospective Launch Project sponsors, modifies them to fit the project proposal form, and pre-populates an initial project definition slide deck. Her workflow involves clear entities (sponsors, projects, faculty, students) and data transformations (meeting notes → intake form → slide deck), making it ideal for practicing data model design and CRUD operations in a full-stack context.

Complete your interview and answer the following questions:

1. **WHO** is the staff member and what is their problem?
2. **WHAT** will you build?
3. **WHICH** tech stack and why? (Justify your choice based on the staff member's needs)
4. **HOW** will you know it works?

### Synthesis Artifact: Data Model Sketch

Before writing any code, sketch a data model based on what you heard in the interview. This is your synthesis artifact for this week.

#### Start from the User's Screen, Not the Database

Before drawing entities and fields, flip your perspective. Instead of asking "what tables do I need?", ask "what does the user see on their screen?"

**Step 1: Sketch the User's View First**

Draw what the target user sees when they open the application. Sketch 2-3 screens. You are allowed to use Claude Design for this task.


**Step 2: Derive the Data Model from the Screens**

Now look at your screen sketches and extract the data model:

- Who owns the item on screen
- How the data schema might look like

**Why this matters:** When the data model starts from the user's screen, the resulting application naturally matches what users expect. When it starts from the database, developers often build technically correct but user-hostile interfaces. These are typical fields that the user does not understand, relationships they cannot navigate, and screens that expose database structure instead of useful information.

### Build Mandate

Complete this sentence before writing any code:

> "Based on the interview, I will build **[specific feature/app]** because the interviewee said **[direct quote or paraphrased finding]**, which means **[design decision it drives]**."

### Deliverable

- Completed interview with notes, along with all questions answered earlier in this lab
- Build Mandate sentence

---

## Component B: Lab

### Topic: Multi-page Next.js, Supabase Auth, CRUD, Row Level Security

### Level 1: Multi-Page Setup 

**Goal:** Create 2-3 pages using Next.js App Router and add navigation between them using a shared layout. For example:

- `/sponsors` -- a list of sponsor organizations
- `/projects` -- a list of Launch Projects
- `/meetings` -- sponsor meeting notes or intake status

Each page needs its own folder under `src/app/` with a `page.tsx` file inside. Update the Navbar component in `src/components/Navbar.tsx` to include links to your new pages.

Before running your code, take time to understand the architecture. Open the project in Cursor or other IDEs and look at the files. Use the example below as the conceptual tour of the project structure.

```
src/
  app/
    layout.tsx        <-- The shared layout (wraps every page)
    page.tsx          <-- Home page (the "/" route)
    dashboard/
      page.tsx        <-- Dashboard page (the "/dashboard" route)
    settings/
      page.tsx        <-- Settings page (the "/settings" route)
    login/
      page.tsx        <-- Login page (the "/login" route)
    auth/
      callback/
        route.ts      <-- Handles Supabase auth redirects
  components/
    Navbar.tsx        <-- Shared navigation component
    Footer.tsx        <-- Shared footer component
  lib/
    supabase.ts       <-- Supabase client initialization
```

##### Top-level project files (outside `src/`)

The runnable app is the **whole project folder**, not `src/` alone. Without `package.json` and the other files at the repo root, you cannot run `npm install` or `npm run dev`. Here are some typically seen files in a project:

| File | Role |
|------|------|
| `package.json` | Declares dependencies and `npm` scripts (`dev`, `build`, …). |
| `next.config.ts` | Next.js build and runtime settings for this app. |
| `tsconfig.json` | TypeScript compiler options (paths, strictness). |
| `tailwind.config.ts` / `postcss.config.mjs` | Tailwind + PostCSS pipeline for styling. |
| `middleware.ts` | Next.js **middleware** at the **repo root** (code that runs on matched requests before your page loads). In Next.js, this file lives at the project root by design, not under `src/`. |
| `.env.example` | Template for required environment variable **names**; copy to `.env.local` and fill in values. Real secrets stay local and out of Git. |


#### If You Are Stuck

If you are stuck, open your Agent and start with the prompt below:

```
Objective:
Create a Next.js App Router project with a layout at src/app/layout.tsx
and a Navbar at src/components/Navbar.tsx. Please:

1. Create a page at src/app/sponsors/page.tsx with a heading "Sponsor
   Organizations" and a placeholder table with 3 example rows (Organization, Industry,
   Contact Email)
2. Create a page at src/app/projects/page.tsx with a heading "Launch
   Projects" and a placeholder list of 3 projects (Title, Term, Status)
3. Create a page at src/app/meetings/page.tsx with a heading "Sponsor Meetings"
   and 3 placeholder cards (Meeting Title, Date, Notes snippet)
4. Update the Navbar to include links to /sponsors, /projects, and /meetings

Constraints:
Use Tailwind CSS for all styling. Keep it clean and professional.
```

---

### Level 2: Supabase Auth

**Goal:** Add sign-up and sign-in using Supabase Auth. Protect pages so only authenticated users can access them. Read [docs](https://www.freecodecamp.org/news/set-up-authentication-in-apps-with-supabase/) for more details.

Please implement:
1. A sign-up function for new users
2. A sign-in function for existing users with password
3. Proper error handling that maps technical errors to user-friendly messages. You would want to (1) validate inputs locally first, (2) map technical error messages to human-readable ones, (3) log the original error for debugging, (4) always clear loading state even if there is an error.
4. Add route protection so that unauthenticated users are redirected to the login page when they try to access data pages. If no session exists, redirect to `/login`.

---

### SQL Quick Reference

Before diving into CRUD and Row Level Security, here is a quick primer on SQL — the language databases understand.

SQL (Structured Query Language) is the standard language for reading and writing data in relational databases like Supabase.

**The four commands you need:**

```sql
-- SELECT: read rows from a table
SELECT * FROM posts WHERE user_id = '123';

-- INSERT: add a new row
INSERT INTO posts (title, body) VALUES ('Hello', 'World');

-- UPDATE: change existing rows
UPDATE posts SET title = 'Updated' WHERE id = '42';

-- DELETE: remove rows
DELETE FROM posts WHERE id = '42';
```

** Row Level Security (RLS) policy** is attached to a table to decide which rows a user is allowed to see or change. 

**How `auth.uid()` and `USING` work:** `auth.uid()` returns the ID of the currently logged-in user. Supabase figures out who is logged in from the login cookie your browser sends with every request so you do not need to pass it manually. `USING (...)` is the condition the bouncer checks for every row.

---

### Level 3: CRUD Operations

**Goal:** Implement Create, Read, Update, and Delete for one entity -- for example, sponsor organizations. Use the Supabase client library.

#### Step 1: Set Up the Database Table

1. Open your Supabase project dashboard at [supabase.com](https://supabase.com)
2. Navigate to the **SQL Editor**
3. Have your agent write SQL based on the entity you chose from your data model sketch (Component A)

Here is an example for a `sponsors` table (Note that this is only an example and could be different than your data model): 

```sql
-- Create the sponsors table
CREATE TABLE sponsors (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  company_name text NOT NULL,
  industry text,
  contact_email text,
  contact_name text,
  notes text,
  last_contacted date,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security (we will add policies later)
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
```

4. Click **Run**

After running the SQL, go to **Table Editor** in the Supabase sidebar. You should see your table with the expected columns. If you do not see the table, check that the SQL ran without errors.

#### Step 2: Implement CRUD with Data Validation

Open the page for your chosen entity (e.g., `src/app/sponsors/page.tsx`). Implement (if appropriate to your web app):

1. **Read:** Fetch all records from the table on page load
2. **Create:** A form to add new records with validation
3. **Update:** An edit button that pre-fills the form with existing data
4. **Delete:** A delete button for each record

**Data validation matters.** What happens if a user submits an empty organization name? What if they paste in a 10,000-character string? What about HTML tags like `<script>alert('xss')</script>`? Your code should handle all of these.

**Implement create (and apply the same ideas on update) without a copy-paste sample:** connect your form’s submit handler to the Supabase client. At a high level:

- **Trim and check required fields** — After trimming whitespace, reject empty values for any column your schema marks `NOT NULL` (for example, organization name). Show a clear, human-readable message and do not call the database until validation passes.
- **Cap length** — Reject or truncate unreasonably long strings so a single paste cannot stress your UI or database (pick a sensible maximum for names and notes).
- **Optional email** — If the user enters something in an email field, validate that it looks like an email (basic pattern or a small library). Empty optional email can stay empty.
- **Reduce risky text** — Strip or neutralize obvious HTML/script markup in free-text fields before inserting, so pasted content is stored as plain text, not executable markup.
- **Associate with the signed-in user** — Include the current user’s id on the row (for example `user_id`) so each record is tied to a user, matching your table definition.
- **Insert or update via Supabase** — Use `.from('your_table').insert(...)` (and `.update(...)` for edits) with the validated values. Use `.select()` if you need the new or updated row back for your list state.
- **Handle errors and success** — On failure, show a friendly message and log details for debugging. On success, refresh your list (or prepend the returned row), clear the form, and clear any error state.

Use the [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript/insert) for insert and update syntax. 


### Level 4: Row Level Security + Validation

**Goal:** Enable RLS on your Supabase table so users can only see and edit their own records. Add comprehensive input validation -- required fields, email format, max length.

#### Why Row Level Security (RLS) Matters

This is a **baseline requirement** for any app that stores user data. If RLS is not enabled, any signed-in user can open the browser developer console and run a query like this against your Supabase API:

```
// Anyone logged in can see EVERY user's data — not just their own
const { data } = await supabase.from('sponsors').select('*')
// Returns ALL rows from ALL users. Passwords, notes, contact info — everything.
```

RLS is the fix: it makes the database enforce "you can only see your own rows" at the database level, so even a malicious query returns only the current user's data.

If you did not already enable RLS in the table creation SQL, do it now. Open the Supabase SQL Editor and run:

```sql
-- Turn on the "bouncer" for this table.
-- After this line, NO ONE can read or write ANY rows unless a policy allows it.
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Reading data (SELECT)
-- Plain English: "When anyone tries to read rows from 'sponsors',
-- only show them rows where the user_id column matches THEIR user ID."
-- auth.uid() = the ID of whoever is currently logged in (Supabase fills this in automatically)
-- USING (...) = the condition checked for EVERY row — rows that fail are hidden
CREATE POLICY "Users can view their own sponsors"
  ON sponsors FOR SELECT
  USING (auth.uid() = user_id);

-- POLICY 2: Creating data (INSERT)
-- Plain English: "When anyone tries to add a new row, only allow it
-- if the user_id they are setting matches their own ID."
-- WITH CHECK (...) = like USING, but for the new row state being created
-- or saved after an update
CREATE POLICY "Users can insert their own sponsors"
  ON sponsors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- POLICY 3: Updating data (UPDATE)
-- Plain English: "Users can only edit rows that already belong to them,
-- and the edited row must still belong to them afterward."
CREATE POLICY "Users can update their own sponsors"
  ON sponsors FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- POLICY 4: Deleting data (DELETE)
-- Plain English: "Users can only delete rows that belong to them."
CREATE POLICY "Users can delete their own sponsors"
  ON sponsors FOR DELETE
  USING (auth.uid() = user_id);
```

**Verify RLS is working:** After enabling RLS policies, go to your app and confirm:
1. You can still see and create records when logged in
2. If you check the Supabase Table Editor directly, you see all records (the dashboard bypasses RLS)
3. Your app only shows records that belong to the currently authenticated user

#### Comprehensive Input Validation Checklist

Review all forms in your application and confirm:

- [ ] **Required fields:** Empty submissions are blocked with a clear message
- [ ] **Email format:** Email fields are validated with a regex pattern before submission
- [ ] **Max length:** All text fields have reasonable length limits (200 characters for names, 500 for notes, etc.)
- [ ] **HTML sanitization:** All text inputs strip HTML tags before database insertion
- [ ] **Error messages:** Validation messages tell the user what to fix, not just that something is wrong
- [ ] **Row Level Security is enabled**.
- [ ] **No hardcoded secrets**: Search your code for your Supabase URL and key. They should only appear in `.env.local`, never in source files. In your terminal: `grep -r "supabase.co" src/` should return zero results.
- [ ] **`.env.local` is in `.gitignore`**. **For grading purposes, please submit your secrets. For future projects, do not disclose secrets.**
- [ ] **Error handling exists**: Every `supabase.from()` call should have error handling (check for `error` in the response). Every `supabase.auth` call should have error handling.
- [ ] **Input validation exists**: Form submissions should validate input before sending to the database (check for empty strings, length limits, email format).
- [ ] **No sensitive data in the console**: Check that you are not `console.log`-ing passwords, tokens, or user data.

#### Submission note (Component B)

In your README or lab notes, briefly document **at least two concrete improvements** you made while building or validating your CRUD forms (for example: clearer validation messages, max-length handling, email checks, or HTML sanitization). This satisfies the [Component B](#component-b-deliverables) deliverable for documented validation or form improvements.

### Level 5: Stretch Goals

- **Goal:** Add a search bar that filters records in real-time and a sort dropdown (e.g., sort by name, date, industry).

---

## Component C: System Architecture & Design

---

### C.1 Architecture Concept: Entity-Relationship Modeling & Normalization

#### The Big Idea

Before you write any database code, you need to answer a fundamental question: what are the "things" in my system, and how do they relate to each other? This is called entity-relationship (ER) modeling.

An **entity** is a "thing" your system tracks -- a sponsor, a project, a meeting note, a student, a contact. Each entity has **attributes** (fields like name, email, date). Entities are connected to each other by **relationships** (a sponsor has many meeting notes; a project links sponsors to faculty and students).

**Normalization** is the practice of organizing your data so that each piece of information lives in exactly one place. If a sponsor's address appears in 50 rows of a meetings table, and the sponsor moves, you have to update 50 rows. If the address lives in a sponsors table and the meetings table just references it, you update one row. That is normalization.

### Design Decision Log

#### The Template

| Field | Your Entry |
|-------|------------|
| **Decision** | What did you decide? |
| **Alternatives considered** | What else could you have done? |
| **Why you chose this** | What constraint drove it? |
| **Trade-off** | What did you give up? |
| **When would you choose differently?** | Under what conditions? |

#### This Week's Decision Prompt

> **"What did you denormalize (or keep in a single table), and what would break at scale?"**

Think about:
- Did you store contact information as columns inside the sponsors table, or as a separate contacts table?
- Did you use a free-text "notes" field instead of structured data (tags, categories)?
- If Katelin's team tracked 10,000 sponsors instead of 10, would your data model still work? What would slow down or break?
- What would change if two users needed to edit the same record simultaneously?

---

## Component D: Testing & Validation

**Boundary testing** in software means testing at the edges and limits of what your system accepts:

- What happens at the maximum allowed length? At one character over?
- What happens with zero items? With one item? With a thousand items?
- What happens at the boundary between "authorized" and "unauthorized"?
- What happens with the first valid input and the first invalid input?

#### Why this matters

Most bugs live at boundaries, not in the middle of normal operation:

- Your form works fine with "xyz abc" but breaks with an empty string
- Your RLS works for logged-in users but what about a request with an expired session?
- Your chart handles 12 data points but crashes with 0 data points
- Your API route processes normal text but breaks on emoji or Unicode

Boundary testing is how professional security teams find vulnerabilities. They do not test whether login works with the right password -- they test what happens with the wrong password, an empty password, a 10,000-character password, a password containing SQL commands, and no password at all.


---

### D.1 Validation Exercise: Security Validation Matrix

#### What you are testing

You will verify two critical security properties:

1. **RLS isolation**: User A cannot see or modify User B's data
2. **Input edge cases**: Your form validation handles unexpected, extreme, and malicious input

#### Part A: RLS Isolation Test

**Step 1: Create two test accounts**

If you have not already, create two separate user accounts in your app:

- **Test User A**: e.g., `testa@test.com`
- **Test User B**: e.g., `testb@test.com`

> **Tip:** If email confirmation is enabled in Supabase, temporarily disable it for testing: Supabase Dashboard > Authentication > Settings > toggle off "Enable email confirmations."

**Step 2: Create data as User A**

Log in as User A and add 2-3 records (e.g., sponsor records, bookmarks, incidents -- whatever entity your app manages). Note the exact data you created.

**Step 3: Verify isolation as User B**

Log out. Log in as User B.

- Can User B see User A's records? (Expected: **No**)
- Can User B see an empty list or only User B's own records? (Expected: **Yes**)

**Step 4: Create data as User B**

While logged in as User B, add 1-2 records.

**Step 5: Verify reverse isolation**

Log out. Log in as User A.

- Can User A see User B's records? (Expected: **No**)
- Can User A still see their own original records? (Expected: **Yes**)

Record your results in the RLS testing table below.

#### Part B: Input Edge Case Testing

Test your form validation with 5 edge cases. For each case, attempt to submit the form with the given input and record what happens.

| # | Edge Case | Input to Try | Why This Matters |
|---|-----------|-------------|-----------------|
| 1 | Empty required field | Leave the organization name (or equivalent required field) blank and click submit | Tests that required field validation works |
| 2 | Extremely long input | Paste a 500+ character string into a text field | Tests max-length validation; could break your UI layout |
| 3 | HTML/script injection | Type `<script>alert('xss')</script>` into a text field | Tests that HTML is sanitized before display/storage |
| 4 | Special characters | Type `O'Malley & Co. "Test" <Corp>` into a name field | Tests that apostrophes, ampersands, and angle brackets do not break queries or display |
| 5 | Emoji/Unicode | Type `Tokyo Office` or paste non-Latin characters | Tests that your app handles Unicode correctly |

#### Recording Template

**RLS Isolation Test:**

| Test Step | Action | Expected | Actual | Pass/Fail |
|-----------|--------|----------|--------|-----------|
| User A creates records | _Added 3 sponsor records as testa@test.com_ | _Records saved successfully_ | _3 records visible in list_ | _Pass_ |
| User B views data | _Logged in as testb@test.com, opened sponsors page_ | _Empty list (no access to A's data)_ | _Shows "No sponsors yet"_ | _Pass_ |
| User B creates records | _Added 2 sponsor records as testb@test.com_ | _Records saved, only B's records visible_ | _2 records visible_ | _Pass_ |
| User A re-checks | _Logged back in as testa@test.com_ | _Only A's 3 records visible_ | _3 original records, no B's data_ | _Pass_ |

**Input Edge Case Test:**

| # | Edge Case | Input Used | Expected Behavior | Actual Behavior | Pass/Fail |
|---|-----------|-----------|-------------------|-----------------|-----------|
| 1 | Empty required field | _(left blank)_ | _Error: "Organization name cannot be empty"_ | _Shows validation message, form not submitted_ | _Pass_ |
| 2 | Long input | _500 chars of "A"_ | _Error: "Organization name too long" or truncation_ | _ _ | _ _ |
| 3 | HTML injection | `<script>alert('xss')</script>` | _Tags stripped or escaped, no alert box_ | _ _ | _ _ |
| 4 | Special characters | `O'Malley & Co. "Test" <Corp>` | _Saved and displayed correctly without breaking_ | _ _ | _ _ |
| 5 | Emoji/Unicode | `Tokyo Office` | _Saved and displayed correctly_ | _ _ | _ _ |

---

## Submission

Submit to **GitHub Classroom** on the **main** branch. Your README should document how to install, configure environment variables, and run the app so a TA can reproduce your results.

**Secrets:** For grading, submit the values your app needs (e.g. Supabase URL and anon key) as directed by your instructor—typically in the submission form or a private channel, not committed to a public repo. Keep `.env.local` out of Git; never publish secrets in source files. The Level 4 checklist still applies: `grep -r "supabase.co" src/` should return no secret URLs pasted into code.

### Component A Deliverables

1. Interview notes with all four required questions answered (WHO, WHAT, WHICH tech stack and why, HOW you will know it works)—see [Component A](#component-a-staff-interview)
2. **Data model sketch** — Diagram or image showing entities, roughly 3–5 fields per entity, and relationships, grounded in your user-first screen sketches ([Synthesis Artifact](#synthesis-artifact-data-model-sketch))
3. **Build mandate** — Completed sentence using the template in Component A: *"Based on the interview, I will build … because the interviewee said …, which means …"*

### Component B Deliverables

1. **Working multi-page Next.js app** aligned with your interview context: shared layout/navigation ([Level 1](#level-1-multi-page-setup)), auth-protected data pages ([Level 2](#level-2-supabase-auth))
2. **One CRUD entity** connected to Supabase with Create, Read, Update, Delete ([Level 3](#level-3-crud-operations))
3. **RLS evidence** — Your table has RLS enabled and policies for SELECT, INSERT, UPDATE, and DELETE ([Level 4 — RLS](#why-row-level-security-rls-matters)); point the TA to your SQL (README or `*.sql` file)
4. **Validation / form improvements** — At least **two** documented improvements you made while implementing CRUD and validation ([Submission note (Component B)](#submission-note-component-b))
5. **Security and validation checklist** — Evidence you addressed the [Comprehensive Input Validation Checklist](#comprehensive-input-validation-checklist) (for example: completed checklist in README, or short notes per item)

### Component C Deliverables

1. **Design Decision Log** entry using the template in [Design Decision Log](#design-decision-log) (decision, alternatives, why, trade-off, when you would choose differently)
2. Response to this week's prompt: **"What did you denormalize (or keep in a single table), and what would break at scale?"**

### Component D Deliverables

1. **D.1 Part A:** Completed [RLS Isolation Test](#part-a-rls-isolation-test) table (copy the template from [Recording Template](#recording-template) with your actual results)
2. **D.1 Part B:** Completed [Input Edge Case Test](#part-b-input-edge-case-testing) table — all five edge cases attempted with pass/fail outcomes

### AI usage log (required)

Document **three** AI interactions from this lab session. For each interaction:

- **What you prompted:** The exact prompt or request you gave the AI
- **What it produced:** Summary of the AI's output
- **AI assumption:** Where the AI's framing diverged from your intent—what did it optimize for that you did not ask for?
- **Failure mode:** What went wrong or could have gone wrong
- **Resolution:** What prompt change or manual fix addressed it

**Course reflection:** Answer the three prompts in the [Reflection](#reflection) section (**3–5 sentences total** across all three questions—not 3–5 sentences per question).

---

## Reflection

Answer the following questions in 3-5 sentences total:

1. **Data modeling decisions:** What was the hardest decision you made when designing your data model (choosing entities, fields, or relationships)? What trade-off were you weighing? *(Compare this to the JTBD statement from Week 4 — how is designing a data model similar to or different from defining a user's "job to be done"?)*

2. **What RLS taught you about security:** Before this lab, how did you think about who can see what data in a web application? How did implementing Row Level Security change your understanding? *(Recall the security checklist from Week 5 — which items were already habits, and which did RLS make real for the first time?)*

3. **Partnerships / Launch Project data model comparison:** How did the data model you sketched from the interview with Katelin compare to what you actually implemented? What did you simplify, and what would you add if you had more time?

---

## Troubleshooting Matrix

For detailed troubleshooting guidance, see [troubleshooting.md](troubleshooting.md). Below is a quick-reference matrix for the most common issues in this lab.


### RLS Blocking All Reads

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Query returns empty array even though data exists | RLS policies are filtering out rows because `user_id` does not match the authenticated user | Check that the `user_id` column in your data matches the logged-in user's ID. View data in Supabase Table Editor to verify. Log `supabase.auth.getUser()` to confirm the current user's ID. |
| Cannot insert rows -- "new row violates row-level security policy" | User is not authenticated, or the `user_id` being inserted does not match `auth.uid()` | Make sure the user is signed in before making database calls. Pass `user_id: user.id` when inserting rows, where `user` comes from `supabase.auth.getUser()`. |
| Everything worked before enabling RLS, now nothing works | RLS is enabled but no policies have been created | You must create policies (SELECT, INSERT, UPDATE, DELETE) after enabling RLS. See the SQL in Level 4. Enabling RLS without policies blocks ALL access by default. |

### CRUD Not Updating

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Data appears in Supabase but not in the app | Query might be filtering incorrectly, or the component is not re-rendering | Add `console.log(data, error)` after your Supabase query. Check that you are updating React state with the results. |
| "relation 'sponsors' does not exist" | The SQL setup script was not run, or was run on the wrong project | Go to Supabase SQL Editor and run your CREATE TABLE statement again. Make sure you are in the correct project. |
| Edit does not save changes | The update query might be missing the `.eq("id", record.id)` filter, or is not calling `.execute()` | Check that your update call includes `.eq("id", id)` and `.select()`. Log the error response to see if Supabase is rejecting the update. |
| Delete removes from UI but comes back on refresh | The delete query failed silently | Always check the `error` response from Supabase delete operations. The UI should only update after confirming the database operation succeeded. |

### Next.js Routing Issues

| Symptom | Root Cause | Fix |
|---------|-----------|-----|
| Page shows 404 | File is not named `page.tsx` or is in the wrong directory | Verify your file is at `src/app/[route]/page.tsx` (must be named exactly `page.tsx`). Next.js App Router uses folder names as routes. |
| Layout not applying to pages | `layout.tsx` is in the wrong directory or has a syntax error | Check that `src/app/layout.tsx` exists and wraps `{children}` in the JSX return. |
| Clicking links causes full page reload | Using `<a>` tags instead of Next.js `<Link>` component | Replace `<a href="/sponsors">` with `import Link from 'next/link'` then `<Link href="/sponsors">`. |
| "Text content does not match" hydration error | Component renders differently on server vs client | Add `"use client"` at the top of the file, or move dynamic content into a `useEffect` hook. |
| Module not found | Import path is wrong or the `@` alias is not configured | Check that `tsconfig.json` has `"@/*": ["./src/*"]` in the `paths` section. Verify the file exists at the exact path. |

### General Quick Fixes

When in doubt, try these steps in order:

1. **Restart the dev server** -- Press Ctrl+C, then `npm run dev`
2. **Clear the cache** -- Delete `.next` folder: `rm -rf .next && npm run dev`
3. **Reinstall dependencies** -- `rm -rf node_modules package-lock.json && npm install`
4. **Check the browser console** -- Press F12 or Cmd+Option+J and look at the Console tab
5. **Check the terminal** -- The terminal running `npm run dev` often shows errors before the browser does
6. **Ask Cursor** -- Select the error message, press Cmd+K, and say "Fix this error"
7. **Ask for help** -- Raise your hand. That is what the instructor and TAs are here for.
