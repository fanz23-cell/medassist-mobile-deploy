"use client";

import { useMemo, useRef, useState } from "react";

type StepKind =
  | "input"
  | "scan"
  | "map"
  | "materials"
  | "listen"
  | "operate"
  | "queue"
  | "wait"
  | "finish";

type StageName =
  | "Start"
  | "Registration"
  | "Triage"
  | "Waiting"
  | "Consultation"
  | "Tests"
  | "Pharmacy"
  | "Complete";

type MapVariant = "registration" | "triage" | "doctor" | "payment" | "lab" | "pharmacy";
type RestTarget = "rest" | "wc" | "water" | "vend" | "help";

type Insight = {
  source: "Image scan" | "Voice note" | "Queue record";
  title: string;
  doctorAdvice?: string[];
  nextAction?: string;
  nextPlace?: string;
  medication?: string[];
  followUp?: string[];
  questions?: string[];
  answeredQuestions?: string[];
  routeStops?: string[];
};

type CarePlan = {
  doctorAdvice: string[];
  tests: string[];
  medication: string[];
  followUp: string[];
  answeredQuestions: string[];
  openQuestions: string[];
};

type AiPayload = {
  title: string;
  doctorAdvice: string[];
  nextAction: string;
  nextPlace: string;
  medication: string[];
  questions: string[];
  routeStops?: string[];
  error?: string;
};

type Step = {
  id: string;
  stage: StageName;
  title: string;
  place: string;
  kind: StepKind;
  instruction: string;
  primary: string;
  mapVariant?: MapVariant;
  materials?: string[];
  scanResult?: {
    title: string;
    details: string[];
    nextAction: string;
    nextPlace: string;
    doctorAdvice?: string[];
    medication?: string[];
  };
  listenResult?: {
    title: string;
    doctorAdvice: string[];
    nextAction: string;
    nextPlace: string;
    questions: string[];
    followUpAnswer?: string[];
    medication?: string[];
  };
};

