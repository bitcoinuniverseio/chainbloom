/**
 * The page shell every documentation page is poured into.
 *
 * The markup is written so the page is complete before any script runs:
 * navigation, table of contents, previous and next links, and the whole body
 * are in the HTML. Scripts add search, saved progress, tooltips, and the
 * interactive figures on top of a page that already works without them.
 */

import { escapeHtml } from './markdown.mjs';
import { SITE } from '../../content/site.mjs';

const MARK = `${SITE.basePath}/assets/chainbloom-mark.svg`;
const LOGO = `${SITE.basePath}/assets/chainbloom-logo.svg`;

function meta(name, content, property = false) {
  if (content === undefined || content === null || content === '') return '';
  const key = property ? 'property' : 'name';
  return `<meta ${key}="${name}" content="${escapeHtml(content)}" />`;
}

function absolute(path) {
  return `${SITE.origin}${path}`;
}

function structuredData(page, nav) {
  const crumbs = page.breadcrumbs.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.label,
    item: absolute(crumb.href),
  }));
  const graph = [
    {
      '@type': 'TechArticle',
      headline: page.title,
      description: page.description,
      url: absolute(page.url),
      dateModified: page.updated,
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        name: `${SITE.name} documentation`,
        url: absolute(`${SITE.docsPath}/`),
      },
      publisher: { '@type': 'Organization', name: SITE.name },
    },
    { '@type': 'BreadcrumbList', itemListElement: crumbs },
  ];
  if (page.faq !== undefined && page.faq.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    });
  }
  void nav;
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
}

function head(page, nav) {
  const title =
    page.url === `${SITE.docsPath}/`
      ? `${SITE.name} documentation`
      : `${page.title} · ${SITE.name}`;
  const image = absolute(page.socialImage ?? SITE.socialImage);
  return `<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
${meta('description', page.description)}
<link rel="canonical" href="${absolute(page.url)}" />
${meta('og:type', 'article', true)}
${meta('og:site_name', `${SITE.name} documentation`, true)}
${meta('og:title', page.socialTitle ?? title, true)}
${meta('og:description', page.socialDescription ?? page.description, true)}
${meta('og:url', absolute(page.url), true)}
${meta('og:image', image, true)}
${meta('og:image:alt', `${SITE.name}: ${page.title}`, true)}
${meta('twitter:card', 'summary_large_image')}
${meta('twitter:title', page.socialTitle ?? title)}
${meta('twitter:description', page.socialDescription ?? page.description)}
${meta('twitter:image', image)}
${meta('theme-color', '#07111f')}
<link rel="icon" href="${MARK}" type="image/svg+xml" />
<link rel="stylesheet" href="${SITE.basePath}/assets/docs.css" />
${page.previous === null ? '' : `<link rel="prev" href="${page.previous.url}" />`}
${page.next === null ? '' : `<link rel="next" href="${page.next.url}" />`}
<script>
(function(){try{var s=localStorage.getItem('chainbloom-theme');var m=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=(s==='light'||s==='dark')?s:m;}catch(e){document.documentElement.dataset.theme='dark';}document.documentElement.classList.add('js');})();
</script>
<script type="application/ld+json">${structuredData(page, nav)}</script>
<script src="${SITE.basePath}/assets/docs.js" defer></script>
</head>`;
}

function header() {
  return `<header class="docs-header">
<div class="docs-header-inner">
<button type="button" class="nav-toggle" aria-expanded="false" aria-controls="docs-sidebar" aria-label="Documentation menu">
<span class="nav-toggle-bars" aria-hidden="true"></span>
<span class="nav-toggle-text">Menu</span>
</button>
<a class="docs-brand" href="${SITE.basePath}/">
<img src="${LOGO}" alt="ChainBloom" width="150" height="32" />
<span class="docs-brand-tag">Docs</span>
</a>
<div class="docs-header-actions">
<button type="button" class="search-open" data-search-open>
<span aria-hidden="true">⌕</span>
<span class="search-open-label">Search</span>
<kbd>/</kbd>
</button>
<button type="button" class="theme-toggle" data-theme-toggle aria-pressed="false">
<span aria-hidden="true">☼</span><span class="theme-label">Light</span>
</button>
<a class="header-cta" href="${SITE.appUrl}" target="_blank" rel="noreferrer noopener">Open ChainBloom</a>
</div>
</div>
</header>`;
}

