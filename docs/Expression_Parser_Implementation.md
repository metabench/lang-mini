# Expression Parser Implementation Guide

This document translates the high-level plan in `docs/Expression_Parser.md` into concrete engineering steps. It assumes familiarity with `lang-mini.js`, the existing test scaffold in `tests/expression-parser.test.js`, and the legacy evaluation helpers already present in the project.

## 1. File Layout and Exports
- Keep the Expression Parser implementation inside `lang-mini.js` for now so it ships with the main bundle. If it grows too large, the classes can later move into their own module that `lang-mini.js` wires up.
- Mirror those exports in `lib-lang-mini.js` so consumers and tests can access `ExpressionParser` via `require('lang-mini').ExpressionParser`.
- Each of the three internal building blocks should live in their own well-labeled section within `lang-mini.js`:
  1. `Tokenizer`
  2. `Parser`
  3. `Evaluator`
- The public facade (`class ExpressionParser`) instantiates the tokenizer and parser, then feeds the AST to the evaluator. It also owns the caching layers and option merging.

## 2. Tokenizer Implementation Plan
1. **Token definitions** – implement the literal/operator keyword sets and operator tables described in the plan (`KEYWORD_LITERALS`, `KEYWORD_OPERATORS`, `MULTI_CHAR_OPERATORS`, `SINGLE_CHAR_OPERATORS`). Add punctuation tokens for `(` `)` `[` `]` `{` `}` `,` `:` `?` `.`.
2. **Character helpers** – methods such as `isIdentifierStart`, `isIdentifierPart`, `isDigit`, `isOperatorStart`.
3. **Token producers**
   - `tokenizeIdentifier` returns `KEYWORD`, `OPERATOR`, or `IDENTIFIER` depending on the collected lexeme.
   - `tokenizeNumber` supports integer and decimal forms; optionally scientific notation (`1e5`) if desired.
   - `tokenizeString` handles single and double quotes, escape sequences for `\"`, `\\`, `\n`, etc.
   - `tokenizeOperator` first checks the multi-character list before emitting single characters to ensure longest-match semantics.
   - `tokenizePunctuation` covers brackets, braces, commas, colon, question mark, and dot.
4. **Unsupported syntax detection** – explicitly reject arrow functions (`=>`) and spread/rest (`...`) with descriptive errors to match the scope called out in the plan.
5. **Output shape** – each token should look like `{ type: 'OPERATOR', value: '==' }`. This makes the test expectations in `tests/expression-parser.test.js` pass.

## 3. Parser Implementation Plan
1. **Entry point** – `Parser.parse()` should call `parseExpression()` and ensure there are no trailing tokens.
2. **Precedence table** – implement a `getPrecedence(token)` helper that returns numeric precedence for `||`, `&&`, `??`, `|`, `^`, `&`, equality, relational, shift, additive, multiplicative, exponentiation, member, and call operations. Use higher numbers for tighter binding.
3. **Recursive-descent methods**
   - `parsePrimary()` handles literals, identifiers, parenthesized expressions, arrays, objects, member expressions (`obj.prop` & `obj['prop']`), and call expressions `fn(args)`.
   - `parseUnaryExpression()` consumes unary operators (`+ - ! ~ typeof void delete`) before delegating to primary expressions.
   - `parseBinaryExpression(precedence)` implements Pratt-style parsing (current skeleton already resembles this). Ensure ternary `?:` is handled after the condition but before returning.
   - `parseArrayLiteral()` and `parseObjectLiteral()` build AST nodes with `elements` and `properties`.
   - `parseArguments()` collects comma-separated expressions until `)`.
4. **AST node shape** – follow ESTree-like shapes so the evaluator remains straightforward (`{ type: 'BinaryExpression', operator, left, right }`, etc.).
5. **Error handling** – throw informative `Error` instances for unexpected tokens, unmatched delimiters, or unsupported syntax to satisfy the test cases.

## 4. Evaluator Implementation Plan
1. **Constructor options**
   - `context` – user data for identifiers.
   - `helpers` – injected functions/values that shadow context entries.
   - `strict` – when true, unresolved identifiers throw.
   - `allowedFunctions` – a Set seeded with safe defaults (`Math.abs`, `Math.max`, etc.) that can be extended via options.
   - `allowCall` – predicate hook `(fn, thisArg) => boolean`.
