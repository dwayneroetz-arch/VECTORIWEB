# VECTORI Asset Intelligence Platform 2.2

VECTORI is a monetizable premium asset-intelligence platform built around one shared outcome architecture.

## Asset verticals
- Automotive
- Property
- Fine Jewellery

Each vertical has its own asset adapter and evidence fields but feeds the same finance, insurance, scenario and real-world outcome engine.

## Marketplace layout
Desktop results use two four-slot rows:
- 3 listing cards + 1 sponsored slot
- 1 sponsored slot + 3 listing cards

That produces a 75% listing / 25% sponsored slot footprint without creating a permanent advertising column. On mobile, the stream becomes one column with inline sponsored placements.

## Dealer distribution
Where multiple providers have qualifying inventory, the full filtered result set is interleaved across providers before pagination. An explicit dealer/agent/jeweller filter remains exclusive.

## Outcome engine
The common engine produces:
- monthly real cash exposure
- horizon cash outflow
- expected/entered exit value
- finance balance
- net equity
- economic cost
- operating cost
- insurance exposure
- evidence completeness
- stress/downside scenarios

Property transfer and bond-registration costs are included in finance principal when supplied. A fine-jewellery current valuation is not automatically treated as a future exit value.

## Accuracy boundary
Deterministic arithmetic is regression-tested. Real-world future values, provider terms, insurance prices, condition, maintenance, market movement and customer circumstances remain uncertain. VECTORI exposes missing evidence rather than fabricating certainty.

## Compliance boundary
The package includes South African compliance-readiness controls covering the Property Practitioners Act/PPRA, SADPMR precious-metals permissions, NCA/credit, FAIS/financial intermediation, insurance conduct and Policyholder Protection Rules, POPIA, CPA, ECTA and advertising identification. This is not legal certification. Production launch requires legal/compliance review of VECTORI's exact role, provider contracts, authorisations, data rights and consumer journeys.

## Tests
```bash
npm test
```

## Local server
```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.
