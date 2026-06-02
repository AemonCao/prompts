#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const REQUIRED_STRING_FIELDS = [
  'id',
  'name',
  'name_zh',
  'status',
  'type',
  'summary',
  'summary_zh',
  'language',
  'updated',
  'entry',
  'entry_zh',
];
const START_MARKER = '<!-- snippet-catalog:start -->';
const END_MARKER = '<!-- snippet-catalog:end -->';

function usage() {
  return `Usage: node scripts/generate-snippet-catalog.mjs [options]

Options:
  --source=worktree|index  Read snippet metadata from the working tree or Git index.
                           Defaults to worktree.
  --readme=PATH            English README to update. Defaults to README.md.
  --readme-zh=PATH         Chinese README to update. Defaults to README.zh-CN.md.
  --output=PATH            Optional standalone English catalog output.
  --output-zh=PATH         Optional standalone Chinese catalog output.
  --check                  Check whether generated outputs are up to date.
  --help                   Show this help text.
`;
}

function fail(message) {
  console.error(`snippet catalog: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {
    source: 'worktree',
    readme: 'README.md',
    readmeZh: 'README.zh-CN.md',
    output: null,
    outputZh: null,
    check: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--check') {
      options.check = true;
    } else if (arg.startsWith('--source=')) {
      options.source = arg.slice('--source='.length);
    } else if (arg === '--source') {
      index += 1;
      options.source = argv[index];
    } else if (arg.startsWith('--readme=')) {
      options.readme = arg.slice('--readme='.length);
    } else if (arg === '--readme') {
      index += 1;
      options.readme = argv[index];
    } else if (arg.startsWith('--readme-zh=')) {
      options.readmeZh = arg.slice('--readme-zh='.length);
    } else if (arg === '--readme-zh') {
      index += 1;
      options.readmeZh = argv[index];
    } else if (arg.startsWith('--output=')) {
      options.output = arg.slice('--output='.length);
    } else if (arg === '--output') {
      index += 1;
      options.output = argv[index];
    } else if (arg.startsWith('--output-zh=')) {
      options.outputZh = arg.slice('--output-zh='.length);
    } else if (arg === '--output-zh') {
      index += 1;
      options.outputZh = argv[index];
    } else {
      fail(`unknown option: ${arg}`);
    }
  }

  if (options.help) {
    return options;
  }

  for (const [name, value] of Object.entries({
    '--source': options.source,
    '--readme': options.readme,
    '--readme-zh': options.readmeZh,
    '--output': options.output,
    '--output-zh': options.outputZh,
  })) {
    if (value !== null && (!value || value.startsWith('-'))) {
      fail(`missing value for ${name}.`);
    }
  }

  if (!['worktree', 'index'].includes(options.source)) {
    fail(`unsupported source "${options.source}". Use "worktree" or "index".`);
  }

  return options;
}

function runGit(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args.join(' ')} failed`).trim());
  }

  return result.stdout;
}

function findRepoRoot() {
  try {
    return runGit(['rev-parse', '--show-toplevel'], process.cwd()).trim();
  } catch {
    return process.cwd();
  }
}

function toPosixPath(value) {
  return value.split(path.sep).join('/');
}

function fromPosixPath(root, value) {
  return path.join(root, ...value.split('/'));
}

function compareText(left, right) {
  const normalizedLeft = left.toLowerCase();
  const normalizedRight = right.toLowerCase();

  if (normalizedLeft < normalizedRight) {
    return -1;
  }

  if (normalizedLeft > normalizedRight) {
    return 1;
  }

  if (left < right) {
    return -1;
  }

  if (left > right) {
    return 1;
  }

  return 0;
}

function listWorktreeMetaFiles(root) {
  const snippetsRoot = path.join(root, 'snippets');

  if (!fs.existsSync(snippetsRoot) || !fs.statSync(snippetsRoot).isDirectory()) {
    fail(`could not find snippets directory under ${root}`);
  }

  const files = [];
  for (const entry of fs.readdirSync(snippetsRoot, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }

    const repoPath = `snippets/${entry.name}/meta.yaml`;
    const metaPath = fromPosixPath(root, repoPath);
    if (fs.existsSync(metaPath) && fs.statSync(metaPath).isFile()) {
      files.push(repoPath);
    }
  }

  return files.sort(compareText);
}

function listIndexFiles(root) {
  try {
    const output = runGit(['ls-files', '-z', '--', 'snippets'], root);
    return output.split('\0').filter(Boolean);
  } catch (error) {
    fail(`could not list Git index files: ${error.message}`);
  }
}

