import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve, basename } from 'node:path';
import { parse } from 'yaml';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({ html: false, linkify: false });
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const reserved = new Set(['index', 'images', '404']);

export function renderMarkdown(body) {
  // Content is never passed through Liquid/Nunjucks, including code examples.
  const tokens = markdown.parse(body, {});
  const headings = new Map();
  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== 'heading_open') continue;
    // The page title supplies h1. Authors can use the editor's Heading 1 safely.
    if (tokens[i].tag === 'h1') tokens[i].tag = tokens[i + 2].tag = 'h2';
    const text = tokens[i + 1].content;
    const base = text.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    const count = (headings.get(base) || 0) + 1;
    headings.set(base, count);
    tokens[i].attrSet('id', `article-${base}${count > 1 ? `-${count}` : ''}`);
  }
  return markdown.renderer.render(tokens, markdown.options, {});
}

function requiredText(data, key, source) {
  if (typeof data[key] !== 'string' || !data[key].trim()) {
    throw new Error(`${source}: ${key} must contain text.`);
  }
}

function ordered(data, source) {
  requiredText(data, 'title', source);
  requiredText(data, 'description', source);
  if (!Number.isFinite(data.order) || data.order < 0) {
    throw new Error(`${source}: order must be a non-negative number.`);
  }
}

function readMarkdown(path) {
  const raw = readFileSync(path, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) throw new Error(`${path}: expected YAML frontmatter.`);
  const data = parse(match[1]);
  requiredText(data, 'title', path);
  requiredText(data, 'description', path);
  const body = raw.slice(match[0].length).trim();
  if (!body) throw new Error(`${path}: article body cannot be empty.`);
  return { ...data, body, html: renderMarkdown(body) };
}

const sortEntries = (a, b) => a.order - b.order || a.title.localeCompare(b.title, 'en') || a.id.localeCompare(b.id, 'en');

export function loadWiki(root = process.cwd()) {
  const categoryDir = 'content/wiki-categories';
  const categories = readdirSync(resolve(root, categoryDir)).filter(f => f.endsWith('.yml')).map(file => {
    const id = basename(file, '.yml');
    if (!slugPattern.test(id)) throw new Error(`Invalid category filename: ${file}`);
    const path = `${categoryDir}/${file}`;
    const data = parse(readFileSync(resolve(root, path), 'utf8'));
    ordered(data, path);
    return { id, path, title: data.title, description: data.description, order: data.order, articles: [] };
  }).sort(sortEntries);
  const articles = readdirSync(resolve(root, 'content/wiki')).filter(f => f.endsWith('.md')).map(file => {
    const slug = basename(file, '.md');
    if (!slugPattern.test(slug) || reserved.has(slug)) throw new Error(`Invalid or reserved article filename: ${file}`);
    const path = `content/wiki/${file}`;
    const data = readMarkdown(resolve(root, path));
    ordered(data, path);
    const category = categories.find(c => c.path === data.category);
    if (!category) throw new Error(`${path}: select an existing category in Pages CMS before publishing.`);
    if (data.image) {
      if (typeof data.image !== 'string' || !/^\/wiki\/images\/[a-zA-Z0-9_./-]+$/.test(data.image)
        || data.image.includes('..') || !existsSync(resolve(root, `public${data.image}`))) {
        throw new Error(`${path}: image must be an existing upload under /wiki/images/.`);
      }
      requiredText(data, 'image_alt', path);
    }
    const article = {
      id: slug, slug, url: `/wiki/${slug}/`, title: data.title, description: data.description,
      order: data.order, categoryId: category.id, categoryTitle: category.title,
      html: data.html, image: data.image || '', image_alt: data.image_alt || '',
    };
    category.articles.push(article);
    return article;
  });
  for (const category of categories) {
    category.articles.sort(sortEntries);
    category.articles.forEach((article, index, siblings) => {
      const link = item => item ? { title: item.title, url: item.url } : null;
      article.previous = link(siblings[index - 1]);
      article.next = link(siblings[index + 1]);
    });
  }
  const home = readMarkdown(resolve(root, 'content/wiki-home.md'));
  return { home: { title: home.title, description: home.description, html: home.html }, categories, articles };
}
