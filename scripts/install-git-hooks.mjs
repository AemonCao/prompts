#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function runGit(args, cwd) {
  const result = spawnSync('git', args, {
    cwd,
    encoding: 'utf8',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error((result.stderr || result.stdout || `git ${args.join(' ')} failed`).trim());
  }

  return result.stdout;
}

function fail(message) {
  console.error(`install git hooks: ${message}`);
  process.exit(1);
}

function main() {
  let root;
  try {
    root = runGit(['rev-parse', '--show-toplevel'], process.cwd()).trim();
  } catch (error) {
    fail(`could not find a Git repository: ${error.message}`);
  }

  const hooksPath = path.join(root, '.githooks');
  const preCommitPath = path.join(hooksPath, 'pre-commit');

  if (!fs.existsSync(preCommitPath)) {
    fail(`missing hook file: ${preCommitPath}`);
  }

  try {
    runGit(['config', 'core.hooksPath', '.githooks'], root);
  } catch (error) {
    fail(`could not configure core.hooksPath: ${error.message}`);
  }

  if (process.platform !== 'win32') {
    try {
      fs.chmodSync(preCommitPath, 0o755);
    } catch (error) {
      fail(`could not make .githooks/pre-commit executable: ${error.message}`);
    }
  }

  console.log('Installed repository Git hooks.');
  console.log('');
  console.log('Manual commands:');
  console.log('  Generate prompt catalog:  node scripts/generate-prompt-catalog.mjs');
  console.log('  Check prompt catalog:     node scripts/generate-prompt-catalog.mjs --check');
  console.log('  Generate snippet catalog: node scripts/generate-snippet-catalog.mjs');
  console.log('  Check snippet catalog:    node scripts/generate-snippet-catalog.mjs --check');
  console.log('  Disable hooks:            git config --unset core.hooksPath');
}

main();
