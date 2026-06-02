---
name: markdown-normalizer
description: Normalize plain, loosely formatted, or inconsistent text into clean Markdown while preserving meaning. Use when the user asks to standardize, format, clean up, or convert prompts, notes, specs, checklists, instructions, or documents into Markdown without changing the substance.
---

# Markdown Normalizer

## Overview

Convert ordinary text or loosely structured content into well-formed Markdown. Preserve the source meaning and make the existing structure explicit with Markdown syntax.

## Core Rules

- Preserve the original language, meaning, ordering, constraints, examples, placeholders, and output requirements.
- Do not translate, summarize, expand, invent requirements, remove details, or change the user's intent unless explicitly asked.
- Improve only formatting, hierarchy, spacing, and Markdown syntax.
- Keep existing YAML frontmatter, metadata, or machine-readable blocks unchanged unless the user asks to edit them.
- Use the smallest Markdown structure that makes the content clear.

## Formatting Guide

- Use headings for clear sections.
- Use unordered lists for peer items and numbered lists for ordered steps.
- Use task lists only when the source already implies checkboxes or completion tracking.
- Use fenced code blocks for code, commands, templates, JSON, YAML, XML, logs, or text that must be copied verbatim. Add a language hint when obvious.
- Use inline code for file paths, commands, variables, UI labels, and literal identifiers.
- Use Markdown tables only when the source is already tabular or comparison-oriented.
- Normalize blank lines around headings, lists, blockquotes, tables, and fenced code blocks.
- Avoid decorative Markdown that does not improve readability.

## File Workflow

1. Read the target file or pasted content.
2. Identify the existing structure: title, sections, steps, lists, examples, constraints, and final output requirements.
3. Rewrite the content as Markdown-normalized text without changing the substance.
4. If editing a file, apply a focused patch to the target content only.
5. Read the result back and check that no source information was lost or invented.
6. Report the file updated and summarize the formatting changes briefly.

## Quality Check

Before finishing, verify:

- All original requirements are still present.
- Section hierarchy is clear and not over-nested.
- Lists and code fences render correctly.
- Literal examples, placeholders, and machine-readable snippets remain intact.
