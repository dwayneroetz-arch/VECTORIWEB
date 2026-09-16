# VECTORI A-to-Z — Final Research Ledger

Research cut-off: 16 September 2026. This document separates verified public-source facts from provider-specific items that still require contracts, quotes or current legal review.

## 1. Regulatory architecture

### National Credit Act
The NCA governs consumer credit and responsible credit granting. VECTORI therefore treats affordability and creditworthiness as distinct concepts and never labels an estimate as an approval.
Source: https://www.gov.za/documents/national-credit-act

### Credit life
Government Gazette 40606 contains a prescribed maximum cost for credit life on “other credit agreements” of R4.50 per R1,000 of deferred amount per month. This value is retained as a historical/current-source rule with a production verification flag; it must not be assumed unchanged if later regulations amend it.
Source: https://www.gov.za/sites/default/files/gcis_document/201702/40606gon103.pdf

### NCA fees and interest ceilings
Older public summaries quote initiation/service caps that may be stale or indexed. VECTORI does not hard-code those figures as universal production rules. The live engine must ingest the latest prescribed fee and interest tables with effective dates and source documents.
Source: https://www.gov.za/documents/notices/national-credit-act-regulations-review-limitations-fees-and-interest-rates-06-nov

### Early settlement
Settlement treatment is agreement-category and amount sensitive. VECTORI therefore models settlement as a provider/agreement rule rather than a universal “no penalty” assumption.
Example provider disclosure: https://www.absa.co.za/personal/loans/for-a-car/instalment-sale-agreement/

## 2. Finance product findings

### WesBank
WesBank describes a balloon as a lump-sum amount due at the end of the term and states that affordability and creditworthiness are central to finance decisions.
Sources:
- https://www.wesbank.co.za/help-centre/new-to-wesbank/more-on-balloon-payments/
- https://www.wesbank.co.za/help-centre/article/what-affects-a-vehicle-finance-application/

### Absa
Absa publishes 24–72 month instalment-sale options, fixed or variable rates, deposit/balloon flexibility, and a requirement for vehicle insurance. Its early-settlement wording is agreement-size specific.
Source: https://www.absa.co.za/personal/loans/for-a-car/instalment-sale-agreement/

### Standard Bank
Standard Bank's public calculator accepts purchase price, deposit, interest rate, loan term and balloon and also exposes an affordability workflow.
Source: https://www.standardbank.co.za/southafrica/personal/products-and-services/borrow-for-your-needs/vehicle-financing/calculators

### Ford Credit
Ford publishes instalment sale, balloon instalment sale and Ford Options. Its published balloon product supports 24–72 months and a balloon up to 35% of loan value; Ford separately describes Options as a guaranteed-future-value style product.
Source: https://www.ford.co.za/buying/ford-credit/individual/

### BMW Financial Services
BMW publishes instalment sale, instalment sale with balloon and Select products. Its public material distinguishes customer balloon risk from guaranteed future value and gives product/term conditions that must be versioned.
Sources:
- https://www.bmw.co.za/en/bmw-financial-services.html
- https://www.bmw.co.za/en/bmw-financial-services/find-my-finance.html

### Volkswagen Financial Services
VW publishes EasyFinance as Guaranteed Future Value finance and separately describes instalment sale. The engine therefore treats GFV as distinct from a normal balloon.
Source: https://www.vw.co.za/en/offers-and-finance/financial-services/easy-finance.html

## 3. Insurance findings

Private motor insurance is not generally a statutory requirement for every private vehicle; however, financiers may contractually require comprehensive cover. VECTORI therefore has a finance-compliance flag rather than a universal statutory flag.
Source: https://www.miway.co.za/blog/car-insurance-in-south-africa-how-to-choose-the-right-cover-in-2026

### OUTsurance
Public comprehensive product information includes fixed excess selection, up to R5m standard liability and 24/7 emergency assistance.
Source: https://www.outsurance.co.za/car-insurance/comprehensive-car-insurance/

### Discovery Insure
Discovery states premiums are personalised based on profile, cover requirements and risk assessment, and explains that excess can include basic plus additional applicable amounts. Optional car-hire/other benefits exist by plan.
Source: https://www.discovery.co.za/car-and-home-insurance/core-plan

### Naked
Naked publishes comprehensive motor insurance, fixed excess and a digital quote flow; its site states that major banks accept its comprehensive cover for financed vehicles.
Source: https://www.naked.insure/car-insurance

### Miway
Miway publishes Comprehensive, Lite and Total Loss structures, a R5,000 standard flexible excess for Comprehensive, optional credit shortfall, car hire and specified accessories, plus 24/7 roadside assistance.
Source: https://www.miway.co.za/car-insurance

### King Price
King Price publishes quote-based pricing and explains excess as a claim contribution; its public materials describe risk-profile-dependent premiums and flexible excess concepts.
Sources:
- https://insurance.kingprice.co.za/car-insurance-quote
- https://blog.kingprice.co.za/car-insurance-excess-explained-south-africa/

## 4. POPIA / information architecture

POPIA requires lawful processing conditions and imposes rules around minimality, purpose, further processing, information quality, openness, security and retention/restriction. VECTORI therefore separates anonymous calculator data from identifiable quote/application data and keeps sensitive data server-side in the live architecture.
Sources:
- https://inforegulator.org.za/knowledge-base/category/popia/chapter-3-conditions-for-lawful-processing/
- https://inforegulator.org.za/knowledge-base/category/popia/chapter-2-application-provisions/

The Information Regulator also identifies circumstances where prior authorisation may be required, including specified unique-identifier linking, credit reporting and certain cross-border transfers. This must be assessed before live bureau/API integration.
Source: https://eservices.inforegulator.org.za/priorauthorisation/default.aspx

## 5. FSCA / FAIS boundary

The FSCA's Fit-and-Proper framework covers honesty/integrity, competence, experience, qualifications, regulatory examinations, class-of-business/product training, CPD, operational ability and financial soundness. VECTORI can provide calculations and factual comparison in a demo, but any live personalised financial/insurance advisory or intermediary function needs an appropriately licensed/authorised structure or partner model.
Sources:
- https://www.fsca.co.za/LR-FAIS-Fit-and-Proper/
- https://www.fsca.co.za/LR-FAIS-New-Applications/

## 6. Current fuel input

DMPR publishes monthly official fuel adjustments. The September 2026 adjustment became effective 2 September 2026. VECTORI's demo uses R26.92/L for inland 95 ULP from the verified project research, but production should load the official regional schedule dynamically rather than hard-code one national number.
Source: https://www.dmpr.gov.za/Media-Centre/News/ArtMID/2215/ArticleID/1030/MEDIA-STATEMENT-FUEL-PRICE-ADJUSTMENTS-EFFECTIVE-FROM-THE-2ND-OF-SEPTEMBER-2026

## 7. What remains intentionally unresolved

1. Current prescribed NCA fee/interest limits must be versioned from the latest regulations before live quoting.
2. Exact provider fees, rates, balloon limits, vehicle-age rules and settlement charges require current product documents or partner feeds.
3. Insurer premiums cannot be inferred reliably from public marketing pages; live quotes require the insurer/intermediary's quote flow or API.
4. Insurance policy wording, excess annexures, exclusions and benefit limits must be version-controlled.
5. API availability is a commercial integration question; a public webpage is not an API licence.
6. POPIA retention periods must be mapped by data type and applicable legal/contractual duty, not reduced to one universal period.
7. Any transition from factual comparison/calculation into regulated advice/intermediation requires legal/compliance review and an appropriate licensed partner structure.
