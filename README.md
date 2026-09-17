# VECTORI Level 1.2 — Complete Multi-Vertical Demonstrator

VECTORI is a multi-vertical asset-intelligence demonstrator spanning:

- Automotive
- Property
- Fine Jewellery
- Finance as an independent module
- Insurance as an independent module

Operating model:

**Asset → Intelligence → Finance / Insurance → Real-World Outcome**

## Demo catalogue

30 demo assets are included: 10 per vertical, with 10 distinct asset-provider records per vertical.

All provider/asset/finance/insurance records are synthetic demo/scenario data unless explicitly marked as an official regulatory reference.

## Intelligence modules

### Automotive

Market reference, acquisition, fuel, maintenance, licence, tyres, finance, insurance and future-value outcome.

### Property

Acquisition, SARS transfer-duty formula, VAT scenarios, transfer/legal costs, bond-registration scenario, rates, levies, utilities, maintenance, rental income/vacancy, insurance, future value and sale costs.

### Fine Jewellery

Metal/purity, weight, stone/4Cs, certificate, valuation, replacement value, fair-market, trade and scrap scenarios, insurance, storage and resale costs.

### Finance

Provider product, rate, term, deposit, balloon/GFV-style residual, monthly fee, initiation fee and total finance charges. Balloon financing uses a present-value calculation.

### Insurance

Provider product, sum-insured basis, premium, excess and independent enable/disable control. Selected insurance products feed the outcome engine and comparison engine.

### Affordability

Optional monthly income, existing debt and living-cost scenario with surplus and debt-service ratio. This is explicitly **illustrative** and is not a lender affordability assessment or credit decision.

## Evidence boundary

The catalogue explicitly distinguishes demo, provider-supplied, estimated, calculated, scenario and missing evidence. Missing evidence is not silently converted into verified fact.

## Commercial layout

The marketplace uses a 75/25 workspace-to-advertising structure. Sponsored content is visibly separated from intelligence and cannot rewrite calculation inputs.

## Compliance control plane

The demo contains a compliance guardrail audit and a source matrix covering, among other things:

- SARS transfer duty and VAT references
- Property Practitioners Act / PPRA
- National Credit Act and affordability regulations
- Insurance Act / FSCA FSP verification reference
- POPIA, including automated-decision-making reference
- Consumer Protection Act
- Advertising Regulatory Board code reference
- SADPMR jewellery licensing/register references
- DMPR fuel-price reference

The compliance layer is a **control baseline, not legal certification**. Production requires legal/compliance review of the exact business model and live workflows.

## Tests

### Core deterministic suite

```bash
node tests/simulations.mjs
```

Expected:

```text
VECTORI 1.1 simulation suite: 165 assertions PASS
```

### 10,000 randomized engine simulations

```bash
node tests/stress-10000.mjs
```

Current run:

- 10,000 randomized scenarios
- 137,827 invariant checks
- 0 failures

### Compliance guardrail audit

```bash
node tests/compliance-audit.mjs
```

Current run: 16/16 guardrail checks PASS.

### Browser workflow stress

`tests/browser-stress.mjs` is designed to run against the **deployed site**. It exercises randomized clicks/workflows including market switching, search, sorting, comparison, intelligence open/close, finance/insurance toggles and recalculation.

Install Playwright once:

```bash
npm install -D playwright
```

Then run 10,000 browser workflows against the deployed URL:

```bash
node tests/browser-stress.mjs https://YOUR-PAGES-URL.pages.dev 10000
```

This live-site browser test is the final gate after deployment.

## Run locally

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Production boundary

This is a demonstrator, not a live provider marketplace. Live production requires authenticated data feeds, provider agreements, registry/identity verification, quotation adapters, immutable evidence/audit logs, privacy governance, regulated disclosures and ongoing regulatory monitoring.