function sidebarSection(section, page) {
  const items = section.pages
    .map((entry) => {
      const current = entry.url === page.url;
      const done = `data-progress-page="${escapeHtml(entry.id)}"`;
      return `<li><a href="${entry.url}" ${current ? 'aria-current="page"' : ''} ${done}>
<span class="side-label">${escapeHtml(entry.navTitle ?? entry.title)}</span>
<span class="side-done" aria-hidden="true"></span>
</a></li>`;
    })
    .join('');
  const open = section.pages.some((entry) => entry.url === page.url);
  return `<li class="side-section">
<details ${open ? 'open' : ''}>
<summary><span class="side-icon" data-icon="${section.icon}" aria-hidden="true"></span>${escapeHtml(section.title)}</summary>
<ul>${items}</ul>
</details>
</li>`;
}

function sidebar(nav, page) {
  const participant = nav.filter((section) => section.tier === 'participant');
  const reference = nav.filter((section) => section.tier === 'reference');
  return `<nav class="docs-sidebar" id="docs-sidebar" aria-label="Documentation">
<div class="sidebar-inner">
<a class="sidebar-start" href="${SITE.docsPath}/start/">
<strong>Start here</strong>
<span>Answer one question, get your path.</span>
</a>
<p class="sidebar-heading">Take part</p>
<ul class="side-list">${participant.map((section) => sidebarSection(section, page)).join('')}</ul>
<p class="sidebar-heading">Build and operate</p>
<ul class="side-list">${reference.map((section) => sidebarSection(section, page)).join('')}</ul>
<div class="sidebar-foot">
<a href="${SITE.repoUrl}" target="_blank" rel="noreferrer noopener">Source and issues ↗</a>
<button type="button" data-progress-reset class="progress-reset">Clear saved progress</button>
</div>
</div>
</nav>`;
}

function breadcrumbs(page) {
  const items = page.breadcrumbs
    .map((crumb, index, all) => {
      const last = index === all.length - 1;
      if (last) return `<li aria-current="page">${escapeHtml(crumb.label)}</li>`;
      return `<li><a href="${crumb.href}">${escapeHtml(crumb.label)}</a></li>`;
    })
    .join('');
  return `<nav class="breadcrumbs" aria-label="Breadcrumb"><ol>${items}</ol></nav>`;
}

function tableOfContents(page) {
  if (page.toc.length < 2) return '';
  const items = page.toc
    .map(
      (entry) =>
        `<li class="toc-level-${entry.level}"><a href="#${entry.id}">${escapeHtml(entry.text)}</a></li>`,
    )
    .join('');
  return `<aside class="docs-toc" aria-labelledby="toc-heading">
<p class="toc-heading" id="toc-heading">On this page</p>
<ul>${items}</ul>
<button type="button" class="toc-complete" data-mark-read data-page="${escapeHtml(page.id)}">
<span class="toc-complete-mark" aria-hidden="true"></span>
<span class="toc-complete-text">Mark as read</span>
</button>
</aside>`;
}

