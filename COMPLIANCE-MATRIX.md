# VECTORI Level 1.2 — Compliance Control Matrix

**Scope:** South Africa demo / pre-production demonstrator. This is a control map, not a legal opinion or certification.

## Controls implemented in the demo

| Area | Control | Demo status | Production requirement |
|---|---|---|---|
| Consumer marketing | Demo/scenario data visibly labelled; no live-quote claim | PASS | Provider-specific substantiation, availability and price evidence before publishing live claims |
| Advertising | Sponsored area separated from organic intelligence; provider slot described as verification-ready | PASS | Ad review, substantiation, labelling and complaint process |
| Property practitioners | PPRA reference included; provider status remains demo | PASS | Verify current FFC/RC and applicable disclosures before any live practitioner listing |
| Property tax | SARS transfer-duty formula and VAT/transfer-duty exclusivity modelled | PASS | Transaction-specific legal/tax validation and current effective-date rules |
| Finance | Finance model is mathematical scenario only | PASS | Verify NCR registration, product terms, disclosures, fees, affordability process and provider-specific rules |
| Affordability | Clearly labelled illustrative scenario, not a lender assessment | PASS | Do not substitute VECTORI calculation for a regulated credit provider's affordability assessment |
| Insurance | Insurance is an independent scenario module | PASS | Verify insurer/FSP status, product authority, policy wording, premium/cover/exclusions and intermediary disclosures |
| POPIA | No personal-data collection in demo; privacy references included | PASS | Lawful basis, notices, consent/objection flows where applicable, retention, security, data-subject rights, vendor controls |
| Automated decision-making | Demo does not make credit/insurance approval decisions | PASS | Section 71 safeguards and human-review/explanation controls if profiling materially affects people |
| Jewellery | SADPMR licensing/register references; values labelled demo/scenario | PASS | Verify applicable licences/permits, provenance, valuation and transaction documentation |
| Evidence | Evidence states are explicit and missing values remain missing | PASS | Immutable provenance, source snapshots, timestamps, audit logs and correction workflow |
| Regulatory sources | Official-source links included | PASS | Continuous regulatory monitoring and versioned rule effective dates |

## Production blockers

1. Live provider onboarding and identity verification.
2. Live finance/insurance quotation adapters and regulated disclosure flows.
3. PPRA FFC/RC and applicable property disclosure verification.
4. FSCA/FSP and insurer authorisation verification.
5. NCR registration/product and affordability controls where applicable.
6. POPIA privacy notice, lawful-basis mapping, retention, access/correction/deletion workflows and security controls.
7. Advertising substantiation, sponsor labelling, complaint/takedown process and record retention.
8. Legal/tax review of property transaction calculations and edge cases.
9. Jewellery provenance, valuation and applicable SADPMR controls.
10. Production audit trail and evidence immutability.

## Sources

- SARS Transfer Duty: https://www.sars.gov.za/types-of-tax/transfer-duty/
- SARS 2026 Tax Guide: https://www.sars.gov.za/budget-tax-guide-2026-web-version/
- Property Practitioners Act: https://www.gov.za/documents/acts/property-practitioners-act-22-2019-english-tshivenda-03-oct-2019
- PPRA FFC renewals: https://theppra.org.za/licensing-and-registrations/ffc-renewals/
- National Credit Act: https://www.gov.za/documents/national-credit-act
- NCA Regulations / Affordability: https://www.gov.za/documents/notices/national-credit-act-regulations-13-mar-2015
- Insurance Act: https://www.gov.za/documents/acts/insurance-act-18-2017-english-afrikaans-18-jan-2018
- FSCA FSP search: https://www.fsca.co.za/FSB-Search/
- POPIA: https://www.justice.gov.za/legislation/acts/2013-004.pdf
- Consumer Protection Act: https://www.gov.za/documents/consumer-protection-act
- ARB Code: https://www.arb.org.za/The_Codes/
- SADPMR registers: https://www.sadpmr.co.za/registers/
- DMPR fuel prices: https://www.dmpr.gov.za/Branches/Petroleum-Resources/Fuel-Prices
