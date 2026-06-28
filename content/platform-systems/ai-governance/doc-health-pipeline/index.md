---
title: "Documentation Health Operating Cycle"
toc: true
type: docs
draft: false
url: "/platform-systems/doc-health-pipeline/"
---

<p class="page-tag">sabbatical project - built and running</p>
<hr class="page-divider">

# Documentation Health Operating Cycle

sabbatical project - built and running

---

Most documentation teams catch staleness and gaps the same way: a quarterly audit, run manually, by whoever has a free afternoon. It works until the content base outgrows the time anyone has to re-check it.

This page describes the model I designed for replacing that manual audit with a standing, automated signal - extending the same principle I've already proven in production with AI-assisted editorial review at Zeta (curated prompts, human sign-off retained) into a continuous health-monitoring cycle. I've since built and run this pipeline on this site itself: it auto-discovers every page in the live repository, checks freshness against real commit history, and runs an AI-assisted coverage and consistency review on a weekly schedule via GitHub Actions.

---

## Current Status

This pipeline is live and running against this site:

- **79 pages** auto-discovered and checked on every run
- **Weekly schedule**, plus on-demand runs via GitHub Actions
- **Zero infrastructure cost** beyond a small per-run OpenAI API charge - no separate subscription tooling
- Reports land privately, both as a structured JSON snapshot and a running GitHub Issue

A second, related system - matching documentation coverage against sprint and release tickets, rather than checking page content in isolation - is also built and running in a separate private repository. It isn't yet written up as its own page here.

---

## Platform Objective

The goal is to answer one resourcing question: can documentation health monitoring scale without scaling headcount?

Key objectives:

- continuous monitoring of content freshness
- automated detection of coverage gaps
- flagging of internal inconsistencies across pages
- a human review step that stays firmly in control of what's actually wrong

The system is designed as a noticing layer on top of an existing documentation set - it would never edit content, only flag it.

---

## Platform Architecture Overview

The pipeline is designed to run on a weekly schedule with four stages:

1. Ingest - pull markdown source files directly from the live repository
2. Context build - pair each page's content with its real last-commit date
3. Health checks - an LLM evaluates freshness, coverage, and consistency per page
4. Report - flagged pages are compiled into a single message for human triage

Each stage performs a specific function in the monitoring pipeline.

---

## Ingest and Context Build

The pipeline would read every markdown file from the site's content folder and pair it with metadata pulled from commit history - giving the system two real signals per page: the actual content, and how long it's actually been since the page last changed.

---

## Health Checks

The monitoring step would evaluate each page against three checks:

- **Freshness** - flags pages old enough that referenced tools or processes may have moved on
- **Coverage** - flags missing prerequisites or undefined terms a reader would need
- **Consistency** - flags statements that read as internally contradictory

This layer is designed to identify candidate issues and trigger a flag when a check fires - it would not decide what's actually wrong. That stays human.

---

## Report and Human Review

When checks fire, the pipeline would compile every flag into one weekly report.

The report would include which page was flagged, how old it is, and which check fired and why. This is the point where judgment re-enters the system: a flag is a candidate, not a verdict.

---

## How I'd Run This as a Team Cadence

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

In practice, this would mean:

- **Triage as a standing weekly review, not an ad hoc glance.** Every flag gets a real decision - real gap, false positive, or not worth fixing this cycle - and that decision is recorded, not just acted on silently.
- **Every accepted flag gets a named owner and a cycle to resolve it.** Health monitoring that doesn't result in an assigned fix is just a dashboard nobody acts on.
- **The next cycle checks whether the fix actually held.** A flag that recurs after being marked resolved is itself a signal - either about the content or about the check.
- **The pattern across cycles becomes the real management data.** Which categories of pages flag repeatedly, which writers' content stays clean, where the team's actual gaps are - that's the conversation this cadence is built to support, not just one week's report.

This is the layer that would turn a working pipeline into a management system: the tool tells you what's stale, the cadence makes sure something happens about it.

---

## Anticipated Limitations - Designed With, Not Discovered

Two limitations I'd expect and design around from the start, based on what I already know about LLM-based review from running AI-assisted editorial workflows in production:

**Content-type blindness.** An LLM check tuned for how-to content could easily misapply a "missing prerequisites" rubric to a marketing or positioning page, where that rubric doesn't belong. I'd plan for content-type-aware checks from day one rather than treating this as a surprise to fix later.

**Run-to-run inconsistency.** LLM-based judgment doesn't always return the identical result on the same unchanged input. That's exactly why the human review step exists - the system is designed to flag candidates, not publish verdicts, precisely because I don't expect AI judgment to be perfectly deterministic.

**Isolated review misses cross-page contradictions - discovered, not anticipated.** The first working version reviewed each page independently, one API call per page. I tested it against a deliberately seeded contradiction - two pages stating different years of experience - and the isolated version missed it, because a single-page review has no visibility into what any other page says. I redesigned the check to send all pages to the model together in one comparison pass. That version catches it. This is the one limitation on this page I found by testing, not by reasoning in advance - worth naming honestly rather than folding it into the "anticipated" list above.

---

## Design Principles

**AI scales the noticing, not the deciding.** The system is designed to surface candidates; a person decides what's a real gap.

**Real signals over assumptions.** Every check would run against the live repository and live commit history, not a cached snapshot.

**Honest about limitations.** Where the system would be wrong or inconsistent, that's a known design constraint, not a hidden risk.

---

## Future Platform Capabilities

The architecture is designed to extend rather than be rebuilt:

- content-type-aware checks, so a marketing page and a how-to guide are held to different rubrics
- embeddings-based consistency checks across semantically similar pages, instead of one page read at a time
- webhook-triggered runs on every merge, instead of a weekly cron

This progression would move the system from a periodic audit replacement toward a continuous documentation-health layer.

---

## Related

[AI Governance & Review Operating Model](https://productnorth.in/platform-systems/ai-governance-model) - the accountability model this pipeline's signal would feed into

[Documentation Metrics & Impact System](https://productnorth.in/platform-systems/metrix) - how this pipeline's data would roll up into reportable metrics

[AI-Driven Documentation Workflow](https://productnorth.in/platform-systems/ai-driven/ "AI-Driven Documentation Workflow")