const steps: Step[] = [
  {
    id: "purpose",
    stage: "Start",
    title: "Tell us why you are here",
    place: "Hospital entrance",
    kind: "input",
    instruction: "Type one simple sentence about what you came to the hospital for today.",
    primary: "Start visit"
  },
  {
    id: "scan-start",
    stage: "Start",
    title: "Scan your appointment paper or message",
    place: "Hospital entrance",
    kind: "scan",
    instruction: "Upload an appointment message, registration slip, QR code screenshot, or paper document. The system will identify where to go next.",
    primary: "Confirm next step",
    scanResult: {
      title: "Appointment information found",
      details: ["Department: Internal Medicine", "Floor: 1F, right side", "Next: registration counter"],
      nextAction: "Go to the registration counter",
      nextPlace: "1F Registration Counter"
    }
  },
  {
    id: "registration-map",
    stage: "Registration",
    title: "Go to the registration counter",
    place: "1F Registration Counter",
    kind: "map",
    mapVariant: "registration",
    instruction: "Follow the blue route to the registration counter.",
    primary: "I am at registration"
  },
  {
    id: "registration-materials",
    stage: "Registration",
    title: "Prepare registration documents",
    place: "At the registration counter",
    kind: "materials",
    instruction: "Tap each item after you have it ready.",
    primary: "Documents are ready",
    materials: ["ID card", "Insurance card / hospital card", "Appointment message / code"]
  },
  {
    id: "registration-listen",
    stage: "Registration",
    title: "Listen to the counter staff",
    place: "Registration counter",
    kind: "listen",
    instruction: "Type or paste what the staff said. The system will pull out the key points.",
    primary: "Staff finished speaking",
    listenResult: {
      title: "Counter instructions identified",
      doctorAdvice: ["Hand your ID, insurance card, and appointment code to the counter", "Keep the new registration slip after registration"],
      nextAction: "Scan the new registration slip",
      nextPlace: "Registration counter",
      questions: []
    }
  },
  {
    id: "registration-slip",
    stage: "Registration",
    title: "Scan the new registration slip",
    place: "Registration counter",
    kind: "scan",
    instruction: "Scan the slip you just received. The system will find the triage location and queue information.",
    primary: "Go to triage",
    scanResult: {
      title: "Registration slip identified",
      details: ["Triage location: 3F West Triage Desk", "Queue number: A128", "Next: triage desk"],
      nextAction: "Go to the triage desk",
      nextPlace: "3F West Triage Desk"
    }
  },
  {
    id: "triage-map",
    stage: "Triage",
    title: "Go to the triage desk",
    place: "3F West Triage Desk",
    kind: "map",
    mapVariant: "triage",
    instruction: "Take the elevator to 3F, then follow the blue route to triage.",
    primary: "I am at triage"
  },
  {
    id: "triage-operate",
    stage: "Triage",
    title: "Use the triage machine",
    place: "Beside the triage machine",
    kind: "operate",
    instruction: "Follow the screen prompts, scan the registration slip, confirm the name, and print the queue number.",
    primary: "Queue number printed"
  },
  {
    id: "queue-record",
    stage: "Waiting",
    title: "Save your queue number",
    place: "Waiting area",
    kind: "queue",
    instruction: "Enter the queue number so the app can keep it visible.",
    primary: "Start waiting"
  },
  {
    id: "queue-wait",
    stage: "Waiting",
    title: "Wait for your number",
    place: "Waiting area",
    kind: "wait",
    instruction: "Sit down and watch the screen or listen for the announcement.",
    primary: "My number was called"
  },
  {
    id: "doctor-map",
    stage: "Consultation",
    title: "Go to the consultation room",
    place: "Room 318",
    kind: "map",
    mapVariant: "doctor",
    instruction: "Follow the blue route to Room 318.",
    primary: "I am at the room"
  },
  {
    id: "doctor-listen",
    stage: "Consultation",
    title: "Record the doctor instructions",
    place: "Room 318",
    kind: "listen",
    instruction: "Type or paste what the doctor said. The system will separate care advice, where to go next, and questions to ask.",
    primary: "Doctor finished speaking",
    listenResult: {
      title: "Doctor instructions identified",
      doctorAdvice: ["The doctor says a blood test is needed first", "After results are ready, bring the report back to Room 318"],
      nextAction: "Pay first, then go to 2F Laboratory for blood draw",
      nextPlace: "Self-service Payment Machine B",
      questions: ["Do I need to fast before the blood test?", "How long will the result take?", "If the result is abnormal, should I return today?"],
      followUpAnswer: ["Doctor added: fasting is not required this time", "Doctor added: results should be ready in about 1 hour", "Doctor added: return to Room 318 today if the result is abnormal"]
    }
  },
  {
    id: "doctor-order",
    stage: "Tests",
    title: "Scan the doctor order",
    place: "Outside the consultation room",
    kind: "scan",
    instruction: "Upload the test order or payment slip. The system will tell you where to go first.",
    primary: "Go to payment or test",
    scanResult: {
      title: "Doctor order identified",
      details: ["Test: blood draw", "Next: pay first", "Then: laboratory"],
      nextAction: "Pay first",
      nextPlace: "Self-service Payment Machine B"
    }
  },
  {
    id: "payment-map",
    stage: "Tests",
    title: "Go to the payment machine",
    place: "Self-service Payment Machine B",
    kind: "map",
    mapVariant: "payment",
    instruction: "Go to Payment Machine B. The blue route shows the shortest path.",
    primary: "I am at payment"
  },
  {
    id: "payment-operate",
    stage: "Tests",
    title: "Complete payment",
    place: "Self-service Payment Machine B",
    kind: "operate",
    instruction: "Follow the screen prompts to finish payment, then continue.",
    primary: "Payment completed"
  },
  {
    id: "lab-map",
    stage: "Tests",
    title: "Go to the laboratory",
    place: "2F Laboratory",
    kind: "map",
    mapVariant: "lab",
    instruction: "Take the elevator to 2F, then follow the blue route to the laboratory window.",
    primary: "I am at the lab"
  },
  {
    id: "lab-operate",
    stage: "Tests",
    title: "Submit lab documents",
    place: "Laboratory window",
    kind: "operate",
    instruction: "Give the test order and receipt to the staff, then wait for sampling.",
    primary: "Sample collected"
  },
  {
    id: "lab-result",
    stage: "Tests",
    title: "Scan test results",
    place: "Near the laboratory",
    kind: "scan",
    instruction: "After you receive the result, upload it. The system will decide whether you need to return to the doctor.",
    primary: "Return to the doctor",
    scanResult: {
      title: "Test result identified",
      details: ["Status: completed", "Next: return to Room 318", "Bring the report and medical record"],
      nextAction: "Return to Room 318 for follow-up",
      nextPlace: "Room 318"
    }
  },
  {
    id: "doctor-return-map",
    stage: "Consultation",
    title: "Return to the consultation room",
    place: "Room 318",
    kind: "map",
    mapVariant: "doctor",
    instruction: "Follow the route back to Room 318 and give the result to the doctor.",
    primary: "Start follow-up"
  },
  {
    id: "followup-listen",
    stage: "Consultation",
    title: "Record follow-up advice",
    place: "Room 318",
    kind: "listen",
    instruction: "Type or paste the doctor's advice about medication, care, and follow-up time.",
    primary: "Follow-up finished",
    listenResult: {
      title: "Follow-up advice identified",
      doctorAdvice: ["Rest at home and eat light meals", "Return promptly if chest tightness or dizziness gets worse"],
      nextAction: "Scan the prescription or pickup slip, then go to the pharmacy",
      nextPlace: "2F Pharmacy Window 5",
      questions: ["How many days should I take the medicine?", "What should I do if I miss a dose?", "When should I come back for follow-up?"],
      followUpAnswer: ["Doctor added: take the prescription for 7 days first", "Doctor added: do not double the dose if you miss one", "Doctor added: return in 7 days with the test result"]
    }
  },
  {
    id: "prescription",
    stage: "Pharmacy",
    title: "Scan prescription or pickup slip",
    place: "Outside the consultation room",
    kind: "scan",
    instruction: "Upload the prescription or pickup slip. The system will identify the medicine and pickup location.",
    primary: "Go to pharmacy",
    scanResult: {
      title: "Medication pickup slip identified",
      details: ["Pharmacy: 2F Pharmacy Window 5", "Pickup number: A128", "Next: pick up medicine"],
      nextAction: "Go to the pharmacy to pick up medicine",
      nextPlace: "2F Pharmacy Window 5",
      medication: ["Blood pressure medicine: once every morning", "Stomach medicine: twice daily after meals"]
    }
  },
  {
    id: "pharmacy-map",
    stage: "Pharmacy",
    title: "Go to the pharmacy",
    place: "2F Pharmacy Window 5",
    kind: "map",
    mapVariant: "pharmacy",
    instruction: "Follow the blue route to Pharmacy Window 5.",
    primary: "I am at the pharmacy"
  },
  {
    id: "pharmacy-operate",
    stage: "Pharmacy",
    title: "Pick up and check medicine",
    place: "Pharmacy Window 5",
    kind: "operate",
    instruction: "Check the medicine name, quantity, and dosing time. Ask the pharmacist right away if anything is unclear.",
    primary: "Medicine received"
  },
  {
    id: "pharmacy-listen",
    stage: "Pharmacy",
    title: "Record pharmacist instructions",
    place: "Pharmacy Window 5",
    kind: "listen",
    instruction: "Ask the pharmacist how to take each medicine. The system will separate medicine instructions from the next step.",
    primary: "Pharmacist finished speaking",
    listenResult: {
      title: "Pharmacist instructions identified",
      doctorAdvice: ["After receiving medicine, check patient name, medicine name, and quantity"],
      medication: ["Blood pressure medicine: 1 tablet every morning", "Stomach medicine: twice daily after breakfast and dinner", "Do not change dose or stop medicine by yourself"],
      nextAction: "Leave the hospital and take medicine as instructed",
      nextPlace: "Hospital exit",
      questions: ["Can these medicines be taken together?", "What should I do if I feel unwell after taking them?"],
      followUpAnswer: ["Pharmacist added: the medicines can be taken on the same day as instructed", "Pharmacist added: if you feel clearly unwell, stop and contact the hospital"]
    }
  },
  {
    id: "finish",
    stage: "Complete",
    title: "Visit summary",
    place: "Hospital exit",
    kind: "finish",
    instruction: "Review the most important items: care advice, medicine instructions, and follow-up timing.",
    primary: "Start over"
  }
];

