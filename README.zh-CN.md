# 提示词仓库

这个仓库是一个基于文件的 LLM 提示词库，用来存放可复用、可管理、可版本化的提示词。
目标很简单：好找、好用、好扩展。

## 目录结构

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

每个提示词单独放在一个目录里：

```text
prompts/<category>/<slug>/
├── prompt.md
└── meta.yaml
```

可选文件：

- `examples.md`：示例用法
- `tests.yaml`：轻量测试样例

## 分类说明

- `coding`：代码审查、调试、重构、测试、架构、Git 流程
- `writing`：写作、改写、润色、翻译、总结、邮件、文章
- `business`：产品、运营、市场、销售、调研、会议、策略
- `personal`：计划、复盘、学习、决策辅助、生活管理
- `multimodal`：图片生成、图片编辑、图片分析、音频、视频、视觉提示词

## 命名规则

- 使用简短的英文 `hyphen-case` slug
- 一个提示词一个目录
- 尽量使用具体名称，避免过于泛化
- `prompt.md` 中保留原始提示词内容

## 元数据

`meta.yaml` 用来描述提示词，常见字段包括：

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

## 新增提示词

如果你在使用 Codex，可以直接使用 `prompt-archiver` skill。
它会帮你判断提示词属于哪个分类，创建目录，把原始提示词写入 `prompt.md`，再补上对应的元数据。

## 设计原则

把提示词当作资产，而不是散落的笔记。
保留原文，只加够用的元数据，让仓库保持简单、稳定、可持续维护。
