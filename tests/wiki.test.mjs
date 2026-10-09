import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, cpSync, readdirSync, symlinkSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { loadWiki, renderMarkdown } from '../lib/wiki.mjs';
import { validateCms, validateOutput } from '../scripts/validate.mjs';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'starch-wiki-test-'));
  cpSync('content', join(root, 'content'), { recursive: true });
  for (const [id, title, order] of [['getting-started', 'Getting started', 10], ['hardware', 'Hardware', 20]]) {
    writeFileSync(join(root, `content/wiki-categories/${id}.yml`), `title: ${title}\ndescription: Test category\norder: ${order}\n`);
  }
  for (const [slug, title, category, order] of [
    ['getting-started', 'Getting started', 'getting-started', 10],
    ['installation', 'Installation', 'getting-started', 20],
    ['handhelds', 'Handhelds', 'hardware', 10],
  ]) {
    writeFileSync(join(root, `content/wiki/${slug}.md`), `---\ntitle: ${title}\ndescription: Test article\ncategory: content/wiki-categories/${category}.yml\norder: ${order}\n---\nTest content.\n`);
  }
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('Markdown renders documentation features without executing HTML or template examples', () => {
  const result = renderMarkdown('# Heading\n\n**Bold** and *italic* with `code`.\n\n- One\n- Two\n\n1. First\n2. Second\n\n> Note\n\n| Name | Value |\n| --- | --- |\n| A | B |\n\n```sh\n{{ literal }}\n<script>alert(1)</script>\n```\n\n![Description](/wiki/images/example.png)\n\n[Link](/wiki/)\n\n<script>alert(2)</script>\n\n## Heading\n');
  for (const fragment of ['<h2 id="article-heading">', 'id="article-heading-2"', '<strong>', '<em>', '<code>', '<ul>', '<ol>', '<blockquote>', '<table>', 'language-sh', '{{ literal }}', 'alt="Description"', 'href="/wiki/"']) assert.ok(result.includes(fragment), fragment);
  assert.ok(!result.includes('<script>'));
  assert.ok(!renderMarkdown('[bad](javascript:alert(1))').includes('href="javascript:'));
});

test('CMS configuration and complete generated site agree', () => {
  validateCms(process.cwd());
  validateOutput(process.cwd());
});

test('new articles enter navigation; title edits preserve URLs; deletion removes them', t => {
  const root = fixture(t);
  const path = join(root, 'content/wiki/a-new-page.md');
  const source = '---\ntitle: A new page\ndescription: A new GUI article.\ncategory: content/wiki-categories/getting-started.yml\norder: 15\n---\nA new article.';
  writeFileSync(path, source);
  let wiki = loadWiki(root);
  let article = wiki.articles.find(a => a.slug === 'a-new-page');
  assert.equal(article.previous.url, '/wiki/getting-started/');
  assert.equal(article.next.url, '/wiki/installation/');
  writeFileSync(path, source.replace('title: A new page', 'title: Renamed title'));
  assert.equal(loadWiki(root).articles.find(a => a.title === 'Renamed title').url, '/wiki/a-new-page/');
  rmSync(path);
  wiki = loadWiki(root);
  assert.ok(!wiki.articles.some(a => a.slug === 'a-new-page'));
  assert.equal(wiki.articles.find(a => a.slug === 'getting-started').next.url, '/wiki/installation/');
});

test('category title changes preserve references; category removal reports a useful error', t => {
  const root = fixture(t);
  const path = join(root, 'content/wiki-categories/hardware.yml');
  writeFileSync(path, readFileSync(path, 'utf8').replace('Hardware', 'Devices'));
  assert.equal(loadWiki(root).articles.find(a => a.slug === 'handhelds').categoryTitle, 'Devices');
  rmSync(path);
  assert.throws(() => loadWiki(root), /select an existing category/);
});

test('rejects reserved paths and invalid navigation order', t => {
  const root = fixture(t);
  const original = join(root, 'content/wiki/installation.md');
  const reserved = join(root, 'content/wiki/images.md');
  cpSync(original, reserved);
  assert.throws(() => loadWiki(root), /reserved article filename/);
  rmSync(reserved);
  writeFileSync(original, readFileSync(original, 'utf8').replace('order: 20', 'order: wrong'));
  assert.throws(() => loadWiki(root), /order must be/);
});

test('cover images require a repository upload and description', t => {
  const root = fixture(t);
  const path = join(root, 'content/wiki/handhelds.md');
  const source = readFileSync(path, 'utf8');
  writeFileSync(path, source.replace('order: 10', 'order: 10\nimage: /wiki/images/test.png\nimage_alt: A device'));
  assert.throws(() => loadWiki(root), /existing upload/);
  mkdirSync(join(root, 'public/wiki/images'), { recursive: true });
  writeFileSync(join(root, 'public/wiki/images/test.png'), 'fixture');
  assert.equal(loadWiki(root).articles.find(a => a.slug === 'handhelds').image, '/wiki/images/test.png');
  writeFileSync(path, readFileSync(path, 'utf8').replace('image_alt: A device', 'image_alt: ""'));
  assert.throws(() => loadWiki(root), /image_alt must contain text/);
});

test('a CMS-style article and upload build into public files; a rebuild removes deleted pages', t => {
  const root = fixture(t);
  // Run the real build in a disposable checkout, keeping test content out of the website.
  for (const entry of readdirSync('.')) {
    if (entry.startsWith('.') && entry !== '.pages.yml') continue;
    if (['node_modules', 'dist', 'content', 'dev-private-web'].includes(entry)) continue;
    cpSync(entry, join(root, entry), { recursive: true });
  }
  symlinkSync(join(process.cwd(), 'node_modules'), join(root, 'node_modules'), 'dir');
  mkdirSync(join(root, 'public/wiki/images'), { recursive: true });
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD1sAAAAASUVORK5CYII=', 'base64');
  writeFileSync(join(root, 'public/wiki/images/example.png'), png);
  const source = join(root, 'content/wiki/upload-test.md');
  writeFileSync(source, '---\ntitle: Upload test\ndescription: Screenshot upload test\ncategory: content/wiki-categories/hardware.yml\norder: 20\n---\n## Screenshot\n\n![Example screenshot](/wiki/images/example.png)\n\n| Item | Status |\n| --- | --- |\n| Test | Ready |\n');
  const build = () => {
    const result = spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: root, encoding: 'utf8' });
    assert.equal(result.status, 0, result.stdout + result.stderr);
  };
  build();
  const output = join(root, 'dist/wiki/upload-test/index.html');
  assert.ok(readFileSync(output, 'utf8').includes('<table>'));
  assert.ok(readFileSync(output, 'utf8').includes('alt="Example screenshot"'));
  assert.deepEqual(readFileSync(join(root, 'dist/wiki/images/example.png')), png);
  assert.ok(readFileSync(join(root, 'dist/wiki/index.html'), 'utf8').includes('/wiki/upload-test/'));
  rmSync(source);
  build();
  assert.ok(!existsSync(output));
  assert.ok(!readFileSync(join(root, 'dist/wiki/index.html'), 'utf8').includes('/wiki/upload-test/'));
});
