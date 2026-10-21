import { statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

/** Shared by content validation and Astro's build-time collection schema. */
export function guideImageError(image: unknown, root = process.cwd()): string | undefined {
  if (image === undefined) return;
  if (typeof image !== 'string' || !/^\/images\/guides\/[a-z0-9][a-z0-9-]*\.webp$/.test(image)) {
    return 'image must reference /images/guides/<slug>.webp';
  }
  if (!statSync(join(root, 'public', image.slice(1)), { throwIfNoEntry: false })?.isFile()) {
    return `image does not exist or is not a file: ${image}`;
  }
}
