import snapshot from '../data/models.json';
import { modelCatalogSchema } from './model-schema.ts';

// Build-time validation also runs when a developer invokes `astro build` directly.
export const modelCatalog = modelCatalogSchema.parse(snapshot);
