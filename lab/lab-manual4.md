# Week 4 Lab Manual: Decision-Maker Dashboards & JTBD


## Table of Contents

1. [Overview](#overview)
2. [Learning Objectives](#learning-objectives)
3. [Component A: Staff Interview](#component-a-staff-interview)
4. [Component B: Lab](#component-b-lab)
5. [Component C: System Architecture & Design](#component-c-system-architecture--design)
6. [Component D: Testing & Validation](#component-d-testing--validation)
7. [Component E: Applied Challenge — Budget Byte](#component-e-applied-challenge--budget-byte)
8. [Submission](#submission)
9. [Reflection](#reflection)

---

## Overview

Dashboards exist to enable decisions. By the end of this lab, your dashboard will tell a story grounded in a real person's real needs.

---

## Learning Objectives

By the end of this lab, you will be able to:

1. Conduct a structured stakeholder interview and extract decision-making needs
2. Write a Jobs-to-be-Done (JTBD) statement that connects user needs to dashboard design
3. Build a Streamlit dashboard with KPI cards, columns, expanders, and tabs
4. Create interactive filters using `st.selectbox`, `st.slider`, and `st.date_input`
5. Write `assert` statements that verify your dashboard logic
6. Arrange visualizations into a story-first layout (situation, data, insight, action)
7. Design a story-first dashboard layout by mapping JTBD statement elements (situation, data, insight, action) to specific dashboard components (headline, KPI cards, charts, recommendation)
8. Write 2+ assert statements that verify data transformation correctness, and explain in writing why each assertion matters for the dashboard's trustworthiness
9. Map interview-derived story elements (JTBD, metrics, decision context) into structured prompts for an AI coding assistant (role, data/schema constraints, layout intent, success checks)

---

## Component A: Staff Interview

### Guest: Cristie Chase, Assistant Director of Finance & Operations

**Cristie** struggles to determine the optimal timing for starting seeds, using a greenhouse, and transplanting plants due to inconsistent, generic guidance that doesn’t account for their specific location and gardening setup.

Cristie provided a sample data in `component-a-data/Sample Data.docx`.

### During the Interview

- Write down **exact phrases** the interviewee uses (their language, not your paraphrase)
- Note which decisions are data-driven and which are gut feel
- Listen for frustrations, workarounds, and gaps (these are design opportunities)
- Pay attention to the metrics they mention (these become your KPI cards)

### Synthesis Artifact: JTBD Statement

After the interview, write a Jobs-to-be-Done statement using this pattern:

> **"When [interviewee] is [situation], they want to [motivation] so they can [outcome]."**

**Example:**

> "When the Marketing Lead is preparing the quarterly budget proposal, they want to see which channels drove the most qualified applicant inquiries so they can reallocate spend away from underperforming channels before the next enrollment cycle."

Your JTBD statement is the north star for your dashboard. Every KPI card, every filter, and every chart should trace back to this sentence. If a visualization does not help the Marketing Lead reach their decision, it does not belong.
Compared to problem statement, your JTBD should define what success means whereas problem statement defines the pain.

### Story-to-Prompt Mapping

Before writing any code, turn the **story** from your interview into **instructions an AI agent can execute**. Prompts grounded in JTBD, exact phrases from notes, and real data constraints produce work you can verify.


**Part 1 — Mapping table**

Below is a template for you to map from JTBD to prompt. **Do not dump all notes into one row**, which will not be helpful for you to develop a clean train of thought.

| Story element (from notes / JTBD) | What the model must get right | Prompt constraint or snippet |
|----------------------------------|------------------------------|--------------------------------|
| ... | ... | ... |

Each row should tie to something concrete from the interview: a metric name the stakeholder used, a decision they need to make, a filter or comparison they care about, or a story-first zone (headline, KPI row, primary chart, recommendation). The third column is a phrase or bullet you will actually put in your assistant prompt—not fluff.

**Part 2 — One primary scaffold prompt**

Write the **full text** of the main prompt you will use to start the Streamlit dashboard. Below it, add **2–3 short bullets** that cite which interview note or JTBD clause justifies each major part of the prompt (same discipline as capturing **exact phrases** during the interview).

**Quality bar:** Your scaffold prompt should make clear:

- **Who** is deciding and **what** decision the dashboard supports
- **Which data** you have (file name, important columns, grain of the data)
- **Layout / story in words**—e.g., headline → KPIs → main chart → supporting charts → recommendation (no drawing required)
- **Verification**—e.g., ask for `assert` checks or other testable guarantees on transformations

### Deliverable

- Interview scripts with notes taken during interview
- One JTBD statement following the pattern above
- Story-to-prompt mapping table and scaffold prompt

---

## Component B: Lab

---

### The JTBD Framework

Before building, understand the framework that connects your interview findings to your dashboard design.

**Jobs-to-be-Done (JTBD)** asks: What "job" is the interviewee "hiring" this dashboard to do?


**The dashboard should tell a story:**

| Story Element | Dashboard Element |
|--------------|-------------------|
| **Situation** | Context: What decision is being made, and why now? |
| **Data** | KPI cards and charts: What does the evidence show? |
| **Insight** | Headline: What is the key finding? |
| **Action** | Recommendation: What should the decision-maker do? |

Every chart in your dashboard should earn its place by advancing this story. If a visualization is interesting but does not help the decision-making, remove it.

---

### Dashboard UX Pattern Library

Before building, familiarize yourself with these common dashboard UX patterns. These patterns can be reused as building blocks.

**Pattern 1: KPI Cards**
- **What they show:** A single important number with optional trend indicator
- **When to use:** For the 3-5 most important metrics the decision-maker checks first
- **Streamlit implementation:** `st.metric(label="Projected NOR", value="$12.4M", delta="-3.2% vs plan")`
- **UX tip:** Place KPI cards at the top of the dashboard. The decision-maker should get the "executive summary" before scrolling. Limit to 3-5 cards -- more than that dilutes their impact.

**Pattern 2: Trend Lines**
- **What they show:** How a metric changes over time
- **When to use:** When the decision depends on direction (going up, going down, staying flat)
- **Streamlit implementation:** `st.line_chart()` or Plotly `px.line()`
- **UX tip:** Always label the time axis clearly. If comparing two periods, use a secondary line or annotation rather than requiring the user to remember numbers.

**Pattern 3: Comparison Bars**
- **What they show:** How categories rank against each other
- **When to use:** When the decision is "which one is best/worst?"
- **Streamlit implementation:** `st.bar_chart()` or Plotly `px.bar()`
- **UX tip:** Sort bars by value (largest to smallest or vice versa), not alphabetically. Sorted bars answer the "which is biggest?" question instantly; unsorted bars require the user to do mental work.

**Pattern 4: Filter Controls**
- **What they show:** Nothing directly -- they let the user slice the data
- **When to use:** When different stakeholders need different views of the same data
- **Streamlit implementation:** `st.selectbox()`, `st.multiselect()`, `st.slider()`
- **UX tip:** Place filters in the sidebar, not inline with the content. Show the current filter state clearly so the user knows what they are looking at. Always handle the "nothing selected" state gracefully.

**Pattern 5: Detail Expanders**
- **What they show:** Supplementary detail hidden until the user asks for it
- **When to use:** When you have context that some users need but most do not
- **Streamlit implementation:** `st.expander("Methodology")`
- **UX tip:** Use for data sources, methodology notes, or detailed tables. Keep the default view clean; let curious users drill down.

**Anti-Pattern: Chart Soup**
- **What it looks like:** A dashboard with 6+ charts of equal size, no hierarchy, no narrative thread
- **Why it fails:** The decision-maker cannot tell which chart matters most. Everything looks equally important, so nothing is.
- **The fix:** Identify ONE primary chart that answers the core question. Make it the largest element. Supporting charts should be smaller, in a second row, and clearly labeled as context.

**Reference these patterns** as you build your dashboard in the levels below. For each chart or element you add, name which pattern it follows and why you chose it.

---

### Build Web App for Interviewee

**Key AI Tools:** Use Cursor (inline editor with AI) and/or Claude Code (terminal-based AI assistant) throughout the build. Use your JTBD statement and interview notes in your prompts so the AI understands the context.

**Start with the interviewee's decision, work backwards to what data and layout supports it.**

Before writing any code, answer these questions:

1. **What is the decision?** (from your interview notes)
2. **What data would make the interviewee confident?** (from their answers to Questions 1 and 4)
3. **What layout tells this story?** (headline at top, supporting context below, recommendation at bottom)


#### Constraints for web app build

**Constraint 1: Use 2+ Python assert statements to check your dashboard logic.**

Please refer to TECHIN 509 for assert statements and its comparison to if/else statements.

**What assert does:** An assert is a one-line sanity check. If the condition is False, Python raises an `AssertionError` with your message. Think of it like a building inspector checking that a wall is plumb before continuing.

**Examples of common assert patterns for dashboards:**

```python
# After any groupby: grouped result should have fewer rows
assert len(grouped) <= len(df), "Grouping should not increase row count"

# After any filter: filtered result should have fewer or equal rows
assert len(filtered) <= len(df), "Filter should not add rows"

# After any sum: parts should equal whole
assert grouped["count"].sum() == len(filtered_df), "Counts should sum to total"

# Percentage check
assert all(grouped["pct"] >= 0) and all(grouped["pct"] <= 100), "Percentages out of range"
```

**Constraint 2: At the bottom of your dashboard, write one paragraph that:**

1. States what the dashboard reveals (the headline insight, with a number)
2. Explains why it matters to your interviewee (connects back to your JTBD)
3. Recommends a specific action they should take (e.g., which scenario to stress-test with leadership)
---

## Component C: System Architecture & Design


### C.1 Architecture Concept: Feedback Loops & Causal Loops

#### The Big Idea


Your dashboard should be part of a decision cycle. Understanding this cycle helps you design dashboards that lead to better decisions.
For example, your JTBD statement describes a decision your interviewee needs to make. Your dashboard provides the data to inform that decision. But the story does not end when they look at the chart:

1. **Dashboard shows data** (e.g., "Scenario A projects $X NOR at Y% enrollment vs plan")
2. **Interviewee makes a decision** (e.g., "Present Scenario B to leadership and ask for a planning assumption on yield")
3. **Action is taken** (leadership adopts assumptions; planning model is updated)
4. **New data appears** (actual enrollment and revenue roll in; assumptions are revised next cycle)
5. **Dashboard shows new data** (loop repeats)


#### Key Vocabulary

- **Feedback loop:** When the output of a system influences its future input. Positive feedback amplifies change; negative feedback stabilizes.
- **Causal loop:** A diagram showing how variables in a system cause changes in each other, forming a cycle. Used in systems thinking to map complex relationships.

---

### C.2 Diagramming Exercise: Draw a Causal Loop for Your Dashboard

#### Instructions

Draw a causal loop diagram showing how your dashboard fits into the target user's decision-making cycle. This is not a data flow diagram. This is a systems thinking diagram that shows how acting on data changes the next round of data.

#### Step-by-Step

1. **Identify variables** in the system. These come from your JTBD statement and your dashboard. Examples:
   - Tuition rate or discount policy (scenario)
   - Enrollment headcount or yield assumption
   - Net operating revenue (projected or actual)
   - Dashboard insight visibility (what leadership sees)
   - Time horizon (year / cohort) in the model

2. **Draw each variable as a node**.

3. **Draw arrows** between variables showing cause and effect. Label each arrow with "+" (more of A leads to more of B) or "-" (more of A leads to less of B).

4. **Close the loop.** Make sure at least one path goes all the way around from a decision variable back to a data variable.

#### What to Include

- Variables (e.g., data, decision, action, new data)
- Arrows labeled with "+" or "-" and a brief cause-effect note
- At least one complete loop (the last variable connects back to the first)
- Your specific dashboard metrics, not generic placeholders

---

### C.3 Design Decision Log

#### The Template

| Field | Your Entry |
|-------|------------|
| **Decision** | What did you decide? |
| **Alternatives considered** | What else could you have done? |
| **Why you chose this** | What constraint drove it? |
| **Trade-off** | What did you give up? |
| **When would you choose differently?** | Under what conditions? |

#### This Week's Decision Prompt

> **"How does acting on your dashboard's data change the next dataset? Did you design for this?"**

Think about:
- If your interviewee follows your recommendation (e.g., adopt a new enrollment or tuition assumption), what changes in the **next** dataset or planning cycle?
- Does your dashboard show data that is "stale" after an action is taken, or does it naturally update when new actuals arrive?
- Did you design your charts to show trends over time (which capture the effect of decisions), or only snapshots (which do not)?
- What happens if they act on your dashboard and the results are worse (e.g., enrollment misses plan)? Would the dashboard surface that clearly?

---

## Component D: Testing & Validation

### D.1 Validation Exercise: Assert Expansion

#### What you are testing

Expand to more assertions in your web app build for interviewee, each covering a different category of check. You should think systematically about what can go wrong. 

#### The four assertion categories

| Category | What it checks | Example |
|----------|---------------|---------|
| **Value** | A specific computed value is correct | `assert projected_nor == filtered_df["revenue"].sum()` |
| **Type** | Data has the expected type or structure | `assert isinstance(tuition_delta_pct, float)` |
| **Range** | A value falls within acceptable bounds | `assert 0 <= enrollment_pct_of_plan <= 200` |
| **Relational** | Two values have the correct relationship to each other | `assert len(filtered_df) <= len(df)` |

#### Instructions

**Step 1: Review your existing asserts**

Look at the assert statements you wrote in Component B. 

**Step 2: Write assert statements**

Add assert statements. You need to cover all four categories. Here are templates for each category:

**Value assert** -- checks a specific computed result.

**Type assert** -- checks data has the expected structure.

**Range assert** -- checks values fall within acceptable bounds.

**Relational assert** -- checks that two values have the correct relationship.

**Step 3: Run your app and confirm all asserts pass**

If an assert fails, fix the failures.

**Step 4: Record your results**

Use the recording template below.

#### Recording Template

Copy this table into your submission document:

| # | Assert Category | Assert Statement (code) | What It Checks (plain English) | Result |
|---|----------------|------------------------|-------------------------------|--------|
| 1 | Value | `assert abs(scenario_totals.sum() - filtered_df["revenue"].sum()) < 0.01` | Scenario revenue subtotals add up to the filtered total | Pass |
| 2 | Type | `assert isinstance(projected_nor, (int, float))` | KPI metric is a number, not a string | Pass |
| 3 | Range | `assert -20 <= tuition_delta_pct <= 20` | Tuition scenario delta is within a plausible bound | Pass |
| 4 | Relational | `assert len(filtered_df) <= len(df)` | Filtering did not add phantom rows | Pass |

---

### D.2 Testing Concept Preview: Test Coverage

#### What is test coverage?


**Test coverage** measures what percentage of your code is actually tested. If your app has 10 functions and your tests only exercise 4 of them, you have 40% test coverage. The other 6 functions could have bugs and you would never know.

High coverage does not guarantee your code is correct, but low coverage guarantees untested blind spots. AI-generated code is especially important to cover with tests because you did not write it yourself.

---

## Component E: Applied Challenge — Budget Byte

**Required for submission** — include the deliverables below in your repo (and document how to run the challenge app in your README). See [Submission](#submission).

**Note: This is a separate web app from previous components.**

### The Problem

The GIX Student Council treasurer needs to allocate $8,000 across 5 event categories for next quarter. You're given a CSV of last year's spending, attendance, and satisfaction scores. The treasurer's ask: "I want to know what worked and where we wasted money."

### What You Build

- A JTBD (Jobs-to-be-Done) statement for the treasurer
- A condensed **story-to-prompt mapping** for this scenario (at least 3 table rows referencing `student_council_budget.csv` + one annotated scaffold prompt)
- A Streamlit dashboard with KPI cards, interactive charts, and a recommendation
- Verified data traceability with assertions and manual tracing

**Data file:** Use `challenge-data/student_council_budget.csv` in this week's folder.

### Part 1: Architecture & Design

1. **JTBD statement:** Write a Jobs-to-be-Done statement for the treasurer:
   > "When I [situation], I want to [motivation], so I can [expected outcome]."
2. **Story-to-prompt mapping:** Before writing any code, produce a shortened version of the Component A artifact.

### Part 2: Implementation

Build your **Streamlit** dashboard:
- Load `student_council_budget.csv`
- **KPI cards** that set the context for your data story
- **Interactive charts** with at least 1 filter
- **1 data-backed recommendation** sentence with evidence from the data
- Layout and metrics should match the structure and choices you specified in your story-to-prompt mapping and JTBD

### Part 3: Testing & Validation

1. **Manual trace:** Pick one data point and manually verify it matches the CSV. Document the row number and value.
2. **Assert statements** (2 minimum):
   - Verify total spending sums to expected amount
   - Verify no negative attendance values
3. **PRIMM on one chart:** If you used AI to generate a chart, apply PRIMM — predict what the chart will show, run it, investigate any surprises.

---

## Submission
Submit on Github classroom.

### Component A Deliverables

- **Interview notes with JTBD statement** -- interview scripts/notes plus one JTBD statement following the pattern: "When [interviewee] is [situation], they want to [motivation] so they can [outcome]"
- **Story-to-prompt mapping document** -- mapping table plus one annotated scaffold prompt, tied to interview notes or JTBD (see Component A)

### Component B Deliverables

1. **Story paragraph** explaining what the dashboard reveals and what action your interviewee should take (this should also appear in your dashboard's Recommendation section)

### Component C Deliverables

1. **Architecture diagram** from C.2 exercise (hand-drawn photo or digital)
2. **Design Decision Log** entry from C.3

### Component D Deliverables

1. **Validation results** from D.1 exercise (completed recording template) — include asserts from all four categories, and ensure they match your submitted dashboard code and pass
2. Submit the codebase you build for interviewee to Github classroom. Make sure the code is reproducible by following your README.md.

### Component E Deliverables

1. **Budget Byte Streamlit app** in your repo — loads `challenge-data/student_council_budget.csv` (or a copy with a documented path); KPI cards, at least one interactive chart with a filter, and one data-backed recommendation. If you use a **separate** entrypoint (e.g. `budget_byte_app.py`), document the `streamlit run ...` command in your README.
2. **Design artifacts for the treasurer scenario** — JTBD statement, story-to-prompt table.
3. **Testing evidence** — manual trace (row number + value from the CSV), the two required assert statements in code, and a short **PRIMM** note on one chart (predict / run / investigate)

### AI Usage Log -- Level 2: Evaluative

Document 3 AI interactions from today. For each interaction:
- **What you prompted:** The exact prompt or request you gave the AI
- **What it produced:** Summary of the AI's output
- **Your evaluation:** Was the AI's output correct? What did you fix? Evaluate the AI's output against a ground truth -- documentation, test results, or your own domain knowledge. Note any claims the AI made that you had to verify, correct, or reject.
- **Verification method:** How did you verify correctness? (e.g., ran the code, checked docs, tested with assert statements, manual calculation)

### Reflection note

3-5 sentences (see [Reflection](#reflection) section below)

---

## Reflection

Answer the following questions in 3-5 sentences total. Include your reflection as a comment in your code and in your submission.

1. **How did the JTBD statement from the interview change your dashboard design?** Did hearing the interviewee's actual words shift what you chose to visualize or how you arranged the layout?

2. **Did your assert statements catch any bugs?** If so, what went wrong and how did you fix it? If not, did writing them change how you thought about your data transformations? 

3. **What story does your dashboard tell?** 
