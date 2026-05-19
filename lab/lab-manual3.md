# Week 3 Lab Manual: Sensor Data Visualization -- From Physical World to Dashboard

## Table of Contents

1. [Overview](#overview)
2. [Learning Objectives](#learning-objectives)
3. [Component A: Hardware Setup](#component-a-hardware-setup)
4. [Component B: Structured Lab](#component-b-lab)
5. [Component C: System Architecture -- Sensor-to-Dashboard Pipeline](#component-c-system-architecture--sensor-to-dashboard-pipeline) — [C.1 Architecture](#c1-architecture-concept-the-sensor-to-dashboard-pipeline) · [C.2 Diagramming](#c2-diagramming-exercise-draw-your-sensor-to-dashboard-pipeline) · [C.3 Design Decision Log](#c3-design-decision-log)
6. [Component D: Validation -- Physical Reference + Pipeline Integrity](#component-d-validation--physical-reference--pipeline-integrity) — [D.1 Validation Exercise](#d1-validation-exercise-physical-reference--pipeline-integrity) · [D.2 Quality Gate](#d2-quality-gate) · [D.3 Property-Based Preview](#d3-testing-concept-preview-property-based-testing-with-physical-constraints)
7. [Component E: Applied Challenge — Sensor Sanity Check](#component-e-applied-challenge--sensor-sanity-check-4050-min-individual)
8. [Troubleshooting Matrix](#troubleshooting-matrix)
9. [Submission](#submission)
10. [Reflection](#reflection)

---

## Overview

This week you work with real-time physical data. You will wire sensors to an ESP32 microcontroller, read sensor data, stream data to frontend, and build a live Streamlit dashboard that answers a practical question: *"Should I go study in the GIX lounge right now?"*

Along the way, you will practice the PRIMM method on sensor firmware, build verification habits that compare software readings to physical reality, and learn how data flows from the physical world through a multi-stage pipeline to a chart in your browser.

**Goal: GIX Study Space Monitor** -- Is the room comfortable? Is the room occupied? Your dashboard combines temperature/humidity (comfort) and proximity (occupancy) into a single view that helps GIX students decide where to study.

---

## Learning Objectives

By the end of this lab, you will be able to:

1. Stream sensor data
2. Build interactive charts 
3. **Apply the PRIMM method** (Predict-Run-Investigate-Modify-Make) to read and understand an AI-generated serial parser before modifying it
4. **Validate sensor readings** against physical references by comparing dashboard values to a weather app, a ruler measurement, or a known distance
5. **Validate** visualizations are accurate, properly labeled with units, and show real sensor data (not hardcoded values)
6. **Diagram the sensor-to-dashboard pipeline**, labeling data format at each stage from physical measurement to browser rendering

---

## Component A: Hardware Setup

### Hardware Choices

You are constrained to use ESP32 as the microcontroller if needed. No other microcontrollers will be accepted for this lab. Before wiring anything, get to know your sensors. Check out from Makerspace staff to understand what sensors are available to you. 

Pick appropriate sensors for this task and read their datasheets. Document your choices and the sensors' key features that affect your project quality, e.g., accuracy, operating range, number of pins, etc. Justify your choices. 

### Wire the Circuit

Sketch a diagram of how you wire the circuit. Take a photo of your completed circuit. Prototypes on breadboard are sufficient for this lab.

### Data Sketch

Before writing any dashboard code, think about:
- What does "comfortable" mean?
- What does "available" mean?
- Would you draw a trend (e.g., temperature over time), a snapshot (e.g., current values), or a status indicator (comfortable vs not comfortable)?

Write down your answer in one sentence:
> "I would sketch a **[chart type]** showing **[what]** because the most important thing to communicate is **[insight]**."

---

## Component B: Lab 

### Level 1: Serial Connection + Data Collection

In this level, you connect your ESP32 to your laptop and collect real sensor data into a pandas DataFrame.

#### Step 1.1: Set Up Your Project

Open your terminal and set up a new project.
Create a `requirements.txt` file.

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.gitignore`. Initialize git.


#### Step 1.2: Flash the Firmware

Connect the ESP32 to your laptop via USB. The board should appear as a USB drive named `CIRCUITPY`.

> **No compilation needed.** CircuitPython runs `.py` files directly. Edit `code.py` on the USB drive and the board restarts automatically.

#### Step 1.3: Write the Serial Reader

Create a file called `serial_reader.py` in your project. Complete the function below and call it for serial communication. 

```python
import serial
import time

def read_sensor_line(ser: serial.Serial) -> dict | None:
    """Read one CSV line from serial port, parse into a dict.

    Expected format: timestamp,temperature_c,humidity_pct,distance_cm
    Returns None if the line is malformed or the port times out.
    """
```

#### Step 1.4: Collect Data

Run the serial reader.

**Checkpoint:** Your DataFrame should show:
- Temperature values between 18-28 C (typical indoor range)
- Humidity values between 20-60% (typical indoor range)
- Distance values that change when you move your hand near the proximity sensor

If your values look wrong (e.g., temperature shows 0.0 or 999.0), check your wiring and refer to the [Troubleshooting Matrix](#troubleshooting-matrix).


#### Step 1.5: Commit

```bash
git add serial_reader.py
git commit -m "Level 1: Serial reader with CSV parsing and data collection"
```

---

### Level 2: Static Dashboard

Now you will build a Streamlit dashboard using the data you just collected. This version uses static data (a snapshot from Level 1) -- live streaming comes in Level 3.

#### Step 2.1: Build the Dashboard

Create a file called `app.py`. Your dashboard should read the data collected by sensors and display them.


#### Step 2.2: Run and Verify

Run your dashboard and verify the correctness of results. Document and report your results.


#### Step 2.3: Commit

```bash
git add app.py
git commit -m "Level 2: Static dashboard"
```

---

### Level 3: Live Data Streaming

Now you will make the dashboard update in real time as the ESP32 sends new readings.

#### Step 3.1: Add Live Streaming

Streamlit normally re-runs the entire script on each interaction. For live data, you use the `st.empty()` pattern: create a placeholder, then overwrite it in a loop. Refactor `app.py` to incorporate live data. Note that your code on microcontroller should be updated so that data can be sent to your laptop.

> **How `st.empty()` works:** Unlike Streamlit's normal re-run model (which reruns the entire script on each widget change), `st.empty()` creates a single placeholder in the page. Calling `placeholder.container()` replaces *only* the contents of that placeholder, without rerunning the rest of the script. This is what makes live updating possible.

#### Step 3.2: Test Live Mode


**Checkpoint:** The chart should update on the fly with new readings. Moving your hand near the proximity sensor should change the "Desk Status" metric and show a dip in the proximity chart.

#### Step 3.3: Commit

```bash
git add app.py
git commit -m "Level 3: Live data streaming with channel selector and rolling window"
```

---

### Level 4: PRIMM Code Reading -- Serial Parser

PRIMM (Predict-Run-Investigate-Modify-Make) is a structured method for reading code you did not write

#### Step 4.1: Generate a Parser Function with AI

Open Cursor Composer or Claude Code and use this prompt:

> "Write a Python function called `parse_sensor_stream` that takes a `serial.Serial` object and an integer `n_readings`. It should read `n_readings` valid sensor readings from serial, skipping malformed lines. Each line is CSV format: `timestamp,temperature_c,humidity_pct,distance_cm`. Return a pandas DataFrame with those columns plus a `datetime` column converted from the monotonic timestamp. Add a docstring."

**Do not run the code yet.** Save the generated function into a new file called `parser.py`.

#### Step 4.2: Predict

Before running anything, read the generated code and write down your predictions:

- **What columns will the returned DataFrame have?** (List them.)
- **If 3 of 60 serial lines are malformed, how many rows will the DataFrame have?** (Think carefully about what "n_readings valid readings" means.)
- **What happens if the serial connection drops mid-read?** (Does the function hang? Crash? Return partial data?)
- **How does the function know a line is "malformed"?** (Look at the parsing logic.)

Write your predictions in a text file or on paper. Be specific.

#### Step 4.3: Run

Import and test the function. 
Compare the actual output to your predictions:
- Did the columns match?
- Did it handle malformed lines as you expected?
- Was anything surprising?

#### Step 4.4: Investigate

Now read the generated code line by line:

- How does it detect and skip malformed lines? Does it use try/except? Does it check field count?
- What happens if a sensor returns `NaN` or an empty string for one field?
- Does it sort by timestamp? Should it?
- How does it convert the monotonic timestamp to a `datetime`? Is that conversion reasonable?

Add a comment to `parser.py` noting one thing you discovered during investigation.

#### Step 4.5: Modify

Make one deliberate change to the function:

- Add **outlier filtering**: skip any temperature reading outside 10-50 C or humidity outside 0-100%
- Add a **rolling average** column for temperature (window of 5 readings)
- Add **malformed line logging**: print a warning with the raw line content when a line is skipped
- Change the **timeout behavior**: if no valid reading arrives after a short timeout, return partial data instead of hanging

Run the modified function and verify your change works.


#### Step 4.6: Write Your PRIMM Analysis

Write a short paragraph (3-5 sentences) describing:

- What you predicted the code would do vs. what it actually did
- One thing that surprised you during the Investigation step
- How the Modify step changed your understanding of the code

This paragraph is part of your submission.

#### Step 4.7: Commit

```bash
git add parser.py
git commit -m "Level 4: PRIMM exercise with AI-generated serial parser"
```

---

### Verification Checklist

Complete this checklist for every chart in your app to catch silent data errors. Charts may render without errors but show wrong data. With sensor data, wrong data could mean a faulty wiring connection, not just a code bug.

For each chart in your app, confirm:

- [ ] **Chart title accurately describes the sensor data** (e.g., "Temperature Over Time" not "Chart 1")
- [ ] **Axes labeled with correct units** (C for temperature, % for humidity, cm for distance, seconds for time)
- [ ] **Visualization shows real sensor data, not hardcoded values** (verify by moving your hand near the proximity sensor -- does the chart respond?)
- [ ] **Edge cases tested:** What happens when the serial disconnects? When all readings are identical (sensor stuck)? When the sensor returns NaN?

Spot-check at least one data point: Read a temperature value from the Serial Monitor (or CircuitPython REPL) and verify it matches what the Streamlit dashboard shows.

```python
# VERIFICATION: Serial Monitor shows temperature = 22.5°C
# Dashboard metric card shows: 22.5 °C
# Match: Yes -- pipeline integrity confirmed from ESP32 to browser
```

Include your completed Verification Checklist in your submission.

---

### Chart Readability Checklist

The Verification Checklist above checks whether your charts are *accurate*. This checklist checks whether they are *readable* -- whether someone seeing the chart for the first time can understand it without asking you to explain.

**Readability** is different from accuracy. A chart can be 100% accurate but completely unreadable if it has no title, unlabeled axes, or uses colors that look identical to a colorblind viewer.

For **each** chart in your app, confirm:

**1. Title and Labels**
- [ ] The chart has a descriptive title (e.g., "Room Temperature Over Last 60 Seconds" not "Line Chart")
- [ ] Both axes are labeled with units (e.g., "Temperature (C)", "Time (seconds)")
- [ ] If there is a legend, it uses clear labels (e.g., "Occupied" / "Available" not "True" / "False")

**2. Color Accessibility**
- [ ] Colors are distinguishable by someone who is colorblind
  - Quick test: Take a screenshot of your chart and view it in grayscale (on macOS: System Settings > Accessibility > Display > Color Filters > Grayscale; on Windows: Settings > Ease of Access > Color filters > Grayscale). Can you still tell the categories apart?
  - Safe palettes for Plotly: Use `color_discrete_sequence=px.colors.qualitative.Safe` or `color_discrete_sequence=px.colors.qualitative.Plotly`
  - Palette to avoid: Pure red/green combinations without other visual differentiators (shapes, patterns, or labels)

**3. Data Density**
- [ ] The chart is not overcrowded. If you have more than 100 data points on a line chart, the chart may become noisy. Consider downsampling or using a rolling average.
- [ ] Text labels do not overlap. If x-axis labels overlap, try rotating them with `fig.update_layout(xaxis_tickangle=-45)` or showing fewer tick marks.

If any item fails: Fix it before moving to Level 5. Readability fixes are typically 1-2 lines of code.

**Record your results.** For each chart, note which items passed and which you fixed. Include this in your submission alongside the Verification Checklist.

---

## Component C: System Architecture -- Sensor-to-Dashboard Pipeline

---

### C.1 Architecture Concept: The Sensor-to-Dashboard Pipeline

#### The Big Idea

Data travels through a **pipeline**. Each stage in the pipeline transforms data to a different format. Understanding this pipeline is what lets you debug when a chart shows the wrong numbers, and it is what lets you explain to an AI tool exactly what transformation you need.

- **Raw material:** A physical quantity exists in the room, e.g., temperature
- **Sensor stage:** The sensor converts it to an electrical signal (analog voltage or digital pulse)
- **Microcontroller stage:** The ESP32 reads the signal and converts it to a number
- **Formatter stage:** CircuitPython formats the number as a CSV string
- **Transport stage:** The string travels over USB serial as raw bytes
- **Decoder stage:** Python decodes the bytes into a string, then parses the CSV into a dict
- **Analysis stage:** Python code/libraries such as pandas organizes the dicts into a DataFrame
- **Visualization stage:** Python code/libraries such as Plotly converts the DataFrame into an SVG chart
- **Delivery stage:** Streamlit sends the chart to the browser

If something goes wrong at any stage, the chart may render without errors but show incorrect numbers. Each stage is a potential failure point, and each is an opportunity for verification. Investigate how the data changes format at every stage, and document your results. 
---

### C.2 Diagramming Exercise: Draw Your Sensor-to-Dashboard Pipeline

#### Instructions

Draw the complete data pipeline for your Week 3 sensor dashboard. Show every stage from the physical world to what the user sees in the browser. Clearly label data format at each stage.

#### Checkpoint

You are done when:
- [ ] Your diagram shows all stages from physical world to browser
- [ ] Each stage is labeled with the data format (not just the tool name)
- [ ] Arrows connect every stage
- [ ] Two verification points are marked (where to verify data is transformed correctly)

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

> **"You chose [Serial / WiFi HTTP / WiFi MQTT] for the communication channel between the ESP32 and your laptop. Why? What did you gain and give up? Under what conditions would you choose differently?"**

---

## Component D: Validation -- Physical Reference + Pipeline Integrity

> This week you built a dashboard that displays real sensor data. A temperature chart that says 22.5 C should match what a thermometer (or weather app) says. This exercise teaches you to validate both the **accuracy of your sensors** and the **integrity of your pipeline**.

### D.1 Validation Exercise: Physical Reference + Pipeline Integrity

#### What you are testing

There are two possible kinds of errors in a sensor dashboard:

1. **Sensor error:** The sensor reads 22.5 C but the actual room temperature is 25.0 C. The pipeline is correct, but the sensor is inaccurate, or poorly calibrated, or wired wrong.
2. **Pipeline error:** The sensor reads 22.5 C, the Serial Monitor shows 22.5, but the dashboard shows 18.3. The sensor is correct, but something in the pipeline corrupted the value (e.g., the CSV parser swapped columns, or the unit conversion is wrong).

You will perform **1 physical reference checks** (type 1) and **1 pipeline integrity check** (type 2).

#### Instructions

**Physical Reference Check 1: Temperature**

1. Open a weather app on your phone (or check weather.com) and note the current outdoor temperature for Seattle
2. Note that indoor temperature should be higher than outdoor in winter and lower in summer due to HVAC-controlled
3. Read the temperature from your Streamlit dashboard
4. Is the dashboard reading plausible? Indoor temperature at GIX should be roughly 20-25 C (68-77 F)
5. If you have a second thermometer (phone weather station, thermostat display), compare directly

Record: Dashboard says ___ C. Weather app says outdoor is ___ C. Plausible? Why or why not?


**Pipeline Integrity Check: Serial Monitor = Dashboard**

1. Open the Serial Monitor (or CircuitPython REPL): in your terminal, you can use `screen /dev/tty.usbmodem1101 115200` (macOS) or use Mu editor's serial console
2. Note a specific temperature reading from the Serial Monitor (e.g., "22.5")
3. Check whether the same value appears (or appeared within the same time window) on your Streamlit dashboard
4. If the values differ, the pipeline has an error -- investigate where the data changed

Record: Serial Monitor shows ___ C at timestamp ___. Dashboard shows ___ C. Match? If not, where in the pipeline did the value change?

#### Recording Template

Copy this table into your submission document and fill it in:

| # | Check Type | What You Measured | Reference Value | Dashboard Value | Match? | Notes |
|---|-----------|-------------------|-----------------|-----------------|--------|-------|

### D.2 Quality Gate

Before you submit, every item below must be satisfied:

- [ ] **1 physical reference checks**: Your recording template has 2 rows comparing sensor readings to physical reality (weather app, ruler measurement)
- [ ] **1 pipeline integrity check**: One row shows the same value in Serial Monitor and Streamlit dashboard
- [ ] **Evidence provided**: Temperature check references a weather app or thermometer. Proximity check references a ruler or known distance.
- [ ] **Plausibility reasoning**: For each check, you explain why the reading is or is not in the expected range (not just "Yes" or "No")
- [ ] **Charts have labeled axes**: Every chart has a title and axes labeled with correct units (C, %, cm, seconds)

---

### D.3 Testing Concept Preview: Property-Based Testing with Physical Constraints

#### From spot-checks to properties

The physical reference checks you did today tested specific values at specific moments. Property-based testing asks: what properties should ALWAYS be true in my sensor dashboard, regardless of when you check?

**Physical constraints as properties:**

- "Temperature should be between 10 and 50 C indoors" -- if it reads -5 C, something is wrong (sensor error or wiring issue)
- "Humidity should be between 0% and 100%" -- values outside this range are physically impossible
- "Proximity distance should be non-negative" -- a negative distance has no physical meaning
- "Timestamps should be monotonically increasing" -- time does not go backwards
- "No reading should be NaN after filtering" -- if your parser claims to filter NaN values, verify that none remain

These properties are true for ANY valid sensor reading.

---

## Component E: Applied Challenge — Sensor Sanity Check

### The Problem

The GIX building manager wants to know if Study Room B is comfortable for studying. You're given a CSV of 200 rows of sensor data (temperature, humidity, CO2) collected over one week — but the data has intentionally corrupted rows: missing values, impossible readings (e.g., temperature of 999°F), and duplicate timestamps. Build a cleaning and visualization pipeline.

### What You Build

- A Streamlit app that loads, cleans, and visualizes the sensor data
- A pipeline diagram showing your data transformation stages
- PRIMM analysis on your cleaning function
- 3 assert statements verifying data quality

**Data file:** Use `challenge-data/study_room_b.csv` in this week's folder.

### Part 1: Architecture & Design

Design a multi-stage pipeline for cleaning and analyzing this data. For each stage, document:
- What the stage does
- The data format going in and coming out (e.g., row count, column types)

Identify which stage carries the **most risk** of losing valid data or introducing errors. Circle it and explain why.

### Part 2: Implementation

Build your Streamlit app:
- Load `study_room_b.csv` into a pandas DataFrame
- Clean the data: handle missing values, remove implausible readings, and deal with duplicate timestamps. Define your own plausible ranges for each sensor and justify your choices.
- Display: how many rows were removed and why, summary statistics, and at least one visualization
- Show a **comfort verdict** based on thresholds you define and justify

### Part 3: Testing & Validation

1. **PRIMM analysis** on your cleaning function:
   - **Predict:** Before running, predict how many rows will remain after cleaning
   - **Run:** Execute and record the actual count
   - **Investigate:** If your prediction was wrong, explain why
   - **Modify:** Change one cleaning threshold and observe the effect
   - **Make:** Write one improvement to the cleaning logic
2. **Assert statements** (3 required): Write 3 assert statements that verify your cleaned data meets your quality criteria. Each should test a different aspect of data integrity.

---

## Troubleshooting Matrix

| Problem | Likely Cause | Fix |
|---------|-------------|-----|
| ESP32 does not appear as USB drive | Board not running CircuitPython, or USB cable is charge-only | Try a different USB cable (must be data-capable). Check if the board shows up in `ls /dev/tty.*` (macOS) or Device Manager (Windows). If needed, reflash CircuitPython. |
| `serial.SerialException: could not open port` | Wrong port name or another program (Serial Monitor) has the port open | Close any Serial Monitor windows. Run `ls /dev/tty.usb*` (macOS) or check Device Manager (Windows) to find the correct port name. |
| Serial output shows garbage characters | Baud rate mismatch | Ensure both CircuitPython `code.py` and your Python script use the same baud rate (115200). |
| Temperature reads 0.0 or shows no change | DHT22 data pin not connected properly | Check the yellow wire connection to GPIO 4. Ensure the DHT22 is oriented correctly (pins facing you, left to right: VCC, DATA, NC, GND). Some DHT22 modules have only 3 pins. |
| Proximity always reads max distance (~400 cm) | HC-SR04 trigger or echo pin disconnected | Check the blue (TRIG to GPIO 5) and green (ECHO to GPIO 6) wire connections. Ensure the sensor faces an obstacle within 2-400 cm. |
| `RuntimeError` in CircuitPython | DHT22 timing issue (common, harmless) | The `except RuntimeError: pass` in the firmware handles this. If it happens on every read, check wiring. Occasional errors (1 in 5 reads) are normal for DHT sensors. |
| `ModuleNotFoundError: No module named 'serial'` | `pyserial` not installed (note: the package name is `pyserial`, not `serial`) | Run `pip install pyserial`. Do NOT run `pip install serial` -- that is a different, wrong package. |
| Streamlit live mode freezes or crashes | Serial timeout or port disconnected during streaming | Add `timeout=2` to your `serial.Serial()` call. Wrap the read loop in try/except to handle disconnections gracefully. |
| `ModuleNotFoundError: No module named 'plotly'` | Plotly not installed | Run `pip install plotly`. |
| Chart does not update in live mode | Using `st.line_chart` outside the `st.empty()` container | Ensure all live-updating elements are inside the `with placeholder.container():` block. |
| Humidity reads exactly 0% or 100% | Sensor saturated or disconnected | Check wiring. If the sensor is near steam or water, let it dry. Values of exactly 0% or 100% usually indicate a wiring issue, not actual conditions. |

---

## Submission

All deliverables are **individual**. Submit your GitHub link on Canvas. Your GitHub repo should be well organized. Results should be reproducible with clear instructions on how to run the code. Make sure your repo contains a **PDF report** with the following information:

Your repo must include your main lab source code (`app.py`, `serial_reader.py`, `parser.py`, firmware or notes as needed), `requirements.txt`, and a **README** with step-by-step run instructions for the sensor dashboard. If your Component E challenge uses a **separate** Streamlit entrypoint (e.g. `challenge_app.py`), document how to run it in the README and name the file in your PDF.

### Component A Deliverables

1. **Sensor choice summary** -- which sensors you used, key datasheet facts (accuracy, range, pins), and a short justification of your choices
2. **Wiring sketch + circuit photo** -- hand-drawn or digital wiring diagram and a photo of your completed breadboard with ESP32 and sensors
3. **Data sketch** -- photo or scan of your dashboard sketch (if hand-drawn) plus the one-sentence napkin chart answer from [Data Sketch](#data-sketch)

### Component B Deliverables

1. **Dashboard screenshot** -- a screenshot showing your Streamlit app with real sensor data (metric cards + at least 2 charts)
2. **PRIMM Analysis** -- 3-5 sentence paragraph from Level 4, Step 4.6
3. **Verification Checklist** -- completed checklist with at least one spot-checked data point (Serial Monitor value = Dashboard value)
4. **Chart Readability Checklist** -- completed checklist for each chart
5. **AI Usage Log -- Level 2: Evaluative** -- Document 3 AI interactions from today. For each, record your prompt, the AI's output, and your assessment: was the output correct, partially correct, or wrong? If you caught an error or made a correction, describe what you fixed and how you verified it.

### Component C Deliverables

1. **Pipeline diagram** -- sensor-to-dashboard pipeline from C.2 (hand-drawn photo or digital), showing data format at each stage
2. **Design Decision Log** -- communication channel choice entry from C.3

### Component D Deliverables

1. **Validation table** -- from D.1: 2 physical reference checks + 1 pipeline integrity check (use the recording template)
2. **Quality gate** -- from D.2: all items checked before submission

### Component E Deliverables

1. **Challenge Streamlit app** in your repo -- loads `challenge-data/study_room_b.csv` (or a copy committed with a documented path), cleans and visualizes the data; README or PDF states the command to run it (e.g. `streamlit run challenge_app.py`)
2. **Cleaning pipeline diagram** -- stages from Part 1 with data format in/out per stage; **most-risk stage** circled or called out with a one-sentence explanation
3. **Implementation evidence** -- in the app or PDF: how many rows were removed and **why**, summary statistics, at least one visualization, and a **comfort verdict** with thresholds you defined and justified
4. **PRIMM analysis on your cleaning function** -- Predict / Run / Investigate / Modify / Make as specified in Component E, Part 3
5. **Three `assert` statements** -- in your challenge app code; in the PDF, briefly state what each assert guarantees (three different aspects of data integrity)

### Reflection Deliverables

Before you leave, take a few minutes to write 3-5 sentences addressing the questions in [Reflection](#reflection) below. Submit these as part of your **Component B** deliverables.

---

## Reflection

Answer these three questions in 3-5 sentences total. Submit as part of your **Component B** deliverables.

1. **What surprised you about working with real-time physical data vs. a static DataFrame?** Think about timing, noise, edge cases, and the feedback loop between the physical world and your code.

2. **How did PRIMM change your code reading?** Before PRIMM, how did you approach AI-generated code? After completing the Predict-Run-Investigate-Modify steps, what do you do differently? *(Look back at your Week 1 reflection: how did you describe your approach to AI-generated code then? What has changed?)*

3. **Is your pipeline trustworthy?** If your dashboard ran for an hour unattended in the GIX lounge, would you trust the readings? What could go wrong? What would you add to make it more reliable?

---

## Further Reading

- [Streamlit Documentation](https://docs.streamlit.io) -- official reference for all Streamlit components
- [Plotly Python Documentation](https://plotly.com/python/) -- interactive chart types, customization, and examples
- [CircuitPython Essentials](https://learn.adafruit.com/circuitpython-essentials) -- Adafruit's guide to CircuitPython on microcontrollers
- [pyserial Documentation](https://pyserial.readthedocs.io/) -- serial port communication in Python
- [The PRIMM Approach to Teaching Programming](https://blogs.kcl.ac.uk/cser/2017/09/01/primm-a-structured-approach-to-teaching-programming/) -- the code-reading pedagogy behind Level 4
- Anthropic, "Claude Code Best Practices" -- [anthropic.com/engineering/claude-code-best-practices](https://www.anthropic.com/engineering/claude-code-best-practices)