function listIndexMetaFiles(root) {
  return listIndexFiles(root)
    .filter((file) => /^snippets\/[^/]+\/meta\.yaml$/.test(file))
    .sort(compareText);
}

function readFileFromSource(root, source, repoPath) {
  if (source === 'worktree') {
    return fs.readFileSync(fromPosixPath(root, repoPath), 'utf8');
  }

  try {
    return runGit(['show', `:${repoPath}`], root);
  } catch (error) {
    fail(`could not read ${repoPath} from Git index: ${error.message}`);
  }
}

function fileExists(root, source, repoPath, indexFileSet) {
  if (source === 'worktree') {
    const absolutePath = fromPosixPath(root, repoPath);
    return fs.existsSync(absolutePath) && fs.statSync(absolutePath).isFile();
  }

  return indexFileSet.has(repoPath);
}

function parseScalar(raw, filePath, lineNumber) {
  const value = raw.trim();

  if (value === '[]') {
    return [];
  }

  if (value === '{}') {
    return {};
  }

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  if (value === 'null' || value === '~') {
    return null;
  }

  if (value.startsWith("'")) {
    if (!value.endsWith("'") || value.length === 1) {
      fail(`${filePath}:${lineNumber} has an unterminated single-quoted scalar.`);
    }

    return value.slice(1, -1).replaceAll("''", "'");
  }

  if (value.startsWith('"')) {
    if (!value.endsWith('"') || value.length === 1) {
      fail(`${filePath}:${lineNumber} has an unterminated double-quoted scalar.`);
    }

    try {
      return JSON.parse(value);
    } catch {
      fail(`${filePath}:${lineNumber} has an invalid double-quoted scalar.`);
    }
  }

  if (value.startsWith('[') || value.startsWith('{')) {
    fail(`${filePath}:${lineNumber} uses inline YAML collections, which are not supported except [] and {}.`);
  }

  return value;
}

function parseKeyValue(line, expectedIndent, filePath, lineNumber) {
  const indent = line.match(/^ */)[0].length;
  if (indent !== expectedIndent) {
    fail(`${filePath}:${lineNumber} has unsupported indentation.`);
  }

  const content = line.slice(expectedIndent);
  const match = content.match(/^([A-Za-z0-9_-]+):(.*)$/);
  if (!match) {
    fail(`${filePath}:${lineNumber} is not a supported key/value line.`);
  }

  return {
    key: match[1],
    rest: match[2],
  };
}

function nextContentLine(lines, startIndex) {
  for (let index = startIndex; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() !== '' && !line.trimStart().startsWith('#')) {
      return index;
    }
  }

  return -1;
}

function parseNestedBlock(lines, startIndex, filePath) {
  const firstIndex = nextContentLine(lines, startIndex);

  if (firstIndex === -1 || !lines[firstIndex].startsWith('  ')) {
    return {
      value: {},
      nextIndex: startIndex,
    };
  }

  if (lines[firstIndex].startsWith('  - ')) {
    return parseList(lines, startIndex, filePath);
  }

  return parseMap(lines, startIndex, filePath);
}

function parseList(lines, startIndex, filePath) {
  const list = [];
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      index += 1;
      continue;
    }

    if (!line.startsWith('  ')) {
      break;
    }

    if (!line.startsWith('  - ')) {
      fail(`${filePath}:${index + 1} is not a supported list item.`);
    }

    list.push(parseScalar(line.slice(4), filePath, index + 1));
    index += 1;
  }

  return {
    value: list,
    nextIndex: index,
  };
}

function parseMap(lines, startIndex, filePath) {
  const object = {};
  let index = startIndex;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      index += 1;
      continue;
    }

    if (!line.startsWith('  ')) {
      break;
    }

    const entry = parseKeyValue(line, 2, filePath, index + 1);
    if (entry.rest.trim() === '') {
      fail(`${filePath}:${index + 1} uses nested maps, which are not supported.`);
    }

    object[entry.key] = parseScalar(entry.rest, filePath, index + 1);
    index += 1;
  }

  return {
    value: object,
    nextIndex: index,
  };
}

function parseMetaYaml(content, filePath) {
  if (content.includes('\t')) {
    fail(`${filePath} contains tabs, which are not supported in this YAML subset.`);
  }

  const meta = {};
  const lines = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (line.trim() === '' || line.trimStart().startsWith('#')) {
      index += 1;
      continue;
    }

    const entry = parseKeyValue(line, 0, filePath, index + 1);
    if (Object.hasOwn(meta, entry.key)) {
      fail(`${filePath}:${index + 1} repeats key "${entry.key}".`);
    }

    if (entry.rest.trim() === '') {
      const nested = parseNestedBlock(lines, index + 1, filePath);
      meta[entry.key] = nested.value;
      index = nested.nextIndex;
    } else {
      meta[entry.key] = parseScalar(entry.rest, filePath, index + 1);
      index += 1;
    }
  }

  return meta;
}

