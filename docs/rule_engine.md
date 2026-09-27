# Deterministic Rule Engine Specification

## Supported Operators
| Operator | Description | Supported Types |
|---|---|---|
| `==` | Exact equality | string, number, boolean |
| `!=` | Inequality | string, number, boolean |
| `>` | Strictly greater than | number |
| `<` | Strictly less than | number |
| `>=` | Greater than or equal | number |
| `<=` | Less than or equal | number |
| `IN` | Containment in allowed set | list, string |
| `NOT_IN` | Exclusion from set | list, string |

## Status State Machine
- **ELIGIBLE**: All statutory criteria passed and all required documents are uploaded.
- **POTENTIALLY_ELIGIBLE**: Socio-economic profile passes all requirements, but required documents are pending upload.
- **INELIGIBLE**: One or more mandatory rules failed.
- **INSUFFICIENT_INFORMATION**: Core demographic or financial profile fields are missing.
