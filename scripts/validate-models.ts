import { readFileSync } from 'node:fs';
import { modelCatalogSchema } from '../src/lib/model-schema.ts';

const result = modelCatalogSchema.safeParse(
  JSON.parse(readFileSync(new URL('../src/data/models.json', import.meta.url), 'utf8')),
);
if (!result.success) {
  console.error(result.error.message);
  process.exitCode = 1;
} else {
  console.log(`Model Explorer: ${result.data.length} sourced model snapshots validated.`);
}
