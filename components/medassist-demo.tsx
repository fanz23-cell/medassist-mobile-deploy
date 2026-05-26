"use client";

import { useRef, useState } from "react";
import { detectStart } from "@/lib/medassist";

type Zone = "direct" | "outer" | "wrist" | "operation" | "inner";
type Persona = "first" | "dependent" | "experienced" | "overwhelmed";
type ActionKind = "input" | "scan" | "navigate" | "prepare" | "operate" | "listen" | "wait" | "confirm" | "finish";

type FlowStep = {
  id: string;
  stage: string;
  title: string;
  place: string;
  zone: Zone;
  kind: ActionKind;
  main: string;
  detail: string;
  primary: string;
  helper: string;
  materials?: string[];
  quick?: string[];
  recognized?: string;
  nextId?: string;
};

const personas: Record<Persona, { label: string; detail: string }> = {
  first: { label: "First-time", detail: "Full guidance, confirmations, and clear operating prompts." },
  dependent: { label: "Dependent", detail: "Extra document checks and family-readable progress notes." },
  experienced: { label: "Experienced", detail: "Fewer explanations, faster route and deviation prompts." },
  overwhelmed: { label: "Overwhelmed", detail: "Shorter copy, larger actions, and proactive rest support." }
};

const zoneLabels: Record<Zone, string> = {
  direct: "Directly Ahead",
  outer: "Outer Ring",
  wrist: "Wrist Area",
  operation: "Operation Ring",
  inner: "Inner Ring"
};

