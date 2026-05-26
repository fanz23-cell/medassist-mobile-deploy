import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildHelpEventMockResponse, isHelpEventPayload } from "../lib/help-event.ts";
import { detectStart } from "../lib/medassist.ts";

describe("detectStart", () => {
  it("routes medicine pickup requests to prescription scanning", () => {
    assert.equal(detectStart("Pick up medicine at the pharmacy"), "scan-prescription");
  });

  it("supports Chinese visit-intent keywords", () => {
    assert.equal(detectStart("我要复诊看检查结果"), "scan-lab-result");
    assert.equal(detectStart("今天要抽血化验"), "scan-doctor-order");
    assert.equal(detectStart("去药房取药"), "scan-prescription");
  });

  it("defaults uncertain first-time visits to paper destination scanning", () => {
    assert.equal(detectStart("first registration for knee pain"), "destination-from-paper");
  });
});

describe("isHelpEventPayload", () => {
  it("accepts valid support events", () => {
    assert.equal(
      isHelpEventPayload({
        visitId: "demo-visit",
        stepId: "nav-lab",
        eventType: "rest_requested",
        note: "Need rest"
      }),
      true
    );
  });

  it("rejects missing identifiers and unknown event types", () => {
    assert.equal(isHelpEventPayload({ visitId: "", stepId: "nav-lab", eventType: "rest_requested" }), false);
    assert.equal(isHelpEventPayload({ visitId: "demo-visit", stepId: "nav-lab", eventType: "panic" }), false);
  });
});

describe("buildHelpEventMockResponse", () => {
  it("mirrors the payload in mock mode", () => {
    const payload = {
      visitId: "demo-visit",
      stepId: "reason",
      eventType: "step_completed" as const,
      note: "Done"
    };

    assert.deepEqual(buildHelpEventMockResponse(payload), {
      mode: "mock",
      saved: true,
      event: payload
    });
  });
});