function restAreaForStage(stage: StageName) {
  const areas: Record<StageName, string> = {
    Start: "Rest area near entrance",
    Registration: "Seats in registration hall",
    Triage: "Seats near triage desk",
    Waiting: "Nearest waiting seat",
    Consultation: "Waiting area outside room",
    Tests: "Seats near laboratory",
    Pharmacy: "Seats outside pharmacy",
    Complete: "Rest spot near exit"
  };
  return areas[stage];
}

function mapInfo(step: Step) {
  const map: Record<MapVariant, { main: string; sub: string }> = {
    registration: { main: `Go to ${step.place}`, sub: "Walk straight, then turn right" },
    triage: { main: `Go to ${step.place}`, sub: "Take the elevator, then turn left" },
    doctor: { main: `Go to ${step.place}`, sub: "Follow the blue route" },
    payment: { main: `Go to ${step.place}`, sub: "Pay before the test" },
    lab: { main: `Go to ${step.place}`, sub: "Bring the order and receipt" },
    pharmacy: { main: `Go to ${step.place}`, sub: "Pick up medicine at the window" }
  };
  return map[step.mapVariant ?? "doctor"];
}

function restRouteFor(target: RestTarget) {
  const routes: Record<RestTarget, { title: string; path: string; points: string }> = {
    rest: {
      title: "Nearest rest area",
      path: "M 110 210 L 430 210 L 430 90 L 1040 90",
      points: "Current location -> straight ahead -> upper-right rest area"
    },
    wc: {
      title: "Nearest restroom",
      path: "M 110 210 L 430 210 L 430 360 L 1040 360",
      points: "Current location -> straight ahead -> lower-right restroom"
    },
    water: {
      title: "Nearest water station",
      path: "M 110 210 L 210 210 L 210 88",
      points: "Current location -> upper-left water station"
    },
    vend: {
      title: "Vending machine",
      path: "M 110 210 L 210 210 L 210 360",
      points: "Current location -> lower-left vending machine"
    },
    help: {
      title: "Nearest help desk",
      path: "M 110 210 L 430 210 L 430 180 L 650 180",
      points: "Current location -> straight ahead -> help desk"
    }
  };
  return routes[target];
}

function cleanSummaryItems(items: string[]) {
  return items.filter(Boolean);
}

