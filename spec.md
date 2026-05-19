# SPEC.md - MedAssist Mobile

## Product Summary

MedAssist Mobile is a phone-based hospital visit companion for elderly patients who may need to visit large hospitals alone. The project reinterprets the original AR glasses and smart bracelet concept as a deployable mobile web app.

## Core Problem

Older patients often face several overlapping difficulties during hospital visits:

- Hospital buildings are large and hard to navigate.
- Treatment workflows contain many steps and dependencies.
- Paper slips, QR codes, machines, and queue screens create information overload.
- Patients may have reduced vision, hearing, memory, mobility, or confidence.
- Existing volunteers and signage help, but do not provide continuous personal guidance.

## Product Goal

Guide an older patient through the whole visit with one clear next action at a time. The patient should not need to frequently operate the phone. They only intervene when necessary: entering or speaking their purpose, placing a document in front of the camera, uploading a photo, confirming a safety-critical step, requesting rest/help, or letting the phone listen to the doctor.

The product preserves the original MedAssist functions:

- Destination scanning
- Document/environment image upload
- Typed or voice-transcribed fallback input
- Route guidance
- Deviation alerts
- Material preparation
- Task reminders
- Machine-operation support
- Doctor-speech-to-task conversion
- Rest support
- Staff and caregiver escalation
- Visit summary for family

## User Stories

### 1. Guided Visit Flow

As an elderly patient, I want to see the current step and the next action, so that I do not need to remember the whole medical process at once.

Acceptance criteria:

- The visit is broken into registration, triage, consultation, payment, test, and pharmacy steps.
- Each step shows place, time, instruction, reason, and required materials.
- The patient can mark a step complete and move forward.
- The app can advance automatically when recognition is confident.

### 2. Document and Destination Scanning

As an elderly patient, I want to scan or identify my paper slip, QR code, or department sign, so that I know where to go next.

Acceptance criteria:

- The prototype includes a scanning state.
- The user can upload a document/environment image.
- The user can type or paste recognized text when OCR is not available.
- The inferred result updates the current step with destination and materials.
- The interface explains which document/sign clues drove the decision.
- The patient does not need to manually choose a mode for every scan.

### 3. Doctor Speech to Tasks

As an elderly patient, I want the phone to listen when the doctor gives instructions, so that the instructions become simple tasks I can follow after leaving the consultation room.

Acceptance criteria:

- The prototype includes a listening state.
- Doctor instructions are represented as follow-up tasks.
- The tasks connect to payment, lab, return consultation, and medication pickup.

### 4. Route Guidance and Deviation Alert

As an elderly patient, I want phone-based wayfinding, so that I can reach the next department without relying only on signs.

Acceptance criteria:

- The app shows a simplified route card.
- The app can repeat directions.
- The app can warn the patient if they may be going the wrong way.

### 5. Material Preparation

As an elderly patient, I want to know which card, receipt, or record to hold before each counter or machine, so that I do not delay the line or miss a required item.

Acceptance criteria:

- Each step lists required materials.
- The patient can see all materials before confirming arrival.
- Missing-material support is available through staff help.

### 6. Rest and Emergency Support

As an elderly patient with limited physical energy, I want to pause the route or request staff help, so that I can continue safely.

Acceptance criteria:

- The patient can tap a rest button.
- The interface changes to a paused safety state.
- Staff help and caregiver update events can be logged.

## Data Model

See `supabase/schema.sql`.

Main tables:

- `care_visits`: one scheduled hospital visit.
- `visit_steps`: ordered tasks within a visit.
- `help_events`: support, rest, staff help, and completion events.
