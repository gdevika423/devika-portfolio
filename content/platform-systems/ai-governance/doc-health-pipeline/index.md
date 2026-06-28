---
title: "Documentation Health Operating Cycle"
toc: true
type: docs
draft: false
url: "/platform-systems/doc-health-pipeline/"
---

<p class="page-tag">sabbatical project — v1 built and running</p>
<hr class="page-divider">

# Documentation Health Operating Cycle

sabbatical project — v1 built and running

---

Most documentation teams catch staleness and gaps the same way: a quarterly audit, run manually, by whoever has a free afternoon. It works until the content base outgrows the time anyone has to re-check it.

This page describes the model I designed for replacing that manual audit with a standing, automated signal - extending the same principle I've already proven in production with AI-assisted editorial review at Zeta (curated prompts, human sign-off retained) into a continuous health-monitoring cycle. A first version of this is built and running against this site: [view the repo](https://github.com/gdevika423/doc-health-pipeline).

---

## Current Status

This pipeline is live and running against this site:

- **7 pages** checked on every run - this site's homepage, About, Toolkit, and the four AI/platform-systems pages
- **Weekly schedule** via GitHub Actions, plus on-demand manual runs
- **Coverage, consistency, and overclaim-risk checks** per page via GPT, plus a small accuracy-evals layer: each page is checked against a short list of known-true facts, and the match rate is tracked over time in the repo
- **Most recent run: 100% accuracy** (13/13 ground-truth facts confirmed), up from 92.3% in the previous run - the gap was a real internal contradiction on this site's own Publication Pipeline page, which I fixed and then re-ran to confirm
- Reports are markdown files and a running CSV, committed straight back into the repo - no separate dashboard or subscription tooling

This is a v1: it checks a fixed list of pages, not the whole site automatically, and it doesn't yet check freshness against commit history - both are described as the fuller design below, not yet built.

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
3. Health checks - an LLM evaluates freshness, coverage, consistency, and overclaim risk per page
4. Report - flagged pages are compiled into a single report for human triage

Each stage performs a specific function in the monitoring pipeline.

In v1, stage 1 fetches each page's live rendered page directly rather than raw markdown from the repository, and stage 2's commit-history pairing isn't built yet - the checks below run on page content alone for now.

---

## Ingest and Context Build

The pipeline would read every markdown file from the site's content folder and pair it with metadata pulled from commit history - giving the system two real signals per page: the actual content, and how long it's actually been since the page last changed.

---

## Health Checks

The monitoring step evaluates each page against four checks:

- **Freshness** - flags language signals (specific dates, "current," "in progress") that may need a human to reconfirm are still accurate. This is text-pattern based in v1, not tied to actual elapsed time - true age-based freshness via commit history is still future work.
- **Coverage** - flags missing prerequisites or undefined terms a reader would need
- **Consistency** - flags statements that read as internally contradictory
- **Overclaim risk** - flags language implying more system maturity than a page's actual description supports. This check is built and running in v1 - it's what caught and helped fix a real contradiction on this site's own Publication Pipeline page.

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

## Anticipated Limitations

Two limitations I'd expect and design around from the start, based on what I already know about LLM-based review from running AI-assisted editorial workflows in production:

**Content-type blindness.** An LLM check tuned for how-to content could easily misapply a "missing prerequisites" rubric to a marketing or positioning page, where that rubric doesn't belong. I'd plan for content-type-aware checks from day one
