# VECTORI 2.1 change log

## Marketplace layout

- Removed the permanent advertising sidebar from the desktop marketplace.
- Replaced it with a woven 75/25 result-stream layout: 6 listing slots + 2 ad slots per six-item page on wide desktop.
- Alternated ad position between rows so the commercial inventory does not read as a fixed fourth column.
- Ads are non-sticky inside the listing stream.
- Mobile collapses listings to one column and turns sponsored placements into full-width, labelled blocks.

## Dealer distribution

- Added deterministic dealer interleaving for result pages.
- When multiple dealers exist, the first page is distributed across dealer groups rather than allowing one dealer to occupy all six slots.
- Explicit dealer filters remain exclusive.
- Dealer mix is surfaced above the results.
- No ranking factor or dealer-quality inference is added.

## Asset architecture

- Added `asset-engine.js` adapters for Automotive, Property and Fine Jewellery.
- Added property and fine-jewellery scenario calculations to the shared outcome engine.
- Finance and insurance remain independent modules.
- Shared outcome definitions remain consistent across asset classes.

## Evidence and advertising controls

- Sponsored placements display an Advertisement label plus campaign/sponsor identity.
- Demo inventory is explicitly synthetic.
- Missing evidence remains visible instead of being silently replaced.
- Paid advertising is not used as an intelligence/ranking input.

## Testing

- Finance/property/jewellery simulation grid passes.
- Multi-dealer distribution simulations pass.
- Engine property-grid regression passes.
- Node syntax checks pass.
- HTTP smoke test returns 200 for `index.html` and `outcome-engine.js`.
- Static mobile checks confirm viewport metadata and responsive single-column rules.

A full visual browser screenshot test was not certified in this environment; the earlier headless browser environment timed out. The package therefore does not claim visual browser QA beyond the static responsive checks above.
