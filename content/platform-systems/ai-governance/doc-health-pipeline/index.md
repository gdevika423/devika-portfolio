---title: "Documentation Health Operating Cycle"
toc: true
type: docs
draft: false
url: "/platform-systems/doc-health-pipeline/"
---

<hr class="page-divider">

Most documentation teams catch staleness and gaps the same way: a quarterly audit, run manually, by whoever has a free afternoon. It works until the content base outgrows the time anyone has to re-check it.

This page describes the operating cycle I run a team against instead: a pipeline I designed and built that turns documentation health into a recurring management ritual — flag, triage, assign, re-check — rather than a one-time audit project. What follows includes what running it for real against my own site taught me about where AI helps and where it doesn't.

---

## Platform Objective

The goal was to answer one resourcing question: can documentation health monitoring scale without scaling headcount?

Key objectives included:

- continuous monitoring of content freshness
- automated detection of coverage gaps
- flagging of internal inconsistencies across pages
- a human review step that stays firmly in control of what's actually wrong

The system acts as a noticing layer on top of an existing documentation set — it never edits content, only flags it.

---

## Platform Architecture Overview

The pipeline runs on a weekly schedule and has four stages:

1. Ingest — pulls markdown source files directly from the live GitHub repository
2. Context build — pairs each page's content with its real last-commit date
3. Health checks — an LLM evaluates freshness, coverage, and consistency per page
4. Report — flagged pages are compiled into a single Slack message for human triage

Each stage performs a specific function in the monitoring pipeline.

---

## Ingest and Context Build

The pipeline reads every markdown file from the site's content folder and pairs it with metadata pulled from GitHub's commit history.

This gives the system two real signals per page:

- the actual content, not a cached or stale copy
- how long it's actually been since the page last changed

These signals provide the raw input the health checks run against.

---

## Health Checks

The monitoring step evaluates each page against three checks:

- **Freshness** — flags pages old enough that referenced tools or processes may have moved on
- **Coverage** — flags missing prerequisites or undefined terms a reader would need
- **Consistency** — flags statements that read as internally contradictory

This layer identifies candidate issues and triggers a flag when a check fires — it does not decide what's actually wrong.

---

## Report and Human Review

When checks fire, the pipeline compiles every flag into one weekly report and posts it to Slack.

The report includes:

- which page was flagged
- how old it is
- which check fired and why

This is the point where judgment re-enters the system: a flag is a candidate, not a verdict.

---

## How I Run This as a Team Cadence

The pipeline produces a signal. Running it as a documentation manager means closing the loop on that signal every cycle, not just generating it.

```text
Weekly Report
     ↓
Triage (which flags are real)
     ↓
Assignment (which writer owns the fix)
     ↓
Resolution
     ↓
Re-check Next Cycle
```

In practice, this means:

- **Triage is a standing weekly review, not an ad hoc glance.** Every flag gets a real decision — real gap, false positive, or not worth fixing this cycle — and that decision is recorded, not just acted on silently.
- **Every accepted flag gets a named owner and a cycle to resolve it.** Health monitoring that doesn't result in an assigned fix is just a dashboard nobody acts on.
- **The next cycle checks whether the fix actually held.** A flag that recurs after being marked resolved is itself a signal — either about the content or about the check.
- **The pattern across cycles is the real management data.** Which categories of pages flag repeatedly, which writers' content stays clean, where the team's actual gaps are — that's the conversation this cadence is built to support, not just this week's report.

This is the layer that turns a working pipeline into a management system: the tool tells you what's stale, the cadence makes sure something happens about it.

---

## What Running It For Real Taught Me

Two things surfaced the first time this ran against this site's actual homepage, worth naming rather than glossing over:

**The AI applied a documentation-page rubric to a marketing page.** The first run flagged the homepage for "missing prerequisites" — a reasonable check for a how-to guide, not for positioning copy. That's a real v1 limitation: the system doesn't yet distinguish content types before applying checks.

**The same check isn't perfectly consistent run to run.** A second run against the identical, unchanged page returned zero flags. LLM-based judgment varies slightly between calls — which is exactly why this system flags for a human to review, rather than auto-publishing or auto-editing anything.

---

## Design Principles

**AI scales the noticing, not the deciding.**
The system surfaces candidates; a person decides what's a real gap.

**Real signals over assumptions.**
Every check runs against the live repository and live commit history, not a cached snapshot.

**Honest about limitations.**
Where the system is wrong or inconsistent, that's reported as a finding, not hidden.

---

## Future Platform Capabilities

The architecture is built to extend rather than be rebuilt:

- content-type-aware checks, so a marketing page and a how-to guide are held to different rubrics
- embeddings-based consistency checks across semantically similar pages, instead of one page read at a time
- webhook-triggered runs on every merge, instead of a weekly cron

This progression moves the system from a periodic audit replacement toward a continuous documentation-health layer.

---

<h2>Related</h2>

<a class="text-link" href="/platform-systems/ai-governance-model/">AI Governance & Review Operating Model</a> - the accountability model this pipeline's signal feeds into

<a class="text-link" href="/platform-systems/metrix/">Documentation Metrics & Impact System</a> - how this pipeline's data rolls up into reportable metrics

