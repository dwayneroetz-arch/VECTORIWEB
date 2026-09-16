# VECTORI — Premium Marketplace Polish

## Design direction
**20% luxury editorial / 80% premium marketplace**

This pass is intended to make VECTORI feel like a premium automotive marketplace with a restrained editorial layer, while keeping the existing VECTORI application architecture and intelligence workflow recognizable.

## Preserved
- Existing navigation and five-section architecture.
- Existing Find → Compare → Intelligence → Purchase Readiness → Dealer Portal workflow.
- Existing vehicle filtering, sorting, comparison, calculator and analysis logic.
- Existing advertising manager, campaign selection, destinations and tracking.
- Existing six-vehicle logical page size.
- Existing mobile navigation, swipe pagination and responsive behavior.

## Polished
- More useful desktop workspace proportions with a controlled advertising rail.
- More compact, premium-feeling advert placements rather than a dominant tall ad wall.
- Stronger typography hierarchy and quieter editorial spacing.
- More refined filter/search surface with clearer grouping and focus states.
- Vehicle cards tightened for marketplace scanning while retaining the intelligence data.
- More deliberate image treatment, metadata pills, pricing hierarchy and action controls.
- Consistent visual language carried through Compare, Intelligence, Purchase Readiness and Dealer Portal panels.
- Improved tablet and mobile spacing so the site remains proportionate at smaller widths.
- More restrained glow, borders and shadows to keep inventory content dominant.

## Preview inventory
A small `data/inventory.json` is included in this review package so the site can be opened immediately without the production inventory feed. These records are explicitly marked as **VECTORI demo preview** records and are not live stock.

Replace `data/inventory.json` with the real inventory feed/file when deploying the production dataset. The application still uses the existing `fetch("./data/inventory.json")` path.

## QA note
- `app.js` is unchanged from the previous package.
- JavaScript syntax was checked successfully with Node.
- CSS brace balance was checked successfully.
- Browser screenshot automation was attempted in the supplied environment but Chromium did not complete reliably, so this package should receive a final visual browser pass on a normal desktop and mobile browser before production deployment.
