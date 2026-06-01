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
- `name_zh`
- `version`
- `status`
- `category`
- `summary`
- `summary_zh`
- `tags`
- `tags_zh`
- `inputs`
- `outputs`
- `language`
- `created`
- `updated`

## Adding a Prompt

When using Codex, use the `prompt-archiver` skill to classify a pasted prompt and store it in the right folder.
The skill creates the folder, saves the raw prompt into `prompt.md`, and writes the matching metadata.

## Prompt Catalog

The catalog below is generated from each prompt's `meta.yaml`.
Do not edit the generated section manually; regenerate it instead:

```sh
node scripts/generate-prompt-catalog.mjs
```

To check whether the catalog is current:

```sh
node scripts/generate-prompt-catalog.mjs --check
```

To enable automatic catalog updates before each commit in a new clone:

```sh
node scripts/install-git-hooks.mjs
```

The pre-commit hook reads staged `meta.yaml` files from the Git index, updates the generated catalog sections in both READMEs, and stages those README updates so the catalog matches the commit.

<!-- prompt-catalog:start -->
<!-- This section is generated from prompts/*/*/meta.yaml. Do not edit between the markers. -->

### Business

| Name | Status | Version | Language | Updated | Tags | Summary | Prompt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Reusable Workflow Asset Audit | draft | 1.0.0 | zh-CN | 2026-06-01 | workflow-audit, automation, knowledge-management, codex, operations | Audits recent work history to identify repeated manual workflows worth packaging as skills, subagents, or automations. | [prompt.md](prompts/business/reusable-workflow-asset-audit/prompt.md) |

### Multimodal

| Name | Status | Version | Language | Updated | Tags | Summary | Prompt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Clumsy MS Paint Redraw | draft | 1.0.0 | en-US | 2026-06-02 | multimodal, image-editing, image-generation, style-transfer, ms-paint | Redraws a reference image in an intentionally clumsy, scribbly MS Paint style with a mouse-drawn pixel-by-pixel feel. | [prompt.md](prompts/multimodal/clumsy-ms-paint-redraw/prompt.md) |
| Messy Chat Sticker Pack | draft | 1.0.0 | zh-CN | 2026-06-01 | multimodal, image-generation, stickers, chat-stickers, style-reference, zh-CN | Generates a 16-panel Chinese chat sticker pack from reference images in a deliberately crude MS Paint mouse-drawn style. | [prompt.md](prompts/multimodal/messy-chat-sticker-pack/prompt.md) |

<!-- prompt-catalog:end -->

## Philosophy

Keep prompts as assets, not scattered notes.
Store the raw prompt, add just enough metadata to make it searchable, and keep the layout boring on purpose.

Chinese version: [README.zh-CN.md](README.zh-CN.md)
