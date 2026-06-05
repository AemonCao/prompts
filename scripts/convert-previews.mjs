#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const DEFAULT_WIDTH = 1280;
const DEFAULT_QUALITY = 82;
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg']);

function usage() {
  return `Usage: node scripts/convert-previews.mjs <prompt-dir|examples/source-dir> [options]

Options:
  --width=1280     Maximum output width. Defaults to 1280.
  --quality=82     WebP quality, from 1 to 100. Defaults to 82.
  --force          Overwrite existing preview-*.webp files.
  --help           Show this help text.
`;
}

function fail(message) {
  console.error(`convert previews: ${message}`);
  process.exit(1);
}

function parseInteger(value, optionName) {
  if (!/^[0-9]+$/.test(value || '')) {
    fail(`${optionName} must be a positive integer.`);
  }

  return Number.parseInt(value, 10);
}

function readOptionValue(argv, index, optionName) {
  const value = argv[index + 1];
  if (!value || value.startsWith('-')) {
    fail(`missing value for ${optionName}.`);
  }

  return value;
}

function parseArgs(argv) {
  const options = {
    input: null,
    width: DEFAULT_WIDTH,
    quality: DEFAULT_QUALITY,
    force: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      options.help = true;
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg.startsWith('--width=')) {
      options.width = parseInteger(arg.slice('--width='.length), '--width');
    } else if (arg === '--width') {
      options.width = parseInteger(readOptionValue(argv, index, '--width'), '--width');
      index += 1;
    } else if (arg.startsWith('--quality=')) {
      options.quality = parseInteger(arg.slice('--quality='.length), '--quality');
    } else if (arg === '--quality') {
      options.quality = parseInteger(readOptionValue(argv, index, '--quality'), '--quality');
      index += 1;
    } else if (arg.startsWith('-')) {
      fail(`unknown option: ${arg}`);
    } else if (options.input === null) {
      options.input = arg;
    } else {
      fail(`unexpected argument: ${arg}`);
    }
  }

  if (options.help) {
    return options;
  }

  if (!options.input) {
    fail('missing input path. Pass a prompt directory or an examples/source directory.');
  }

  if (options.width < 1) {
    fail('--width must be greater than 0.');
  }

  if (options.quality < 1 || options.quality > 100) {
    fail('--quality must be between 1 and 100.');
  }

  return options;
}

function isDirectory(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

function resolveInput(input) {
  const absoluteInput = path.resolve(process.cwd(), input);

  if (!isDirectory(absoluteInput)) {
    fail(`input path is not a directory: ${input}`);
  }

  const basename = path.basename(absoluteInput).toLowerCase();
  const parentBasename = path.basename(path.dirname(absoluteInput)).toLowerCase();

  if (basename === 'source' && parentBasename === 'examples') {
    const examplesDir = path.dirname(absoluteInput);
    return {
      promptDir: path.dirname(examplesDir),
      examplesDir,
      sourceDir: absoluteInput,
    };
  }

  if (basename === 'examples' && isDirectory(path.join(absoluteInput, 'source'))) {
    return {
      promptDir: path.dirname(absoluteInput),
      examplesDir: absoluteInput,
      sourceDir: path.join(absoluteInput, 'source'),
    };
  }

  const examplesDir = path.join(absoluteInput, 'examples');
  const sourceDir = path.join(examplesDir, 'source');
  if (!isDirectory(sourceDir)) {
    fail(`could not find examples/source under ${input}. Create it or pass the source directory directly.`);
  }

  return {
    promptDir: absoluteInput,
    examplesDir,
    sourceDir,
  };
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

function listSourceImages(sourceDir) {
  return fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => IMAGE_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort(compareText)
    .map((name) => path.join(sourceDir, name));
}

function previewName(index) {
  return `preview-${String(index + 1).padStart(2, '0')}.webp`;
}

function formatBytes(bytes) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kib = bytes / 1024;
  if (kib < 1024) {
    return `${kib.toFixed(1)} KiB`;
  }

  return `${(kib / 1024).toFixed(2)} MiB`;
}

function parseYamlScalar(raw) {
  const value = raw.trim();

  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replaceAll("''", "'");
  }

  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value);
    } catch {
      return value.slice(1, -1);
    }
  }

  return value;
}

