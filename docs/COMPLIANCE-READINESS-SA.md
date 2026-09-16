# VECTORI 2.0 — South Africa compliance readiness matrix

**Research date:** 16 September 2026  
**Scope:** consumer-facing intelligence platform with automotive, insurance and finance workflows.

This is an engineering/control checklist, not a legal opinion or certification. Commercial launch requires review by appropriately qualified South African legal/compliance professionals and, where applicable, licensed/registered partners.

| Area | Requirement / control | VECTORI implementation status | Evidence / authority |
|---|---|---|---|
| National Credit Act | Responsible credit / affordability boundaries; distinguish model from lender assessment | Implemented as analytical-only outcome; lender approval not claimed | NCR / NCA sources |
| Affordability | Capture income, deductions/debt/living costs where used; preserve inputs and assumptions | Implemented as user-provided scenario model; not a credit decision | NCR affordability guidance |
| FAIS | Do not provide regulated advice/intermediary services without required authorisation/licensed partner structure | Architecture separates information/calculation from regulated advice and applications | FAIS Act + General Code |
| Insurance | Insurance product distribution/quotes require appropriate licensed entity/intermediary arrangements | Prototype accepts quoted/user-entered inputs; no insurer quote is fabricated | Insurance Act / PPR / FSCA |
| POPIA | Purpose limitation, minimisation, lawful processing, security, data subject rights, automated decision controls | Data model designed to separate customer inputs, evidence and outputs; production consent/security backend required | POPIA ss 11, 13–14, 69 and related provisions |
| CPA | Fair, transparent consumer information and marketing | UI labels estimates, sponsored content and source provenance | Consumer Protection Act |
| ECTA | Website/business identity, transaction/disclosure requirements as applicable | Production legal identity/disclosure checklist included | ECTA |
| Advertising | Sponsored content must not be confused with independent intelligence | Ad layer visually labelled and separated | CPA/industry requirements as applicable |
| Automated decisions | Material decisions must not be presented as solely automated regulated decisions | VECTORI outcome is decision support, not lender/insurer approval | POPIA automated decision provisions |
| Evidence | No missing data converted into factual claim | Hard rule in engine; missing evidence remains missing | VECTORI engine tests |
| Provider terms | Rates, fees, GFV, balloon, lease and eligibility are time-sensitive | Product catalogue requires dated source refresh | Provider official sources |
| Auditability | Store input snapshot, calculation version, source timestamp and scenario ID in production | Engine returns version/evidence metadata; production persistence still required | Engineering control |

## Launch gates

1. Confirm VECTORI legal entity and role in each regulated journey.
2. Obtain legal/compliance sign-off for any finance/insurance lead generation, advice, comparison or application flow.
3. Contract with authorised providers where regulated products are distributed.
4. Implement POPIA privacy notice, lawful-basis/consent flows, retention/deletion controls and security controls.
5. Implement source freshness and provider-term expiry.
6. Never present illustrative/demo inventory or model assumptions as live offers.
7. Add human/provider review where a decision has legal or similarly significant effects.
8. Keep a calculation audit trail and versioned methodology.
