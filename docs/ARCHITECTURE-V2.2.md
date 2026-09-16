# VECTORI 2.2 — Asset Intelligence Architecture

## Product model
VECTORI is a single premium asset-intelligence platform. Automotive, Property and Fine Jewellery are asset adapters, not separate calculators or separate platforms.

```text
Marketplace inventory
      ↓
Asset adapter
  ├─ Automotive
  ├─ Property
  └─ Fine Jewellery
      ↓
Finance module (optional)
      +
Insurance module (optional / product-dependent)
      ↓
Shared Outcome Engine
      ↓
Cash exposure + retained equity + economic cost + evidence + scenarios
```

## Marketplace layout contract
Desktop result pages use two four-slot rows:

- Row 1: 3 listing cards + 1 sponsored slot.
- Row 2: 1 sponsored slot + 3 listing cards.
- Six listing slots and two sponsored slots therefore create a 75/25 listing-to-ad slot footprint.
- Sponsored slots are woven into the stream rather than forming a permanent right-hand advertising column.
- The listing cards retain equal visual footprint.
- At tablet widths the grid compresses; at mobile widths listings become one column and sponsored placements become inline full-width blocks.

The 75/25 ratio is a layout allocation, not a promise about advertising inventory revenue or an advertising ranking.

## Provider distribution
When multiple providers have eligible inventory, the full filtered result set is interleaved by provider before pagination. This prevents the first page from being consumed by one provider when other providers have qualifying listings. An explicit provider/dealer filter disables diversification and shows only the selected provider.

This is a presentation rule. It is not a provider ranking, endorsement or quality score.

## Asset adapters
### Automotive
Vehicle price, market reference, mileage, fuel/energy consumption, maintenance, tyres, licence, service plan, tolls, parking, future value and ownership costs.

### Property
Purchase price, reference value, transfer costs, bond registration, rates, levies, maintenance, utilities, property insurance, rental income, future value and sale costs.

### Fine Jewellery
Purchase price, current valuation/reference, insurance, storage, valuation cost, maintenance, future value and resale costs. A current valuation is not silently treated as a future exit value.

## Finance and insurance
Finance and insurance are independent modules. The customer can run the asset alone, asset + finance, asset + insurance, or asset + both where the product is applicable. Provider-specific terms must be ingested as dated evidence before a production quote or comparison is presented.

## Outcome definitions
- Cash outflow: money leaving the customer over the selected horizon.
- Net equity: exit/asset value less outstanding finance balance.
- Economic cost: cash outflow less net equity.
- Monthly cash exposure: horizon cash outflow divided by horizon months.
- Cash-flow ratio: customer-input scenario only; it is not lender affordability approval.

## Evidence policy
Observed, user-supplied, calculated, assumed, estimated and missing states remain distinct. Future values and provider terms are scenarios unless supported by current evidence.

## Regulatory boundary
VECTORI is implemented as analytical decision support. It should not make a credit approval, underwriting decision or other legally/substantially significant decision solely through automated processing. Regulated providers remain responsible for regulated decisions and transactions.
