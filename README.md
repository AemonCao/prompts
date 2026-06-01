# Prompt Repository

This repository is a personal, file-based library for reusable LLM prompts.
The goal is to keep prompts easy to find, easy to version, and easy to reuse.

## Structure

```text
prompts/
  coding/
  writing/
  business/
  personal/
  multimodal/
snippets/
.codex/skills/prompt-archiver/
```

Each prompt lives in its own folder:

```text
prompts/<category>/<slug>/
├── prompt.md
└── meta.yaml
```

Optional files:

- `examples.md` for usage examples
- `tests.yaml` for lightweight evaluation cases

## Categories

- `coding`: code review, debugging, refactoring, tests, architecture, Git workflows
- `writing`: drafting, rewriting, polishing, translation, summaries, emails, articles
- `business`: product, operations, marketing, sales, research, meetings, strategy
- `personal`: planning, reflection, learning, decision support, life admin
- `multimodal`: image generation, image editing, image analysis, audio, video, visual prompts

## Naming

- Use short English hyphen-case slugs
- Keep one prompt per folder
- Prefer specific names over generic ones
- Preserve the original prompt text in `prompt.md`

## Metadata

`meta.yaml` should describe the prompt with fields such as:

- `id`
- `name`
- `version`
- `status`
- `category`
- `summary`
- `tags`
- `inputs`
- `outputs`
- `language`
- `created`
- `updated`

## Adding a Prompt

When using Codex, use the `prompt-archiver` skill to classify a pasted prompt and store it in the right folder.
The skill creates the folder, saves the raw prompt into `prompt.md`, and writes the matching metadata.

## Philosophy

Keep prompts as assets, not scattered notes.
Store the raw prompt, add just enough metadata to make it searchable, and keep the layout boring on purpose.

Chinese version: [README.zh-CN.md](README.zh-CN.md)
