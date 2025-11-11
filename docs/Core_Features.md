# Core Features

## Table of Contents
- [Collection helpers](#collection-helpers)
- [Functional polymorphism](#functional-polymorphism)
- [Type detection & signatures](#type-detection--signatures)
- [Runtime type system](#runtime-type-system)
- [Grammar & combinators](#grammar--combinators)
- [Further reading](#further-reading)

## Collection helpers
Lang-mini ships with a set of small, polymorphic utilities that blur the line between arrays and objects:

- `each(collection, handler)` iterates arrays, objects, or array-like structures. Handlers receive `(value, keyOrIndex, stop)` and can signal early termination by calling the supplied `stop` function.
- Immutable clones (`clone(value)`), conversions for array-like inputs (`arr_like_to_arr`), and `arr_trim_undefined` keep the same signature semantics while trimming the noise.
- Truth-map utilities (`get_truth_map_from_arr`, `get_arr_from_truth_map`, `get_map_from_arr`) let you switch between dense arrays and sparse lookup maps without changing the public API.

```javascript
const { each, get_truth_map_from_arr, get_arr_from_truth_map } = require('lang-mini');

const truth = get_truth_map_from_arr(['admin', 'editor']);
each(truth, (_, role) => console.log(role)); // iterates as if it were an object
console.log(get_arr_from_truth_map(truth)); // → ['admin','editor']
```

## Functional polymorphism
`functional_polymorphism`, `mfp()`, and `fp()` form the dispatch layer for signature-aware helpers.

- `mfp({ name }, handlers)` inspects argument signatures (`get_a_sig`) and routes calls based on strings like `'s,n'` or `'[n]'`. Handlers can declare grammars and custom error messages.
- `fp()` is a lighter dispatcher for cases where you just need signature-based branching without the metadata.
- `vectorify(fn)` lifts binary numeric functions so they accept scalars or vectors interchangeably, and accompanying vector helpers (`v_add`, `v_subtract`, `vector_magnitude`, `distance_between_points`) keep math idiomatic.

```javascript
const { mfp } = require('lang-mini');

const describe = mfp({ name: 'describe' }, {
  's': str => `string(${str.length})`,
  '[n]': arr => arr.reduce((acc, x) => acc + x, 0),
  'default': (_, sig) => { throw new TypeError(`No handler for ${sig}`); }
});
```

## Type detection & signatures
Low-level type helpers inspect runtime values so other subsystems stay polymorphic:

- `tof(value)` returns `'s'`, `'n'`, `'a'`, `'o'`, etc., mirroring the polymorphic signatures used elsewhere.
- `tf(value)` produces a single-character indicator used internally to speed up signature lookups.
- `deep_sig(value)` walks nested structures and emits `[[s],[n]]`-style strings, useful when building grammar maps or verifying inputs.
- `sig_match` and helpers like `get_item_sig` let you test actual values against stored signatures.

Use them when you need to introspect inputs before routing to custom handlers or caching ASTs.

## Runtime type system
`Data_Type`/`Functional_Data_Type` describe lightweight, serializable validation types.

- `Functional_Data_Type` accepts `{ name, abbreviated_name, validate, parse_string }` and exposes prebuilt primitives like `Functional_Data_Type.number` and `.integer`.
- These types can be composed with `field`/`prop` (see `docs/Reactive_Models.md`) to enforce value constraints and coerce string inputs before they hit your models.
- The runtime type helpers also expose metadata flags such as `named_property_access`, `property_names`, and `wrap_value_inner_values` for richer representations where needed.

## Grammar & combinators
`Grammar` codifies structured data with singular/plural mappings and signature caches.

- Define grammars with `{ def: { coordinate: { def: ['number','number'], plural: 'coordinates' }, ... } }`. `Grammar.sig(value)` then resolves items to names (`'coordinate'`, `'route'`, or `'routes'`) while preserving signature information for deep structures.
- The internal maps (`sing_plur`, `plur_sing`, `sing_def`, `deep_sig_sing`, `obj_sig_sing`, `sig_levels_sing`) keep lookups fast while still supporting mixed arrays/objects.
- Combine grammars with combinator helpers such as `combinations`/`combos` for cartesian products, and use the `truth` helper to derive boolean maps.

```javascript
const { Grammar, combinations } = require('lang-mini');

const geoGrammar = new Grammar({
  def: {
    coordinate: { def: ['number', 'number'], plural: 'coordinates' },
    route: { def: ['coordinate', 'coordinate'], plural: 'routes' }
  }
});
console.log(geoGrammar.sig([[0, 0], [3, 4]])); // → 'route'

const apparel = combinations([['red','blue'], ['S','M'], ['cotton','linen']]);
console.log(apparel.length); // → 12
```

## Further reading
- `[Expression Parser](Expression_Parser.md)` – tokenizer/parser/evaluator architecture.
- `[Reactive Models](Reactive_Models.md)` – evented helpers, `field`, `prop`, and typed fields.

