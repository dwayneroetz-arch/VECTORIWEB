# VECTORI South Africa Research Register — 16 September 2026

## Regulatory sources

- FSCA — market-conduct regulator and FAIS regulatory resources: https://www.fsca.co.za/
- FSCA — FAIS overview: https://www.fsca.co.za/Regulatory%20Frameworks/Regulatory%20Frameworks%20Documents/FAIS.pdf
- South African Government — FAIS Act 37 of 2002: https://www.gov.za/documents/financial-advisory-and-intermediary-services-act
- South African Government — FAIS General Code: https://www.gov.za/documents/notices/financial-advisory-and-intermediary-services-act-general-code-conduct-authorised
- South African Government — POPIA: https://www.gov.za/documents/protection-personal-information-act
- South African Government — Consumer Protection Act: https://www.gov.za/documents/consumer-protection-act
- South African Government — ECTA: https://www.gov.za/documents/electronic-communications-and-transactions-act
- South African Government / NCR — National Credit Act and affordability material: https://www.ncr.org.za/
- South African Government — Short-Term Insurance Policyholder Protection Rules: https://www.gov.za/documents/notices/short-term-insurance-act-policyholder-protection-rules-15-dec-2017
- PPRA — Property Practitioners Act and Code of Conduct: https://theppra.org.za/about-us/property-practitioners-act/
- PPRA — Code of Conduct: https://theppra.org.za/compliance-and-investigations/investigations/code-of-conduct/
- SADPMR — licences and permits: https://www.sadpmr.co.za/licenses-and-permits/

## Product/market research

The platform research distinguishes public product structures from live quotations. Finance structures researched include instalment sale/vehicle finance, balloon/residual, GFV, lease/rental-style arrangements, Islamic/Ijaarah-style structures, balloon refinance, private-sale finance and business/asset finance. Insurance structures researched include comprehensive/limited motor cover, shortfall/GAP, credit/debt protection, warranty/mechanical breakdown, service plans and related add-ons.

Provider pages must be refreshed before use as live commercial data. Public examples are not treated as live customer quotations.

## Architecture conclusions

1. Use one shared outcome engine with asset-specific adapters.
2. Keep finance and insurance independent modules that can be combined with an asset.
3. Treat missing evidence as missing rather than filling gaps silently.
4. Use explicit scenario ranges rather than invented probability weights.
5. Keep paid advertising outside the intelligence/ranking methodology.
6. Interleave multiple dealers on result pages when multiple dealers exist in the filtered dataset.
7. Blend advertising into the listing stream rather than using a permanent sidebar.
8. Maintain provider/source timestamps and an audit trail in production.
