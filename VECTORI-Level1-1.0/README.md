# VECTORI Level 1 — Asset Intelligence & Real-World Outcome Engine

Functional commercial-scale demonstrator covering 15 design priorities:
1. unified multi-vertical architecture
2. central state model
3. 10 variants per vertical (30 assets)
4. dealer/provider diversity
5. evidence/status ledger
6. finance as independent module
7. insurance as independent module
8. property acquisition and SARS transfer-duty logic
9. automotive running-cost model
10. jewellery valuation/insurance/resale scenario model
11. real-world outcome calculation
12. 75/25 advertising/workspace separation
13. explicit demo/estimated/missing boundaries
14. source/governance layer
15. automated simulations and browser smoke testing

## Run

```bash
npm test
python3 -m http.server 8080
```
Open http://localhost:8080.

## Data boundary
All catalogue values are demo/scenario data. Official sources are used for the regulatory/data architecture and the property transfer-duty formula; current DMPR and SARB references are recorded in `data/sources.json`. No provider quote, valuation, insurance premium, credit decision or legal certification is represented as live.

## Production scaling path
Replace demo catalogue records with source-linked provider feeds while retaining the same record shape, evidence statuses, calculation APIs, UI modules and test contracts. Add authenticated provider registry, audit log, consent/POPIA controls, live quotation adapters, Deeds/municipal integrations, VIN/market feeds, SADPMR verification and human/provider review before production decisions.
