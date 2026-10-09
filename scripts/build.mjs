import { rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { validateOutput, validateCms } from './validate.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
process.chdir(root);
validateCms(root);
// Remove only this project's generated output, so deleted articles cannot survive a rebuild.
rmSync(new URL('../dist/', import.meta.url), { recursive: true, force: true });
const result = spawnSync(process.execPath, ['node_modules/@11ty/eleventy/cmd.cjs'], { stdio: 'inherit' });
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
validateOutput(root);
