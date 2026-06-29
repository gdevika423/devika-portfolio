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

A documentation page can exist and still not be true. A page tags a
ticket, sits untouched for months, and gets counted as coverage — until
someone reads it and realizes it describes a feature that's since changed
underneath it.

This checker catches that gap before a reader does. It's rule-based, not
an AI model: it cross-references sprint timing against doc commit history,
nothing more.

<img src="/images/traceability-flow.png" alt="AI Governance" width="600">
---

## The rule

```text
COVERED  = ticket is tagged by a doc page AND that page was last touched
           on or after the sprint started

GAP      = no page tags the ticket, OR the page that does predates the
           sprint it claims to cover
```

The second condition is the one most coverage checks skip. A tagged page
looks like proof of documentation — until you ask whether it was actually
written for that work, or just happened to exist first and never got
revisited.

---

## Two ways a ticket fails

<table>
<thead>
<tr><th>Gap type</th><th>What it means</th><th>Why it slips past manual review</th></tr>
</thead>
<tbody>
<tr><td>No tag</td><td>No doc page references the ticket</td><td>Eventually noticed — it's the obvious gap</td></tr>
<tr><td>Stale tag</td><td>A page tags the ticket but predates the sprint that built it</td><td>Reads as coverage on any check that only asks "is it tagged," not "is it current"</td></tr>
</tbody>
</table>

Both gap types show up live on the dashboard, with a legend explaining the
distinction. One stale-tag case wasn't even deliberate — the checker
caught it in test data I'd assumed was clean.

---

## How it runs

- Sprint, epic, and ticket data modeled on a simulated Jira structure
- A Node script scans real documentation files, reads each page's
  frontmatter tags and actual git commit date, and checks both against
  sprint timing
- Output: a per-sprint and per-feature rollup, with every gap named,
  typed, and explained — not just a coverage percentage

No model, no inference. Just structured data and a date comparison. The
value isn't the technology — it's the question the rule asks: not "is
this tagged," but "is this still true."

[**View the live dashboard →**](https://gdevika423.github.io/release-doc-traceability/dashboard/index.html)

---

## Honest scope

The sprint, ticket, and ownership data here is simulated, built to give the
checker something realistic to run against. The checking logic — the
git-history comparison, the gap detection — is real, and runs against any
markdown-based docs repo with frontmatter tagging.

---

## Related

<a class="text-link" href="/platform-systems/doc-health-pipeline/">Documentation Health Operating Cycle</a> — where freshness and coverage checks extend across all pages, not just sprint-tagged ones
<a class="text-link" href="/platform-systems/ai-governance-model/">AI Governance & Review Operating Model</a> — the layer that decides what AI is and isn't trusted to flag
