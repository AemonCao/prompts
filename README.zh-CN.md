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

## 新增提示词

如果你在使用 Codex，可以直接使用 `prompt-archiver` skill。
它会帮你判断提示词属于哪个分类，创建目录，把原始提示词写入 `prompt.md`，再补上对应的元数据。

## 提示词目录

下面的目录会根据每个提示词的 `meta.yaml` 自动生成。
不要手动编辑生成区块，需要更新时运行：

```sh
node scripts/generate-prompt-catalog.mjs
```

检查目录是否为最新：

```sh
node scripts/generate-prompt-catalog.mjs --check
```

在新的 clone 中启用提交前自动更新目录：

```sh
node scripts/install-git-hooks.mjs
```

pre-commit hook 会从 Git 暂存区读取已暂存的 `meta.yaml`，更新中英文 README 里的目录区块，并把 README 更新加入本次提交，确保目录与提交内容一致。

<!-- prompt-catalog:start -->
<!-- 本区块由 prompts/*/*/meta.yaml 自动生成，请不要手动编辑标记之间的内容。 -->

### 业务

| 名称 | 状态 | 版本 | 语言 | 更新日期 | 标签 | 介绍 | 提示词 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 可复用工作流资产审计 | 草稿 | 1.0.0 | zh-CN | 2026-06-01 | 工作流审计, 自动化, 知识管理, Codex, 运营 | 审计近期工作记录，识别值得封装为 skill、子代理或自动化的重复手动流程。 | [prompt.md](prompts/business/reusable-workflow-asset-audit/prompt.md) |

### 多模态

| 名称 | 状态 | 版本 | 语言 | 更新日期 | 标签 | 介绍 | 提示词 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 潦草聊天表情包 | 草稿 | 1.0.0 | zh-CN | 2026-06-01 | 多模态, 图片生成, 表情包, 聊天贴纸, 风格参考, 中文 | 根据参考图生成 16 格中文聊天表情包，风格刻意保持粗糙的画图软件鼠标手绘感。 | [prompt.md](prompts/multimodal/messy-chat-sticker-pack/prompt.md) |

<!-- prompt-catalog:end -->

## 设计原则

把提示词当作资产，而不是散落的笔记。
保留原文，只加够用的元数据，让仓库保持简单、稳定、可持续维护。
