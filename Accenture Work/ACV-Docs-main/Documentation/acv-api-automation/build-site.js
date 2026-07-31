#!/usr/bin/env node
/**
 * build-site.js — ACV API Automation documentation builder
 * Generates the site using the shared three-pane layout
 * (Applications | Content | Pages).
 */

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

const SRC_DIR  = __dirname;
const DOCS_DIR = path.dirname(SRC_DIR);
const REPO_NAME = path.basename(SRC_DIR);
const OUT_DIR  = path.join(SRC_DIR, 'site');
const PAGES_DIR = path.join(OUT_DIR, 'pages');

const DOCS = [
  { file: 'README.md',          slug: 'readme',          title: 'Overview' },
  { file: 'HLD.md',             slug: 'hld',             title: 'High-Level Design' },
  { file: 'LLD.md',             slug: 'lld',             title: 'Low-Level Design' },
  { file: 'architecture.md',    slug: 'architecture',    title: 'Architecture' },
  { file: 'flow.md',            slug: 'flow',            title: 'Application Flow' },
  { file: 'flows.md',           slug: 'flows',           title: 'Business & Data Flows' },
  { file: 'database.md',        slug: 'database',        title: 'Database Design' },
  { file: 'services.md',        slug: 'services',        title: 'API & Services' },
  { file: 'code-mapping.md',    slug: 'code-mapping',    title: 'Code Mapping' },
  { file: 'devops.md',          slug: 'devops',          title: 'CI/CD & DevOps' },
  { file: 'glossary.md',        slug: 'glossary',        title: 'Glossary' },
  { file: 'diagrams.md',        slug: 'diagrams',        title: 'Diagram Index' },
  { file: 'developer-guide.md', slug: 'developer-guide', title: 'Developer Guide' },
  { file: 'business.md',        slug: 'business',        title: 'Business Context' },
  { file: 'CONTRIBUTING.md',    slug: 'contributing',    title: 'Contributing' },
];

// ---------------------------------------------------------------------------
function ensureDir(d) { if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true }); }
function readIfExists(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null; }

const ACRONYMS = new Set(['acv', 'api', 'ui', 'db', 'ci', 'cd', 'sql', 'aws', 'gcp']);
function prettyName(name) {
  return name.split('-').map(w => {
    if (ACRONYMS.has(w.toLowerCase())) return w.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function findSiblingRepos() {
  return fs.readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'site' && e.name !== 'node_modules' && e.name !== 'site-assets')
    .map(e => ({ name: e.name, path: path.join(DOCS_DIR, e.name) }))
    .filter(r => fs.existsSync(path.join(r.path, 'README.md')))
    .sort((a, b) => a.name.localeCompare(b.name));
}

const ALL_REPOS = findSiblingRepos();

function buildAppsNav(currentRepo, pathToDocsRoot) {
  const homeHref = `${pathToDocsRoot}site/index.html`;
  const items = ALL_REPOS.map(r => {
    const href = `${pathToDocsRoot}${r.name}/site/index.html`;
    const cls = r.name === currentRepo ? ' class="active"' : '';
    return `        <li${cls}><a href="${href}">${prettyName(r.name)}</a></li>`;
  }).join('\n');
  return `<aside id="apps-nav">
      <a class="home-link" href="${homeHref}">Documentation Hub</a>
      <span class="nav-title">Applications</span>
      <ul>
${items}
      </ul>
    </aside>`;
}

function buildHeader(repoLabel, hubHref) {
  const crumb = repoLabel
    ? ` <span class="crumb-sep">/</span> <span class="repo-name">${repoLabel}</span>`
    : '';
  return `<header class="site-header">
    <button id="sidebar-toggle" aria-label="Toggle sidebar">&#9776;</button>
    <div class="brand">
      <span class="brand-mark">ACV</span>
      <a href="${hubHref}">Documentation</a>${crumb}
    </div>
    <div class="header-actions">
      <input type="text" id="search-box" placeholder="Search…" autocomplete="off" />
      <button id="theme-toggle" aria-label="Toggle dark mode">&#9789;</button>
    </div>
  </header>`;
}

function buildPagesNav(activeSlug) {
  const items = DOCS
    .filter(d => readIfExists(path.join(SRC_DIR, d.file)))
    .map(d => {
      const cls = d.slug === activeSlug ? ' class="active"' : '';
      let href;
      if (d.slug === 'readme') {
        href = activeSlug === 'readme' ? 'index.html' : '../index.html';
      } else {
        href = activeSlug === 'readme' ? `pages/${d.slug}.html` : `${d.slug}.html`;
      }
      return `        <li${cls}><a href="${href}">${d.title}</a></li>`;
    });
  return items.join('\n');
}

function buildToc(html) {
  const re = /<h([23]) id="([^"]*)"[^>]*>(.*?)<\/h\1>/gi;
  let m; const entries = [];
  while ((m = re.exec(html)) !== null) {
    entries.push({ level: parseInt(m[1], 10), id: m[2], text: m[3].replace(/<[^>]+>/g, '') });
  }
  if (entries.length === 0) return '';
  const lis = entries.map(e => {
    const indent = e.level === 3 ? ' style="padding-left:1.7rem"' : '';
    return `          <li${indent}><a href="#${e.id}">${e.text}</a></li>`;
  });
  return `<div class="toc"><h4>On this page</h4><ul>\n${lis.join('\n')}\n        </ul></div>`;
}

