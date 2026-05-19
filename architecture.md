# ARCHITECTURE.md - MedAssist Mobile

## Overview

MedAssist Mobile is a Next.js web app that converts an AR hospital navigation concept into a phone-first, elderly-friendly experience. The phone becomes the main assistive device for purpose input, camera recognition, wayfinding, doctor-speech-to-task conversion, material preparation, rest support, and caregiver updates.

## System Components

| Layer | Technology | Purpose |
|------|------------|---------|
| Frontend | Next.js App Router, React, TypeScript | Mobile-first interactive hospital visit guide |
| Backend | Next.js API routes | Receives help, rest, and completion events |
| Database | Supabase PostgreSQL | Stores visits, visit steps, and support events |
| Hosting | Vercel | Public deployment and automatic production builds from `main` |

## AR-to-Mobile Translation

| Original AR Function | Mobile Web Equivalent |
|----------------------|-----------------------|
| Directly-ahead navigation ring | Large route card with current destination and repeatable directions |
| Outer ring document scanning | Continuous phone recognition for paper slips, QR codes, queue screens, and signs |
| Wrist-area material reminder | Materials checklist before each task |
| Operation ring | Automatic task boundary prompts with confirmation only when needed |
| Bracelet vibration | Voice-style text prompts, high-contrast alerts, and optional caregiver notifications |
| Deviation alert | Wrong-way warning state in the route card |
| Rest prompt | Route pause mode with safety message |
| Doctor conversation | Listen-to-doctor flow that converts instructions into executable tasks |

## Main User Flow

1. Patient opens the public MedAssist URL on a phone.
2. Patient enters or speaks the reason for the visit.
3. Patient holds the phone up while walking; the app recognizes documents, signs, queue screens, and turns.
4. App shows destination, route instruction, and required materials automatically.
5. During consultation, the phone can convert doctor instructions into executable tasks.
6. Patient confirms only when needed, or taps rest/help if something goes wrong.
7. Help/rest/staff events are logged through `/api/help-event`.
8. Future caregiver dashboard can read events from Supabase.

## Database

The schema is defined in `supabase/schema.sql`.

- `care_visits`: patient visit metadata.
- `visit_steps`: ordered route and task guidance.
- `help_events`: support events created by the mobile interface.

## Production Configuration

Environment variables are documented in `.env.example`.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

`SUPABASE_SERVICE_ROLE_KEY` must only be configured in secure hosting settings, never committed to the repository.
