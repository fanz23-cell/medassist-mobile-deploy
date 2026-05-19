# MedAssist Mobile

MedAssist Mobile is an elderly-friendly web companion for solo hospital visits. It translates the original AR glasses and smart bracelet concept into a low-operation phone workflow: the patient enters or speaks why they came to the hospital, uploads or shows a document/sign, and receives the next safe action.

## Live URL

Production URL: To be added after Vercel deployment.

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
- Deployment target: Vercel with automatic production builds from `main`

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

Real secrets must stay in `.env.local` locally and in Vercel Environment Variables for production. Do not commit `.env.local`.

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Deployment Plan

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Import this GitHub repository into Vercel.
3. Set the production branch to `main`.
4. Add the three environment variables from `.env.example` in Vercel Project Settings.
5. Deploy. Vercel automatically creates a production build whenever new code is merged into `main`.
6. Open the deployed URL in a fresh browser or phone and test the main flow:
   - Open the homepage.
   - Type a visit purpose or upload a photo.
   - Confirm the app moves to the right hospital step.
   - Try the sample inputs for registration, triage, waiting, consultation, lab, and pharmacy.
   - Toggle rest mode and confirm the screen switches to the nearest rest stop.
   - Confirm the page works without localhost.
7. Copy the final live URL into the Live URL section above and into your final handoff note.

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

- [ ] Frontend deployed to stable public hosting.
- [ ] Backend API route deployed with the same Vercel app.
- [ ] Supabase database created from `supabase/schema.sql`.
- [x] Automatic production build workflow added for `main`.
- [x] `.env.example` added without real secrets.
- [ ] Production URL added to this README after deployment.
- [ ] Public URL verified on a fresh device or browser.

## Handoff Notes

After deployment, share the live URL with the Proposer and verify the first screen, document scan flow, and rest mode on a fresh device or incognito browser.
