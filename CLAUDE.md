# CLAUDE.md — Daily Investing-Learning Content Routine

This repo is a static, GitHub Pages–hosted learning site. Each day, **one** new lesson
is generated for the next topic in a fixed 100-topic curriculum. This file tells you
(Claude, running via the daily routine) exactly what to do on each run.

## Mission (per run)

Generate **one** in-depth, interactive Chinese learning document for the **next**
un-covered topic, in strict numeric order 1 → 100. Then rebuild the manifest.

## Step-by-step

1. **Determine the next topic number `N`.**
   - List `content/*.md` files that are named `YYYY-MM-DD.md`.
   - In each, read the first `# ` heading; parse its topic number from the
     `Topic <num>：...` prefix.
   - `N = (highest topic number found) + 1`. If `content/` has no lesson files yet,
     `N = 1`.
   - If `N > 100`, the curriculum is complete — write nothing and stop, noting it.

2. **Look up topic `N`** in `投资理财学习100Topics.md` (root of repo). Use its title and
   the module it belongs to for context. Read neighboring topics so the lesson connects
   to what came before and teases what comes next.

3. **Research before writing.** This is a *learning* site built from first principles —
   accuracy matters. Verify concepts, numbers, formulas, and historical facts (use web
   search if available). Explain the underlying "why", not just the "what".

4. **Write the lesson** to `content/<TODAY>.md` where `<TODAY>` is today's date in
   `YYYY-MM-DD` format (this is the user's local date). Follow the format spec below.
   - If a file for today already exists, overwrite it (one lesson per day).

5. **Rebuild the manifest:** run `python3 scripts/build_manifest.py`.

6. **Commit & push** to `main` (this triggers the GitHub Actions deploy). Commit message:
   `Add Topic N: <title>`.

## Lesson format spec (IMPORTANT — the site depends on it)

- **Language: Chinese (简体中文).** All lesson content is in Chinese.
- **First line MUST be an H1 of the exact form:** `# Topic N：<标题>`
  (full-width colon `：` is fine). `build_manifest.py` reads this as the title, and
  `app.js` parses the `N` to track progress (`N / 100`) and number the sidebar. Do not
  omit `Topic N`.
- The file is rendered as Markdown by `marked` in the browser, with:
  - **Math via MathJax**: use `$...$` for inline and `$$...$$` for display formulas.
  - **GFM tables, blockquotes, lists, code blocks** — all supported.
  - **Embedded HTML + `<script>` for interactivity**: the site executes `<script>` tags
    inside content, so you can build live calculators, sliders, quizzes, charts, etc.
- **Make it genuinely interactive when the topic benefits** (compounding calculators,
  inflation erosion sliders, risk/return plots, bond-price-vs-rate demos…). Wrap widgets
  in `<div class="widget">…</div>` — the site already styles `.widget`, its labels,
  `input[type=range]`, `input[type=number]`, `select`, `button`, and `.result`.
  Keep widget JS self-contained in an IIFE and guard for missing elements.
- **Pedagogy**: start from first principles → build intuition → use a concrete example or
  interactive demo → connect to investing decisions → end with a 小结 (summary) and a
  one-line teaser for `Topic N+1`.
- See `content/2026-06-17.md` (Topic 1) as the reference example for tone, depth, and the
  interactive-widget pattern.
- Singapore context is welcome where relevant (the curriculum references MAS, CPF, SG tax,
  SG REITs) — the learner is Singapore-based.
- End every lesson with a disclaimer line: *本文为个人学习笔记，不构成任何投资建议。*

## What NOT to do

- Don't generate more than one topic per run, and don't skip ahead or out of order.
- Don't rename `投资理财学习100Topics.md` or change the `YYYY-MM-DD.md` naming convention.
- Don't edit `index.html` / `app.js` / `styles.css` as part of a content run — those are
  the app shell, not content.
