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
.agents/skills/prompt-archiver/
```

Each prompt lives in its own folder:

```text
prompts/<category>/<slug>/
├── <slug>.prompt.md
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
- Preserve the original prompt text in `<slug>.prompt.md`

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
The skill creates the folder, saves the raw prompt into `<slug>.prompt.md`, and writes the matching metadata.
The prompt file name should match the folder slug, for example `reusable-workflow-asset-audit.prompt.md`.

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
| Reusable Workflow Asset Audit | draft | 1.0.0 | zh-CN | 2026-06-01 | workflow-audit, automation, knowledge-management, codex, operations | Audits recent work history to identify repeated manual workflows worth packaging as skills, subagents, or automations. | [reusable-workflow-asset-audit.prompt.md](prompts/business/reusable-workflow-asset-audit/reusable-workflow-asset-audit.prompt.md) |

### Personal

| Name | Status | Version | Language | Updated | Tags | Summary | Prompt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Socratic Self-Inquiry Dialogue | draft | 1.0.0 | zh-CN | 2026-06-02 | personal-reflection, socratic-dialogue, self-inquiry, journaling | Guides a reflective Socratic dialogue that asks one adaptive question at a time before producing an insight report. | [socratic-self-inquiry-dialogue.prompt.md](prompts/personal/socratic-self-inquiry-dialogue/socratic-self-inquiry-dialogue.prompt.md) |

### Multimodal

| Name | Status | Version | Language | Updated | Tags | Summary | Prompt |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Architectural Infographic Vector Poster | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-editing, architecture, infographic, vector-art, poster-design | Converts an uploaded building photo into a precise front-elevation vector infographic poster with restrained annotations and measurement lines. | [architectural-infographic-vector-poster.prompt.md](prompts/multimodal/architectural-infographic-vector-poster/architectural-infographic-vector-poster.prompt.md) |
| Architecture Fridge Magnet Icon | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-editing, architecture, icon-design, fridge-magnet, souvenir | Extracts recognizable architectural features from a real photo and turns them into a simplified souvenir fridge-magnet-style icon. | [architecture-fridge-magnet-icon.prompt.md](prompts/multimodal/architecture-fridge-magnet-icon/architecture-fridge-magnet-icon.prompt.md) |
| Clumsy MS Paint Redraw | draft | 1.0.0 | en-US | 2026-06-02 | multimodal, image-editing, image-generation, style-transfer, ms-paint | Redraws a reference image in an intentionally clumsy, scribbly MS Paint style with a mouse-drawn pixel-by-pixel feel. | [clumsy-ms-paint-redraw.prompt.md](prompts/multimodal/clumsy-ms-paint-redraw/clumsy-ms-paint-redraw.prompt.md) |
| Dopamine Abstract Curve Vector Art | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-generation, vector-art, abstract-art, dopamine-color, minimalism | Creates minimalist dopamine-colored vector art with abstract lines, curved shapes, and irregular layered color blocks on white. | [dopamine-abstract-curve-vector-art.prompt.md](prompts/multimodal/dopamine-abstract-curve-vector-art/dopamine-abstract-curve-vector-art.prompt.md) |
| Image Forensic Reconstruction Prompt | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-analysis, image-generation, prompt-engineering, photography, artifact-analysis | Analyzes a reference image's photographic flaws, compression artifacts, and casual capture cues to produce model-ready image generation prompts. | [image-forensic-reconstruction-prompt.prompt.md](prompts/multimodal/image-forensic-reconstruction-prompt/image-forensic-reconstruction-prompt.prompt.md) |
| Korean Naive Flat Photo Redraw | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-editing, style-transfer, korean-illustration, flat-design, naive-art | Redraws a photo in a cute Korean naive flat illustration style with rough broken black outlines, saturated color blocks, and a bright blue background. | [korean-naive-flat-photo-redraw.prompt.md](prompts/multimodal/korean-naive-flat-photo-redraw/korean-naive-flat-photo-redraw.prompt.md) |
| Messy Chat Sticker Pack | draft | 1.0.0 | zh-CN | 2026-06-01 | multimodal, image-generation, stickers, chat-stickers, style-reference, zh-CN | Generates a 16-panel Chinese chat sticker pack from reference images in a deliberately crude MS Paint mouse-drawn style. | [messy-chat-sticker-pack.prompt.md](prompts/multimodal/messy-chat-sticker-pack/messy-chat-sticker-pack.prompt.md) |
| Minimalist Architectural Typography Poster | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-editing, architecture, poster-design, typography, minimalism | Turns a reference building into a refined vertical architectural poster with oversized background typography and restrained editorial annotations. | [minimalist-architectural-typography-poster.prompt.md](prompts/multimodal/minimalist-architectural-typography-poster/minimalist-architectural-typography-poster.prompt.md) |
| Monochrome Chinese Minimalist Vector Silhouette | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-generation, vector-art, chinese-aesthetic, minimalism, monochrome, silhouette | Creates elegant monochrome Chinese minimalist vector art with simplified silhouettes and subtle top-dark-to-bottom-light gradients. | [monochrome-chinese-minimalist-vector-silhouette.prompt.md](prompts/multimodal/monochrome-chinese-minimalist-vector-silhouette/monochrome-chinese-minimalist-vector-silhouette.prompt.md) |
| Noise Gradient Guochao Illustration | draft | 1.0.0 | zh-CN | 2026-06-02 | multimodal, image-generation, image-editing, style-transfer, guochao, gradient, vector-art | Transforms an image into a geometric guochao vector illustration with soft cyan-orange macaron gradients and a gentle hand-drawn feel. | [noise-gradient-guochao-illustration.prompt.md](prompts/multimodal/noise-gradient-guochao-illustration/noise-gradient-guochao-illustration.prompt.md) |

<!-- prompt-catalog:end -->

## Philosophy

Keep prompts as assets, not scattered notes.
Store the raw prompt, add just enough metadata to make it searchable, and keep the layout boring on purpose.

Chinese version: [README.zh-CN.md](README.zh-CN.md)
