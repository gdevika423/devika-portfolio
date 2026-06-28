// scripts/doc-health-check.mjs
//
// Documentation Health Check (v3)
// - Auto-discovers every .md content page under content/ (no manual page list to maintain)
// - Gets last-commit date per page (freshness)
// - One combined OpenAI call across ALL pages so it can catch cross-page
//   contradictions (e.g. "12+ years" on one page, "15+ years" on another)
// - Writes a JSON snapshot to dashboard/doc-health-latest.json (for the dashboard UI)
// - Updates a single GitHub Issue with the same report in markdown
//
// Requires (set as repo secrets):
//   OPENAI_API_KEY
//   GITHUB_TOKEN  (provided automatically by Actions)

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const REPORT_TITLE = 'Documentation Health Report';
const REPORT_LABEL = 'doc-health';
const CONTENT_DIR = 'content';
const SITE_BASE_URL = 'https://productnorth.in';
const JSON_OUTPUT_PATH = 'dashboard/doc-health-latest.json';

// Skip non-page content: drafts, list-only sections with no real body, etc.
const EXCLUDE_PATTERNS = [/\/_index\.md$/i]; // we'll handle _index separately below
const SKIP_IF_DRAFT = true;

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY;

if (!OPENAI_API_KEY || !GITHUB_TOKEN || !GITHUB_REPOSITORY) {
  console.error('Missing required env vars (OPENAI_API_KEY, GITHUB_TOKEN, GITHUB_REPOSITORY).');
  process.exit(1);
}

// ---------- Auto-discovery ----------

function findMarkdownFiles(dir) {
  let results = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return results;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(findMarkdownFiles(full));
    } else if (entry.endsWith('.md')) {
      results.push(full);
    }
  }
  return results;
}

function parseFrontMatter(raw) {
  const match = raw.match(/^---([\s\S]*?)---/);
  if (!match) return {};
  const fm = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w[\w-]*)\s*:\s*(.+)$/);
    if (m) fm[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, '');
  }
  return fm;
}

function contentPathToUrl(filePath) {
  // content/about/_index.md -> /about/
  // content/showcase/knowledge-base-architecture.md -> /showcase/knowledge-base-architecture/
  let rel = filePath.replace(/^content\/?/, '').replace(/\.md$/, '');
  rel = rel.replace(/\/_index$/, '').replace(/^_index$/, '');
  if (rel === '') return SITE_BASE_URL + '/';
  return `${SITE_BASE_URL}/${rel}/`;
}

function discoverPages() {
  const files = findMarkdownFiles(CONTENT_DIR);
  const pages = [];
  for (const file of files) {
    let raw;
    try {
      raw = readFileSync(file, 'utf8');
    } catch {
      continue;
    }
    const fm = parseFrontMatter(raw);
    if (SKIP_IF_DRAFT && String(fm.draft).toLowerCase() === 'true') continue;

    const body = raw.replace(/^---[\s\S]*?---/, '').trim();
    if (!body || body.length < 20) continue; // skip empty stub pages

    pages.push({
      name: fm.title || path.basename(file, '.md'),
      contentPath: file,
      url: contentPathToUrl(file),
      text: body.slice(0, 6000),
    });
  }
  return pages;
}

// ---------- Freshness ----------

function getLastCommitDate(filePath) {
  try {
    const out = execSync(`git log -1 --format=%cI -- "${filePath}"`).toString().trim();
    return out || null;
  } catch {
    return null;
  }
}

function daysSince(isoDate) {
  if (!isoDate) return null;
  return Math.round((Date.now() - new Date(isoDate).getTime()) / 86400000);
}

function freshnessFlag(ageDays) {
  if (ageDays === null) return { emoji: '⚪', label: 'unknown', level: 'unknown' };
  if (ageDays > 180) return { emoji: '🔴', label: 'stale (>6 months)', level: 'stale' };
  if (ageDays > 90) return { emoji: '🟡', label: 'aging (>3 months)', level: 'aging' };
  return { emoji: '🟢', label: 'fresh', level: 'fresh' };
}

// ---------- AI review (one combined call across all pages) ----------

