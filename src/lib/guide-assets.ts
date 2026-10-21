import { readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

/** Shared by content validation and Astro's build-time collection schema. */
export function guideImageError(image: unknown, root = process.cwd()): string | undefined {
  if (image === undefined) return;
  if (
    typeof image !== 'string' ||
    !/^\/images\/guides\/[a-z0-9][a-z0-9-]*\.(?:webp|svg)$/.test(image)
  ) {
    return 'image must reference /images/guides/<slug>.webp or .svg';
  }
  const asset = join(root, 'public', image.slice(1));
  if (!statSync(asset, { throwIfNoEntry: false })?.isFile()) {
    return `image does not exist or is not a file: ${image}`;
  }
  if (image.endsWith('.svg')) {
    const markup = readFileSync(asset, 'utf8');
    // Cover SVGs are standalone decorative assets, not executable HTML or external embeds.
    if (
      !/^\s*<svg\b[^>]*viewBox=/i.test(markup) ||
      /<\/?(?:script|foreignObject|image|use|animate|set|text|tspan|textPath|a|style|iframe)\b|<!DOCTYPE|<\?xml-stylesheet|\bon\w+\s*=|\b(?:href|xlink:href|style)\s*=|\b(?:javascript|data):|url\(\s*["\x27]?https?:/i.test(
        markup,
      )
    ) {
      return 'SVG guide cover must be a standalone, viewBox-based editorial artwork without scripts, text, CSS, event handlers, embeds or external references';
    }
  }
}