function notesFromInsight(stepId: string, insight: Insight): string[] {
  const notes: string[] = [];
  const add = (value?: string) => {
    if (value && notes.length < 3) notes.push(value);
  };

  if (stepId === "scan-start") {
    add(insight.nextAction);
    add(insight.nextPlace ? `Location: ${insight.nextPlace}` : undefined);
    add("Use the appointment information for registration");
  }

  if (stepId === "registration-listen") {
    add("Hand over ID, insurance card, and appointment code");
    add("Keep the new registration slip");
  }

  if (stepId === "registration-slip") {
    add("Go to the 3F West Triage Desk");
    add("Queue number: A128");
  }

  if (stepId === "doctor-order") {
    add(insight.doctorAdvice?.[0] || "Check whether payment is required first");
    add((insight.doctorAdvice || []).find((item) => item.toLowerCase().includes("fast")) || "For blood draw, check whether fasting is needed");
    add(insight.nextAction);
  }

  if (stepId === "doctor-listen") {
    add((insight.doctorAdvice || [])[0]);
    add((insight.doctorAdvice || [])[1]);
    add(insight.nextAction);
  }

  if (stepId === "lab-result") {
    add("The result is ready. Remember to take it with you");
    add("Return to Room 318 for follow-up");
  }

  if (stepId === "followup-listen") {
    add((insight.doctorAdvice || [])[0]);
    add((insight.doctorAdvice || [])[1]);
    add("Follow up as instructed");
  }

  if (stepId === "prescription") {
    add(`Pickup location: ${insight.nextPlace || "Pharmacy"}`);
    add((insight.medication || [])[0]);
    add("Check medicine name and quantity");
  }

  if (stepId === "pharmacy-listen") {
    add((insight.medication || [])[0]);
    add((insight.medication || [])[1]);
    add("Confirm times per day and before/after meals");
  }

  return notes.slice(0, 3);
}

function routeStopsFromInsight(stepId: string, insight: Insight): string[] {
  const stops = new Set<string>();
  const add = (value?: string) => {
    if (value) stops.add(value);
  };

  add(insight.nextPlace);
  if (stepId === "doctor-order") {
    add("Self-service Payment Machine B");
    add("2F Laboratory Window");
  }
  if (stepId === "lab-result") add("Room 318");
  if (stepId === "prescription") add("2F Pharmacy Window 5");
  if (stepId === "pharmacy-listen") add("Hospital exit");

  return Array.from(stops).slice(0, 4);
}

function destinationForMap(step: Step, routeQueue: string[]) {
  return routeQueue[0] || step.place;
}

function hospitalPointFor(place: string) {
  const text = (place || "target").toLowerCase();
  if (text.includes("registration") || text.includes("挂号")) return { x: 900, y: 128 };
  if (text.includes("triage") || text.includes("分诊")) return { x: 800, y: 104 };
  if (text.includes("318") || text.includes("room") || text.includes("诊室")) return { x: 930, y: 88 };
  if (text.includes("payment") || text.includes("缴费")) return { x: 775, y: 286 };
  if (text.includes("lab") || text.includes("laboratory") || text.includes("化验")) return { x: 245, y: 92 };
  if (text.includes("pharmacy") || text.includes("药房")) return { x: 930, y: 312 };
  if (text.includes("exit") || text.includes("出口")) return { x: 1050, y: 224 };
  const seed = Array.from(text).reduce((total, char) => total + char.charCodeAt(0), 0);
  return { x: 260 + (seed % 660), y: 86 + ((seed * 7) % 250) };
}

function hospitalRoutePath(place: string) {
  const target = hospitalPointFor(place);
  const midX = Math.max(230, Math.min(980, target.x - 140));
  return {
    target,
    path: `M 92 242 L ${midX} 242 L ${midX} ${target.y} L ${target.x} ${target.y}`
  };
}

function resolveFollowUpAdditions(stepId: string, question: string) {
  const text = question.toLowerCase().replace(/\s+/g, "");
  if (stepId === "pharmacy-listen") {
    if (text.includes("together") || text.includes("一起吃")) return ["Pharmacist added: the medicines can be taken on the same day as instructed"];
    if (text.includes("unwell") || text.includes("不舒服")) return ["Pharmacist added: if you feel clearly unwell, stop taking it and contact the hospital"];
    return ["Pharmacist added: take medicine according to the label time and frequency"];
  }

  if (text.includes("fast") || text.includes("空腹")) return ["Doctor added: fasting is not required for this blood test"];
  if (text.includes("result") || text.includes("多久")) return ["Doctor added: results should be ready in about 1 hour"];
  if (text.includes("follow") || text.includes("abnormal") || text.includes("复诊")) return ["Doctor added: return to Room 318 today if the result is abnormal"];
  if (text.includes("days") || text.includes("几天")) return ["Doctor added: take the prescription for 7 days first"];
  if (text.includes("miss") || text.includes("漏服")) return ["Doctor added: do not double the dose if one dose is missed"];
  if (text.includes("unwell") || text.includes("不舒服")) return ["Doctor added: if you feel clearly unwell, stop and contact the hospital"];
  return ["Doctor added: follow the instructions and return if anything feels abnormal"];
}

