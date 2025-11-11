# Reactive Models

## Table of Contents
- [Overview](#overview)
- [Evented primitives](#evented-primitives)
- [The `eventify` helper](#the-eventify-helper)
- [`field` & `prop` helpers](#field--prop-helpers)
- [Functional data types](#functional-data-types)
- [Patterns & tips](#patterns--tips)

## Overview
The reactive subset of **lang-mini** bundles a tiny evented runtime with helpers for wiring data-bound properties and validation rules. Most of the high-level APIs (`Evented_Class`, `eventify`, `field`, `prop`, `Functional_Data_Type`, `Publisher`) are exported from `lang-mini.js` so you can layer lightweight observability on any plain object.

## Evented primitives
`Evented_Class` is the core emitter. Each instance keeps a `_bound_events` map and exposes `raise_event`, `add_event_listener`, `on`, `off`, and `raise` for firing events. The implementation also exposes:

- `bound_named_event_counts` (getter) to enumerate how many handlers are attached per event.
- `one(event, handler)` to register a listener that removes itself after the first invocation.
- `changes(trace)` to declare handlers for named `change` events; once this helper is used the class listens for `'change'` and dispatches callbacks based on the property name.

`Publisher` extends `Evented_Class` and wires up a `'ready'` signal. It caches the readiness state and exposes a `when_ready` promise so subscribers can await the first `ready` event.

## The `eventify` helper
`eventify(obj)` mixes the same listener API into any plain object, tracking handlers in a private `bound_events` map so the target can still raise scoped events. The helper attaches `on`, `off`, and `raise`/`raise_event` without mutating the prototype chain, making it safe to call on POJOs or DOM-like structures.

## `field` & `prop` helpers
Both helpers define properties with getters/setters that live on the evented object, store values in `obj._`, and raise `'change'` events.

- `field(obj, name, [dataType|transform|default], [default|transform])` is a lightweight alias that expects either a data type (`instanceof Data_Type`) or transformation/validation callbacks. When you assign a new value, the setter stores the previous state from `obj._`, applies the optional transformer, writes into `obj._`, and emits `{ name, old, value }` on the target.
- `prop(obj, name, defaultValue?, transform?, onchange?)` is the more flexible helper. It accepts:
  - arrays of property definitions or config objects (`{ name, transform, change, ready }`)
  - `fn_transform` to massage input before storing
  - `fn_onchange` to react to the value change directly
  - `fn_on_ready` that gets a `silent_set` helper before the property is first exposed
  - a `_silent_set` path that can set the backing value without re-emitting `change`.

`prop` also lets you pass a `default` (or `default_value`) and wires change events through `obj.raise` when `raise_change_events` is enabled.

## Functional data types
`Functional_Data_Type` extends a base `Data_Type` and is the standard place to describe validation, parsing, and metadata for a value. A type is defined with `name`, optional `abbreviated_name`, and callback slots such as `validate`, `validate_explain`, `parse_string`, and `parse`. The library ships with a few primitives like `Functional_Data_Type.number` and `Functional_Data_Type.integer`, which call `Number`/`parseInt` and reuse `validate` when coercion succeeds.

Use these data types together with `field`/`prop` to guarantee that the stored value passes `type.validate` before the setter writes it, or to coerce string inputs via `parse_string`.

## Patterns & tips

```javascript
const lang = require('lang-mini');

const person = lang.eventify({});
lang.field(person, 'name', value => value.trim(), 'Ada');
lang.field(person, 'age', lang.Functional_Data_Type.integer, 18);

person.on('change', ({ name, old, value }) => {
  console.log(`${name} changed from ${old} → ${value}`);
});

person.name = ' Ada ';
person.age = '21'; // parse_string on Functional_Data_Type.integer keeps the value numeric
```

- Call `prop(obj, { name: 'status', change: state => ... })` to register multiple properties at once.
- Use `Publisher` when you need a simple evented workflow that resolves once (via `when_ready`).
- The `eventify` helper is intended for objects constructed outside of `Evented_Class` so you can incrementally add events without subclassing.
