---
title: "AI-Enabled Documentation Health Monitoring"
toc: true
type: docs
draft: false
---

<hr class="page-divider">

Most documentation teams catch staleness and gaps the same way: a quarterly audit, run manually, by whoever has a free afternoon. It works until the content base outgrows the time anyone has to re-check it.

This page describes a working pipeline I designed and built that replaces that manual audit with a standing, automated signal — and what running it for real against my own site taught me about where AI helps and where it doesn't.

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