export function MedAssistDemo() {
  const [stepIndex, setStepIndex] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [uploadedName, setUploadedName] = useState("");
  const [speechText, setSpeechText] = useState("");
  const [aiError, setAiError] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [listened, setListened] = useState(false);
  const [queueNumber, setQueueNumber] = useState("A128");
  const [readyMaterials, setReadyMaterials] = useState<string[]>([]);
  const [resting, setResting] = useState(false);
  const [restTarget, setRestTarget] = useState<RestTarget>("rest");
  const [modalMode, setModalMode] = useState<"rest" | "help">("rest");
  const [asking, setAsking] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [questionInsight, setQuestionInsight] = useState<AiPayload | null>(null);
  const [questionFileName, setQuestionFileName] = useState("");
  const [insight, setInsight] = useState<Insight | null>(null);
  const [stageNotes, setStageNotes] = useState<Partial<Record<StageName, string[]>>>({});
  const [routeQueue, setRouteQueue] = useState<string[]>([]);
  const [followUpQueue, setFollowUpQueue] = useState<string[]>([]);
  const [followUpAnimating, setFollowUpAnimating] = useState<string | null>(null);
  const [carePlan, setCarePlan] = useState<CarePlan>({
    doctorAdvice: [],
    tests: [],
    medication: [],
    followUp: [],
    answeredQuestions: [],
    openQuestions: []
  });
  const fileRef = useRef<HTMLInputElement>(null);
  const questionFileRef = useRef<HTMLInputElement>(null);

  const step = steps[stepIndex];
  const progress = Math.round(((stepIndex + 1) / steps.length) * 100);
  const allMaterialsReady = (step.materials ?? []).every((item) => readyMaterials.includes(item));
  const canContinue = step.kind !== "materials" || allMaterialsReady;
  const currentMap = step.kind === "map" ? mapInfo(step) : null;
  const currentRouteTarget = destinationForMap(step, routeQueue);
  const activeRestArea = useMemo(() => restAreaForStage(step.stage), [step.stage]);
  const currentNotes = (stageNotes[step.stage] ?? []).slice(0, 3);

  function resetTransientState(nextIndex: number) {
    setStepIndex(nextIndex);
    setUploadedName("");
    setSpeechText("");
    setAiError("");
    setIsAnalyzing(false);
    setListened(false);
    setFollowUpQueue([]);
    setFollowUpAnimating(null);
    setReadyMaterials([]);
    setResting(false);
    setModalMode("rest");
    setAsking(false);
    setQuestionText("");
    setQuestionInsight(null);
    setQuestionFileName("");
    setInsight(null);
  }

  function goNext() {
    if (step.kind === "materials" && !allMaterialsReady) return;
    if (step.kind === "finish") {
      setPurpose("");
      setQueueNumber("A128");
      setInsight(null);
      setRouteQueue([]);
      setCarePlan({
        doctorAdvice: [],
        tests: [],
        medication: [],
        followUp: [],
        answeredQuestions: [],
        openQuestions: []
      });
      setStageNotes({});
      resetTransientState(0);
      return;
    }
    resetTransientState(Math.min(stepIndex + 1, steps.length - 1));
  }

  function goBack() {
    resetTransientState(Math.max(stepIndex - 1, 0));
  }

  function appendUnique(list: string[], next: string[]) {
    return Array.from(new Set([...list, ...cleanSummaryItems(next)]));
  }

  function updateStageNotes(nextInsight: Insight) {
    const notes = notesFromInsight(step.id, nextInsight);
    if (!notes.length) return;
    setStageNotes((current) => ({ ...current, [step.stage]: notes }));
  }

  function updateRouteQueue(nextInsight: Insight) {
    const stops = routeStopsFromInsight(step.id, nextInsight);
    setRouteQueue(stops.length ? stops : nextInsight.nextPlace ? [nextInsight.nextPlace] : []);
  }

  function absorbInsightIntoSummary(stepId: string, nextInsight: Insight) {
    setCarePlan((plan) => ({
      ...plan,
      doctorAdvice: appendUnique(plan.doctorAdvice, nextInsight.doctorAdvice ?? []),
      medication: appendUnique(plan.medication, nextInsight.medication ?? []),
      tests: stepId === "doctor-order" ? appendUnique(plan.tests, [nextInsight.nextAction ?? "Complete the test ordered by the doctor"]) : plan.tests,
      followUp:
        stepId === "lab-result"
          ? appendUnique(plan.followUp, ["Return to Room 318 after the test"])
          : stepId === "pharmacy-listen"
            ? appendUnique(plan.followUp, ["Take medicine as the pharmacist explained"])
            : plan.followUp,
      answeredQuestions: appendUnique(plan.answeredQuestions, nextInsight.answeredQuestions ?? []),
      openQuestions: appendUnique(plan.openQuestions, nextInsight.questions ?? [])
    }));
  }

  function applyPayload(payload: AiPayload, source: Insight["source"]) {
    const nextInsight: Insight = {
      source,
      title: payload.title,
      doctorAdvice: payload.doctorAdvice,
      nextAction: payload.nextAction,
      nextPlace: payload.nextPlace,
      medication: payload.medication,
      questions: payload.questions,
      routeStops: payload.routeStops
    };
    setInsight(nextInsight);
    setFollowUpQueue(payload.questions);
    updateStageNotes(nextInsight);
    updateRouteQueue(nextInsight);
    absorbInsightIntoSummary(step.id, nextInsight);
  }

  async function handleUpload(file: File | undefined) {
    if (!file) return;
    setUploadedName(file.name);
    setAiError("");
    setIsAnalyzing(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("stepTitle", step.title);
      formData.append("place", step.place);
      const response = await fetch("/api/analyze-image", { method: "POST", body: formData });
      const payload = (await response.json()) as AiPayload;
      if (!response.ok) throw new Error(payload.error || "Image analysis failed");
      applyPayload(payload, "Image scan");
      return;
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Image analysis failed");
    } finally {
      setIsAnalyzing(false);
    }

    if (!step.scanResult) return;
    applyPayload(
      {
        title: step.scanResult.title,
        doctorAdvice: step.scanResult.doctorAdvice ?? [],
        nextAction: step.scanResult.nextAction,
        nextPlace: step.scanResult.nextPlace,
        medication: step.scanResult.medication ?? [],
        questions: []
      },
      "Image scan"
    );
  }

  async function handleQuestionUpload(file: File | undefined) {
    if (!file) return;
    setQuestionFileName(file.name);
    setAiError("");
    setIsAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("stepTitle", step.title);
      formData.append("place", step.place);
      const response = await fetch("/api/analyze-image", { method: "POST", body: formData });
      const payload = (await response.json()) as AiPayload;
      if (!response.ok) throw new Error(payload.error || "Image analysis failed");
      setQuestionInsight(payload);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Image analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleQuestionSubmit() {
    if (!questionText.trim()) return;
    setAiError("");
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/analyze-text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: questionText, stepTitle: step.title, place: step.place })
      });
      const payload = (await response.json()) as AiPayload;
      if (!response.ok) throw new Error(payload.error || "Question analysis failed");
      setQuestionInsight(payload);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Question analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleListen() {
    setListened(true);
    setAiError("");
    if (speechText.trim()) {
      setIsAnalyzing(true);
      try {
        const response = await fetch("/api/analyze-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: speechText, stepTitle: step.title, place: step.place })
        });
        const payload = (await response.json()) as AiPayload;
        if (!response.ok) throw new Error(payload.error || "Voice note analysis failed");
        applyPayload(payload, "Voice note");
        return;
      } catch (error) {
        setAiError(error instanceof Error ? error.message : "Voice note analysis failed");
      } finally {
        setIsAnalyzing(false);
      }
    }

    if (!step.listenResult) return;
    applyPayload(
      {
        title: step.listenResult.title,
        doctorAdvice: step.listenResult.doctorAdvice,
        nextAction: step.listenResult.nextAction,
        nextPlace: step.listenResult.nextPlace,
        medication: step.listenResult.medication ?? [],
        questions: step.listenResult.questions
      },
      "Voice note"
    );
  }

  function startFollowUpRecording(question: string) {
    setFollowUpAnimating(question);
    window.setTimeout(() => {
      const additions = resolveFollowUpAdditions(step.id, question);
      setInsight((current) =>
        current
          ? {
              ...current,
              doctorAdvice: appendUnique(current.doctorAdvice ?? [], additions),
              answeredQuestions: appendUnique(current.answeredQuestions ?? [], additions)
            }
          : current
      );
      setCarePlan((plan) => ({
        ...plan,
        doctorAdvice: appendUnique(plan.doctorAdvice, additions),
        answeredQuestions: appendUnique(plan.answeredQuestions, additions),
        openQuestions: plan.openQuestions.filter((item) => item !== question)
      }));
      setFollowUpQueue((items) => items.filter((item) => item !== question));
      setFollowUpAnimating(null);
    }, 360);
  }

  function toggleMaterial(item: string) {
    setReadyMaterials((items) => (items.includes(item) ? items.filter((ready) => ready !== item) : [...items, item]));
  }

  function submitQueueNumber() {
    const queueInsight: Insight = {
      source: "Queue record",
      title: "Queue number saved",
      nextAction: "Keep waiting for your number",
      nextPlace: "Waiting area"
    };
    setInsight(queueInsight);
    updateStageNotes(queueInsight);
  }

  const summarySource = cleanSummaryItems(carePlan.doctorAdvice);
  const summaryMedication = cleanSummaryItems(carePlan.medication);
  const summaryFollowUp = cleanSummaryItems(carePlan.followUp);

  return (
    <div className="elder-app">
      <header className="elder-header">
        <button
          className="header-action"
          onClick={() => {
            setResting(true);
            setModalMode("rest");
            setRestTarget("rest");
          }}
          type="button"
        >
          Rest
        </button>
        <button
          className="header-action"
          onClick={() => {
            setAsking(true);
            setQuestionInsight(null);
            setQuestionText("");
          }}
          type="button"
        >
          Question
        </button>
        <button
          className="header-action"
          onClick={() => {
            setResting(true);
            setModalMode("help");
            setRestTarget("help");
          }}
          type="button"
        >
          Help
        </button>
      </header>

      <section className="elder-progress" aria-label={`Current progress ${progress}%`}>
        <div className="progress-top">
          <span>
            Stage {step.stage} · Step {stepIndex + 1}
          </span>
          <strong>{activeRestArea}</strong>
        </div>
        <i style={{ width: `${progress}%` }} />
        {currentNotes.length ? (
          <div className="goal-chip">
            <span>Reminder</span>
            {currentNotes.map((item) => (
              <strong key={item}>{item}</strong>
            ))}
          </div>
        ) : null}
      </section>

      <main className="elder-screen">
        <section className="main-column">
          <p className="elder-place">{step.place}</p>
          <h1>{step.title}</h1>
          <p className="elder-instruction">{step.instruction}</p>

          {step.kind === "input" && (
            <section className="elder-panel">
              <label htmlFor="purpose">Visit purpose</label>
              <textarea
                id="purpose"
                onChange={(event) => setPurpose(event.target.value)}
                placeholder="Example: internal medicine / blood test / medicine pickup"
                value={purpose}
              />
              <div className="elder-samples">
                {["Internal medicine", "Blood test", "Follow-up", "Pick up medicine"].map((item) => (
                  <button key={item} onClick={() => setPurpose(item)} type="button">
                    {item}
                  </button>
                ))}
              </div>
            </section>
          )}

          {step.kind === "scan" && (
            <section className="elder-panel scan-panel">
              <button className="upload-button" onClick={() => fileRef.current?.click()} type="button">
                {isAnalyzing ? "Analyzing..." : "Upload image"}
              </button>
              <input accept="image/*" hidden onChange={(event) => handleUpload(event.target.files?.[0])} ref={fileRef} type="file" />
              {uploadedName && insight ? (
                <div className="scan-cards">
                  <div className="scan-card compact">
                    <span>Care advice</span>
                    {insight.doctorAdvice?.length ? (
                      <div className="scroll-list">
                        {insight.doctorAdvice.map((item) => (
                            <p key={item}>- {item}</p>
                          ))}
                      </div>
                    ) : (
                      <p>No care advice found.</p>
                    )}
                  </div>
                  <div className="scan-card compact">
                    <span>Next place</span>
                    <strong>{insight.nextAction}</strong>
                    {insight.nextPlace ? <p>{insight.nextPlace}</p> : null}
                  </div>
                  {insight.medication?.length ? (
                    <div className="scan-card compact">
                      <span>Medicine</span>
                      <div className="scroll-list">
                        {insight.medication.map((item) => (
                          <p key={item}>- {item}</p>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="empty-card">Upload an image to see the result.</div>
              )}
              {aiError ? <div className="ai-error">{aiError}</div> : null}
            </section>
          )}

          {step.kind === "map" && currentMap && (
            <section className="elder-map-panel">
              <div className="map-copy">
                <strong>{currentMap.main}</strong>
                <strong>{currentMap.sub}</strong>
              </div>
              <div className="simple-map hospital-map" data-variant={step.mapVariant}>
                {(() => {
                  const route = hospitalRoutePath(currentRouteTarget);
                  return (
                    <>
                      <svg className="hospital-route-svg" viewBox="0 0 1200 420" aria-hidden="true">
                        <path d={route.path} />
                      </svg>
                      <span className="you" style={{ left: "74px", top: "212px" }}>
                        You
                      </span>
                      <span className="pin" style={{ left: `${route.target.x - 18}px`, top: `${route.target.y - 18}px` }} />
                      <span className="route-start" />
                      <span className="route-end" style={{ left: `${route.target.x - 12}px`, top: `${route.target.y - 12}px` }} />
                    </>
                  );
                })()}
              </div>
            </section>
          )}

          {step.kind === "materials" && (
            <section className="elder-panel material-panel">
              {step.materials?.map((item) => (
                <button className={readyMaterials.includes(item) ? "ready" : ""} key={item} onClick={() => toggleMaterial(item)} type="button">
                  {readyMaterials.includes(item) ? "✓ " : ""}
                  {item}
                </button>
              ))}
              {!allMaterialsReady && <p>Please tap all required items before continuing.</p>}
            </section>
          )}

          {step.kind === "listen" && (
            <section className="elder-panel listen-panel">
              <textarea
                className="speech-input"
                onChange={(event) => setSpeechText(event.target.value)}
                placeholder="Paste what the doctor, staff, or pharmacist said."
                value={speechText}
              />
              <button className="upload-button" onClick={handleListen} type="button">
                {isAnalyzing ? "Summarizing..." : speechText.trim() ? "Analyze" : "Use sample note"}
              </button>
              {aiError ? <div className="ai-error">{aiError}</div> : null}
              {listened && insight ? (
                <>
                  <div className="listen-grid">
                    <div className="scan-card compact">
                      <span>Care advice</span>
                      {insight.doctorAdvice?.length ? (
                        <div className="scroll-list">
                          {insight.doctorAdvice.map((item) => (
                            <p key={item}>- {item}</p>
                          ))}
                        </div>
                      ) : (
                        <p>No care advice found.</p>
                      )}
                    </div>
                    <div className="scan-card compact">
                      <span>Next place</span>
                      <strong>{insight.nextAction}</strong>
                      {insight.nextPlace ? <p>{insight.nextPlace}</p> : null}
                    </div>
                  </div>
                  {followUpQueue.length ? (
                    <div className="tiny-followup-strip">
                      <strong>Ask next</strong>
                      <div className="followup-tags">
                        {followUpQueue.map((question) => (
                          <button
                            key={question}
                            className={`question-pill${followUpAnimating === question ? " selected" : ""}`}
                            onClick={() => startFollowUpRecording(question)}
                            type="button"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </>
              ) : (
                <div className="empty-card">Record once. Results will appear here.</div>
              )}
            </section>
          )}

          {step.kind === "operate" && (
            <section className="elder-panel simple-panel">
              <strong>Follow the screen slowly.</strong>
              <p>If needed, tap Rest or Help.</p>
            </section>
          )}

          {step.kind === "queue" && (
            <section className="elder-panel">
              <label htmlFor="queue">Queue number</label>
              <input id="queue" onChange={(event) => setQueueNumber(event.target.value)} value={queueNumber} />
              <button className="upload-button" onClick={submitQueueNumber} type="button">
                Save queue number
              </button>
            </section>
          )}

          {step.kind === "wait" && (
            <section className="elder-panel simple-panel">
              <strong>Wait for your number.</strong>
              <p>Queue: {queueNumber}</p>
            </section>
          )}

          {step.kind === "finish" && (
            <section className="elder-panel summary-panel">
              <strong>Visit summary</strong>
              <div className="summary-block">
                <p>Care: {cleanSummaryItems(summarySource).slice(0, 1).join("; ") || "Rest and follow the doctor's advice."}</p>
                <p>Medicine: {cleanSummaryItems(summaryMedication).slice(0, 1).join("; ") || "Take medicine as labeled."}</p>
                <p>Follow-up: {cleanSummaryItems(summaryFollowUp).slice(0, 1).join("; ") || "Return on time."}</p>
              </div>
              <div className="summary-footer">
                <p>Rest, take medicine on time, and return as instructed.</p>
              </div>
            </section>
          )}
        </section>
      </main>

      <footer className="elder-actions">
        <button disabled={stepIndex === 0} onClick={goBack} type="button">
          Back
        </button>
        <button disabled={!canContinue} onClick={goNext} type="button">
          {step.kind === "materials" && !allMaterialsReady ? "Prepare first" : step.primary}
        </button>
      </footer>

      {resting && (
        <div className="rest-modal-backdrop" role="dialog" aria-modal="true" aria-label={modalMode === "rest" ? "Rest navigation" : "Staff help navigation"}>
          <div className="rest-modal">
            <section className="rest-map-panel">
              <div className="rest-map-top">
                <strong>{restRouteFor(restTarget).title}</strong>
                <span>{restRouteFor(restTarget).points}</span>
              </div>
              <div className="rest-map" data-target={restTarget}>
                <svg className="rest-route-svg" viewBox="0 0 1200 480" aria-hidden="true">
                  <path d={restRouteFor(restTarget).path} />
                </svg>
                <span className="rest-road rest-road-x" />
                <span className="rest-road rest-road-y" />
                <span className="rest-you">You</span>
                {modalMode === "rest" ? (
                  <>
                    <button className={`amenity amenity-seat${restTarget === "rest" ? " selected" : ""}`} onClick={() => setRestTarget("rest")} type="button">
                      Rest
                    </button>
                    <button className={`amenity amenity-wc${restTarget === "wc" ? " selected" : ""}`} onClick={() => setRestTarget("wc")} type="button">
                      WC
                    </button>
                    <button className={`amenity amenity-water${restTarget === "water" ? " selected" : ""}`} onClick={() => setRestTarget("water")} type="button">
                      Water
                    </button>
                    <button className={`amenity amenity-vend${restTarget === "vend" ? " selected" : ""}`} onClick={() => setRestTarget("vend")} type="button">
                      Shop
                    </button>
                  </>
                ) : (
                  <button className="amenity amenity-elevator selected" onClick={() => setRestTarget("help")} type="button">
                    Help
                  </button>
                )}
              </div>
            </section>
            <div className="rest-action">
              <button onClick={() => setResting(false)} type="button">
                {modalMode === "rest" ? "Continue" : "Done"}
              </button>
            </div>
          </div>
        </div>
      )}

      {asking && (
        <div className="rest-modal-backdrop" role="dialog" aria-modal="true" aria-label="Ask a question">
          <div className="rest-modal question-modal">
            <div className="rest-map-top">
              <strong>Ask a Question</strong>
              <span>Image + question</span>
            </div>
            <div className="question-layout">
              <div className="question-panel">
                <button className="upload-button" onClick={() => questionFileRef.current?.click()} type="button">
                  Upload image
                </button>
                <input accept="image/*" hidden onChange={(event) => handleQuestionUpload(event.target.files?.[0])} ref={questionFileRef} type="file" />
                <textarea
                  className="question-input"
                  onChange={(event) => setQuestionText(event.target.value)}
                  placeholder="What is this, where am I now, and what comes next?"
                  value={questionText}
                />
                <button className="upload-button" onClick={handleQuestionSubmit} type="button">
                  Analyze
                </button>
                {questionFileName ? <div className="question-file">Selected image: {questionFileName}</div> : null}
                {aiError ? <div className="ai-error">{aiError}</div> : null}
              </div>
              {questionInsight ? (
                <div className="question-result">
                  <div className="scan-card compact">
                    <span>What it is</span>
                    <strong>{questionInsight.title}</strong>
                  </div>
                  <div className="scan-card compact">
                    <span>Current stage</span>
                    <strong>{step.stage}</strong>
                  </div>
                  <div className="scan-card compact">
                    <span>Next step</span>
                    <strong>{questionInsight.nextAction}</strong>
                    {questionInsight.nextPlace ? <p>{questionInsight.nextPlace}</p> : null}
                  </div>
                  <div className="scan-card compact">
                    <span>Key points</span>
                    <div className="scroll-list">
                      {questionInsight.doctorAdvice?.slice(0, 3).map((item) => (
                        <p key={item}>- {item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-card">Results appear here.</div>
              )}
            </div>
            <div className="rest-action">
              <button onClick={() => setAsking(false)} type="button">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
