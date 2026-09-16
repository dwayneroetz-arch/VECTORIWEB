# VECTORI Asset Intelligence Platform — Architecture 2.1

## Core principle

VECTORI is one intelligence platform, not three disconnected marketplaces.

`Customer → Asset → Evidence → Finance and/or Insurance → Shared Outcome Engine → Real-world outcome`

The first production vertical can be Automotive. Property and Fine Jewellery use the same core contract through asset-specific adapters.

### Asset adapters

- **Automotive:** vehicle price, mileage, consumption, maintenance, tyres, licence, service/warranty, market evidence, future value.
- **Property:** purchase price, transfer costs, bond-registration costs, rates, levies, maintenance, utilities, property insurance, rental income, future value and sale costs.
- **Fine Jewellery:** purchase price, valuation/reference value, insurance, storage, maintenance, future value and resale costs.

The adapters intentionally do not assume that the economics or evidence standards are identical between asset classes.

## Shared finance layer

The finance layer supports documented structures such as instalment sale, balloon/residual, GFV, lease/rental-style structures and future authorised provider products. Provider-specific terms must be sourced, dated and refreshed; the mathematical engine does not turn a public headline rate into a live quotation.

## Shared insurance layer

The insurance layer can model quoted/user-supplied premiums and contingent exposures such as excesses, plus shortfall/GAP or other cover when supported by the authorised product data. It must not fabricate a policy, premium, insurer identity, wording, exclusion or eligibility outcome.

## Outcome definitions

- **Cash outflow:** money leaving the customer over the selected horizon, including acquisition cash, finance payments/fees, operating costs, insurance costs and known end-of-term obligations.
- **Net equity:** supplied/estimated exit asset value less finance balance at the selected horizon.
- **Economic cost:** horizon cash outflow less net equity. It is an analytical scenario, not a guaranteed future market price.
- **Monthly cash exposure:** horizon cash outflow divided by the selected horizon.
- **Affordability signal:** customer-input cash-flow ratio only; it is not lender affordability approval.

## Marketplace distribution

The result page uses a **woven 75/25 commercial footprint** rather than a permanent advertising sidebar. On wide screens, three equal listing slots are followed by one advertising slot; the advertising position alternates between rows. This keeps advertising visible while preserving the marketplace workspace.

### Dealer distribution rule

The platform interleaves listings by dealer for each result page when more than one dealer is available. It preserves the user's explicit dealer filter and does not invent inventory. The rule is presentation logic, not a ranking or endorsement of a dealer.

Example six-listing page:

`Dealer A → Dealer B → Dealer C → Dealer A → Dealer B → Dealer C`

If only one dealer exists in the filtered dataset, the platform cannot manufacture additional dealers and will show the available stock.

## Evidence hierarchy

`Observed → User-provided → Calculated → Assumed → Estimated → Missing`

Missing data remains missing and is surfaced to the customer.

## Scenario policy

Base/stress/downside are explicit parameter variations. No probability-weighted result is produced unless verified historical evidence is available.

## Regulatory boundary

VECTORI is designed as analytical decision support. It must not present itself as a lender, insurer, property valuer, regulated financial adviser/intermediary, or precious-metals dealer unless the relevant legal entity, licences/permissions and operating arrangements are actually in place.

Production journeys involving regulated financial products, property practice or precious-metals activities require the appropriate authorised provider/partner structure and legal/compliance sign-off.
