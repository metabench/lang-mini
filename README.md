# lang-mini

Lang-mini is a lightweight, zero-runtime-dependency JavaScript toolkit that powers the core utilities, type system, and event infrastructure used across the wider jsgui3 ecosystem. It ships as a single file (`lang-mini.js`), works identically in Node.js and modern browsers, and focuses on highly-polymorphic utilities that remain ergonomic in plain JavaScript.

> ✨ **Key idea:** Lang-mini combines small, composable helpers (iteration, cloning, truth maps) with advanced primitives (multi-function polymorphism, functional data types, grammar-based type inference) so that larger frameworks can build rich behavior without carrying heavy dependencies.

---

## Why lang-mini?

- **Cross-environment** – `lang-mini.js` auto-detects whether it's running in Node or the browser and exports the same API in both contexts via `lib-lang-mini.js`.
- **Polymorphic by default** – `mfp()` and `fp()` route calls using runtime signatures, letting you author concise yet type-aware functions.
- **Typed without TypeScript** – `Functional_Data_Type`, `Type_Signifier`, and `Grammar` provide runtime validation, parsing, and structural signatures that plug into UI and data layers.
- **Event-first architecture** – `Evented_Class`, `eventify`, `field`, and `prop` enable reactive data binding with tiny objects.
- **Battle-tested** – A combined Jest + legacy test suite (118+ assertions) covers the core behaviors and prevents regressions.

---

## Table of contents

