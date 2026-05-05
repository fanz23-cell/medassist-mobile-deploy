import { MedAssistDemo } from "@/components/medassist-demo";

const journeyStages = [
  {
    stage: "Registration",
    standard: "Find registration window, register, read materials",
    senior: "Search signs, confirm the right window, ask staff for help",
    pain: "Information is scattered across signs, screens, and paper slips."
  },
  {
    stage: "Consultation",
    standard: "Read triage instruction, queue, enter clinic room",
    senior: "Interpret procedure text, track queue, avoid wrong corridor",
    pain: "Complex space and changing queue status increase uncertainty."
  },
  {
    stage: "Medical Test",
    standard: "Find lab, pay, prepare material, finish test",
    senior: "Collect documents, identify machines, verify next action",
    pain: "Tasks depend on documents, payment codes, and body movement."
  },
  {
    stage: "Medication",
    standard: "Find pharmacy, queue, retrieve medication",
    senior: "Confirm prescription, wait, collect medicine",
    pain: "Memory load accumulates after a long hospital visit."
  }
];

const personas = [
  {
    name: "Mr Xu",
    age: "68",
    type: "Experienced Visitor",
    tag: "Fully familiar",
    goal: "Regular check for hypertension and hyperlipidemia",
    frustration: "Still gets distracted by route changes and dense signage."
  },
  {
    name: "Mrs Yu",
    age: "71",
    type: "First-Time Visitor",
    tag: "Partially familiar",
    goal: "Attend a cataract assessment",
    frustration: "Cannot tell which step belongs to her current process."
  },
  {
    name: "Mrs Hao",
    age: "78",
    type: "Dependent Visitor",
    tag: "Needs support",
    goal: "Diabetes check-up",
    frustration: "Understands the destination but struggles with machines."
  },
  {
    name: "Mr Li",
    age: "71",
    type: "Overwhelmed Visitor",
    tag: "Totally unfamiliar",
    goal: "Knee pain examination",
    frustration: "Large hospital space makes independent navigation tiring."
  }
];

const features = [
  {
    title: "Directly Ahead",
    mode: "Central vision",
    detail: "Shows immediate route planning and deviation alerts when a patient is close to a decision point."
  },
  {
    title: "Outer Ring",
    mode: "Peripheral vision",
    detail: "Keeps document scanning, destination hints, and material preparation visible without blocking the path."
  },
  {
    title: "Wrist Area",
    mode: "Hand movement support",
    detail: "Connects receipts, forms, and medical cards to the next action through bracelet vibration prompts."
  },
  {
    title: "Operation Ring",
    mode: "Task boundary",
    detail: "Activates reminders only when the user enters an operation range such as payment or pharmacy pickup."
  }
];

export default function HomePage() {
  return (
    <div className="med-page">
      <section className="med-hero" id="overview">
        <div className="hero-copy">
          <p className="eyebrow">Portfolio Web Application</p>
          <h1>MedAssist</h1>
          <p className="hero-subtitle">
            AR glasses and a smart bracelet designed to help elderly patients
            navigate solo hospital visits with clearer guidance, lighter memory
            load, and calmer task execution.
          </p>
          <div className="hero-actions">
            <a className="button" href="#demo">
              Try Prototype
            </a>
            <a className="button-secondary" href="#research">
              View Research
            </a>
          </div>
          <dl className="project-meta">
            <div>
              <dt>Role</dt>
              <dd>User Research, Product Design</dd>
            </div>
            <div>
              <dt>Tools</dt>
              <dd>Figma, SketchUp, Procreate, Blender</dd>
            </div>
            <div>
              <dt>Timeline</dt>
              <dd>May to September 2024</dd>
            </div>
          </dl>
        </div>

        <div className="hero-device" aria-label="MedAssist AR visual">
          <div className="hospital-haze" />
          <div className="patient-figure">
            <span className="cap" />
            <span className="face" />
            <span className="mask" />
            <span className="body" />
          </div>
          <div className="glasses">
            <span />
            <span />
          </div>
          <div className="bracelet" />
          <div className="route-chip route-chip-top">3rd Floor West Side</div>
          <div className="route-chip route-chip-bottom">Prepare material</div>
        </div>
      </section>

      <section className="research-grid section" id="research">
        <div className="section-heading">
          <p className="eyebrow">Background</p>
          <h2>Solo hospital visits create a compound challenge.</h2>
          <p>
            Field research focused on how older patients gather information,
            interpret procedures, make decisions, and complete tasks inside
            complex Chinese hospital environments.
          </p>
        </div>
        <div className="stat-panel">
          <strong>40%</strong>
          <p>
            Approximate share of older individuals who reported visiting a
            hospital alone in the past year.
          </p>
        </div>
        <div className="insight-card">
          <h3>Complex Hospital Interior Space</h3>
          <p>
            Large hospitals have dense department layouts and limited prominent
            directional signage.
          </p>
        </div>
        <div className="insight-card">
          <h3>Complicated Treatment Process</h3>
          <p>
            Registration, consultation, examination, payment, and medication
            collection each contain specific rules.
          </p>
        </div>
        <div className="insight-card">
          <h3>Inadequate Auxiliary Measures</h3>
          <p>
            Existing support facilities and volunteer services help, but do not
            fully solve navigation, cognition, and task execution problems.
          </p>
        </div>
      </section>

      <section className="section journey-section" id="journey">
        <div className="section-heading">
          <p className="eyebrow">User Journey</p>
          <h2>From gathering information to implementing tasks.</h2>
        </div>
        <div className="journey-table">
          {journeyStages.map((item, index) => (
            <article className="journey-step" key={item.stage}>
              <span className="step-number">{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.stage}</h3>
              <p>{item.standard}</p>
              <p className="muted">{item.senior}</p>
              <strong>{item.pain}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section persona-section">
        <div className="section-heading">
          <p className="eyebrow">Persona</p>
          <h2>Four visitor groups reveal different support needs.</h2>
        </div>
        <div className="persona-grid">
          {personas.map((persona) => (
            <article className="persona-card" key={persona.name}>
              <div className="avatar" aria-hidden="true">
                {persona.name.slice(0, 1)}
              </div>
              <div>
                <h3>{persona.type}</h3>
                <p className="muted">
                  {persona.name}, age {persona.age}
                </p>
              </div>
              <span className="pill">{persona.tag}</span>
              <p>{persona.goal}</p>
              <strong>{persona.frustration}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section solution-section">
        <div className="section-heading">
          <p className="eyebrow">Solution</p>
          <h2>Two wearable interfaces divide attention by task context.</h2>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <span className="feature-ring" />
              <p className="eyebrow">{feature.mode}</p>
              <h3>{feature.title}</h3>
              <p>{feature.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section demo-section" id="demo">
        <div className="section-heading">
          <p className="eyebrow">Interactive Prototype</p>
          <h2>Simulate how MedAssist responds during a hospital visit.</h2>
        </div>
        <MedAssistDemo />
      </section>
    </div>
  );
}
