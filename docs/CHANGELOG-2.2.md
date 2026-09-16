# VECTORI 2.2 change log

## Corrected marketplace architecture
- Replaced the previous effectively single-vertical result presentation with explicit Automotive / Property / Fine Jewellery market tabs.
- Added asset-specific listing fields and intelligence paths.
- Added real Property and Fine Jewellery outcome input panels.
- Finance and Insurance are now visibly independent modules shared by all asset adapters.

## Corrected 75/25 commercial footprint
- Removed the permanent advertising-column concept.
- Desktop marketplace uses 3 listing cards + 1 ad, followed by 1 ad + 3 listing cards.
- Six listings / two sponsored slots = 75/25 slot allocation.
- Ads are labelled and woven into the result stream.
- Mobile converts ads to inline full-width placements.

## Corrected dealer distribution
- Provider diversification now occurs across the full filtered result set before pagination.
- Demo Automotive, Property and Fine Jewellery categories each contain six listings from three providers and render two listings per provider on the first page.

## Corrected outcome logic
- Property transfer and bond-registration costs are included in finance principal when finance is selected.
- Fine-jewellery current valuation is no longer silently reused as future exit value.
- Property and jewellery asset-specific costs flow into the common outcome engine.

## Verification
- Node syntax checks pass for app.js, outcome-engine.js and listing-utils.js.
- npm test passes finance, property, jewellery, dealer distribution and 2.2 layout/integration tests.
- HTTP smoke test returns 200 for the application.
- Headless Chromium was attempted for visual verification but the supplied runtime timed out; therefore this release does not claim full visual browser certification.