function pageShell({ title, bodyHtml, pagesNavHtml, tocHtml, breadcrumb, isSubPage }) {
  const assetPrefix = isSubPage ? '../' : '';
  const pathToDocsRoot = isSubPage ? '../../../' : '../../';
  const hubHref = `${pathToDocsRoot}site/index.html`;
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${prettyName(REPO_NAME)} Docs</title>
  <link rel="stylesheet" href="${assetPrefix}styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script src="${assetPrefix}mermaid-init.js"></script>
</head>
<body>
  ${buildHeader(prettyName(REPO_NAME), hubHref)}
  <div class="layout">
    ${buildAppsNav(REPO_NAME, pathToDocsRoot)}
    <main>
      ${breadcrumb ? `<nav class="breadcrumb">${breadcrumb}</nav>` : ''}
      <article>
${bodyHtml}
      </article>
    </main>
    <aside id="pages-nav">
      <span class="nav-title">Pages</span>
      <ul>
${pagesNavHtml}
      </ul>
      ${tocHtml}
    </aside>
  </div>
  <script src="${assetPrefix}search.js"></script>
</body>
</html>`;
}

// ---------------------------------------------------------------------------
const renderer = new marked.Renderer();
renderer.heading = function (text, level) {
  const raw = typeof text === 'object' ? text.text : text;
  const depthNum = typeof text === 'object' ? text.depth : level;
  const slug = String(raw).toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
  return `<h${depthNum} id="${slug}">${raw}</h${depthNum}>`;
};
renderer.code = function (code, lang) {
  const codeStr = typeof code === 'object' ? code.text : code;
  const langStr = typeof code === 'object' ? code.lang : lang;
  if (langStr === 'mermaid') return `<pre class="mermaid">${codeStr}</pre>`;
  const escaped = codeStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<pre><code class="language-${langStr || 'text'}">${escaped}</code></pre>`;
};
marked.setOptions({ renderer, gfm: true, breaks: false });

ensureDir(OUT_DIR);
ensureDir(PAGES_DIR);

const mdToSlug = {};
DOCS.forEach(d => { mdToSlug[d.file.toLowerCase()] = d.slug; });

function rewriteLinks(html, currentSlug) {
  return html.replace(/href="([^"]*\.md)(#[^"]*)?"/gi, (match, mdRef, anchor) => {
    const base = mdRef.replace(/^\.\//, '').toLowerCase();
    const slug = mdToSlug[base];
    if (!slug) return match;
    anchor = anchor || '';
    if (slug === 'readme') {
      const prefix = currentSlug === 'readme' ? '' : '../';
      return `href="${prefix}index.html${anchor}"`;
    }
    const prefix = currentSlug === 'readme' ? 'pages/' : '';
    return `href="${prefix}${slug}.html${anchor}"`;
  });
}

DOCS.forEach(doc => {
  const md = readIfExists(path.join(SRC_DIR, doc.file));
  if (!md) return;
  let bodyHtml = marked.parse(md);
  bodyHtml = rewriteLinks(bodyHtml, doc.slug);
  const pagesNav = buildPagesNav(doc.slug);
  const toc = buildToc(bodyHtml);
  const isSubPage = doc.slug !== 'readme';
  const breadcrumb = isSubPage
    ? `<a href="../../../site/index.html">Home</a> / <a href="../index.html">${prettyName(REPO_NAME)}</a> / <span>${doc.title}</span>`
    : `<a href="../../site/index.html">Home</a> / <span>${prettyName(REPO_NAME)}</span>`;
  const outPath = isSubPage
    ? path.join(PAGES_DIR, `${doc.slug}.html`)
    : path.join(OUT_DIR, 'index.html');
  fs.writeFileSync(outPath, pageShell({
    title: doc.title,
    bodyHtml,
    pagesNavHtml: pagesNav,
    tocHtml: toc,
    breadcrumb,
    isSubPage,
  }));
  console.log(`  ${outPath}`);
});

// Copy static assets (prefer local site-assets, fallback to parent)
const assetCandidates = [
  path.join(SRC_DIR, 'site-assets'),
  path.join(DOCS_DIR, 'site-assets'),
];
for (const dir of assetCandidates) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir)) {
    const src = path.join(dir, file);
    if (!fs.statSync(src).isFile()) continue;
    fs.copyFileSync(src, path.join(OUT_DIR, file));
  }
  break;
}

console.log(`\nDone. Built ${prettyName(REPO_NAME)} site.`);
