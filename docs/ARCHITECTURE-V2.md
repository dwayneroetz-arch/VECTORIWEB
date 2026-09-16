# VECTORI 2.0 Architecture

## Principle
One shared outcome engine; three domain modules.

`Customer profile → evidence → Automotive + Insurance + Finance → scenarios → real-world outcome → audit trail`

### Outcome definitions
- **Cash outflow:** money leaving the customer over the selected horizon, including upfront amounts, scheduled payments, operating costs and known end-of-term obligations.
- **Net equity:** expected asset value less finance balance at the selected horizon.
- **Economic cost:** cash outflow less net equity. It is not a prediction of future market price.
- **Monthly cash exposure:** horizon cash outflow divided by horizon months.
- **Affordability signal:** customer-provided cash-flow ratio, not lender approval.

### Evidence hierarchy
Observed → User-provided → Calculated → Assumed → Estimated → Missing.
Missing data is never silently replaced with a favourable number.

### Scenario policy
Base / stress / downside scenarios are parameter variations. Probability-weighted outcomes are disabled unless verified historical evidence exists.

### Regulatory boundary
The platform provides analytical decision support. It does not itself grant credit, underwrite insurance, approve finance, or replace regulated advice. Any future regulated journey must be implemented through the appropriate authorised entity/provider arrangement.
