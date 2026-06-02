# Repository Guidelines

## Project Structure & Module Organization
This repository is a file-based prompt library. Prompt assets live under `prompts/<category>/<slug>/` with one `prompt.md` and one `meta.yaml` per prompt. Current categories are `coding`, `writing`, `business`, `personal`, and `multimodal`. Shared notes or helpers belong in `snippets/`. Repository automation lives in `scripts/`, and Git hooks live in `.githooks/`.

## Build, Test, and Development Commands
Use Node.js 18+.

- `node scripts/generate-prompt-catalog.mjs` updates the generated catalog sections in `README.md` and `README.zh-CN.md`.
- `node scripts/generate-prompt-catalog.mjs --check` verifies that the generated catalog is current.
- `node scripts/install-git-hooks.mjs` enables the repo pre-commit hook that refreshes the catalog before commits.

There is no separate build step.

## Coding Style & Naming Conventions
Keep prompt folders short, descriptive, and hyphen-case, for example `prompts/business/reusable-workflow-asset-audit/`. Preserve the raw prompt text in `prompt.md` and keep `meta.yaml` simple and explicit. Match existing Markdown style: plain headings, short paragraphs, and minimal decoration. Avoid tabs; use ASCII unless the prompt content requires otherwise.

## Testing Guidelines
There is no formal test runner in this repo. Treat catalog generation as the primary validation step: run `node scripts/generate-prompt-catalog.mjs --check` before opening a PR. If you add prompt-level checks, place them alongside the prompt as `tests.yaml` and keep them lightweight and reproducible.

## Commit & Pull Request Guidelines
Recent commits use an emoji plus Conventional Commit format, such as `✨ feat(prompt): ...`, `🐛 fix(prompt): ...`, and `📝 docs: ...`. Keep the scope specific and the summary short. PRs should explain what prompt assets changed, mention any new metadata fields or categories, and confirm the catalog is up to date. If you touched generated README sections, include that in the PR description.

## Agent-Specific Notes
Do not edit the generated catalog block in either README by hand. Regenerate it instead, then let the hook or script stage the README updates.

## Shared Skills
Shared agent skills live in `.agents/skills/`. When a task matches a skill, read the relevant `SKILL.md` before acting. Keep skill-specific helper scripts and agent metadata inside each skill folder.
