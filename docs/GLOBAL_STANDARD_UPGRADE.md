# VECTORI Global-Standard / South Africa Upgrade

## Scope
This upgrade preserves the existing VECTORI demo workflow while strengthening the layout, advertising architecture, South African buying workflow, affordability model, finance mathematics, evidence hierarchy, mobile behaviour and dealer-facing presentation.

## Global concepts integrated
- Side-by-side comparison with decision-oriented interpretation, inspired by the approach used by Edmunds and Carwow.
- Total-cost-of-ownership thinking rather than price-only comparison.
- Explicit affordability and purchase-price modelling.
- Finance modelling with balloon/residual support, monthly administration fees and initiation fees, reflecting common South African vehicle-finance calculator inputs.
- Explainable warnings instead of opaque recommendations.

## South African additions
- Balloon payment as an explicit end-of-term liability.
- Vehicle cash burden separated from economic/depreciation cost to avoid double-counting principal repayment in affordability.
- Roadworthiness, registration/ownership transfer, licence status, service history, VIN/history evidence and test-drive/inspection checklist.
- Evidence provenance states: OBSERVED, CALCULATED, ASSUMED, MISSING.
- Dealer feed authorisation and image/data-rights workflow retained.

## Advertising
Desktop content uses a 70/30 main-content-to-advertising grid. Six banner formats are supported:
1. Leaderboard 970x90
2. Wide Banner 728x90
3. Medium Rectangle 300x250
4. Large Rectangle 336x280
5. Half Page 300x600
6. Mobile Banner 320x100

Ad impressions are counted only after at least 50% visibility through IntersectionObserver when supported, preventing hidden mobile placements from being counted as viewed on desktop.

## Mathematical model
For a financed vehicle:
- Principal = purchase price - trade-in - deposit
- Balloon = principal x balloon %
- Monthly payment uses the standard present-value formula with the balloon as the future value.
- Cash ownership burden = finance instalment + admin fee + fuel + insurance + maintenance + licence reserve + tyre reserve + other vehicle costs.
- Affordability uses cash burden, not depreciation reserve. This avoids treating principal repayment and depreciation as two separate cash expenses.
- Economic monthly cost may include depreciation reserve, while principal repayment is removed from that economic view.
- Balloon reserve planning amount = balloon / finance term.
- Stress test: interest +1 percentage point; fuel +20%; insurance +15%; maintenance +20%.

## Important production gates
The current package is a browser-based demo/prototype. Before commercial production, connect the UI to the previously established commercial backend/API architecture, production PostgreSQL, authenticated dealer feeds, managed secrets, monitoring, backups, consent/POPIA controls, contracted advertising infrastructure, security testing, and legal review.

The demo inventory remains illustrative/historical development data and must not be represented as live stock.


## Comparison v1.1
- Comparison capacity increased from 4 to 6 vehicles.
- Vehicle cards now use an explicit `Add to Compare` button with an `aria-pressed` selected state instead of a checkbox.
- Selected buttons are visually highlighted and switch to `✓ Compared`.
- The comparison table expands horizontally and remains mobile-scrollable.
- Comparison burden calculations use explicit demonstration assumptions and the same PMT convention as the main calculator; principal is not added as a separate cash cost.
- Six-vehicle selection/cap behaviour and mathematical invariants are covered by the regression and randomized simulation suite.


## Presentation & Inventory v1.2
- Corrected section numbering: 01 Find, 02 Compare, 03 Intelligence, 04 Purchase Readiness, 05 Dealer Portal.
- Added Purchase Readiness to primary navigation.
- Updated hero comparison capacity label to six.
- Added 150 supplied CSV records plus the 3 previously supplied historical examples (153 total).
- Added explicit missing-data labels and source-year verification flags.
- Comparison burden analysis now fails closed when required consumption data is missing rather than selecting an Infinity result.
- Calculator vehicle loading leaves missing market/consumption fields blank for explicit user entry.
