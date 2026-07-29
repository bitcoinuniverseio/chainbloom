# ChainBloom public site

The site is dependency-free and can be served from this directory:

```bash
npx serve site
```

It uses semantic HTML, inline code-based vector elements, system fonts,
reduced-motion support, and no analytics, cookies, forms, committed media, or
third-party runtime assets. Documentation links resolve to the canonical public
repository.

## Honest live status

The status panel fails closed and shows no synthetic values. To enable it in a
deployment, set the `data-status-endpoint` attribute on the `#status` section to
the absolute or same-origin v1 indexer status route. The response must be the
top-level status object and include `network`, `coreChain`, `indexedHeight`,
`indexedHash`, `tipHeight`, `tipHash`, `headerHeight`, `lag`, `nodeAvailable`,
`initialBlockDownload`, `synced`, `degraded`, `syncStatus`, and `nodeError`.
The page labels the service synchronized only when those fields prove exact
canonical agreement; malformed, stale, forked, IBD, or unavailable data is
displayed as unavailable or degraded.

## Publishing

The Pages workflow publishes `site/` at
`https://bitcoinuniverse.github.io/chainbloom/` after a push to `main` or a
manual dispatch. The repository owner must enable GitHub Pages with GitHub
Actions as the source before the first deployment. Canonical and sitemap URLs
assume this public location and the default `main` branch. Deployments may
supply separately managed social-preview media outside this source repository.
