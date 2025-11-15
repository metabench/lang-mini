# Expression Parser Implementation Plan

## Objectives
- Deliver a robust expression parser with minimal byte footprint while supporting arithmetic, logical, and functional expressions described in `docs/Expression_Parser.md`.
- Ensure compatibility with existing lang-mini utilities and evented systems.
- Maintain a compressed size contribution not exceeding 6 KB gzipped.

## Scope & Constraints
- **In Scope**: Tokenizer, Pratt-style parser, evaluator with pluggable helpers, small caching layer, policy-driven execution guardrails.
- **Out of Scope**: Full AST serialization, custom bytecode engines, or large operator libraries. These remain future considerations.
- **Constraints**: No external dependencies; code must remain readable yet concise; reuse shared helpers where possible.

## Module Breakdown
1. **Tokenizer (`ExpressionTokenizer`)**
   - Input: UTF-8 string (ASCII-first assumption with graceful fallback).
   - Output: Iterable of token objects `{ type, value, span }`.
   - Strategy: Single-pass finite state machine with character classification helpers.
   - Size Tactics: Inline simple tables, reuse `tof` for type checks, avoid large regex collections.
2. **Parser (`ExpressionParserCore`)**
   - Implements Pratt parser with binding power table.
   - Supports literals, identifiers, function calls, unary/binary operators, ternary conditional.
   - Size Tactics: Store table in compact array of tuples, map to handler functions via shared dispatch helper.
3. **Evaluator (`ExpressionEvaluator`)**
   - Consumes AST nodes, resolves identifiers via injected context, executes operators via policy map.
   - Provides hooks for user-defined functions, with guardrails against unbounded recursion.
4. **Facade (`ExpressionParser`)**
   - Public API bridging tokenizer, parser, evaluator, caching, and policy enforcement.
   - Exposes `tokenize(expression)`, `parse(expression)`, `evaluate(expression, context)`, and `compile(expression)` returning cached functions.
   - Maintains a small LRU cache for ASTs and value buckets; configurable via `cacheSize` with per-evaluation overrides such as `cacheKeyResolver`.
5. **Cache Layer (`ExpressionCache`)**
   - Simple LRU with configurable size (default 64 entries) implemented in ~30 LOC.
   - Avoids `Map` polyfills by assuming modern environments while falling back gracefully.

## Integration Points
- Export via `lib-lang-mini.js` under `ExpressionParser`.
- Document usage in README once stable.
- Hook into existing `tof`, `is_array`, and event system where applicable.

## Error Handling Strategy
- Throw `ExpressionParserError` with `code`, `message`, and `details` (line/column hints).
- Parser detects unexpected tokens, mismatched delimiters, and member-depth violations early.
- Evaluator validates operator availability before execution and reports undefined identifiers consistently.

## Security Guardrails
- Disallow `this`, `new`, direct property chains beyond configured depth (default 2) to keep evaluation safe.
- Provide allowlist for global identifiers; default set limited to math helpers, with explicit `allowedGlobals`/`allowedFunctions` overrides.
- Reject expressions exceeding configurable length (default 10k chars) and surface parser locations for all failures.

## Testing Alignment
- Map existing Jest suite sections to planned modules:
  - Tokenizer tests ⇒ `ExpressionTokenizer` unit methods.
  - Parser coverage ⇒ `ExpressionParserCore`.
  - Evaluator scenarios ⇒ `ExpressionEvaluator` with policy mocks.
  - Cache behavior ⇒ `ExpressionCache` integration tests.
- Add targeted legacy tests for regression coverage once implementation stabilizes.

## Implementation Phases
1. **Scaffold Core Classes** (est. 150 LOC)
   - Implement minimum viable tokenizer and Pratt parser supporting literals and basic arithmetic.
   - Verify against Jest basic cases.
2. **Expand Operator Support** (est. +120 LOC)
   - Add comparison, logical, and ternary operators.
   - Introduce policy map and context resolution.
3. **Caching & Facade** (est. +80 LOC)
   - Wire cache into `evaluate`/`compile`.
   - Ensure cache respects size constraints and optional disable flag.
4. **Hardening** (est. +70 LOC)
   - Integrate guardrails, error codes, span tracking, and performance profiling hooks.
   - Finalize documentation updates.

_Total planned source lines_: ~420 LOC before minification; target <6 KB gzipped after bundling.

## Quality Gates
- 100% coverage for `tests/expression-parser.test.js`.
- Manual review ensuring no regressions in existing modules.
- Size check recorded in `AI-NOTES.md` post-implementation.
- Update `TEST-SUMMARY.md` with new coverage.

## Open Questions
- Should we expose a streaming/token-by-token API for external tooling? Deferred until demand is demonstrated.
- Do we need built-in macro support? Out of current scope to keep size low.

## Next Actions
1. Confirm byte budget after Phase 1 prototype.
2. Iterate through phases while monitoring test results and size metrics.
3. Prepare README examples and migration notes ahead of release.
