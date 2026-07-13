---
title: "Documentation Health Operating Cycle"
toc: true
type: docs
draft: false
url: "/platform-systems/doc-health-pipeline/"
---

<p class="page-tag">sabbatical project — checker built and running weekly against this site; team operating cycle designed, not yet run with a team</p>
<hr class="page-divider">

Most documentation teams catch staleness and gaps the same way: a quarterly audit, run manually, by whoever has a free afternoon. It works until the content base outgrows the time anyone has to re-check it.

This page describes two things, and I keep them separate. The **checker** is built and runs weekly against this site's own content. The **team operating cycle** around it is the model I would run with a team, and it has not been run with one, because I do not have a team right now.

The principle underneath both is one I already proved in production at Zeta with AI-assisted editorial review: curated prompts, human sign-off retained. This extends it from a per-draft check into a continuous health signal.

---

## What Is Actually Running

The checker is live. It is a GitHub Actions workflow on a weekly cron, and it runs against this repository.

- **73 pages checked on every run.** It auto-discovers every markdown page under `content/`. There is no manual page list to maintain, so a new page is monitored the moment it is committed.
- **Weekly schedule** via GitHub Actions, plus on-demand manual runs.
- **Real freshness from commit history.** Each page is paired with its actual last-commit date via `git log`. Pages are graded fresh, aging (over 3 months), or stale (over 6 months). This is elapsed time, not a guess from the text.
- **Cross-page contradiction detection.** Every page goes into a single combined model call, so the check can compare pages against each other and flag a claim stated one way here and another way there. Years of experience, team size, metrics, role titles, dates.
- **Coverage gaps** per page: claims made with no supporting detail or evidence behind them.
- **Reports committed straight back into the repo** as a JSON snapshot, and pushed into a single running GitHub Issue as markdown. No separate dashboard, no subscription tooling.

Last run: 73 pages, 37 fresh and 36 aging.

The cross-page check is the one that earns its keep. A per-page review cannot catch an inconsistency that only exists *between* two pages, and that is exactly the kind of error that survives a manual audit and then surfaces in an interview. This checker found a real contradiction on this site's own Publication Pipeline page. I fixed it, re-ran, and confirmed it was gone.

---

## Platform Objective

The goal is to answer one resourcing question: can documentation health monitoring scale without scaling headcount?

Key objectives:

- continuous monitoring of content freshness
- automated detection of coverage gaps
- flagging of inconsistencies, including ones that only exist across pages
- a human review step that stays firmly in control of what is actually wrong

The system is a noticing layer on top of an existing documentation set. It never edits content. It only flags it.

---

## Architecture

Four stages, run weekly.

1. **Ingest** — read every markdown source file directly from the repository
2. **Context build** — pair each page's content with its real last-commit date
3. **Health checks** — a model evaluates freshness, coverage, and cross-page consistency
4. **Report** — flagged pages are compiled into a snapshot and a running GitHub Issue for human triage

Each stage does one thing. The value is in stage 2 and stage 3 together: content alone tells you what a page says, and commit history tells you how long it has been saying it. Neither signal is sufficient on its own.

---

## Health Checks

The monitoring step evaluates each page against three checks:

- **Freshness** — graded from the actual last-commit date. Fresh, aging past 3 months, stale past 6 months.
- **Coverage** — flags claims made with no supporting detail, and prerequisites or terms a reader would need but cannot find.
- **Cross-page consistency** — compares all pages against each other and flags any factual claim stated differently in two places, naming the pages and quoting the conflicting values. If there is no conflict, it has to say so explicitly rather than stay silent.

This layer identifies candidates and raises a flag. It does not decide what is actually wrong. That stays human.

---

## Report and Human Review

Every flag is compiled into one report: which page fired, how old it is, which check fired, and why.

This is where judgment re-enters the system. **A flag is a candidate, not a verdict.** I have had the checker flag things that were fine, and I have had it catch a contradiction I had read past three times. Both outcomes are the reason a person still reads the report.

---

## How I'd Run This as a Team Cadence

This part is designed, not run. I do not have a team, so I have not operated it with one.

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

In practice:

- **Triage as a standing weekly review, not an ad hoc glance.** Every flag gets a real decision — real gap, false positive, or not worth fixing this cycle — and that decision is recorded, not just acted on silently.
- **Every accepted flag gets a named owner and a cycle to resolve it.** Health monitoring that does not result in an assigned fix is just a dashboard nobody acts on.
- **The next cycle checks whether the fix held.** A flag that recurs after being marked resolved is itself a signal, either about the content or about the check.
- **The pattern across cycles becomes the real management data.** Which categories of page flag repeatedly, whose content stays clean, where the team's actual gaps are. That is the conversation this cadence exists to support, not one week's report.

The tool tells you what is stale. The cadence makes sure something happens about it. I have built the first and designed the second.

---

## Known Limitations

Real ones, from running it.

**Content-type blindness.** A check tuned for how-to content will misapply a "missing prerequisites" rubric to a marketing or positioning page, where that rubric does not belong. I would build content-type-aware checks before running this on a real team's content set.

**Freshness is not the same as staleness.** A page can be six months old and perfectly correct. The commit date tells you when something last changed, not whether it is wrong. The check raises a candidate; the writer decides.

**False positives cost trust.** A checker that cries wolf gets ignored by week three. That is the argument for keeping triage human and recording the decision, so a repeat false positive gets fixed at the check, not tolerated forever.