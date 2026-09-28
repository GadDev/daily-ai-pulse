import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const storiesDir = join(root, 'src/content/stories');
const pulseDir = join(root, 'src/content/pulse');
const publicDir = join(root, 'public');
const errors = [];

const files = (dir) => readdirSync(dir).filter((name) => /\.mdx?$/.test(name));
const storyIds = new Set(files(storiesDir).map((name) => name.replace(/\.mdx?$/, '')));

function frontmatter(file) {
  const content = readFileSync(file, 'utf8');
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) errors.push(`${file}: missing frontmatter`);
  return match?.[1] ?? '';
}

for (const name of files(storiesDir)) {
  const file = join(storiesDir, name);
  const fm = frontmatter(file);
  const image = fm.match(/^image:\s*["']?([^"'\n]+)["']?$/m)?.[1]?.trim();
  const imageAlt = fm.match(/^imageAlt:\s*["']?(.+?)["']?$/m)?.[1]?.trim();
  const sourceUrls = [...fm.matchAll(/^\s+url:\s*["']?(https?:\/\/[^"'\s]+)["']?$/gm)];

  if (!image) errors.push(`${name}: missing image`);
  if (!imageAlt) errors.push(`${name}: missing imageAlt`);
  if (sourceUrls.length === 0) errors.push(`${name}: missing source URL`);

  if (image?.startsWith('/')) {
    const asset = join(publicDir, image.slice(1));
    if (!existsSync(asset)) errors.push(`${name}: image does not exist: ${image}`);
  }
}

for (const name of files(pulseDir)) {
  const file = join(pulseDir, name);
  const fm = frontmatter(file);
  const id = basename(name).replace(/\.mdx?$/, '');
  const date = fm.match(/^date:\s*(\d{4}-\d{2}-\d{2})$/m)?.[1];
  const featured = fm.match(/^featured:\s*["']?([^"'\n]+)["']?$/m)?.[1]?.trim();
  const refs = [...fm.matchAll(/^\s+-\s+["'](\d{4}-\d{2}-\d{2}-[^"']+)["']\s*$/gm)].map(
    (match) => match[1],
  );

  if (date !== id) errors.push(`${name}: frontmatter date must match filename (${id})`);
  if (!featured || !storyIds.has(featured)) errors.push(`${name}: featured story is missing: ${featured}`);
  if (featured && !refs.includes(featured)) errors.push(`${name}: featured story must appear in a section`);

  const seen = new Set();
  for (const ref of refs) {
    if (!storyIds.has(ref)) errors.push(`${name}: unknown story reference: ${ref}`);
    if (seen.has(ref)) errors.push(`${name}: duplicate story reference: ${ref}`);
    seen.add(ref);
  }
}

if (errors.length > 0) {
  console.error(`Content integrity failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content integrity OK: ${storyIds.size} stories, ${files(pulseDir).length} editions.`);
