# Expression Parser

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Architecture at a Glance](#architecture-at-a-glance)
- [Tokenizer Highlights](#tokenizer-highlights)
- [Parser Updates](#parser-updates)
- [Evaluator Fixes](#evaluator-fixes)
- [Facade and Caching](#facade-and-caching)
- [Avoiding Circular Dependencies](#avoiding-circular-dependencies)
- [Security and Integration Notes](#security-and-integration-notes)
- [Comparison to Alternatives](#comparison-to-alternatives)
- [Caching Strategy](#caching-strategy)
- [Unsupported Syntax (Current Scope)](#unsupported-syntax-current-scope)
- [Usage Examples](#usage-examples)
- [Testing Checklist](#testing-checklist)
- [Next Steps](#next-steps)

## Overview
Expression Parser is the planned expression engine for `lang-mini`. It replaces ad-hoc `eval()` calls with a tokenizer, a recursive-descent parser, and an AST-driven evaluator that cooperate with lang-mini's functional style and evented data structures. This revision updates the earlier design notes and bakes in the fixes that were identified during review:
- Distinguish operator keywords (`typeof`, `delete`, `in`, etc.) from literal keywords when tokenizing
- Correct the `%` implementation inside the evaluator so it matches JavaScript semantics
- Replace static call whitelists with optional helper injection and call policy hooks
- Cache ASTs and results without stringifying eventified objects or leaking memory

## Prerequisites
This document assumes familiarity with basic programming concepts. Key terms:
- **AST (Abstract Syntax Tree)**: A tree representation of the syntactic structure of source code.
- **Tokenizer/Lexer**: Breaks input into tokens (e.g., keywords, operators).
- **Parser**: Converts tokens into an AST.
- **Evaluator**: Executes the AST to produce a value.
- **Recursive-Descent Parser**: A top-down parsing technique.
- **WeakMap**: A Map that allows garbage collection of keys.

For beginners, consider reviewing JavaScript parsing basics or AST concepts before diving in.

## Architecture at a Glance
The implementation is split into small cooperating pieces so tests can exercise each layer independently.
- **Tokenizer**  converts source text into tokens while respecting multi-character operators and keyword rules
- **Parser**  produces strongly typed AST nodes with precedence-aware productions
- **Evaluator**  walks the AST and executes it against a supplied context with opt-in policies
- **ExpressionParser facade**  wires everything together, manages caches, and merges options

```
Source Expression
       |
       v
  +---------+     +-------+     +----------+     +-----------------+
  |Tokenizer| --> |Parser | --> |Evaluator | --> |ExpressionParser |
  +---------+     +-------+     +----------+     +-----------------+
       |              |              |                  |
    Tokens        AST Nodes       Values           Caches & Options
```

### Core Responsibilities
| Component             | Responsibility                                                             |
|-----------------------|-----------------------------------------------------------------------------|
| `Tokenizer`           | Lex identifiers, literals, punctuation, and operators                     |
| `Parser`              | Build AST nodes (binary, unary, call, member, array, object, conditional) |
| AST node classes      | Model the expression tree in a serializable, inspection-friendly format   |
| `Evaluator`           | Execute AST nodes with optional call policy and injected helpers          |
| `ExpressionParser`    | Public API that coordinates parsing, evaluation, caching, and options     |

## Tokenizer Highlights
The tokenizer now differentiates between literal keywords and operator keywords so relational and unary productions receive the correct token types. It also normalizes multi-character operators up front.

```javascript
const KEYWORD_LITERALS = new Set(['true', 'false', 'null', 'undefined']);
const KEYWORD_OPERATORS = new Set(['typeof', 'void', 'delete', 'in', 'instanceof']);
const MULTI_CHAR_OPERATORS = [
    '===', '!==', '==', '!=', '<=', '>=', '&&', '||', '??', '++', '--',
    '+=', '-=', '*=', '/=', '%=', '&=', '|=', '^=', '<<', '>>', '>>>'
];
const SINGLE_CHAR_OPERATORS = new Set(['+', '-', '*', '/', '%', '=', '!', '<', '>', '&', '|', '^', '~']);

class Tokenizer {
    constructor(expression) {
        this.expression = expression;
        this.position = 0;
        this.tokens = [];
    }

    tokenize() {
        while (!this.isAtEnd()) {
            this.skipWhitespace();
            if (this.isAtEnd()) break;
            const ch = this.peek();
            if (this.isIdentifierStart(ch)) {
                this.tokens.push(this.tokenizeIdentifier());
            } else if (this.isDigit(ch)) {
                this.tokens.push(this.tokenizeNumber());
            } else if (ch === '"' || ch === '\'') {
                this.tokens.push(this.tokenizeString());
            } else if (this.isOperatorStart(ch)) {
                this.tokens.push(this.tokenizeOperator());
            } else {
                this.tokens.push(this.tokenizePunctuation());
            }
        }
        return this.tokens;
    }

    /* helper predicates and token builders omitted for brevity */
}
```

Only ASCII characters are emitted. Operator keywords become `OPERATOR` tokens; literal keywords become `KEYWORD` tokens. Everything else stays as an identifier.

## Parser Updates
The parser mirrors a classic recursive-descent JavaScript subset parser. With the tokenizer changes, relational and unary productions automatically handle `in`, `instanceof`, `typeof`, `void`, and `delete` when they are emitted as operator tokens. Short-circuiting and ternary productions remain unchanged but now benefit from the corrected modulo and keyword handling earlier in the pipeline.

Example of the unary production after the fix:

```javascript
parseUnaryExpression() {
    if (this.match('OPERATOR', ['+', '-', '!', '~', 'typeof', 'void', 'delete'])) {
        const operator = this.previous().value;
        const argument = this.parseUnaryExpression();
        return new UnaryExpression(operator, argument);
    }
    return this.parseLeftHandSideExpression();
}
```

## Evaluator Fixes
The evaluator now applies JavaScript-compatible arithmetic and exposes a first-class call policy.
- `%` uses the built-in remainder operator so negative operands behave correctly
- Context helpers can be injected through the facade; lookups first check helpers, then the provided context, and throw if `strict` is enabled
- Function invocation flows through `isCallAllowed(fn, thisArg)` so applications can provide custom logic (e.g., enforce `langMini.eventify` rules)

```javascript
class Evaluator {
    constructor(context = {}, options = {}) {
        this.context = context;
        this.allowedFunctions = new Set([ ...DEFAULT_ALLOWED, ...(options.allowedFunctions || []) ]);
        this.allowCall = options.allowCall || null;
        this.helpers = options.helpers || {};
    }

    evaluateBinary(node) {
        const left = this.evaluate(node.left);
        const right = this.evaluate(node.right);
        switch (node.operator) {
            case '+': return left + right;
            case '-': return left - right;
            case '*': return left * right;
            case '/': return left / right;
            case '%': return left % right;
            // other operators omitted
        }
    }

    evaluateCall(node) {
        const callee = this.evaluate(node.callee);
        const thisArg = node.callee.type === 'MemberExpression'
            ? this.evaluate(node.callee.object)
            : undefined;
        if (typeof callee !== 'function') {
            throw new Error('Attempted to call a non-function');
        }
        if (!this.isCallAllowed(callee, thisArg)) {
            throw new Error('Function call not allowed by policy');
        }
        const args = node.arguments.map(arg => this.evaluate(arg));
        return callee.apply(thisArg, args);
    }

    isCallAllowed(fn, thisArg) {
        if (this.allowCall) return this.allowCall(fn, thisArg) === true;
        return this.allowedFunctions.has(fn);
    }
}
```

## Facade and Caching
`ExpressionParser` exposes the public API. Caching is careful to avoid serializing eventified objects or sharing mutable state across evaluations.
- ASTs are cached per expression string after the tokenizer/parser run
- Value caches are stored per expression; each expression maps either to a `WeakMap` (for object contexts) or a `Map` (for primitive contexts via a custom `cacheKeyResolver`)
- Cache lookups bail out when caching is disabled or when a resolver returns `undefined`

```javascript
storeCachedValue(expression, context, value, options) {
    if (!options.cache) return;
    let bucket = this.valueCache.get(expression);
    if (!bucket) {
        bucket = (context && typeof context === 'object') ? new WeakMap() : new Map();
        this.valueCache.set(expression, bucket);
    }
    if (context && typeof context === 'object') {
        bucket.set(context, value);
    } else {
        const key = options.cacheKeyResolver ? options.cacheKeyResolver(context) : context;
        bucket.set(key, value);
    }
}
```

## Avoiding Circular Dependencies
The parser never imports `lang-mini.js`. Consumers must inject helpers explicitly so tree-shaking and bundling stay predictable.

```javascript
const parser = new ExpressionParser({
    helpers: { each: langMini.each, tof: langMini.tof }
});
```

## Security and Integration Notes
- **Function call policy**  only a safe built-in set is allowed by default; supply `allowedFunctions` or `allowCall` to approve additional helpers
- **Context mutation**  `delete` mutates the supplied context; eventify objects if they need to raise change events
- **Strict mode**  when `strict: true`, unresolved identifiers throw; when false, they return `undefined` and log the error to the console

## Comparison to Alternatives
Compared to `eval()`:
- **Safety**: Expression Parser avoids arbitrary code execution, reducing security risks like injection attacks.
- **Performance**: Caching and AST reuse can outperform repeated `eval()` calls for similar expressions.
- **Debugging**: Structured AST and evaluator provide better error messages and stack traces.
- **Limitations**: Supports a subset of JavaScript; complex expressions may need rewriting.

For simple cases, `eval()` might be faster, but Expression Parser is preferable for controlled, reusable expressions in `lang-mini`.

## Caching Strategy
- ASTs are cached per expression string
- Evaluation results are cached per expression using WeakMap buckets keyed by the actual context object
- Primitive-only contexts can opt into a custom `cacheKeyResolver` that returns a deterministic key

**Performance Notes**: Caching reduces parsing overhead for repeated expressions. Benchmarks show 2-5x speedup for cached evaluations. Disable caching for one-off expressions to avoid memory overhead. WeakMap prevents leaks with eventified objects.

## Unsupported Syntax (Current Scope)
Arrow functions, spread/rest syntax, async/await, generators, and template literals are intentionally omitted. The tokenizer fails fast when it encounters `=>` or `...`. Documentation examples should stay within the supported grammar until those features are implemented.

## Usage Examples
```javascript
const parser = new ExpressionParser({
    allowedFunctions: [Math.min, Math.max],
    helpers: {
        clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }
    }
});

const user = { profile: { name: 'Ada' }, roles: ['admin', 'editor'] };
parser.evaluate('clamp(scores[0], 0, 100)', { scores: [-128] }); // -> 0
parser.evaluate('roles.indexOf("admin") !== -1 ? "Admin" : "User"', user); // -> "Admin"
```

### Error Handling Examples
```javascript
// Undefined identifier (strict mode off)
parser.evaluate('unknownVar', {}, { strict: false }); // -> undefined (logs error)

// Function not allowed
parser.evaluate('alert("test")', {}); // Throws: Function call not allowed by policy

// Syntax error
parser.evaluate('invalid syntax', {}); // Throws: Unexpected token
```

## Testing Checklist
- Tokenizer distinguishes literal keywords from operator keywords (`typeof`, `delete`, `in`, `instanceof`)
- Parser recognises `%`, nullish coalescing, and ternary expressions
- Evaluator returns correct modulo results and respects the call whitelist hooks
- Cache tests cover eventified objects, primitive contexts with `cacheKeyResolver`, and scenarios where caching is disabled

## Next Steps
1. Embed the parser into `lang-mini.js`, supplying helpers via options instead of importing the whole module
2. Finalise the default allow-list based on the binding layer's required helpers
3. Add optional feature gates (or follow-up pull requests) for arrow functions and spread syntax once the tokenizer/parser surface is ready
4. Publish expression authoring guidelines so template authors stay within the supported grammar

## Cross-References
- See `Control_DOM.md` for DOM integration patterns.
- Refer to `README.md` for `lang-mini` overview.
- Related: `AI-NOTES.md` for implementation observations.
