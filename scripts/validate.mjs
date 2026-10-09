import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, relative, dirname, sep } from 'node:path';
import { parse } from 'yaml';
import { parseHTML } from 'linkedom';

function assert(condition, message) { if (!condition) throw new Error(message); }
function files(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory() ? files(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
}

export function validateCms(root) {
  const config = parse(readFileSync(resolve(root, '.pages.yml'), 'utf8'));
  const article = config.content.find(entry => entry.name === 'wiki');
  const category = config.content.find(entry => entry.name === 'wiki_categories');
  const home = config.content.find(entry => entry.name === 'wiki_home');
  assert(article?.path === 'content/wiki' && article.format === 'yaml-frontmatter', 'CMS article path/format must match the build.');
  assert(category?.path === 'content/wiki-categories' && category.format === 'yaml', 'CMS category path/format must match the build.');
  assert(home?.path === 'content/wiki-home.md', 'CMS wiki home path must match the build.');
  const body = article.fields.find(field => field.name === 'body');
  assert(body?.type === 'rich-text' && body.options?.format === 'markdown', 'CMS body must use Markdown rich-text.');
  const media = config.media.find(source => source.name === body.options.media);
  assert(media?.input === 'public/wiki/images' && media.output === '/wiki/images', 'CMS image paths must match the build.');
  const reference = article.fields.find(field => field.name === 'category');
  assert(reference?.options?.collection === category.name && reference.options.value === '{path}', 'CMS category references must store entry paths.');
  assert(article.operations.rename === false && category.operations.rename === false, 'Keep published filenames stable.');
  for (const entry of config.content) {
    assert(existsSync(resolve(root, entry.path)), `Missing CMS path: ${entry.path}`);
    assert(new Set(entry.fields.map(f => f.name)).size === entry.fields.length, `Duplicate CMS fields in ${entry.name}`);
  }
}

export function validateOutput(root) {
  const output = resolve(root, 'dist');
  const all = files(output);
  const documents = new Map();
  for (const file of all.filter(path => path.endsWith('.html'))) {
    documents.set(file, parseHTML(readFileSync(file, 'utf8')).document);
  }
  const required = ['index.html', 'download/index.html', 'community/index.html', 'extras/index.html', 'projects/index.html', 'wiki/index.html', '404.html', '_headers', '_redirects'];
  for (const file of required) assert(existsSync(resolve(output, file)), `Missing public file: ${file}`);
  for (const file of all) {
    const name = relative(output, file).split(sep).join('/');
    assert(!/^(dev-private-web|node_modules|content|src|scripts|lib|tests|\.git)(\/|$)/.test(name), `Private source copied into deployment: ${name}`);
    assert(!name.endsWith('.md') && !name.endsWith('.yml') && !name.endsWith('.yaml'), `Source content copied into deployment: ${name}`);
  }
  for (const [file, document] of documents) {
    const name = relative(output, file).split(sep).join('/');
    const isWiki = name.startsWith('wiki/');
    const url = new URL(`/${name.replace(/index\.html$/, '')}`, 'https://starchlinuxproject.org');
    assert(document.querySelectorAll('h1').length === 1, `${name}: expected one page heading.`);
    assert(document.querySelector('#site-navigation a[href="/wiki/"]'), `${name}: missing Wiki navigation link.`);
    const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
    assert(new Set(ids).size === ids.length, `${name}: duplicate element IDs.`);
    for (const element of document.querySelectorAll('[href], [src]')) {
      const attribute = element.hasAttribute('href') ? 'href' : 'src';
      const value = element.getAttribute(attribute);
      if (!value || /^(mailto:|tel:|data:)/i.test(value)) continue;
      const target = new URL(value, url);
      assert(['https:', 'http:'].includes(target.protocol), `${name}: unsafe URL ${value}`);
      if (target.origin !== url.origin) {
        if (isWiki && element.localName === 'img') throw new Error(`${name}: upload images through Pages CMS; external images are blocked by the site's CSP (${value}).`);
        continue;
      }
      let path = resolve(output, `.${decodeURIComponent(target.pathname)}`);
      assert(path === output || path.startsWith(`${output}${sep}`), `${name}: URL escapes the output directory.`);
      if (target.pathname.endsWith('/')) path = resolve(path, 'index.html');
      else if (existsSync(resolve(path, 'index.html'))) path = resolve(path, 'index.html');
      assert(existsSync(path), `${name}: broken ${attribute} ${value}`);
      if (target.hash && documents.has(path)) {
        assert(documents.get(path).getElementById(decodeURIComponent(target.hash.slice(1))), `${name}: broken anchor ${value}`);
      }
    }
    if (isWiki) {
      assert(document.querySelector('link[rel="canonical"]').getAttribute('href') === url.href, `${name}: incorrect canonical URL.`);
      for (const image of document.querySelectorAll('.wiki-prose img, .wiki-cover img')) {
        assert(image.getAttribute('alt')?.trim(), `${name}: documentation images need an image description.`);
      }
    }
  }
  // Existing public pages are copied byte-for-byte, including download links and licenses.
  for (const name of ['index.html', 'download/index.html', 'community/index.html', 'extras/index.html', 'projects/index.html', '_headers']) {
    assert(readFileSync(resolve(root, name)).equals(readFileSync(resolve(output, name))), `Passthrough changed ${name}`);
  }
  console.log(`Validated ${documents.size} HTML pages, internal links, CMS paths, and public assets.`);
}
