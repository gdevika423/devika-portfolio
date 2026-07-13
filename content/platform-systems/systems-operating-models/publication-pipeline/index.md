---
title: "End-to-End AI-Assisted Publication Pipeline"
toc: true
type: docs
draft: false
weight: 2
url: "/platform-systems/publication-pipeline/"
---

<p class="page-tag">sabbatical project — built; one AI-drafted page merged through the PR gate. Not yet run as a team workflow</p>
<hr class="page-divider">

A documentation team adopting AI usually starts with one isolated win — a faster first draft, a quicker editorial pass — without ever connecting those wins into a pipeline that runs end-to-end. This page describes a pipeline I built that generates a first draft directly from a spec, gates it behind a real review step, and connects to the same health-monitoring signal used elsewhere on this site. It extends the AI-assisted editorial review I already proved in production at Zeta — this is that same principle, run as a working pipeline rather than a manual workflow.

---

## Platform Objective

The goal was to answer a different question than the Doc Health pipeline: not "is existing content healthy," but "can a new piece of documentation move from spec to a usable first draft with AI assistance, without skipping the human judgment that makes it publishable."

Key objectives:

- generate a usable first draft directly from a structured input (a spec or feature description), not from a blank page
- keep a real, mechanically enforced review gate between AI draft and publication — not a recorded sign-off, an actual merge requirement
- connect new pages into the same health-monitoring signal used elsewhere, from day one rather than only audited later

---

## Pipeline Stages

```text
Spec Input
     ↓
AI-Assisted Draft
     ↓
Human Review Gate (pull request)
     ↓
Publish (on merge)
     ↓
Health Monitoring Feedback Loop
```

1. **Spec input** — a structured spec file triggers draft generation
2. **AI-assisted draft** — the spec generates a first-pass draft via GPT-4o-mini: structure, descriptions, and example content in the shape a writer would start from rather than a blank page
3. **Human review gate** — the draft never reaches `main` directly. The pipeline opens a pull request with a review checklist; nothing publishes until I read it and merge it myself
4. **Publish** — merging the PR triggers the standard Hugo build, and the page goes live through the same docs-as-code path as everything else on this site
5. **Feedback loop** — once merged, the new page is automatically included in the next Documentation Health run, since that checker scans all site content

---

## Why This Connects to the Health Operating Cycle

A draft-from-spec workflow that never feeds into ongoing health monitoring just creates more content to audit manually later. Every AI-assisted page enters the same accountability loop as everything else on the site — flagged, triaged, owned, re-checked. This connection isn't a planned integration; it's true by construction, since Doc Health already scans the full content tree.

---

## Design Principles

**AI drafts, a person merges.**
The review gate is not a recorded checkbox — it's a pull request. No AI-assisted draft reaches publication without a human reading it and clicking merge.

**New content shouldn't get a clean slate.**
A page generated this way is tracked the same way as every other page from day one, not exempted from ongoing monitoring because it started with an AI draft.

**A gate that can't be bypassed is the only kind worth building.**
Earlier designs for this considered a logged-sign-off-then-auto-publish model. I deliberately built a PR-based gate instead — the same pattern real engineering teams use to review code — because a sign-off that doesn't block publication isn't actually a gate.

---

## Where I'd Take This as a Manager

Running this as a team's standard workflow means the same Layer 1 / Layer 2 / Layer 3 accountability from the AI Governance model applies here directly: AI owns the draft, the team owns the review and the merge, and I'd own the metric that tells me whether the workflow is actually saving time — how often an AI-assisted draft needs heavy rework versus light editing — rather than just moving the same work around.

---

<h2>Related</h2>

<a class="text-link" href="/platform-systems/ai-governance-model/">AI Governance & Review Operating Model</a> - the accountability model this pipeline's review gate operationalizes

<a class="text-link" href="/platform-systems/doc-health-pipeline/">Documentation Health Operating Cycle</a> - the feedback loop every page generated here automatically enters