1. [Quick start](#quick-start)
2. [Installation](#installation)
   - [Node / bundlers](#node--bundlers)
   - [Browser via script tag](#browser-via-script-tag)
3. [Core concepts](#core-concepts)
   - [Collection helpers](#collection-helpers)
   - [Functional polymorphism](#functional-polymorphism)
   - [Type detection & signatures](#type-detection--signatures)
   - [Runtime type system](#runtime-type-system)
   - [Events & data binding](#events--data-binding)
   - [Grammar-driven inference (WIP)](#grammar-driven-inference-wip)
4. [Reactive models & events](#reactive-models--events)
5. [Detailed feature guide](#detailed-feature-guide)
6. [API highlights](#api-highlights)
6. [Usage patterns & examples](#usage-patterns--examples)
7. [Project layout](#project-layout)
8. [Testing & development](#testing--development)
9. [Status & roadmap notes](#status--roadmap-notes)
10. [License](#license)

---

## Quick start

```javascript
// CommonJS (Node.js ≥ 15)
const lang = require('lang-mini');
const { each, mfp } = lang;

each([1, 2, 3], (value, index) => {
	console.log(index, value * 2);
});

const describe = mfp({ name: 'describe', return_type: 'string' }, {
	's': (str) => `string(${str.length})`
});

console.log(describe('hello'));
```

```javascript
// ESM / bundlers (Vite, Webpack, etc.)
import lang from 'lang-mini';

const pointDistance = lang.distance_between_points([[0, 0], [3, 4]]);
console.log(pointDistance); // → 5
```

```html
<!-- Browser (UMD-style) -->
<script src="/path/to/lang-mini.js"></script>
<script>
  const { each, eventify } = window.lang;
  const state = eventify({});
  each(['a', 'b'], (item) => console.log(item));
</script>
```

---

## Installation

Lang-mini is published to npm as a CommonJS module with no production dependencies.

```bash
npm install lang-mini
```

### Node / bundlers

- Entry point: `lib-lang-mini.js` re-exports everything from `lang-mini.js`.
- Works with Node.js ≥ 15 (per `package.json` `engines` field).
- When using ESM, import the default export: `import lang from 'lang-mini';`.
- Tree-shaking is limited because the build is a single module; destructure the functions you need.

### Browser via script tag

1. Copy `lang-mini.js` into your project or serve it from your build pipeline.
2. Include it before your scripts. It attaches a `lang` global.
3. For bundlers, treat it as a standard CommonJS module and rely on your bundler's CJS support.

---

## Core concepts

### Collection helpers

- `each(collection, fn, [context])` – Unified iterator for arrays and objects. Returns a new array/object of collected results. Supports early exit via a third `stop` callback parameter.
- `clone(value)` – Shallow clone for primitives, arrays, and objects. (Deep cloning is out of scope.)
- `arr_like_to_arr(arrayLike)` – Converts `arguments`, DOM collections, and other array-like objects into real arrays.
- Truth-map utilities:
  - `get_truth_map_from_arr(array)` converts an array into `{ value: true }` object.
  - `get_arr_from_truth_map(map)` converts it back (stringifying keys).
  - `get_map_from_arr(array)` indexes values to their latest position.
- `is_array(value)` and `is_defined(value)` provide robust guards that match the library's type semantics.

### Functional polymorphism

- `mfp(config, handlers)` – Multi-function polymorphism. Dispatches on signature strings built from runtime argument types (e.g. `'n,n'`, `'s,[n]'`). Supports verbs, nouns, and grammar metadata for descriptive error messages.
- `fp(handlers)` – Lightweight version for simple polymorphic dispatch.
- `vectorify(fn)` – Lifts a binary numeric function so it works element-wise over vectors/arrays.
- `distance_between_points([[x1, y1], [x2, y2]])` – Example of a vector-aware helper included in the library.

### Type detection & signatures

- `tof(value)` – Enhanced `typeof` returning `array`, `null`, `undefined`, etc.
- `tf(value)` – Abbreviated signatures (`'n'`, `'s'`, `'b'`, `'a'`, `'o'`, `'u'`, `'N'`). Used internally by `mfp`.
- `deep_sig(value, [maxDepth])` – Generates deterministic structural signatures such as `'[{"a":n},{"b":n}]'`. Useful for memoization and grammar inference.

### Runtime type system

- `Functional_Data_Type` – Define runtime types with `validate`, optional `parse_string`, and metadata. Frequently combined with `field` for model validation.
- `Type_Signifier` & `Type_Representation` – Experimental utilities (exported via `lib-lang-mini.js`) for distinguishing what a value *is* from *how it is represented*. Useful when modelling complex domains (colors, dates, binary blobs).

### Events & data binding

- `Evented_Class` – Minimal event emitter with `.on(event, handler)` and `.raise(event, data)`.
- `eventify(obj)` – Mixes event methods into plain objects so they can emit (`raise`) and listen (`on`) to events.
- `field(obj, name, [typeOrDefault], [defaultOrTransform])` – Declares data-bound properties on eventified objects. Supports:
  - default values (`field(obj, 'age', 21)`)
  - validation via `Functional_Data_Type`
  - transformation functions (`field(obj, 'upperName', value => value.toUpperCase())`)
  - change notifications (`obj.raise('change', { name, old, value })`).
- `prop` – For binding properties across objects (used alongside `eventify`).

> ⚠️ **Requirement:** Always pass an object through `eventify()` before calling `field()` or `prop()`. Otherwise a `TypeError` is thrown (`raise is not a function`).

### Grammar-driven inference (WIP)

- `Grammar` – Describes structured data with singular/plural forms and resolves runtime signatures.
- `grammar.tof(value)` – Infers the matching definition name (e.g. `'user_login'`).
- `grammar.sig(value)` – Resolves plural forms (`'users'`, `'locations'`).
- Some deeper methods in `Grammar` are still marked `NYI`; expect evolution in future releases.

---

## Reactive models & events

Reactive behavior is built into the library through `Evented_Class`, `eventify`, `field`, `prop`, and `Functional_Data_Type`. The combination lets you turn plain objects into observable models, add typed fields, and hook change events without pulling in a heavier framework. Check `docs/Reactive_Models.md` for the full guide and usage examples.

---

## Detailed feature guide

The helpers highlighted under “core concepts” are unpacked at `docs/Core_Features.md`. That guide includes short examples for the collection utilities, polymorphic dispatch helpers, signature detectors, runtime type layer, and grammar/combinator building blocks.

---

## API highlights

| Area | Key exports | Notes |
|------|-------------|-------|
| Collections | `each`, `clone`, `arr_like_to_arr`, `get_truth_map_from_arr`, `get_map_from_arr`, `get_arr_from_truth_map` | Consistent semantics between arrays and objects; helpers return transformed copies. |
| Type detection | `tof`, `tf`, `deep_sig` | Signatures integrate with grammar and polymorphism features. |
| Functional utilities | `mfp`, `fp`, `vectorify`, `distance_between_points` | `mfp` supports default handlers (`'default'` key) and grammar-aware error messages. |
| Events | `Evented_Class`, `eventify` | Underpins `field` and `prop`; `Evented_Class` can be subclassed for richer components. |
| Data binding | `field`, `prop`, `Functional_Data_Type` | Compose validation, parsing, defaults, and transformations with change events. |
| Advanced types | `Type_Signifier`, `Type_Representation` | Experimental building blocks for rich type metadata. |
| Combinatorics | `combinations` (alias: `combos`) | Cartesian product across nested arrays; stops early if any sub-array is empty. |

Full source documentation lives inline within `lang-mini.js`; search for function names to see implementation notes and historical commentary.

---

## Usage patterns & examples

### Iterating with `each`

```javascript
const { each } = require('lang-mini');

const labelled = each({ a: 1, b: 2 }, (value, key) => `${key}:${value}`);
// labelled → { a: 'a:1', b: 'b:2' }

const doubleUp = each([1, 2, 3], (value, index, stop) => {
	if (value === 3) stop();
	return value * 2;
});
// doubleUp → [2, 4]
```

### Polymorphism with `mfp`

```javascript
const { mfp } = require('lang-mini');

const sum = mfp({ name: 'sum' }, {
	'n,n': (a, b) => a + b,
	'[n]': (arr) => arr.reduce((acc, n) => acc + n, 0),
	'default': (_, signature) => {
		throw new TypeError(`sum has no handler for signature ${signature}`);
	}
});

sum(2, 3);        // → 5
sum([1, 2, 3, 4]); // → 10
```

### Creating validated, reactive models

```javascript
const lang = require('lang-mini');
const person = lang.eventify({});

const IntegerType = new lang.Functional_Data_Type({
	name: 'integer',
	validate: Number.isInteger,
	parse_string: (value) => {
		const parsed = Number(value);
		return Number.isInteger(parsed) ? parsed : undefined;
	}
});

lang.field(person, 'name', (value) => value.trim());
lang.field(person, 'age', IntegerType, 18);

person.on('change', ({ name, old, value }) => {
	console.log(`${name} changed from ${old} → ${value}`);
});

person.name = ' Ada ';
person.age = '21';
// Console:
// name changed from undefined → Ada
// age changed from 18 → 21
```

### Working with combinations

```javascript
const { combinations } = require('lang-mini');

const colourways = combinations([
	['red', 'green'],
	['S', 'M', 'L'],
	['cotton', 'linen']
]);

console.log(colourways.length); // 12
```

### Grammar-powered inference

```javascript
const { Grammar } = require('lang-mini');

const geoGrammar = new Grammar({
	name: 'Geo',
	def: {
		coordinate: { def: ['number', 'number'], plural: 'coordinates' },
		route: { def: ['coordinate', 'coordinate'], plural: 'routes' }
	}
});

geoGrammar.tof([51.5, -0.1]);                 // → 'coordinate'
geoGrammar.sig([[51.5, -0.1], [40.7, -74]]);   // → 'route'
geoGrammar.sig([ [ [0,0], [1,1] ], [ [2,2], [3,3] ] ]); // → 'routes'
```

> **Tip:** Some advanced grammar APIs remain marked `NYI`; consult inline comments before relying on them in production.

---

## Project layout

```
lang-mini/
├─ lang-mini.js           # Single-file implementation (~2800 lines)
├─ lib-lang-mini.js       # CommonJS re-export for consumers
├─ examples/              # Runnable usage samples (Node scripts)
├─ docs/                  # Additional design notes (e.g., Control_Dom)
├─ tests/                 # Jest + legacy test suites
│  ├─ *.test.js           # Modern Jest suites
│  ├─ all-test.js         # Legacy runner
│  └─ new-tests.js        # Legacy runner extension
├─ AI-NOTES.md            # Development notes and open questions
├─ TEST-SUMMARY.md        # Snapshot of recent test runs
└─ package.json           # Metadata, scripts, dev dependencies (jest, fnl)
```

---

## Testing & development

Run the full suite (Jest + legacy tests):

```bash
npm test
```

Run only the Jest suites:

```bash
npm run test:jest
```

Run legacy suites (useful when iterating on old tests):

```bash
npm run test:legacy
```

### Contribution tips

- Keep `lang-mini.js` changes focused; it's a shared dependency across multiple projects.
- Document behavioral observations or known issues in `AI-NOTES.md` before making large refactors.
- Add or update tests under `tests/` and ensure `npm test` passes before submitting PRs.

---

## Status & roadmap notes

- Version `0.0.40` (see `package.json`).
- No production dependencies; `fnl` and `jest` are dev-only.
- Several `Grammar` and advanced type-system methods are intentionally marked `NYI`; contributions welcome but coordinate via `AI-NOTES.md` first.
- Roadmap items such as richer type representations and additional documentation live in `AI-README.md` and `roadmap.md`.
- Keep up with the current focus areas in `docs/Whats_Next.md`, which consolidates the remaining gaps and suggested next steps for lang-mini.

---

## License

MIT © James Vickers / Metabench