const flowSteps: FlowStep[] = [
  {
    id: "reason",
    stage: "Start",
    title: "Why are you here today?",
    place: "Hospital Entrance",
    zone: "direct",
    kind: "input",
    main: "Tell MedAssist the reason for this visit.",
    detail: "Type, speak, or upload a hospital paper. The app will choose the safest next step.",
    primary: "Find My First Step",
    helper: "Replaces the AR destination recognition moment with a phone-first intake screen.",
    quick: ["First-time registration", "Follow-up report", "Blood test", "Pick up medicine", "Knee pain"]
  },
  {
    id: "destination-from-paper",
    stage: "Obtain Destination Information",
    title: "Scan the paper you have",
    place: "Hospital Entrance",
    zone: "inner",
    kind: "scan",
    main: "Photograph the appointment code, registration slip, or message.",
    detail: "MedAssist looks for department, floor, room, time, and whether registration is still needed.",
    primary: "Confirm Destination",
    helper: "Document Scanning + Guidance Arrow from the AR concept.",
    quick: ["Appointment SMS", "Registration slip", "Medical card", "No paper"],
    recognized: "Recognized: Internal Medicine, 3F West Side. Please register first.",
    nextId: "nav-registration"
  },
  {
    id: "nav-registration",
    stage: "Registration",
    title: "Go to registration",
    place: "1F Registration Window",
    zone: "outer",
    kind: "navigate",
    main: "Follow the cyan route to the registration window.",
    detail: "Only the route stays visible while walking. If you turn the wrong way, the phone shows a deviation alert.",
    primary: "I Arrived",
    helper: "Outer Ring navigation becomes a focused phone route.",
    materials: ["ID card", "Medical card", "Appointment code"],
    quick: ["I am lost", "Sign is unclear", "Need rest"]
  },
  {
    id: "prepare-registration",
    stage: "Registration",
    title: "Prepare these materials",
    place: "Before the Window",
    zone: "wrist",
    kind: "prepare",
    main: "Take out only the items needed now.",
    detail: "Tap each item when ready. If unsure, photograph it and MedAssist checks whether it is correct.",
    primary: "Materials Ready",
    helper: "Material Preparation from the wrist area becomes a large checklist.",
    materials: ["ID card", "Medical card", "Appointment code"],
    quick: ["Check ID", "Check card", "Check code"]
  },
  {
    id: "staff-registration",
    stage: "Registration",
    title: "Listen to the staff",
    place: "Registration Window",
    zone: "direct",
    kind: "listen",
    main: "Start listening. The next handover appears in large text.",
    detail: "MedAssist converts staff speech into simple instructions: what to give now and what to keep.",
    primary: "Staff Finished",
    helper: "Communication prompts for hearing and cognitive support.",
    recognized: "Staff says: please provide ID card, medical card, and appointment code. Keep the registration slip.",
    quick: ["Repeat", "Show phone to staff", "I cannot hear"]
  },
  {
    id: "scan-registration-slip",
    stage: "Registration",
    title: "Scan the new slip",
    place: "Registration Window",
    zone: "inner",
    kind: "scan",
    main: "Photograph the registration slip you just received.",
    detail: "The app extracts department, floor, triage area, queue number, and payment needs.",
    primary: "Go to Triage",
    helper: "Turns paper information into the next executable route.",
    recognized: "Recognized: 3F West Side Internal Medicine. Complete triage before waiting.",
    quick: ["Retake", "Ask family", "Unreadable"]
  },
  {
    id: "nav-triage",
    stage: "Navigate to Consultation",
    title: "Go to 3F West Side triage",
    place: "3F West Side Triage",
    zone: "outer",
    kind: "navigate",
    main: "Take the elevator and follow the cyan arrow to triage.",
    detail: "At each corridor fork, the screen keeps only the next turn.",
    primary: "At Triage",
    helper: "Destination Instruction + Navigation Line.",
    materials: ["Registration slip", "Medical card"],
    quick: ["Find elevator", "Wrong way", "Need rest"]
  },
  {
    id: "operate-triage-machine",
    stage: "Guide Through Triage",
    title: "Use the triage machine",
    place: "Triage Machine",
    zone: "operation",
    kind: "operate",
    main: "Follow the operation ring one step at a time.",
    detail: "1. Scan slip. 2. Confirm name. 3. Print queue number.",
    primary: "Queue Number Printed",
    helper: "Operation Ring appears only when the task is in reach.",
    materials: ["Registration slip", "Queue ticket"],
    quick: ["Scan machine", "Ask staff", "I am stuck"]
  },
  {
    id: "record-queue",
    stage: "Ready for Triage",
    title: "Save your queue number",
    place: "Waiting Area",
    zone: "direct",
    kind: "confirm",
    main: "Tell MedAssist your queue number or scan the ticket.",
    detail: "The number remains saved so you do not need to remember it.",
    primary: "Start Waiting",
    helper: "Reduces memory load during long waiting periods.",
    recognized: "Saved: A128. Please wait near Room 318.",
    quick: ["A128", "Scan ticket", "I forgot"]
  },
  {
    id: "wait-consultation",
    stage: "Medical Consultation",
    title: "Rest and wait",
    place: "Waiting Area",
    zone: "direct",
    kind: "wait",
    main: "Sit down and wait for A128.",
    detail: "The interface becomes quiet. When your number is called, MedAssist switches to the room route.",
    primary: "Simulate Number Called",
    helper: "Low-stimulation waiting mode for overwhelmed visitors.",
    quick: ["Rest area", "Call family", "I missed it"]
  },
  {
    id: "nav-doctor-room",
    stage: "Medical Consultation",
    title: "Go to Room 318",
    place: "Room 318",
    zone: "outer",
    kind: "navigate",
    main: "A128 has been called. Walk to Room 318.",
    detail: "The route is short and specific so you do not search nearby rooms.",
    primary: "Enter Room",
    helper: "Micro-navigation from waiting area to consultation room.",
    materials: ["Registration slip", "Medical record", "Previous results"],
    quick: ["Door sign unclear", "Find room"]
  },
  {
    id: "doctor-recording",
    stage: "Medical Consultation",
    title: "Record the doctor",
    place: "Room 318",
    zone: "direct",
    kind: "listen",
    main: "Place the phone on the desk and record the doctor instructions.",
    detail: "Checks, payment, follow-up, and medication tasks become the next route plan.",
    primary: "Doctor Finished",
    helper: "Route planning after consultation.",
    recognized: "Doctor says: pay first, go to 2F Lab for blood test, then bring the result back.",
    quick: ["Save note", "Show family", "Doctor spoke fast"]
  },
  {
    id: "scan-doctor-order",
    stage: "Route Planning",
    title: "Scan the doctor order",
    place: "Outside Room 318",
    zone: "inner",
    kind: "scan",
    main: "Photograph the test order or payment sheet.",
    detail: "MedAssist checks whether you should pay first or go directly to the lab.",
    primary: "Plan Lab Route",
    helper: "Transforms paper into action.",
    recognized: "Recognized: Blood test. Pay at Kiosk B, then go to 2F Lab.",
    quick: ["Test order", "Payment bill", "Unreadable"]
  },
  {
    id: "nav-payment",
    stage: "Medical Test",
    title: "Go to payment kiosk",
    place: "Self-service Kiosk B",
    zone: "outer",
    kind: "navigate",
    main: "Go to Kiosk B before the lab.",
    detail: "Material reminders appear only when you approach the machine.",
    primary: "At Kiosk",
    helper: "Late material preparation prevents overload while walking.",
    materials: ["Test order", "Medical card", "Payment code"],
    quick: ["Find cashier", "Need rest", "Cannot pay"]
  },
  {
    id: "operate-payment",
    stage: "Medical Test",
    title: "Pay step by step",
    place: "Self-service Kiosk B",
    zone: "operation",
    kind: "operate",
    main: "1. Choose Pay Fees. 2. Scan card. 3. Scan payment code.",
    detail: "Tap next only after each machine action is done.",
    primary: "Payment Done",
    helper: "Supports unfamiliar operating methods.",
    materials: ["Receipt", "Test order"],
    quick: ["Scan screen", "Payment failed", "Ask staff"]
  },
  {
    id: "nav-lab",
    stage: "Medical Test",
    title: "Go to the lab",
    place: "2F Lab",
    zone: "outer",
    kind: "navigate",
    main: "Bring the order and receipt to the lab.",
    detail: "If the route is long, MedAssist suggests a rest point.",
    primary: "At Lab",
    helper: "Navigation with physical fatigue support.",
    materials: ["Test order", "Receipt", "Medical card"],
    quick: ["I am tired", "Wrong way", "Find elevator"]
  },
  {
    id: "lab-submit",
    stage: "Medical Test",
    title: "Submit lab materials",
    place: "Lab Window",
    zone: "operation",
    kind: "operate",
    main: "Give the order and receipt, then wait for sample collection.",
    detail: "If the counter or queue screen is unclear, photograph it for guidance.",
    primary: "Sample Collected",
    helper: "Material presentation + action instruction.",
    materials: ["Test order", "Receipt"],
    quick: ["Scan counter", "Scan queue screen", "Which line?"]
  },
  {
    id: "scan-lab-result",
    stage: "Follow-up Consultation",
    title: "Scan the lab result",
    place: "Lab Area",
    zone: "inner",
    kind: "scan",
    main: "Photograph the result after it is ready.",
    detail: "The app decides whether to return to the doctor, continue testing, or go to pharmacy.",
    primary: "Return to Doctor",
    helper: "Converts result paper into a next destination.",
    recognized: "Recognized: result ready. Return to Room 318.",
    quick: ["Result not ready", "Scan result", "Ask staff"]
  },
  {
    id: "nav-return-doctor",
    stage: "Follow-up Consultation",
    title: "Return to Room 318",
    place: "Room 318",
    zone: "outer",
    kind: "navigate",
    main: "Take the lab result back to the doctor.",
    detail: "The screen keeps only the return route and required papers.",
    primary: "Enter Follow-up",
    helper: "Route planning after multiple tasks.",
    materials: ["Lab result", "Medical record", "Registration slip"],
    quick: ["Need rest", "Find room"]
  },
  {
    id: "followup-recording",
    stage: "Follow-up Consultation",
    title: "Record follow-up advice",
    place: "Room 318",
    zone: "direct",
    kind: "listen",
    main: "Record the doctor again.",
    detail: "If medicine is prescribed, MedAssist switches to pharmacy pickup.",
    primary: "Doctor Finished",
    helper: "Keeps planning through the full visit.",
    recognized: "Doctor says: pick up medicine at Pharmacy Counter 5 and follow dosage instructions.",
    quick: ["Save dosage", "Ask question", "Show family"]
  },
  {
    id: "scan-prescription",
    stage: "Retrieve Medication",
    title: "Scan the prescription",
    place: "Outside Room 318",
    zone: "inner",
    kind: "scan",
    main: "Photograph the prescription.",
    detail: "MedAssist extracts pharmacy floor, counter, payment status, and pickup number.",
    primary: "Go to Pharmacy",
    helper: "Turns prescription into pickup route and window task.",
    recognized: "Recognized: 2F Pharmacy Counter 5. Pickup number A128.",
    quick: ["Prescription", "Receipt", "Unreadable"]
  },
  {
    id: "nav-pharmacy",
    stage: "Retrieve Medication",
    title: "Go to Pharmacy Counter 5",
    place: "2F Pharmacy",
    zone: "outer",
    kind: "navigate",
    main: "Follow the route to Pharmacy Counter 5.",
    detail: "When you arrive, the app switches from navigation to counter handover.",
    primary: "At Pharmacy",
    helper: "Automatic mode switch from route to task.",
    materials: ["Prescription", "Receipt", "Medical card"],
    quick: ["Find counter", "Need rest"]
  },
  {
    id: "pharmacy-pickup",
    stage: "Retrieve Medication",
    title: "Pick up and check medicine",
    place: "Counter 5",
    zone: "operation",
    kind: "operate",
    main: "Give the prescription and receipt. Check name, medicine, and dosage.",
    detail: "If the dosage is unclear, photograph the label for large-text explanation.",
    primary: "Medicine Received",
    helper: "Final material presentation and action instruction.",
    materials: ["Prescription", "Receipt", "Medicine"],
    quick: ["Scan dosage", "Ask pharmacist", "Call family"]
  },
  {
    id: "finish",
    stage: "Finished",
    title: "You can leave the hospital",
    place: "Exit",
    zone: "direct",
    kind: "finish",
    main: "The visit is complete.",
    detail: "Keep medicine, receipts, test results, and personal belongings.",
    primary: "Start Again",
    helper: "The phone completes the AR system loop.",
    quick: ["View dosage", "Send to family", "Finish"]
  }
];