async function reviewAllPages(pageData) {
  const systemPrompt = `You are a documentation health reviewer for a senior documentation leader's portfolio site.
You will receive the full text of ALL pages on the site at once. Review them BOTH individually and AGAINST EACH OTHER.

For EACH page, report:
1. Coverage gaps - claims made with no supporting detail or evidence.
2. Freshness risk - only flag if the page reads as stale or outdated relative to current positioning.

THEN, in a SEPARATE final section titled "Cross-page consistency", compare ALL pages against each other and flag:
- Any factual claim (years of experience, team size, metrics, role titles, dates) that is stated differently on two or more pages.
- Any terminology or framing that conflicts across pages.
Be specific: name the pages involved and quote the conflicting values exactly.
If no cross-page conflicts exist, state that explicitly rather than skipping the section.

Respond ONLY as valid JSON, no markdown fences, in this exact shape:
{
  "pages": [
    { "name": "<page name>", "coverageGaps": "<short text>", "freshnessRisk": "<short text>" }
  ],
  "crossPageConsistency": "<short text, may contain multiple bullet-style lines separated by \\n>"
}`;

  const userPrompt = pageData
    .map(
      (p) =>
        `PAGE: ${p.name}\nURL: ${p.url}\nLast content update: ${
          p.ageDays === null ? 'unknown' : `${p.ageDays} days ago`
        }\nTEXT:\n"""\n${p.text}\n"""`
    )
    .join('\n\n---\n\n');

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.2,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI call failed: ${res.status} ${errText}`);
  }

  const data = await res.json();
  return JSON.parse(data.choices[0].message.content);
}

// ---------- Build report ----------

async function buildReport() {
  console.log('Discovering pages...');
  const pages = discoverPages();
  console.log(`Found ${pages.length} pages.`);

  const pageData = pages.map((page) => {
    const lastCommit = getLastCommitDate(page.contentPath);
    const ageDays = daysSince(lastCommit);
    return { ...page, lastCommit, ageDays };
  });

  let aiResult;
  try {
    aiResult = await reviewAllPages(pageData);
  } catch (err) {
    console.error('AI review failed:', err.message);
    aiResult = { pages: [], crossPageConsistency: `⚠️ Review failed: ${err.message}` };
  }

  const aiByName = new Map((aiResult.pages || []).map((p) => [p.name, p]));

  const fullPages = pageData.map((p) => {
    const ai = aiByName.get(p.name) || {};
    const fresh = freshnessFlag(p.ageDays);
    return {
      name: p.name,
      url: p.url,
      contentPath: p.contentPath,
      lastCommit: p.lastCommit,
      ageDays: p.ageDays,
      freshness: fresh,
      coverageGaps: ai.coverageGaps || 'No data',
      freshnessRisk: ai.freshnessRisk || 'No data',
    };
  });

  const snapshot = {
    generatedAt: new Date().toISOString(),
    pages: fullPages,
    crossPageConsistency: aiResult.crossPageConsistency || 'No data',
  };

  return snapshot;
}

function snapshotToMarkdown(snapshot) {
  const date = snapshot.generatedAt.slice(0, 10);
  const freshnessSummary = snapshot.pages
    .map((p) => `- **${p.name}**: ${p.freshness.emoji} ${p.freshness.label}`)
    .join('\n');

  const perPage = snapshot.pages
    .map(
      (p) =>
        `### ${p.name}\n- URL: ${p.url}\n- Coverage gaps: ${p.coverageGaps}\n- Freshness risk: ${p.freshnessRisk}`
    )
    .join('\n\n');

  return (
    `_Run: ${date}_\n\n` +
    `### Freshness summary\n${freshnessSummary}\n\n---\n\n` +
    `${perPage}\n\n---\n\n` +
    `### Cross-page consistency\n${snapshot.crossPageConsistency}`
  );
}

// ---------- GitHub Issue upsert ----------

async function findExistingIssue() {
  const url = `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues?state=open&labels=${REPORT_LABEL}&per_page=10`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
  });
  if (!res.ok) throw new Error(`Issue search failed: ${res.status}`);
  const issues = await res.json();
  return issues.find((i) => i.title === REPORT_TITLE) || null;
}

async function upsertIssue(body) {
  const existing = await findExistingIssue();

  if (existing) {
    await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${existing.number}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
      body: JSON.stringify({ body }),
    });
    await fetch(
      `https://api.github.com/repos/${GITHUB_REPOSITORY}/issues/${existing.number}/comments`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
        body: JSON.stringify({ body: `Snapshot updated:\n\n${body}` }),
      }
    );
    console.log(`Updated issue #${existing.number}`);
  } else {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPOSITORY}/issues`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github+json' },
      body: JSON.stringify({ title: REPORT_TITLE, body, labels: [REPORT_LABEL] }),
    });
    const created = await res.json();
    console.log(`Created issue #${created.number}`);
  }
}

// ---------- Main ----------

const snapshot = await buildReport();

mkdirSync(path.dirname(JSON_OUTPUT_PATH), { recursive: true });
writeFileSync(JSON_OUTPUT_PATH, JSON.stringify(snapshot, null, 2));
console.log(`Wrote ${JSON_OUTPUT_PATH}`);

const markdown = snapshotToMarkdown(snapshot);
await upsertIssue(markdown);
