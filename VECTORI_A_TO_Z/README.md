# VECTORI A-to-Z Purchase Intelligence v2.0

South African vehicle purchase journey prototype integrating:

1. Budget-first / vehicle-first discovery
2. Actual vehicle comparison
3. Finance structure modelling
4. Insurance structure and quote analysis
5. Total monthly/economic ownership cost
6. Stress testing
7. Purchase readiness
8. Dealer onboarding / authorised inventory architecture

## Run locally

Because inventory and research data are loaded with `fetch()`, serve the folder over HTTP rather than opening `index.html` directly.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Tests

```bash
node tests/test_a_to_z.js
node tests/simulate_layouts.js
```

The regression suite includes 10,000 randomized finance scenarios and monotonicity/finite-output invariants.

## Important data rule

This package deliberately does **not** invent live lender or insurer quotes. Provider pages are used to establish product structures and published conditions. Exact pricing, fees, eligibility and policy terms require current provider data or formal quotes.

## Production path

Authorised dealer/provider API or feed → ingestion → validation → provenance → versioned rules → calculation → evidence → user.

Never put bank credentials, credit-bureau credentials, SA ID numbers, insurer credentials or provider API secrets in browser JavaScript.

## Legal/compliance status

This is a prototype/engineering foundation, not a licensed financial advisory or insurance-intermediary service. Before live regulated workflows, obtain appropriate legal/compliance review, provider contracts, secure infrastructure, POPIA controls, audit logging and licensed/authorised partner arrangements where required.
