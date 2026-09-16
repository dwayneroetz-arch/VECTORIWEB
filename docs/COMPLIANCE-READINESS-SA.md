# VECTORI 2.1 — South Africa Compliance Readiness Matrix

**Research date:** 16 September 2026  
**Scope:** consumer-facing multi-asset marketplace and intelligence platform covering automotive, property, fine jewellery, finance and insurance.

This document is an engineering/control framework, not legal advice, certification or a statement that a commercial implementation is compliant. The final operating model must be reviewed by qualified South African legal/compliance professionals and the relevant authorised/registered partners.

| Area | Control required | VECTORI design response | Launch dependency |
|---|---|---|---|
| POPIA | Lawful processing, purpose limitation, minimisation, security, retention/deletion and data-subject controls | Customer inputs, evidence and calculations are separated; production consent/privacy/security backend remains required | Privacy counsel, Information Officer, security implementation |
| POPIA automated decisions | Avoid presenting material legal/substantial decisions as solely automated where section 71 applies | Outcome engine is labelled decision support; no lender/insurer approval is generated | Human/provider review and legal sign-off for any regulated journey |
| NCA / credit | Credit providers conduct the regulated credit/affordability process; consumer data must not be treated as approval | VECTORI affordability ratio is explicitly a customer-input scenario, not lender approval | Authorised credit provider integration |
| FAIS | Advice/intermediary activity may require FSP authorisation and appropriate representatives | Finance/insurance modules are separated from regulated advice/application flows | FSCA/FSP legal classification and contracts |
| Insurance / PPR | Advertising and distribution must not mislead; insurer identity and material information must be clear | Ads are labelled; provider identity is rendered; production insurer data must include legal entity, terms, wording and freshness | Licensed insurer/FSP/intermediary review |
| Property Practitioners Act | Property practitioner activity, conduct, advertising and FFC requirements can apply | Property listings identify the agent/agency; VECTORI does not claim to perform professional valuations | PPRA classification, FFC/mandate checks where applicable |
| Property valuation | Property practitioners should not hold themselves out as professional valuers without the relevant registration | UI calls market figures benchmarks/evidence, not professional valuations | SACPVP/PPRA legal review where valuation functionality is introduced |
| Precious metals/jewellery | Precious-metals/diamond activities may require permits/licences and regulated dealer arrangements | Jewellery adapter is an intelligence/listing layer only; it does not create a dealer licence | SADPMR/legal review and verified dealer credentials |
| CPA | Consumer-facing prices, descriptions and marketing must not be false, misleading or deceptive | Source/evidence labels, missing-data states and advertising labels are explicit | Content/legal review and complaint process |
| ECTA | Electronic transactions require appropriate notices/disclosures and transaction controls where applicable | Production legal identity, terms, transaction and recordkeeping controls are a launch gate | ECTA/legal review |
| Advertising | Sponsored content must be distinguishable from independent intelligence; regulated financial ads need extra controls | Woven ads have an Advertisement label and sponsor identity; no ad is presented as VECTORI evidence | Campaign approval workflow |
| Data provenance | Inventory and provider data need permission/licence and freshness | Authorised feed architecture and source fields are retained | Dealer/provider contracts and feed monitoring |
| Image rights | Listing imagery requires contractual/licensed rights | Prototype uses generated demo art; production source rights are explicit | Dealer/feed/image licence |
| Auditability | Calculation version, input snapshot, source timestamp and scenario should be recoverable | Engine version and evidence objects exist; production persistence is still required | Audit-log backend |
| Security | Customer/lead data needs access control, encryption, monitoring and incident response | Front-end prototype does not claim production security | Secure backend, secrets management, logging, incident plan |

## Advertising and marketplace control

1. Every sponsored placement must be visually identified as an advertisement.
2. A finance/insurance advertisement must identify the relevant legal/provider identity where required by the applicable rules.
3. Sponsored placement must not be allowed to alter the calculation inputs, evidence status or outcome methodology.
4. Paid placement must not silently become a ranking factor in the intelligence engine.
5. Dealer listings must retain the authorised dealer/agent identity and source provenance.
6. The dealer-diversity algorithm is presentation logic only and does not imply dealer quality or endorsement.

## Property-specific launch gates

- Confirm whether VECTORI is merely a portal/advertising platform or is performing acts that fall within the definition of property practitioner.
- Verify each agent/agency's PPRA/Fidelity Fund Certificate status where required.
- Store mandate/source authority for listings.
- Do not label a market estimate as a professional valuation unless performed by an appropriately registered valuer.
- Review commission/lead arrangements and any conflict-of-interest disclosures.

## Jewellery-specific launch gates

- Confirm whether the business model involves dealing in precious metals/diamonds, broking, financing or merely advertising third-party stock.
- Verify relevant SADPMR licences/permits for dealers where applicable.
- Verify diamond/stone certification and provenance fields where claimed.
- Do not convert a seller's claimed valuation into an independent VECTORI valuation without evidence and appropriate professional basis.

## Financial-product launch gates

- Confirm whether the exact journey is information, lead generation, advice, intermediary service, application processing or another regulated activity.
- Contract only with appropriately authorised providers/intermediaries for regulated steps.
- Do not use VECTORI's automated result as a sole approval/underwriting decision.
- Keep provider rate/fee/term/GFV/coverage data dated and expirable.
- Present customer-specific affordability as a scenario, not a lender decision.

## Launch gates — all verticals

1. Confirm VECTORI's legal entity, role and remuneration model per vertical.
2. Obtain South African legal/compliance sign-off for each regulated workflow.
3. Contract with authorised/registered providers where applicable.
4. Implement POPIA privacy notice, lawful-basis/consent, retention/deletion, security and data-subject processes.
5. Implement source freshness, provider expiry and feed-health controls.
6. Never present demo/synthetic data as live stock or a live quote.
7. Keep advertising separate from intelligence methodology.
8. Add human/provider review where the workflow could have legal or similarly significant effects.
9. Persist calculation version, inputs, evidence, provider source timestamp and scenario ID.
10. Maintain a complaints/escalation route appropriate to the operating model.
