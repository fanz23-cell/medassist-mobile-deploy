"use client";

import { useMemo, useState } from "react";

const tasks = [
  {
    id: "registration",
    label: "Registration",
    location: "1F West Hall",
    cue: "Go to the registration window",
    prompt: "Bring ID card and appointment code",
    bracelet: "Two short vibrations at the window entrance",
    progress: 22
  },
  {
    id: "triage",
    label: "Triage",
    location: "3F West Side",
    cue: "Follow the cyan floor guide",
    prompt: "Prepare medical record and triage slip",
    bracelet: "Long vibration when documents are incomplete",
    progress: 48
  },
  {
    id: "payment",
    label: "Payment",
    location: "Self-service Kiosk B",
    cue: "Scan payment code on the receipt",
    prompt: "Keep the receipt for the lab department",
    bracelet: "Pulse reminder after successful payment",
    progress: 71
  },
  {
    id: "pharmacy",
    label: "Pharmacy",
    location: "2F Pharmacy",
    cue: "Wait for queue number A128",
    prompt: "Check medication name before leaving",
    bracelet: "Soft repeated vibration when number is called",
    progress: 92
  }
];

export function MedAssistDemo() {
  const [activeId, setActiveId] = useState(tasks[0].id);
  const activeTask = useMemo(
    () => tasks.find((task) => task.id === activeId) ?? tasks[0],
    [activeId]
  );

  return (
    <div className="prototype">
      <div className="prototype-stage">
        <div className="ar-view">
          <div className="floor-map">
            <span className="corridor corridor-main" />
            <span className="corridor corridor-side" />
            <span className="destination-dot" />
            <span className="patient-dot" />
            <span className="route-line" />
          </div>
          <div className="ar-card ar-card-primary">
            <span className="status-dot" />
            <p>{activeTask.location}</p>
            <strong>{activeTask.cue}</strong>
          </div>
          <div className="ar-card ar-card-secondary">
            <p>Material</p>
            <strong>{activeTask.prompt}</strong>
          </div>
          <div className="vision-ring">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>

      <div className="prototype-controls">
        <div>
          <p className="eyebrow">Hospital Task</p>
          <h3>{activeTask.label}</h3>
          <p className="muted">{activeTask.bracelet}</p>
        </div>

        <div className="task-tabs" role="tablist" aria-label="Hospital task simulation">
          {tasks.map((task) => (
            <button
              aria-selected={task.id === activeId}
              className="task-tab"
              key={task.id}
              onClick={() => setActiveId(task.id)}
              role="tab"
              type="button"
            >
              {task.label}
            </button>
          ))}
        </div>

        <div className="progress-wrap">
          <div className="progress-label">
            <span>Visit progress</span>
            <strong>{activeTask.progress}%</strong>
          </div>
          <div className="progress-track">
            <span style={{ width: `${activeTask.progress}%` }} />
          </div>
        </div>

        <div className="bracelet-panel">
          <span className="bracelet-mini" />
          <div>
            <p className="eyebrow">Smart Bracelet</p>
            <strong>{activeTask.bracelet}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
