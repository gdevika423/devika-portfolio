---
title: "AI Governance & Review Operating Model"
toc: true
type: docs
draft: false
weight: 1
url: "/platform-systems/ai-governance-model/"
---

<p class="page-tag">Sabbatical project - built and running</p>
<hr class="page-divider">

Most teams adopt AI in documentation informally — someone starts using it, it spreads, and nobody can say what AI touched, what a human checked, or where the line sits. That breaks the day something ships wrong.

This page is the operating model I run when a team uses AI: what AI does, what always needs a human, and how I'd account for both.

---

## The Three-Layer Model

Each layer has a distinct job. Collapsing them — letting AI quietly absorb a team-owned or manager-owned responsibility — is where these models fail in practice.

<img src="/images/ai-governance.png" alt="AI Governance" width="600">

---

### Layer 1 — What AI Owns

```text
First drafts + consistency checks + health flagging
```

- Generates first-draft content from specs, tickets, or PRDs
- Runs structural and language-quality checks against the style guide
- Flags stale, low-coverage, or inconsistent content
- Drafts release-note language from tickets

AI does not get sign-off, customer-facing publication, or judgment calls on accuracy or appropriateness.

---

### Layer 2 — What the Team Owns

```text
AI draft → technical accuracy → voice & judgment → sign-off
```

Every writer is accountable for:

- Verifying technical accuracy against the actual product
- Making the judgment calls AI can't — what to cut, what needs context
- Final sign-off, with their name on it

If a writer can't explain why AI-assisted content is correct, it doesn't ship.

---

### Layer 3 — What I Own as Manager

```text
Review ratio + escalation path + training + metrics
```


|
 Responsibility 
|
 In practice 
|
|
---
|
---
|
|
 Review ratio 
|
 How much AI output gets spot-checked vs. fully reviewed, adjusted as trust is earned 
|
|
 Escalation path 
|
 Who's told when AI gets it wrong, what gets corrected 
|
|
 Training 
|
 Every writer knows the workflow and its failure modes — not just early adopters 
|
|
 Traceability 
|
 A record of what AI touched, so any piece can be traced back 
|
|
 Metrics 
|
 Edit-cycle time, post-AI error rate, review bottlenecks — reported, not claimed 
|

---

## Proof point

I ran Layer 1 and 2 in practice at Zeta — a two-stage AI editorial pass, language checks first, then structural validation, that writers used before sign-off. Edit cycles got 30–40% faster, and every piece still went through human review before publishing.

Layer 3 at scale — a documented review ratio, a real escalation path, a standing metric — is what I'd build next in a team-management role.

---

## Related

<a class="text-link" href="/showcase/genai-process-innovation/">GenAI Process Innovation</a> - the proven workflow this model is built from

<a class="text-link" href="/platform-systems/doc-health-pipeline/">Documentation Health Operating Cycle</a> - where this model's monitoring layer connects
