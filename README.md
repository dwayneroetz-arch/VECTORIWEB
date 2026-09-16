# VECTORI Intelligence Platform v2.0

VECTORI is structured as a monetizable premium intelligence platform with automotive, insurance and finance modules feeding one real-world outcome engine.

## What is implemented
- Shared deterministic outcome engine (`outcome-engine.js`).
- Automotive operating-cost model.
- Finance structures: instalment sale, balloon, GFV, lease/rental-style and provider-specific structures represented as inputs.
- Insurance cost/exposure inputs and a researched insurance-product taxonomy.
- Combined or separate module selection.
- Cash-outflow, economic-cost, net-equity and cash-flow outputs.
- Stress and downside scenario views.
- Evidence completeness and missing-data controls.
- Finance-product research taxonomy and source register.
- South Africa compliance-readiness matrix.
- Mobile/web responsive presentation layer.
- Regression tests for the core mathematical engine.

## Accuracy boundary
Deterministic arithmetic is regression-tested. Real-world outcomes cannot be certified as 100% accurate because future asset values, insurance pricing, provider terms, customer circumstances and market conditions are not fully deterministic. VECTORI therefore exposes assumptions and missing evidence instead of fabricating certainty.

## Production requirements
Before regulated commercial operation, use authorised provider feeds, dated product terms, legal/compliance review, secure backend storage, audit logs, POPIA controls, consent/privacy flows and human/provider review for regulated decisions.

## Local test
```bash
npm test
python -m http.server 8080
```
Then open `http://localhost:8080/`.


## 2.1 architecture update

- Shared asset adapter architecture: Automotive, Property and Fine Jewellery.
- Finance and insurance are independent modules and can be combined with any supported asset where the product is legally and commercially available.
- Marketplace result pages use a woven 75/25 commercial footprint instead of a permanent advertising sidebar.
- Result-page listings are interleaved across available dealers when multiple dealers exist; an explicit dealer filter remains exclusive.
- Paid advertising is visually separated from intelligence methodology and does not become a ranking input.
- Deterministic simulations cover finance, automotive, property, fine jewellery and dealer distribution.

## Accuracy boundary

The arithmetic is deterministic for supplied inputs and regression-tested. Real-world values such as future asset values, insurance premiums, provider terms, condition, maintenance, market movements and customer circumstances remain uncertain. The interface therefore exposes evidence status and does not certify future outcomes.

## Compliance boundary

The package contains a South Africa compliance-readiness architecture based on the NCA, FAIS, Insurance/Policyholder Protection Rules, POPIA, CPA, ECTA, Property Practitioners Act/PPRA materials and precious-metals regulatory sources. It is not legal certification. Commercial launch requires legal/compliance review, authorised partner arrangements where applicable, privacy/security controls, source rights and auditable provider data.
