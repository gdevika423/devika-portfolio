---title: "AI Governance & Review Operating Model"
toc: true
type: docs
draft: false
weight: 1
url: "/platform-systems/ai-governance-model/"
---

<p class="page-tag">abbatical project - built and running</p>
<hr class="page-divider">

Most teams adopt AI in documentation the same way: someone starts using it, it spreads informally, and nobody can say with confidence what AI touched, what a human verified, or where the line sits. That works until something AI-assisted ships wrong and there's no clear answer for how it got through.

This page describes the operating model I run when I lead a documentation team using AI — what AI is allowed to do, what always requires a human, and how I'd account for both if asked.

---

## Why This Exists

AI fluency isn't the hard part of managing a documentation team through this shift. The hard part is **drawing a line that holds** — one the team can actually follow under sprint pressure, and one I can defend to engineering, legal, or a VP asking "how do you know what's been checked?"

A documentation manager's job here isn't to use AI well personally. It's to make sure an entire team uses it consistently, safely, and in a way that's auditable after the fact.

---

## The Three-Layer Model

```text
What AI Owns
     +
What the Team Owns
     +
What I Own as Manager
     =
A System That Holds Under Pressure
```

Each layer has a distinct job. Collapsing them — letting AI quietly absorb a team-owned or manager-owned responsibility — is where these models fail in practice.

---

## Layer 1: What AI Owns

```text
First Drafts + Consistency Checks + Health Flagging
```

AI is the right tool for high-volume, low-judgment work where the cost of a missed error is low and review is fast:

- generating first-draft content from specs, tickets, or PRDs
- running structural and language-quality checks against the style guide
- flagging stale, low-coverage, or inconsistent content for human attention
- summarizing release tickets into draft release-note language

What AI does **not** get: final sign-off, customer-facing publication without review, or any judgment call about what's safe, accurate, or appropriate for the audience.

---

## Layer 2: What the Team Owns

```text
AI Draft → Technical Accuracy → Voice & Judgment → Sign-Off
```

Every writer on the team is accountable for:

- verifying technical accuracy against the actual product, not the AI's draft
- making the judgment calls AI can't — what to cut, what needs more context, what a confused user actually needs to know
- final sign-off before anything publishes, with their name on that decision

This is a non-negotiable gate, not a courtesy step. If a writer can't explain why a piece of AI-assisted content is correct, it doesn't ship.

---

## Layer 3: What I Own as Manager

```text
Review Ratio + Escalation Path + Training + Metrics
```

This is the layer that's easy to skip and the one that actually makes the model real:

| Responsibility | What it looks like in practice |
|---|---|
| Setting the review ratio | Deciding how much AI-assisted output gets spot-checked vs. fully reviewed, and adjusting it as trust in the workflow is earned |
| Escalation path | A clear answer for "what happens when AI gets it wrong" — who's told, what gets corrected, whether the workflow itself needs adjusting |
| Training the team | Making sure every writer, not just the early adopters, knows how to use the AI-assisted workflow and where its failure modes are |
| Logging and traceability | Keeping a record of what AI touched, so any piece of content can be traced back if it's ever questioned |
| Owning the metrics | Tracking whether the model is actually working — edit-cycle time, error rate post-AI-adoption, review bottlenecks — and being able to report on it, not just claim it |

If I can't answer "how do you know your team's AI workflow is working" with something more specific than "it feels faster," this layer isn't actually built yet.

---

## What This Looks Like in Practice

I've run a version of this model at the individual-workflow level already — a two-stage AI-assisted editorial pass (language quality, then structural validation) that writers used for self-review before formal sign-off, cutting edit-cycle time 30–40% while every piece still went through human review before publishing. That's Layer 1 and Layer 2 in action.

The piece I'd build out further in a team-management role is Layer 3 at scale: a documented review ratio, a real escalation path, and a standing metric I report on rather than just describe — turning a workflow that worked for one team into an operating model that holds as the team and the AI tooling both grow.

---

## Key Insight

AI scales consistency. The team's judgment is the gate. My job as manager is making sure that gate never quietly disappears just because the work got faster.

A documentation team that can say exactly what AI touched, what a human verified, and why — that's the team that survives the next audit, the next incident, and the next leadership question about AI risk.

---

<h2>Related</h2>

<a class="text-link" href="/showcase/genai-process-innovation/">GenAI Process Innovation</a> - the real, proven workflow this governance model is built from

<a class="text-link" href="/platform-systems/doc-health-pipeline/">Documentation Health Operating Cycle</a> - the operating cadence this model's monitoring layer connects to