function readPromptVersion(promptDir) {
  const metaPath = path.join(promptDir, 'meta.yaml');
  if (!fs.existsSync(metaPath)) {
    return '';
  }

  const content = fs.readFileSync(metaPath, 'utf8');
  const versionLine = content
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .find((line) => line.match(/^version:\s+.+$/));

  if (!versionLine) {
    return '';
  }

  return parseYamlScalar(versionLine.slice(versionLine.indexOf(':') + 1));
}

function formatDimensions(metadata) {
  if (!metadata.width || !metadata.height) {
    return '';
  }

  return `${metadata.width} x ${metadata.height} px`;
}

function toExamplesPath(examplesDir, filePath) {
  return path.relative(examplesDir, filePath).split(path.sep).join('/');
}

function pad2(value) {
  return String(value).padStart(2, '0');
}

function inferSourceDetails(sourceFileName) {
  const chatGptTimestamp = sourceFileName.match(/ChatGPT Image (\d{4})年(\d{1,2})月(\d{1,2})日 (\d{1,2})_(\d{1,2})_(\d{1,2})/i);
  if (!chatGptTimestamp) {
    return {
      date: '',
      notes: '',
    };
  }

  const [, year, month, day, hour, minute, second] = chatGptTimestamp;
  const date = `${year}-${pad2(month)}-${pad2(day)}`;
  const time = `${pad2(hour)}:${pad2(minute)}:${pad2(second)}`;

  return {
    date,
    notes: `Source filename includes ChatGPT Image timestamp ${date} ${time}.`,
  };
}

function exampleFields(job, examplesDir, promptVersion) {
  const sourceFileName = path.basename(job.sourcePath);
  const inferred = inferSourceDetails(sourceFileName);
  const sourceDimensions = formatDimensions(job.sourceMetadata);
  const previewDimensions = formatDimensions(job.targetMetadata);
  const size = [previewDimensions, `preview ${formatBytes(job.targetBytes)}`]
    .filter(Boolean)
    .join('; ');
  const original = [
    toExamplesPath(examplesDir, job.sourcePath),
    sourceDimensions,
    formatBytes(job.sourceBytes),
  ]
    .filter(Boolean)
    .join('; ');

  return [
    ['Model', ''],
    ['Size', size],
    ['Date', inferred.date],
    ['Seed', ''],
    ['Prompt version', promptVersion],
    ['Notes', inferred.notes],
    ['Original', original],
  ];
}