function pageFoot(page) {
  const related =
    page.related.length === 0
      ? ''
      : `<section class="related" aria-labelledby="related-heading">
<h2 id="related-heading">Keep going</h2>
<div class="related-grid">${page.related
          .map(
            (item) => `<a class="related-card" href="${item.url}">
<span class="related-section">${escapeHtml(item.sectionTitle)}</span>
<strong>${escapeHtml(item.title)}</strong>
<span class="related-desc">${escapeHtml(item.description)}</span>
</a>`,
          )
          .join('')}</div>
</section>`;

  const cta =
    page.cta === null
      ? ''
      : `<section class="page-cta">
<div>
<p class="page-cta-eyebrow">Next</p>
<h2>${escapeHtml(page.cta.title)}</h2>
${page.cta.body === null ? '' : `<p>${escapeHtml(page.cta.body)}</p>`}
</div>
<a class="button primary" href="${page.cta.href}"${
          /^https?:/u.test(page.cta.href)
            ? ' target="_blank" rel="noreferrer noopener"'
            : ''
        }>${escapeHtml(page.cta.label)}</a>
</section>`;

  const previous =
    page.previous === null
      ? '<span></span>'
      : `<a class="pager pager-prev" href="${page.previous.url}"><span>Previous</span><strong>${escapeHtml(page.previous.title)}</strong></a>`;
  const next =
    page.next === null
      ? '<span></span>'
      : `<a class="pager pager-next" href="${page.next.url}"><span>Next</span><strong>${escapeHtml(page.next.title)}</strong></a>`;

  return `${cta}${related}<nav class="pager-row" aria-label="Previous and next page">${previous}${next}</nav>`;
}

function searchDialog() {
  return `<div class="search-layer" data-search-layer hidden>
<div class="search-backdrop" data-search-close></div>
<div class="search-panel" role="dialog" aria-modal="true" aria-labelledby="search-title">
<h2 class="visually-hidden" id="search-title">Search the documentation</h2>
<div class="search-field">
<span aria-hidden="true">⌕</span>
<input type="search" data-search-input placeholder="Search worlds, paths, fees, validation…" aria-label="Search the documentation" autocomplete="off" spellcheck="false" />
<button type="button" data-search-close class="search-dismiss">Esc</button>
</div>
<div class="search-results" data-search-results role="listbox" aria-label="Search results"></div>
<p class="search-hint"><kbd>↑</kbd><kbd>↓</kbd> to move · <kbd>Enter</kbd> to open · <kbd>Esc</kbd> to close</p>
</div>
</div>`;
}

function footer() {
  return `<footer class="docs-footer">
<div class="docs-footer-inner">
<a class="footer-brand" href="${SITE.basePath}/"><img src="${LOGO}" alt="ChainBloom" width="140" height="30" /></a>
<p>Shared creation, carried by Bitcoin. No project token, reward, royalty, public mint, or official trading market.</p>
<nav aria-label="Footer">
<a href="${SITE.docsPath}/">Documentation</a>
<a href="${SITE.docsPath}/help/glossary/">Glossary</a>
<a href="${SITE.docsPath}/help/status/">What is running</a>
<a href="${SITE.repoUrl}" target="_blank" rel="noreferrer noopener">Source ↗</a>
</nav>
</div>
</footer>`;
}

function metaLine(page) {
  const bits = [];
  if (page.tier === 'reference') {
    bits.push(
      `<span class="tag tag-reference">Technical reference</span>`,
      `<span>Checked against ${escapeHtml(page.verified)}</span>`,
    );
  } else {
    bits.push(`<span class="tag tag-participant">${escapeHtml(page.sectionTitle)}</span>`);
  }
  bits.push(`<span>Last reviewed ${escapeHtml(page.updated)}</span>`);
  if (page.readingMinutes > 0) {
    bits.push(`<span>${page.readingMinutes} min read</span>`);
  }
  return `<p class="page-meta">${bits.join('')}</p>`;
}

export function renderPage(page, nav) {
  return `<!doctype html>
<html lang="en" data-page="${escapeHtml(page.id)}" data-section="${escapeHtml(page.section)}">
${head(page, nav)}
<body class="docs-body">
<a class="skip-link" href="#docs-main">Skip to content</a>
${header()}
<div class="docs-shell">
${sidebar(nav, page)}
<main class="docs-main" id="docs-main">
<article class="docs-article">
${breadcrumbs(page)}
<h1>${escapeHtml(page.title)}</h1>
${metaLine(page)}
<div class="page-lede"><p>${escapeHtml(page.description)}</p></div>
<div class="prose">
${page.body}
</div>
</article>
${pageFoot(page)}
</main>
${tableOfContents(page)}
</div>
${footer()}
${searchDialog()}
<div class="glossary-tip" id="glossary-tip" role="tooltip" hidden></div>
<div class="live-region" role="status" aria-live="polite" data-live-region></div>
</body>
</html>
`;
}
