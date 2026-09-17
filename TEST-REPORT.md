# VECTORI Level 1.2 Test Report

Date: 2026-09-17

## Automated engine stress

- **10,000 randomized scenarios** across Automotive, Property and Fine Jewellery.
- **137,827 invariant checks.**
- Result: **PASS — 0 failures.**

Scenario dimensions include finance on/off, insurance on/off, deposit, interest rate, term, balloon, fees, ownership horizon, fuel price, mileage, property VAT/transfer-duty paths, rental income, and jewellery exit scenarios.

## Core suite

- **165 assertions PASS.**
- Transfer-duty boundary tests.
- VAT included/excluded tests.
- Finance zero-rate and balloon PV tests.
- Insurance integration tests.
- Property income and acquisition tests.
- Jewellery exit tests.
- Comparison-engine tests.
- UI/module wiring tests.

## Compliance guardrail audit

- **16 compliance guardrail checks PASS.**
- Demo/not-live boundaries.
- No live quote claims.
- Illustrative affordability disclaimer.
- Advertising separation.
- Verification-ready provider language.
- Evidence boundary.
- POPIA / NCA / Insurance Act / PPRA / SADPMR / SARS / DMPR source references.
- No automatic recommendation/approval/eligibility claims.

## Browser workflow stress harness

`tests/browser-stress.mjs` is included for the live deployment stage. It accepts a deployed URL and can run 10,000 randomized browser workflows covering market switching, search, sort, compare, intelligence open/close, finance/insurance toggles and recalculation.

Example after deployment:

```text
node tests/browser-stress.mjs https://YOUR-PAGES-URL.pages.dev 10000
```

A browser-run against localhost could not be executed in this analysis environment because browser navigation to local/loopback addresses is blocked by the environment administrator. The live-site harness is therefore intentionally retained as the next deployment gate rather than being represented as already executed.

## Compliance boundary

The package is a **demo / pre-production control baseline**, not a legal certification. Production compliance requires live provider verification, regulated product/ad disclosures, POPIA governance, auditability, source/effective-date controls and legal/compliance review for the exact operating model.