function validateString(meta, field, filePath) {
  if (typeof meta[field] !== 'string' || meta[field].trim() === '') {
    fail(`${filePath} is missing required string field "${field}".`);
  }
}

function validateStringList(meta, field, filePath) {
  if (!Array.isArray(meta[field])) {
    fail(`${filePath} is missing required list field "${field}".`);
  }

  return meta[field].map((item, index) => {
    if (typeof item !== 'string' || item.trim() === '') {
      fail(`${filePath} has a non-string or empty value in "${field}" at index ${index}.`);
    }

    return item;
  });
}

function validateEntryPath(value, field, metaPath) {
  if (value.includes('/') || value.includes('\\') || value === '.' || value === '..' || value === 'meta.yaml') {
    fail(`${metaPath} has unsupported "${field}" value "${value}". Use a sibling file name.`);
  }
}

function buildEntries(root, source) {
  const metaFiles = source === 'index' ? listIndexMetaFiles(root) : listWorktreeMetaFiles(root);
  const indexFileSet = source === 'index' ? new Set(listIndexFiles(root)) : null;
  const seenIds = new Map();
  const entries = [];

  for (const metaPath of metaFiles) {
    const [, slug] = metaPath.match(/^snippets\/([^/]+)\/meta\.yaml$/);
    const content = readFileFromSource(root, source, metaPath);
    const meta = parseMetaYaml(content, metaPath);

    for (const field of REQUIRED_STRING_FIELDS) {
      validateString(meta, field, metaPath);
    }

    const tags = validateStringList(meta, 'tags', metaPath);
    const tagsZh = validateStringList(meta, 'tags_zh', metaPath);

    validateEntryPath(meta.entry, 'entry', metaPath);
    validateEntryPath(meta.entry_zh, 'entry_zh', metaPath);

    const entryPath = `snippets/${slug}/${meta.entry}`;
    const entryZhPath = `snippets/${slug}/${meta.entry_zh}`;
    if (!fileExists(root, source, entryPath, indexFileSet)) {
      fail(`${metaPath} points to missing entry file ${entryPath} in ${source}.`);
    }

    if (!fileExists(root, source, entryZhPath, indexFileSet)) {
      fail(`${metaPath} points to missing entry_zh file ${entryZhPath} in ${source}.`);
    }

    if (seenIds.has(meta.id)) {
      fail(`${metaPath} duplicates id "${meta.id}" already used by ${seenIds.get(meta.id)}.`);
    }

    seenIds.set(meta.id, metaPath);

    entries.push({
      id: meta.id,
      name: meta.name,
      nameZh: meta.name_zh,
      status: meta.status,
      type: meta.type,
      summary: meta.summary,
      summaryZh: meta.summary_zh,
      tags,
      tagsZh,
      language: meta.language,
      updated: meta.updated,
      entryPath,
      entryZhPath,
      entryFileName: meta.entry,
      entryZhFileName: meta.entry_zh,
    });
  }

  return entries.sort((left, right) => compareText(left.type, right.type) || compareText(left.name, right.name) || compareText(left.id, right.id));
}

function escapeTableCell(value) {
  return String(value)
    .replaceAll('\\', '\\\\')
    .replaceAll('|', '\\|')
    .replaceAll('\n', '<br>')
    .trim();
}

function displayStatus(status, locale) {
  if (locale !== 'zh') {
    return status;
  }

  return {
    draft: '草稿',
    stable: '稳定',
    deprecated: '已弃用',
  }[status] || status;
}

function displayLanguage(language, locale) {
  if (locale !== 'zh') {
    return language;
  }

  return {
    bilingual: '双语',
    'zh-CN': '中文',
    'en-US': '英文',
  }[language] || language;
}

function displayType(type, locale) {
  if (locale !== 'zh') {
    return type;
  }

  return {
    checklist: '清单',
    example: '示例',
    glossary: '术语表',
    reference: '参考资料',
    template: '模板',
    vocabulary: '词汇表',
  }[type] || type;
}

