#!/usr/bin/env node
/**
 * build-site.js — Multi-repo documentation site builder
 *
 * Three-pane layout:
 *   Left   = list of all Applications (repos)
 *   Middle = Markdown content
 *   Right  = Page navigation within current Application
 *
 * Usage:
 *   node build-site.js [repo-name]
 *
 * Output:
 *   <repo>/site/                 # per-repo site
 *   site/index.html              # master hub index
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DOCS_DIR = __dirname;
const TARGET_REPOS = process.argv[2] ? [process.argv[2]] : null;

// ---------------------------------------------------------------------------
// Discover repos
// ---------------------------------------------------------------------------
function findRepos() {
  return fs.readdirSync(DOCS_DIR, { withFileTypes: true })
    .filter(e => e.isDirectory() && !e.name.startsWith('.') && e.name !== 'site' && e.name !== 'node_modules' && e.name !== 'site-assets')
    .map(e => ({ name: e.name, path: path.join(DOCS_DIR, e.name) }))
    .filter(repo => fs.existsSync(path.join(repo.path, 'README.md')))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Friendly title from repo name
const ACRONYMS = new Set(['acv', 'api', 'ui', 'db', 'ci', 'cd', 'sql', 'aws', 'gcp']);
function prettyName(name) {
  return name.split('-').map(w => {
    if (ACRONYMS.has(w.toLowerCase())) return w.toUpperCase();
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

// First sensible description line from README
function readmeDescription(readmePath) {
  if (!fs.existsSync(readmePath)) return '';
  const lines = fs.readFileSync(readmePath, 'utf-8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith('![')) continue;
    if (t.startsWith('[')) continue;
    if (t.startsWith('---')) continue;
    if (t.startsWith('|')) continue;
    return t.replace(/[*_`]/g, '');
  }
  return '';
}

// ---------------------------------------------------------------------------
// Apps navigation HTML (shared by hub + per-repo pages)
// ---------------------------------------------------------------------------
function buildAppsNav(repos, currentRepo, pathToDocsRoot) {
  // pathToDocsRoot = relative path from current page to DOCS_DIR (no trailing slash)
  // e.g. "" for hub index (site/index.html → ../, but we treat hub specially)
  // For simplicity caller passes correct prefix.
  const homeHref = `${pathToDocsRoot}site/index.html`;
  const items = repos.map(r => {
    const href = `${pathToDocsRoot}${r.name}/site/index.html`;
    const cls = r.name === currentRepo ? ' class="active"' : '';
    return `        <li${cls}><a href="${href}">${prettyName(r.name)}</a></li>`;
  }).join('\n');

  const homeActive = currentRepo === '__hub__' ? ' active' : '';
  return `<aside id="apps-nav">
      <a class="home-link${homeActive}" href="${homeHref}">Documentation Hub</a>
      <span class="nav-title">Applications</span>
      <ul>
${items}
      </ul>
    </aside>`;
}

// ---------------------------------------------------------------------------
// Header HTML (shared)
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Default per-repo builder
// ---------------------------------------------------------------------------
function buildRepoDefault(repoPath, repoName, allRepos) {
  console.log(`\nBuilding ${repoName} (default builder)...`);

  const SRC_DIR = repoPath;
  const OUT_DIR = path.join(SRC_DIR, 'site');
  const PAGES_DIR = path.join(OUT_DIR, 'pages');

  const DOCS = [
    { file: 'README.md',         slug: 'readme',         title: 'Overview' },
    { file: 'HLD.md',            slug: 'hld',            title: 'High-Level Design' },
    { file: 'LLD.md',            slug: 'lld',            title: 'Low-Level Design' },
    { file: 'architecture.md',   slug: 'architecture',   title: 'Architecture' },
    { file: 'flows.md',          slug: 'flows',          title: 'Business & Data Flows' },
    { file: 'database.md',       slug: 'database',       title: 'Database Design' },
    { file: 'services.md',       slug: 'services',       title: 'API & Services' },
    { file: 'code-mapping.md',   slug: 'code-mapping',   title: 'Code Mapping' },
    { file: 'devops.md',         slug: 'devops',         title: 'CI/CD & DevOps' },
    { file: 'glossary.md',       slug: 'glossary',       title: 'Glossary' },
    { file: 'security.md',       slug: 'security',       title: 'Security' },
    { file: 'performance.md',    slug: 'performance',    title: 'Performance' },
    { file: 'onboarding.md',     slug: 'onboarding',     title: 'Onboarding' },
    { file: 'testing.md',        slug: 'testing',        title: 'Testing' },
    { file: 'runbooks.md',       slug: 'runbooks',       title: 'Runbooks' },
    { file: 'changelog.md',      slug: 'changelog',      title: 'Changelog' },
    { file: 'CONTRIBUTING.md',   slug: 'contributing',   title: 'Contributing' },
  ];

  function ensureDir(dir) { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }
  function readIfExists(p) { return fs.existsSync(p) ? fs.readFileSync(p, 'utf-8') : null; }

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
    const appsNav = buildAppsNav(allRepos, repoName, pathToDocsRoot);
    return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — ${prettyName(repoName)} Docs</title>
  <link rel="stylesheet" href="${assetPrefix}styles.css" />
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script src="${assetPrefix}mermaid-init.js"></script>
</head>
<body>
  ${buildHeader(prettyName(repoName), hubHref)}
  <div class="layout">
    ${appsNav}
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

  try {
    const { marked } = require('marked');
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

    ensureDir(OUT_DIR);
    ensureDir(PAGES_DIR);

    DOCS.forEach(doc => {
      const md = readIfExists(path.join(SRC_DIR, doc.file));
      if (!md) return;
      let bodyHtml = marked.parse(md);
      bodyHtml = rewriteLinks(bodyHtml, doc.slug);
      const pagesNav = buildPagesNav(doc.slug);
      const toc = buildToc(bodyHtml);
      const isSubPage = doc.slug !== 'readme';
      const breadcrumb = isSubPage
        ? `<a href="../../../site/index.html">Home</a> / <a href="../index.html">${prettyName(repoName)}</a> / <span>${doc.title}</span>`
        : `<a href="../../site/index.html">Home</a> / <span>${prettyName(repoName)}</span>`;
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

    // Copy shared assets
    const assetSrcCandidates = [
      path.join(SRC_DIR, 'site-assets'),
      path.join(DOCS_DIR, 'site-assets'),
    ];
    for (const assetDir of assetSrcCandidates) {
      if (!fs.existsSync(assetDir)) continue;
      for (const file of fs.readdirSync(assetDir)) {
        const src = path.join(assetDir, file);
        if (!fs.statSync(src).isFile()) continue;
        fs.copyFileSync(src, path.join(OUT_DIR, file));
      }
      break;
    }

    console.log(`Built ${repoName}`);
  } catch (err) {
    console.error(`Failed to build ${repoName}: ${err.message}`);
  }
}

// Build a single repo (delegates to its own script if present)
function buildRepo(repoPath, repoName, allRepos) {
  const buildScript = path.join(repoPath, 'build-site.js');
  if (fs.existsSync(buildScript)) {
    console.log(`\nBuilding ${repoName} (custom builder)...`);
    try {
      execSync(`node "${buildScript}"`, { cwd: repoPath, stdio: 'inherit' });
      console.log(`Built ${repoName}`);
    } catch (err) {
      console.error(`Failed to build ${repoName}: ${err.message}`);
    }
    return;
  }
  buildRepoDefault(repoPath, repoName, allRepos);
}

// ---------------------------------------------------------------------------
// Master hub index
// ---------------------------------------------------------------------------
function buildMasterIndex(repos) {
  console.log('\nBuilding master index...');
  const SITE_DIR = path.join(DOCS_DIR, 'site');
  fs.mkdirSync(SITE_DIR, { recursive: true });

  // Copy assets to site/ as well
  const assetDir = path.join(DOCS_DIR, 'site-assets');
  if (fs.existsSync(assetDir)) {
    for (const file of fs.readdirSync(assetDir)) {
      const src = path.join(assetDir, file);
      if (fs.statSync(src).isFile()) {
        fs.copyFileSync(src, path.join(SITE_DIR, file));
      }
    }
  }

  const rows = repos.map(repo => {
    const desc = readmeDescription(path.join(repo.path, 'README.md'));
    const href = `../${repo.name}/site/index.html`;
    return `          <tr>
            <td class="app-name"><a href="${href}">${prettyName(repo.name)}</a></td>
            <td class="app-desc">${desc || '<span style="color:var(--text-subtle)">—</span>'}</td>
            <td class="app-action"><a href="${href}">View &rsaquo;</a></td>
          </tr>`;
  }).join('\n');

  const appsNav = buildAppsNav(repos, '__hub__', '../');
  const pathToDocsRoot = '../';
  const hubHref = `${pathToDocsRoot}site/index.html`;

  const html = `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ACV Documentation Hub</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  ${buildHeader('', hubHref)}
  <div class="layout">
    ${appsNav}
    <main>
      <section class="hub-intro">
        <h1>ACV Platform Documentation</h1>
        <p class="lead">Centralised technical documentation for all services and libraries that comprise the ACV platform. Select an application from the left, or pick one from the index below.</p>
      </section>
      <h2 style="font-size:1.05rem;font-weight:600;margin:1.5rem 0 .5rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);border:none;padding:0;">Applications</h2>
      <table class="app-table">
        <thead>
          <tr>
            <th style="width:24%;">Application</th>
            <th>Description</th>
            <th style="width:8%;text-align:right;">&nbsp;</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
      <footer class="site-footer">
        Last updated ${new Date().toISOString().split('T')[0]} &middot; ACV Platform Team
      </footer>
    </main>
  </div>
</body>
</html>`;

  fs.writeFileSync(path.join(SITE_DIR, 'index.html'), html);
  console.log(`  ${path.join(SITE_DIR, 'index.html')}`);

  // Also write a top-level redirect index.html for convenience
  const redirect = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>ACV Documentation</title>
  <meta http-equiv="refresh" content="0; url=site/index.html" />
  <link rel="canonical" href="site/index.html" />
</head>
<body>
  <p>Redirecting to <a href="site/index.html">ACV Documentation Hub</a>&hellip;</p>
</body>
</html>`;
  fs.writeFileSync(path.join(DOCS_DIR, 'index.html'), redirect);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
console.log('ACV Multi-Repo Documentation Builder');
console.log('====================================\n');

const repos = findRepos();
if (repos.length === 0) {
  console.error('No documentation repositories found.');
  process.exit(1);
}

console.log(`Found ${repos.length} repositories:`);
repos.forEach(r => console.log(`  - ${r.name}`));

const toProcess = TARGET_REPOS
  ? repos.filter(r => TARGET_REPOS.includes(r.name))
  : repos;

if (toProcess.length === 0) {
  console.error(`Repository not found: ${TARGET_REPOS}`);
  process.exit(1);
}

toProcess.forEach(repo => buildRepo(repo.path, repo.name, repos));
buildMasterIndex(repos);

console.log('\nComplete. Open site/index.html');
