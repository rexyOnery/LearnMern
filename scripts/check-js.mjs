import { readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const roots = process.argv.slice(2);

if (roots.length === 0) {
  console.error('Usage: node scripts/check-js.mjs <path> [...path]');
  process.exit(1);
}

const collectJsFiles = (entry) => {
  const absoluteEntry = resolve(entry);
  const stat = statSync(absoluteEntry);

  if (stat.isFile()) {
    return absoluteEntry.endsWith('.js') ? [absoluteEntry] : [];
  }

  return readdirSync(absoluteEntry).flatMap((child) =>
    collectJsFiles(join(absoluteEntry, child))
  );
};

const files = roots.flatMap(collectJsFiles);

for (const file of files) {
  const result = spawnSync(process.execPath, ['--check', file], {
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log(`Checked ${files.length} JavaScript files.`);