2. **Evaluation methods**
   - `evaluateLiteral`, `evaluateIdentifier`, `evaluateMemberExpression`, `evaluateCallExpression`, `evaluateUnaryExpression`, `evaluateBinaryExpression`, `evaluateConditionalExpression`, `evaluateArrayExpression`, `evaluateObjectExpression`.
   - Ensure `%` directly uses JS remainder so negative inputs match native semantics.
   - Implement `delete` so that when the argument is a member expression on the context, it actually removes the property.
   - Short-circuit operators (`&&`, `||`, `??`) must only evaluate the right side when necessary.
3. **Function call policy** – `isCallAllowed(fn, thisArg)` should respect `allowCall` first (if supplied) and fall back to `allowedFunctions`. Throw when the call is denied.
4. **Nullish safety** – throws for invalid member access on `null`/`undefined`, mirroring JS runtime errors.

## 5. Facade, Caching, and API Surface
1. **AST cache** – `this.astCache` is a `Map<string, AST>`. When `options.cache !== false`, store ASTs keyed by expression string.
2. **Value cache**
   - For object contexts, store per-expression `WeakMap<object, any>`.
   - For primitive contexts, store `Map<any, any>`; allow a `cacheKeyResolver(context)` option to reduce primitives or composite data to deterministic keys.
3. **`parse(expression)` flow**
   1. Return cached AST if present and caching is on.
   2. Create a `Tokenizer`, call `tokenize()`.
   3. Instantiate `Parser` with the tokens and call `parse()`.
   4. Cache the AST when allowed.
   5. Return `{ tokens, ast }` or at least store tokens on the returned AST so tests can inspect them. One option is to return the AST but attach `ast.tokens = tokens`; another is to return `{ ast, tokens }`. Update tests accordingly.
4. **`evaluate(expression, context = {}, options = {})` flow**
   - Merge options: instance-level defaults overridden by per-call options.
   - When caching is enabled, attempt `getCachedValue(expression, context, mergedOptions)` before evaluating.
   - Parse and evaluate the AST with a new `Evaluator`.
   - Store value via `storeCachedValue` helper if caching is active.
5. **Helpers & policies** – pass merged options into the evaluator so helper injection, allowed functions, call predicates, and strict mode work consistently.

## 6. Testing Strategy
1. **Tokenizer tests** – the existing Jest suite already outlines expectations. Add cases for strings with escapes, numbers with decimals, `??` operator, `...` rejection, and arrow-function rejection.
2. **Parser tests** – cover precedence, ternary expressions, nested member expressions, computed members (`obj["key"]`), and error messages for trailing tokens.
3. **Evaluator tests** – ensure `%` semantics, helper precedence, delete behavior, call policy enforcement, and nullish errors are verified.
4. **Caching tests** – expose `ExpressionParser.__testing` helpers if necessary to inspect caches, or rely on reference equality and behavior-based assertions (e.g., spying on tokenizer/parsing counts).
5. **Integration tests** – once hooked into `lang-mini`, add at least one end-to-end test proving expressions can be evaluated inside a realistic `lang-mini` scenario.

## 7. Step-by-Step Execution Checklist
1. Implement `Tokenizer` class + unit tests.
2. Replace the placeholder parser implementation with the real tokenizer-driven parser and ensure all parser tests pass.
3. Finish the `Evaluator` per the feature requirements.
4. Implement the `ExpressionParser` facade: caching, option merging, helper injection, exports.
5. Update `tests/expression-parser.test.js` expectations if necessary (e.g., to account for `{ ast, tokens }` parse return shape).
6. Ensure `lib-lang-mini.js` re-exports the new class.
7. Run `npm test` (or `npx jest`) until all suites pass.
8. Document any public API changes in `README.md` and update `docs/Expression_Parser.md` if the implementation deviates from the original plan.

Following this guide will turn the current scaffolding into the fully functional tokenizer/parser/evaluator pipeline described in the original design doc.
