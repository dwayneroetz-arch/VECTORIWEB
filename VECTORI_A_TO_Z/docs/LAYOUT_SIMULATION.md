# VECTORI A-to-Z Layout Simulation

This is an engineering scenario simulation, not a human usability study. It was used to choose the initial information architecture before coding.

## Scenarios
20,000 synthetic journeys varied income, complexity and missing-data rates.

Three layouts were modelled:
- Single page: everything visible at once.
- Wizard: strict sequential screens.
- Hybrid progressive journey: a small first step, shared context, expandable detail and a persistent decision summary.

## Results

| Layout | Completion proxy | Error proxy | Evidence coverage proxy | Journey cost proxy |
|---|---:|---:|---:|---:|
| Single page | 76.63% | 3.68% | 50.33% | 6.77 |
| Wizard | 87.97% | 5.38% | 74.36% | 15.98 |
| Hybrid | 88.91% | 4.00% | 80.13% | 11.63 |

The hybrid architecture was selected for the build because the scenario model showed a useful balance: low initial input burden, high evidence visibility, lower context loss than a strict wizard, and less information overload than a single giant page.

The values above are modelling outputs only. They must not be represented as measured customer conversion or usability results.
