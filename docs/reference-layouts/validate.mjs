import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const directory = path.dirname(new URL(import.meta.url).pathname);
const source = fs.readFileSync(path.join(directory, 'app.js'), 'utf8');
const files = fs.readdirSync(directory).filter((file) => file.endsWith('.html'));
const failures = [];

for (const file of files) {
  const root = { innerHTML: '' };
  const control = { value: '', innerHTML: '', textContent: '', addEventListener() {} };
  const page = file === 'index.html' ? 'home' : file.replace(/\.html$/, '');
  const document = {
    body: { dataset: { page } },
    getElementById(id) {
      return id === 'app' ? root : control;
    },
  };

  vm.runInNewContext(source, { document, Date }, { filename: 'app.js' });
  const headings = (root.innerHTML.match(/<h1\b/g) ?? []).length;
  if (headings !== 1) failures.push(`${file}: expected one H1; found ${headings}`);
  if (/\bundefined\b|\bNaN\b/.test(root.innerHTML)) failures.push(`${file}: invalid text`);

  for (const [, uri] of root.innerHTML.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(https?:|mailto:|#)/.test(uri)) continue;
    const relative = uri.split(/[?#]/)[0];
    if (!fs.existsSync(path.resolve(directory, relative))) {
      failures.push(`${file}: missing ${relative}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`${files.length} layouts render with one H1 and valid local links/assets.`);
}
