# MedAssist Mobile

MedAssist Mobile is an elderly-friendly web companion for solo hospital visits. It translates the original AR glasses and smart bracelet concept into a low-operation phone workflow: the patient enters or speaks why they came to the hospital, uploads or shows a document/sign, and receives the next safe action.

## Live URL

Production URL: https://lucky-pika-a040f3.netlify.app/

## Project Roles

| Role | Name |
|------|------|
| Client / Proposer | Youqian Cui |
| Developer | Fan Zhang |

## What This Web App Does

- Guides an older patient through registration, triage, consultation, lab tests, return visits, and pharmacy pickup.
- Keeps one current step on screen, with a fake hospital map, large buttons, and a simple rest mode.
- Accepts typed text, uploaded photos, simulated voice input, documents, and hospital environment prompts.
- Detects the next step from common hospital words and phrases such as registration, triage, waiting, doctor, lab, report, and pharmacy.
- Keeps a running record of recent inputs so the family or helper can see what the patient just told the app.
- Logs support events through a backend route so a future caregiver dashboard can track progress.
- Uses Supabase schema files for production database setup.

## Tech Stack

- Frontend: Next.js, React, TypeScript
- Backend: Next.js API route at `/api/help-event`
- Database: Supabase PostgreSQL, schema in `supabase/schema.sql`
- Deployment target: Netlify with automatic production builds from the public deployment repository `main` branch

## Local Development

1. Install Node.js 20+.
2. Install dependencies:

```bash
npm install
```

3. Copy environment variables:

```bash
cp .env.example .env.local
```

4. Fill in Supabase values in `.env.local` if database logging is needed. The prototype still runs in mock mode without them.
5. Start the dev server:

```bash
npm run dev
```

6. Open `http://localhost:3000`.

## Environment Variables

Real secrets must stay in `.env.local` locally and in Netlify Environment Variables for production. Do not commit `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deployment Plan

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Push the app code to the public deployment repository used for hosting.
3. Import the public deployment repository into Netlify.
4. Set the production branch to `main`.
5. Add the three environment variables from `.env.example` in Netlify Project Configuration.
6. Deploy. Netlify automatically creates a production build whenever new code is merged into `main`.
7. Open the deployed URL in a fresh browser or phone and test the main flow:
   - Open the homepage.
   - Type a visit purpose or upload a photo.
   - Confirm the app moves to the right hospital step.
   - Try the sample inputs for registration, triage, waiting, consultation, lab, and pharmacy.
   - Toggle rest mode and confirm the screen switches to the nearest rest stop.
   - Confirm the page works without localhost.
8. Copy the final live URL into the Live URL section above and into your final handoff note.

## Current MVP Limits

This version can preview uploaded images and infer next steps from typed or simulated recognized text. Full automatic OCR, real speech-to-text, indoor positioning, and hospital-specific maps require additional APIs and hospital data.

## Inputs To Support

The app is designed around these live inputs:

- Text: the patient explains the reason for the visit.
- Photo: registration slip, triage sheet, queue screen, order form, lab result, prescription, or pharmacy sign.
- Voice: doctor or staff instructions, later connected to speech-to-text.
- Paper: any hospital form or printed slip.
- Environment: room signs, window signs, and waiting-area signs.

## Developer-03 Checklist

- [x] Frontend deployed to stable public hosting.
- [x] Backend API route deployed with the same Netlify app.
- [x] Supabase database created from `supabase/schema.sql`.
- [x] Automatic production build workflow added for `main`.
- [x] `.env.example` added without real secrets.
- [x] Production URL added to this README after deployment.
- [x] Public URL verified on a fresh browser.

## Handoff Notes

Live URL for Proposer Final Acceptance Testing: https://lucky-pika-a040f3.netlify.app/

Verified on a fresh browser after deployment: homepage loads, the visit-purpose intake advances into the guided flow, and rest mode opens correctly.
