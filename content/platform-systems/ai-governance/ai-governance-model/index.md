---
title: "Release Documentation Traceability Checker"
toc: true
type: docs
draft: false
weight: 2
url: "/platform-systems/release-traceability/"
---

<p class="page-tag">Sabbatical project — built and running</p>
<hr class="page-divider">

A documentation page existing and a documentation page being *true* are two
different things. A page can tag a ticket, sit untouched for months, and
still get counted as coverage — right up until someone reads it and
realizes it describes a feature that's since changed underneath it.

This is a rule-based checker, not an AI model. It cross-references sprint
timing against doc commit history to catch that gap before a reader does.

---

## The rule

```text
COVERED  = ticket is tagged by a doc page AND that page was last touched
           on or after the sprint started

GAP      = no page tags the ticket, OR the page that does predates the
           sprint it claims to cover
```

That second condition is the one most coverage checks miss. A page that
tags a ticket looks like proof of documentation — until you check whether
it was actually written *for* that work, or just happened to exist first
and never got revisited.

---

## Two ways a ticket fails

<table>
<thead>
<tr><th>Gap type</th><th>What it means</th><th>Why it's missed by hand</th></tr>
</thead>
<tbody>
<tr><td>No tag</td><td>No doc page references the ticket at all</td><td>Usually caught eventually — it's the obvious gap</td></tr>
<tr><td>Stale tag</td><td>A page tags the ticket, but predates the sprint that built it</td><td>Looks like coverage on every dashboard that only checks "is it tagged," not "is it current"</td></tr>
</tbody>
</table>

Most coverage tracking stops at the first column. This model checks both.

---

## How it runs

- Sprint, epic, and ticket data modeled on a simulated Jira structure
- A Node script scans real documentation files, reads each one's frontmatter
  tags and actual git commit date, and checks both against sprint timing
- Output: a per-sprint and per-feature rollup, with every gap named and
  reasoned — not just a coverage percentage

No model, no inference — just structured data and a date comparison. The
value isn't the AI, it's the question the rule asks: *not just "is this
tagged," but "is this still true."*

[**View the live dashboard →**](https://gdevika423.github.io/release-doc-traceability/dashboard/index.html)

---

## Honest scope

The sprint, ticket, and ownership data here is simulated — built to give the
checker something realistic to run against. The checking logic, the
git-history comparison, and the gap detection are real and runnable against
any markdown-based docs repo with frontmatter tagging.

---

## Related

<a class="text-link" href="/platform-systems/doc-health-pipeline/">Documentation Health Operating Cycle</a> — where freshness and coverage checks extend across all pages, not just sprint-tagged ones
<a class="text-link" href="/platform-systems/ai-governance-model/">AI Governance & Review Operating Model</a> — the layer that decides what AI is and isn't trusted to flag
