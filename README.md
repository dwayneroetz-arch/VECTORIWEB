# VECTORI — Global Standard Demo v1.3

**Find the better vehicle, not just the cheaper one.**

Static deployment package for GitHub Pages and Cloudflare Pages.

## Files
- `index.html` — main demo
- `styles.css` — presentation
- `app.js` — application logic
- `data/inventory.json` — 153 development/demo records
- `docs/` — architecture/research notes
- `tests/test_vectori.js` — regression/property tests
- `.nojekyll` — GitHub Pages helper
- `_headers` — basic static security headers
- `cloudflare-pages.toml` — deployment notes

## Inventory
The browser loads `./data/inventory.json`. The app validates the JSON at startup and fails closed if it is missing, empty, contains duplicate/missing IDs, or invalid price/mileage values.

The 150 imported records are **development/demo data derived from the supplied CSV**. Source listing URLs and listing IDs are retained for provenance. Missing fields remain missing; no dealer, location, consumption, ownership, service-history, warranty or market benchmark is fabricated.

Three earlier VECTORI development examples are retained. These records must **not** be presented as authorised live AutoTrader inventory. Live inventory requires appropriate dealer/licensing/authorisation arrangements and permitted image/data rights.

## GitHub Pages
1. Create a GitHub repository.
2. Upload the **contents of this folder** to the repository root.
3. Commit `index.html` and `data/inventory.json`.
4. GitHub: **Settings → Pages → Deploy from a branch → main → / (root)**.
5. Save and wait for deployment.

No Node build is required.

## Cloudflare Pages
1. Push this folder to GitHub.
2. Create a Cloudflare Pages project and connect the GitHub repository.
3. Production branch: `main`.
4. Build command: `exit 0`.
5. Build output directory: `/`.
6. Deploy.

## Local test
Because `fetch()` can be blocked from `file://`, serve the folder over HTTP:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

With Node.js:

```bash
npm test
```

## Production architecture
Do not use GitHub or public JSON as the production inventory database. Intended path:

`Authorised Dealer → API/feed/CSV → VECTORI ingestion → validation → provenance/freshness → database → frontend`

Never put dealer/API secrets in `app.js`, `inventory.json`, GitHub, or browser-visible code.
