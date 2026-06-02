---
name: prompt-archiver
description: Normalize pasted LLM prompts into clean Markdown, then classify, analyze, name, and store them in this prompt repository. Use when the user pastes a raw or loosely formatted prompt and wants it saved under prompts/coding, prompts/writing, prompts/business, prompts/personal, or prompts/multimodal with a <slug>.prompt.md file and machine-readable metadata.
---

# Prompt Archiver

## Overview

Turn a pasted prompt into a reusable repository entry. Normalize the prompt into clean Markdown while preserving its meaning, infer its purpose, choose the right category, create a stable slug, and store it under this repository's `prompts/` tree.

## Repository Layout

Use the current workspace root when it contains `prompts/`. Store entries at:

```text
prompts/<category>/<slug>/
├── <slug>.prompt.md
└── meta.yaml
```

Create `examples.md` and `tests.yaml` only when the user provides examples/tests or explicitly asks for scaffolding.

## Categories

- `coding`: code review, debugging, refactoring, architecture, tests, documentation for software projects, Git workflows.
- `writing`: drafting, rewriting, polishing, translation, summaries, titles, scripts, articles, emails.
- `business`: product, operations, marketing, sales, user research, PRD, meetings, strategy, analysis.
- `personal`: personal planning, reflection, learning, decision support, journaling, life admin.
- `multimodal`: prompts that consume or produce images, audio, video, screenshots, visual style references, image generation, image editing, image analysis.

If a prompt spans multiple categories, choose the category based on the primary output. Prefer `multimodal` whenever images, video, audio, or visual generation/editing are central to the prompt.

## Markdown Standardization

Before writing `<slug>.prompt.md`, convert the user's pasted prompt into well-formed Markdown:

- Preserve the original language, intent, constraints, ordering, examples, placeholders, and output requirements.
- Do not translate, summarize, expand, invent requirements, or "improve" the prompt beyond formatting.
- Add headings, bullet lists, numbered lists, blockquotes, tables, or fenced code blocks only when they make the existing structure explicit.
- Use fenced code blocks for literal templates, examples, JSON/YAML/XML/code, or text that must be copied verbatim. Add a language hint when it is obvious.
- Normalize spacing with blank lines around headings, lists, and code fences.
- If the prompt is already valid Markdown, make only minimal formatting fixes.
- If the user explicitly asks for exact preservation, follow that request and do not normalize.

## Workflow

1. Convert the pasted prompt to Markdown-normalized text for `<slug>.prompt.md` using the rules above.
2. Analyze the prompt and produce:
   - category
   - English hyphen-case slug
   - readable name
   - readable Chinese name
   - one-sentence summary
   - one-sentence Chinese summary
   - tags
   - Chinese tags
   - expected inputs, if any
   - expected output format
   - likely language
3. Inspect the target path before writing. If `prompts/<category>/<slug>/` already exists, read it first and avoid overwriting. For a new unrelated prompt, choose a more specific slug.
4. Use the bundled script to create the entry:

```powershell
@'
<paste the Markdown-normalized prompt here>
'@ | .\.agents\skills\prompt-archiver\scripts\New-PromptEntry.ps1 `
  -Root . `
  -Category coding `
  -Slug code-review `
  -Name "Code Review" `
  -NameZh "代码审查" `
  -Summary "Reviews a code diff for bugs, regressions, risks, and missing tests." `
  -SummaryZh "审查代码差异中的缺陷、回归风险、潜在问题和缺失测试。" `
  -Tags "coding,review,quality" `
  -TagsZh "代码,审查,质量" `
  -Inputs "diff,context" `
  -Outputs "markdown" `
  -Language "zh-CN"
```

5. After writing, tell the user where the prompt was stored, whether Markdown normalization was applied, and summarize the classification. Keep the response concise.

## Metadata Rules

`meta.yaml` should describe the prompt without duplicating the full prompt text:

```yaml
id: 'coding.code_review'
name: 'Code Review'
name_zh: '代码审查'
version: '1.0.0'
status: 'draft'
category: 'coding'
summary: 'Reviews a code diff for bugs, regressions, risks, and missing tests.'
summary_zh: '审查代码差异中的缺陷、回归风险、潜在问题和缺失测试。'
tags:
  - 'coding'
  - 'review'
tags_zh:
  - '代码'
  - '审查'
inputs:
  - name: 'diff'
    required: true
    description: ''
outputs:
  format: 'markdown'
language: 'zh-CN'
created: '2026-06-01'
updated: '2026-06-01'
```

Use `status: 'draft'` for newly captured prompts unless the user says it is already proven. Use semantic versions starting at `1.0.0`.

## Naming

Use short English slugs even when the prompt itself is Chinese:

- good: `code-review`, `image-style-transfer`, `meeting-summary`
- avoid: `prompt1`, `my-new-prompt`, long sentence slugs

Prefer specific slugs when a category contains similar prompts, such as `vue-code-review` instead of `code-review`.
