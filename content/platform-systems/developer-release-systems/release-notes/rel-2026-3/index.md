---
title: "Release Notes: Search & Onboarding Improvements"
toc: true
type: docs
draft: false
url: "/platform-systems/developer-release-systems/release-notes/rel-2026-3/"
---

<p class="page-tag">AI-generated release notes — pending PM review</p>
<hr class="page-divider">

Release REL-2026.3, shipping 2026-07-10.

## What changed
This release introduces enhancements to search functionality and onboarding for new users. The search relevance ranking for multi-word queries has been improved, prioritizing exact phrase matches over partial matches. Additionally, a new onboarding tour has been implemented for first-time users, providing a guided experience during their initial login. 

A bug fix has corrected the timestamp display in the release notes automation log, ensuring timestamps now reflect the user's local timezone. Lastly, the legacy v1 search API endpoint has been deprecated, with a planned discontinuation of support in 90 days.

## Who is impacted
New users will benefit from the onboarding tour, while all users will experience improved search results for multi-word queries. Existing users will see the corrected timestamps in the audit log. Users relying on the legacy v1 search API will need to transition to the v2 endpoint to avoid service disruption.

## How you should respond
New users should take advantage of the onboarding tour to familiarize themselves with the platform. All users can expect better search results without any action required. Users with integrations using the v1 search API should begin planning their migration to v2 to ensure continued functionality.

## Known limitations
The search improvements do not currently support fuzzy matching for typos, which is planned for a future release. The onboarding tour does not support keyboard-only navigation at this time, and screen reader support is scheduled for the next quarter. Historical log entries prior to this fix will still display incorrect timestamps. Additionally, the v2 search API does not yet support the 'legacyFilter' parameter, which some v1 integrations rely on.

## Rollout details
The search relevance improvements and timestamp fix are effective immediately upon deployment. The onboarding tour is enabled by default for all new signups starting on the release date. Deprecation warnings for the v1 search API have been added, with a hard cutoff for new requests set for 90 days from this release.

---

*These release notes were synthesized from 4 release
tickets using the Release Notes Automation sub-workflow of the AI-Driven
Documentation Workflow model. They have not yet been reviewed by a PM for
accuracy. See the AI-Driven Documentation Workflow page for how this
process works.*