function formatExampleSection(job, examplesDir, promptVersion) {
  const lines = [
    `## ${job.title}`,
    '',
    `![${job.title}](${job.fileName})`,
    '',
  ];

  for (const [name, value] of exampleFields(job, examplesDir, promptVersion)) {
    lines.push(value ? `- ${name}: ${value}` : `- ${name}:`);
  }

  return lines.join('\n');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mergeExampleSection(currentSection, job, examplesDir, promptVersion) {
  let updatedSection = currentSection.trimEnd();

  for (const [name, value] of exampleFields(job, examplesDir, promptVersion)) {
    const fieldPattern = new RegExp(`^- ${escapeRegExp(name)}:(.*)$`, 'm');
    const fieldMatch = updatedSection.match(fieldPattern);
    const desiredLine = value ? `- ${name}: ${value}` : `- ${name}:`;

    if (!fieldMatch) {
      updatedSection = `${updatedSection}\n${desiredLine}`;
      continue;
    }

    if (fieldMatch[1].trim() === '' && value !== '') {
      updatedSection = updatedSection.replace(fieldPattern, desiredLine);
    }
  }

  return updatedSection;
}

function upsertExamplesDocument(examplesDir, outputs, promptVersion) {
  const examplesMd = path.join(examplesDir, 'examples.md');
  if (fs.existsSync(examplesMd)) {
    let content = fs.readFileSync(examplesMd, 'utf8')
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trimEnd();

    for (const output of outputs) {
      const sectionPattern = new RegExp(`(^|\\n)(## ${escapeRegExp(output.title)}\\n[\\s\\S]*?)(?=\\n## |$)`);
      const sectionMatch = content.match(sectionPattern);

      if (sectionMatch) {
        content = content.replace(sectionPattern, `${sectionMatch[1]}${mergeExampleSection(sectionMatch[2], output, examplesDir, promptVersion)}\n`);
      } else {
        content = `${content}\n\n${formatExampleSection(output, examplesDir, promptVersion)}`;
      }
    }

    fs.writeFileSync(examplesMd, `${content}\n`, 'utf8');
    return 'updated';
  }

  const lines = ['# Examples', ''];
  for (const output of outputs) {
    lines.push(formatExampleSection(output, examplesDir, promptVersion), '');
  }

  fs.writeFileSync(examplesMd, `${lines.join('\n').trimEnd()}\n`, 'utf8');
  return 'created';
}

async function convertImage(sourcePath, targetPath, options) {
  await sharp(sourcePath)
    .rotate()
    .resize({
      width: options.width,
      withoutEnlargement: true,
    })
    .webp({
      quality: options.quality,
    })
    .toFile(targetPath);
}

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(usage());
    return;
  }

  const paths = resolveInput(options.input);
  const sources = listSourceImages(paths.sourceDir);

  if (sources.length === 0) {
    fail(`no PNG or JPG files found in ${paths.sourceDir}`);
  }

  fs.mkdirSync(paths.examplesDir, { recursive: true });

  const jobs = sources.map((sourcePath, index) => ({
    sourcePath,
    targetPath: path.join(paths.examplesDir, previewName(index)),
    fileName: previewName(index),
    title: `Preview ${String(index + 1).padStart(2, '0')}`,
  }));

  if (!options.force) {
    const existingTargets = jobs
      .map((job) => job.targetPath)
      .filter((targetPath) => fs.existsSync(targetPath));

    if (existingTargets.length > 0) {
      fail(`refusing to overwrite existing previews without --force:\n${existingTargets.join('\n')}`);
    }
  }

  console.log(`Converting ${jobs.length} image${jobs.length === 1 ? '' : 's'} from ${paths.sourceDir}`);
  const outputs = [];
  const promptVersion = readPromptVersion(paths.promptDir);

  for (const job of jobs) {
    const sourceBytes = fs.statSync(job.sourcePath).size;
    const sourceMetadata = await sharp(job.sourcePath).metadata();
    await convertImage(job.sourcePath, job.targetPath, options);
    const targetBytes = fs.statSync(job.targetPath).size;
    const targetMetadata = await sharp(job.targetPath).metadata();

    outputs.push({
      ...job,
      sourceBytes,
      sourceMetadata,
      targetBytes,
      targetMetadata,
    });
    console.log(`${path.basename(job.sourcePath)} -> ${path.relative(process.cwd(), job.targetPath)} (${formatBytes(sourceBytes)} -> ${formatBytes(targetBytes)})`);
  }

  const examplesStatus = upsertExamplesDocument(paths.examplesDir, outputs, promptVersion);
  if (examplesStatus === 'created') {
    console.log(`Created ${path.relative(process.cwd(), path.join(paths.examplesDir, 'examples.md'))}`);
  } else {
    console.log(`Updated ${path.relative(process.cwd(), path.join(paths.examplesDir, 'examples.md'))}`);
  }
}

main().catch((error) => {
  fail(error.message);
});
