import { access, copyFile, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(scriptDir, '..');
const templateDbPath = resolve(projectRoot, '.astro', 'content.db');

function resolveTargetDbPath() {
  const configuredPath = process.env.ASTRO_DATABASE_FILE || '.astro/content.db';
  return isAbsolute(configuredPath) ? configuredPath : resolve(projectRoot, configuredPath);
}

async function pathExists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

async function ensureDatabaseFile() {
  const targetDbPath = resolveTargetDbPath();
  const targetExists = await pathExists(targetDbPath);

  if (targetExists) {
    return;
  }

  await mkdir(dirname(targetDbPath), { recursive: true });

  if (await pathExists(templateDbPath)) {
    await copyFile(templateDbPath, targetDbPath);
    return;
  }

  process.stderr.write(
    `[baseline] warning: template Astro DB file was not found at ${templateDbPath}. ` +
      `The runtime will start with ${targetDbPath}, but first write may fail if the file is still missing.\n`,
  );
}

await ensureDatabaseFile();

const child = spawn(process.execPath, [resolve(projectRoot, 'dist', 'server', 'entry.mjs')], {
  cwd: projectRoot,
  env: process.env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});