function generateCatalogSection(entries, locale) {
  const generatedComment = locale === 'zh'
    ? '<!-- 本区块由 snippets/*/meta.yaml 自动生成，请不要手动编辑标记之间的内容。 -->'
    : '<!-- This section is generated from snippets/*/meta.yaml. Do not edit between the markers. -->';
  const lines = [
    START_MARKER,
    generatedComment,
    '',
  ];

  if (entries.length === 0) {
    lines.push(locale === 'zh' ? '_暂未收录片段。_' : '_No snippets found._', '');
    lines.push(END_MARKER);
    return lines.join('\n');
  }

  if (locale === 'zh') {
    lines.push('| 名称 | 类型 | 状态 | 语言 | 更新日期 | 标签 | 介绍 | 片段 |');
  } else {
    lines.push('| Name | Type | Status | Language | Updated | Tags | Summary | Snippet |');
  }

  lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');

  for (const entry of entries) {
    const row = locale === 'zh'
      ? [
          entry.nameZh,
          displayType(entry.type, locale),
          displayStatus(entry.status, locale),
          displayLanguage(entry.language, locale),
          entry.updated,
          entry.tagsZh.join(', '),
          entry.summaryZh,
          `[${entry.entryZhFileName}](${entry.entryZhPath})`,
        ]
      : [
          entry.name,
          displayType(entry.type, locale),
          displayStatus(entry.status, locale),
          displayLanguage(entry.language, locale),
          entry.updated,
          entry.tags.join(', '),
          entry.summary,
          `[${entry.entryFileName}](${entry.entryPath})`,
        ];

    lines.push(`| ${row.map(escapeTableCell).join(' | ')} |`);
  }

  lines.push('', END_MARKER);
  return lines.join('\n');
}

function generateStandaloneCatalog(entries, locale) {
  const title = locale === 'zh' ? '# 片段目录' : '# Snippet Catalog';
  return `${title}\n\n${generateCatalogSection(entries, locale)}\n`;
}

function replaceGeneratedSection(content, generated, repoPath) {
  const start = content.indexOf(START_MARKER);
  const end = content.indexOf(END_MARKER);

  if (start === -1 || end === -1 || end < start) {
    fail(`${repoPath} is missing ${START_MARKER} and ${END_MARKER} markers.`);
  }

  const afterEnd = end + END_MARKER.length;
  return `${content.slice(0, start)}${generated}${content.slice(afterEnd)}`;
}

function updateOrCheckFile(root, repoPath, desired, check) {
  const absolutePath = path.resolve(root, repoPath);
  const current = fs.existsSync(absolutePath) ? fs.readFileSync(absolutePath, 'utf8') : null;

  if (check) {
    if (current !== desired) {
      fail(`${toPosixPath(path.relative(root, absolutePath))} is out of date. Run: node scripts/generate-snippet-catalog.mjs`);
    }

    return false;
  }

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, desired, 'utf8');
  return current !== desired;
}

function updateReadme(root, repoPath, generatedSection, check) {
  const absolutePath = path.resolve(root, repoPath);
  if (!fs.existsSync(absolutePath)) {
    fail(`could not find README file: ${toPosixPath(path.relative(root, absolutePath))}`);
  }

  const current = fs.readFileSync(absolutePath, 'utf8');
  const desired = replaceGeneratedSection(current, generatedSection, toPosixPath(path.relative(root, absolutePath)));

  return updateOrCheckFile(root, repoPath, desired, check);
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const root = findRepoRoot();
  const entries = buildEntries(root, options.source);
  const generatedEn = generateCatalogSection(entries, 'en');
  const generatedZh = generateCatalogSection(entries, 'zh');
  const changed = [];

  if (updateReadme(root, options.readme, generatedEn, options.check)) {
    changed.push(options.readme);
  }

  if (updateReadme(root, options.readmeZh, generatedZh, options.check)) {
    changed.push(options.readmeZh);
  }

  if (options.output) {
    if (updateOrCheckFile(root, options.output, generateStandaloneCatalog(entries, 'en'), options.check)) {
      changed.push(options.output);
    }
  }

  if (options.outputZh) {
    if (updateOrCheckFile(root, options.outputZh, generateStandaloneCatalog(entries, 'zh'), options.check)) {
      changed.push(options.outputZh);
    }
  }

  if (options.check) {
    console.log('Generated snippet catalog sections are up to date.');
  } else {
    const targets = changed.length > 0 ? changed.map((item) => toPosixPath(item)).join(', ') : 'no files changed';
    console.log(`Generated snippet catalog from ${entries.length} snippet metadata file${entries.length === 1 ? '' : 's'}: ${targets}.`);
  }
}

main();
