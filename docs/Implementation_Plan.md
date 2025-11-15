# Implementation Plan for lang-mini

## Purpose
This document records the guiding principles and phased roadmap for shipping production-ready features in `lang-mini`, with a particular focus on keeping the toolkit compact (both source and minified assets) while preserving excellent quality. Every feature must justify its byte cost and fit the philosophy of a focused utility library.

## Core Principles
- **Size Discipline**: Target a compressed library size under 20 KB (gzipped) once the expression parser lands. Each new module must present its estimated byte budget and a justification.
- **Composable Modules**: Prefer composable helpers over monolithic abstractions. Reuse existing utilities (`each`, `tof`, `mfp`, etc.) to avoid duplication.
- **Progressive Enhancement**: Ship features behind opt-in facades to keep the core lean. Advanced capabilities (e.g., expression parsing) should load lazily or be tree-shake friendly.
- **High Signal Documentation**: Every major feature requires a design doc and an implementation plan. Documentation must be succinct, ASCII-only, and include integration notes plus test strategies.
- **Test-Driven Delivery**: Author tests first. Legacy runners stay supported, but new functionality must include Jest coverage.

## Planning Artifacts
1. **Design Overview**: Captures the why and the high-level architecture (e.g., `Expression_Parser.md`).
2. **Implementation Plan**: Breaks down incremental milestones, clarifies size constraints, and maps to tests (e.g., `Expression_Parser_Implementation_Plan.md`).
3. **Change Log Entry Draft**: Summaries prepared early to highlight impact on size, API, and compatibility.

## Feature Delivery Workflow
1. **Scoping**
   - Define goals, non-goals, and constraints.
   - Estimate added bundle size and runtime overhead.
2. **Plan Creation**
   - Produce an implementation plan with milestones and acceptance tests.
   - Align with existing coding conventions and size limits.
3. **Test Authoring**
   - Draft Jest suites (and legacy tests if required) covering success, failure, and edge cases.
4. **Incremental Implementation**
   - Build in small, reviewable steps.
   - Frequently measure size impact using `npm run size:report` (to be added).
5. **Verification**
   - Run `npm test`, targeted benchmarks (if relevant), and linting (to be introduced).
   - Validate documentation accuracy.
6. **Release Preparation**
   - Update `README.md`, `AI-NOTES.md`, and `TEST-SUMMARY.md`.
   - Prepare semantic version bump in `package.json`.

## Current Focus Areas
- **Expression Parser (Highest Priority)**
  - Implementation plan tracked in `docs/Expression_Parser_Implementation_Plan.md`.
  - Tests exist in `tests/expression-parser.test.js` and must pass before merge.
  - Size budget: 6 KB minified + gzipped (soft cap) for all parser modules combined.
- **Type Utilities Refresh**
  - Audit existing `Type_Signifier` and `Type_Representation` code for dead paths.
  - Plan future enhancements separately to avoid blocking the parser.

## Size Management Tactics
- Share helper functions between tokenizer, parser, and evaluator (e.g., a unified character classification table).
- Avoid large lookup tables in source; generate them programmatically when feasible.
- Prefer iterative algorithms over recursive ones when they reduce bundle size without harming clarity.

## Quality Bar
- All public APIs documented with examples.
- 100% test pass rate on both Jest and legacy suites.
- No TODO or NYI markers in shipped parser code.
- Maintain clear error messages and avoid silent failures.

## Next Steps
1. Finalize expression parser implementation following its plan.
2. Integrate size reporting into CI.
3. Draft plans for any remaining modules before coding begins.
