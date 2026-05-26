# Developer-04 Submission Notes

## Project

MedAssist Mobile: an elderly-friendly phone web app that converts the original AR glasses and smart bracelet hospital guidance concept into a deployable mobile experience.

Live production URL: https://lucky-pika-a040f3.netlify.app/

## What Changed

- Rebuilt the app around the MedAssist mobile product instead of the previous scaffold.
- Added an interactive low-operation phone prototype driven by purpose input, image upload, typed/voice-transcribed hospital text, rule-based next-step inference, doctor-task conversion, and emergency controls.
- Added backend route `/api/help-event` for completion, rest, staff help, and family update events.
- Replaced the database schema with MedAssist visit, step, and help-event tables.
- Updated `.env.example`, README, SPEC, and architecture documentation for deployment.
- Fixed Chinese intent detection for visit intake so medicine pickup, lab, and follow-up phrases route correctly.
- Added 6 automated tests with `node:test` covering intent detection, help-event payload validation, and mock-mode response shaping.
- Added a security review summary for environment variables and API input validation.

## Original AR Functions Converted to Phone Functions

| AR / Bracelet Function | Mobile Web Function |
|------------------------|--------------------|
| Destination scanning | Patient uploads or holds paper slips, QR codes, queue screens, or signs in front of the phone |
| Navigation ring | Automatic phone route guidance with simplified map and next-turn guidance |
| Deviation alert | Wrong-turn simulation and correction message |
| Wrist material reminders | Required materials checklist on every step |
| Operation ring | Automatic task boundary prompts for counter, kiosk, lab, and pharmacy actions |
| Doctor instructions | Voice listening converts consultation instructions into executable tasks |
| Bracelet vibration | Large text, voice-style prompts, rest pause, and help buttons only when needed |
| Care support | Staff help, call family, and caregiver progress panel |

## Local Testing

```bash
npm install
npm test
npm run typecheck
npm run build
npm run dev
```

Manual smoke test:

1. Open `http://localhost:3000`.
2. Click `Try the Phone Guide`.
3. Enter a visit purpose and current place.
4. Upload an image or choose a sample document.
5. Edit the recognized text and confirm the next action changes.
6. Use voice input / doctor instruction sample.
7. Try tired mode and staff help.

## Deployment Checklist

- [x] Create Supabase project.
- [x] Run `supabase/schema.sql`.
- [x] Import public deployment repo into Netlify.
- [x] Set production branch to `main`.
- [x] Add environment variables from `.env.example`.
- [x] Deploy public URL.
- [x] Add public URL to README.
- [x] Verify URL on a fresh browser.
- [x] Add automated tests and security checks for Developer-04.
