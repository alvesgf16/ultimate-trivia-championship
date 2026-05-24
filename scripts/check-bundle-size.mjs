import { readdirSync, readFileSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BUDGET_BYTES = 300 * 1024;
const CHUNKS_DIR = resolve(
  __dirname,
  '..',
  'apps',
  'web',
  '.next',
  'static',
  'chunks',
);

let entries;
try {
  entries = readdirSync(CHUNKS_DIR, { withFileTypes: true });
} catch {
  console.error(`ERROR: Could not read ${CHUNKS_DIR}`);
  console.error('Run `npm run build --workspace=web` first.');
  process.exit(1);
}

const jsFiles = entries
  .filter((e) => e.isFile() && e.name.endsWith('.js'))
  .map((e) => e.name);

if (!jsFiles.length) {
  console.error('No .js files found in chunks directory.');
  process.exit(1);
}

let hasFailure = false;

const results = jsFiles
  .map((file) => {
    const content = readFileSync(join(CHUNKS_DIR, file));
    const gzipSize = gzipSync(content, { level: 9 }).length;
    const pass = gzipSize <= BUDGET_BYTES;
    if (!pass) hasFailure = true;
    return { file, gzipSize, pass };
  })
  .sort((a, b) => b.gzipSize - a.gzipSize);

const fmt = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;
const col = Math.max(...results.map((r) => r.file.length), 8);
const divider = '-'.repeat(col + 32);

console.log(
  `\nBundle Size Report (.next/static/chunks/ top-level) — Budget: ${fmt(BUDGET_BYTES)} gzipped`,
);
console.log(divider);
console.log(`${'FILE'.padEnd(col)}  ${'GZIP SIZE'.padStart(9)}  STATUS`);
console.log(divider);

for (const { file, gzipSize, pass } of results) {
  const status = pass ? 'PASS' : `FAIL (limit: ${fmt(BUDGET_BYTES)})`;
  console.log(`${file.padEnd(col)}  ${fmt(gzipSize).padStart(9)}  ${status}`);
}

console.log(divider);
console.log(
  `Files checked: ${results.length} | Result: ${hasFailure ? 'FAILED — budget exceeded' : 'PASSED'}\n`,
);

process.exit(hasFailure ? 1 : 0);