const stepIndexById = new Map(flowSteps.map((step, index) => [step.id, index]));

export function MedAssistDemo() {
  const [stepId, setStepId] = useState("reason");
  const [persona, setPersona] = useState<Persona>("first");
  const [input, setInput] = useState("");
  const [captured, setCaptured] = useState("");
  const [readyMaterials, setReadyMaterials] = useState<string[]>([]);
  const [isResting, setIsResting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const currentIndex = stepIndexById.get(stepId) ?? 0;
  const step = flowSteps[currentIndex];
  const progress = Math.round((currentIndex / (flowSteps.length - 1)) * 100);
  const allReady = (step.materials ?? []).every((item) => readyMaterials.includes(item));

  function logHelpEvent(eventType: "step_completed" | "rest_requested" | "staff_help" | "family_update", note?: string) {
    void fetch("/api/help-event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        visitId: "demo-visit",
        stepId: step.id,
        eventType,
        note: note ?? step.title
      })
    }).catch(() => {
      // The user flow should continue even if analytics/database logging is unavailable.
    });
  }

  function goTo(id: string) {
    setStepId(id);
    setReadyMaterials([]);
    setCaptured("");
    setIsResting(false);
  }

  function goNext() {
    logHelpEvent("step_completed");

    if (step.id === "reason") {
      goTo(detectStart(input));
      return;
    }

    if (step.id === "finish") {
      setInput("");
      goTo("reason");
      return;
    }

    if (step.nextId) {
      goTo(step.nextId);
      return;
    }

    goTo(flowSteps[Math.min(currentIndex + 1, flowSteps.length - 1)].id);
  }

  function handleFile(file: File | undefined) {
    if (!file) return;
    setCaptured(`Uploaded: ${file.name}`);
    if (step.id === "reason") goTo("destination-from-paper");
  }

  function toggleMaterial(item: string) {
    setReadyMaterials((items) =>
      items.includes(item) ? items.filter((value) => value !== item) : [...items, item]
    );
  }

  return (
    <div className="medassist-app">
      <header className="app-header">
        <div>
          <span>MedAssist</span>
          <strong>{step.stage}</strong>
        </div>
        <button onClick={() => { logHelpEvent("rest_requested"); setIsResting(true); }} type="button">
          Rest
        </button>
      </header>

      <div className="progress-track" aria-label={`${progress}% complete`}>
        <span style={{ width: `${Math.max(5, progress)}%` }} />
      </div>

      {step.id === "reason" ? (
        <main className="screen intro-screen">
          <p className="screen-kicker">Mobile Hospital Companion</p>
          <h1>{step.title}</h1>
          <p>{step.detail}</p>
          <textarea
            aria-label="Visit purpose"
            autoFocus
            onChange={(event) => setInput(event.target.value)}
            placeholder="Example: I am here for my first registration and knee pain."
            value={input}
          />
          <div className="quick-grid">
            {step.quick?.map((item) => (
              <button key={item} onClick={() => setInput(item)} type="button">
                {item}
              </button>
            ))}
          </div>
          <div className="bottom-actions inline-actions">
            <button className="secondary-action" onClick={() => fileRef.current?.click()} type="button">
              Upload Paper
            </button>
            <button className="primary-action" onClick={goNext} type="button">
              {step.primary}
            </button>
          </div>
        </main>
      ) : (
        <main className={`screen task-screen zone-${step.zone}`}>
          <section className="glass-card current-task">
            <div className="zone-label">
              <span>{zoneLabels[step.zone]}</span>
              <span>{step.place}</span>
            </div>
            <p className="screen-kicker">{step.kind}</p>
            <h1>{step.title}</h1>
            <p>{step.main}</p>
          </section>

          {step.kind === "navigate" && (
            <section className="navigation-view">
              <div className="route-arch">
                <span>Go to</span>
                <strong>{step.place}</strong>
              </div>
              <div className="route-board">
                {["Entrance", "Register", "Triage", "Waiting", "Room", "Pay", "Lab", "Pharmacy"].map((point, index) => (
                  <span className={index <= Math.min(Math.floor(currentIndex / 3), 7) ? "active" : ""} key={point}>
                    {point}
                  </span>
                ))}
              </div>
              <p>{step.detail}</p>
            </section>
          )}

          {step.kind === "prepare" && (
            <section className="material-view">
              {step.materials?.map((item) => (
                <button className={readyMaterials.includes(item) ? "ready" : ""} key={item} onClick={() => toggleMaterial(item)} type="button">
                  <strong>{item}</strong>
                  <span>{readyMaterials.includes(item) ? "Ready" : "Tap when ready"}</span>
                </button>
              ))}
            </section>
          )}

          {step.kind !== "navigate" && step.kind !== "prepare" && (
            <section className="action-view">
              <p>{step.detail}</p>
              {step.recognized && <strong>{captured || step.recognized}</strong>}
              {(step.kind === "scan" || step.kind === "listen") && (
                <button
                  className="spotlight-action"
                  onClick={() => step.kind === "scan" ? fileRef.current?.click() : setCaptured(step.recognized ?? "Voice note captured.")}
                  type="button"
                >
                  {step.kind === "scan" ? "Scan Now" : "Start Listening"}
                </button>
              )}
            </section>
          )}

          {step.materials && step.kind !== "prepare" && (
            <section className="wrist-materials">
              <span>Materials</span>
              {step.materials.map((item) => (
                <button key={item} onClick={() => toggleMaterial(item)} type="button">
                  {item}
                </button>
              ))}
            </section>
          )}

          <section className="support-panel">
            <div>
              <strong>{personas[persona].label} visitor</strong>
              <p>{personas[persona].detail}</p>
            </div>
            <div className="persona-row">
              {(Object.keys(personas) as Persona[]).map((key) => (
                <button className={persona === key ? "selected" : ""} key={key} onClick={() => setPersona(key)} type="button">
                  {personas[key].label}
                </button>
              ))}
            </div>
          </section>

          {step.quick && (
            <section className="quick-grid compact-grid">
              {step.quick.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    if (item.toLowerCase().includes("rest") || item.toLowerCase().includes("tired")) {
                      logHelpEvent("rest_requested", item);
                      setIsResting(true);
                      return;
                    }

                    if (item.toLowerCase().includes("family")) {
                      logHelpEvent("family_update", item);
                    }

                    if (item.toLowerCase().includes("staff")) {
                      logHelpEvent("staff_help", item);
                    }

                    setCaptured(`Selected: ${item}`);
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </section>
          )}
        </main>
      )}

      <input
        accept="image/*"
        hidden
        onChange={(event) => handleFile(event.target.files?.[0])}
        ref={fileRef}
        type="file"
      />

      {isResting && (
        <aside className="rest-sheet">
          <p className="screen-kicker">Rest Reminder</p>
          <h2>Pause and find the nearest seat.</h2>
          <p>The visit flow is paused. Resume when you feel ready.</p>
          <button className="primary-action" onClick={() => setIsResting(false)} type="button">
            Resume Visit
          </button>
        </aside>
      )}

      <footer className="flow-footer">
        {currentIndex > 0 && (
          <button className="secondary-action" onClick={() => goTo(flowSteps[Math.max(currentIndex - 1, 0)].id)} type="button">
            Back
          </button>
        )}
        <button className="primary-action" disabled={step.kind === "prepare" && !allReady} onClick={goNext} type="button">
          {step.kind === "prepare" && !allReady ? "Confirm Materials First" : step.primary}
        </button>
      </footer>
    </div>
  );
}
