# Asynchronous coordination helpers

Lang-mini predates widespread promise adoption and therefore ships with a rich, callback-centric toolkit for coordinating asynchronous work. The same helpers still power modern projects because they provide deterministic ordering, pluggable concurrency limits, and seamless bridges to the event system. This guide documents the main entry points—`call_multi`, `call_multiple_callback_functions`, `Fns`, and `Publisher`—and collects patterns for composing them.

## `call_multiple_callback_functions`

`call_multiple_callback_functions` (exported as `call_multi` and `multi`) is the low-level orchestrator. It accepts an array of "work items" where each item may be:

| Shape | Meaning |
|-------|---------|
| `fn` | Invoke the bare function with a single `(callback)` parameter. |
| `[fn, params]` | Spread `params` across the invocation: `fn(...params, callback)`. |
| `[context, fn]` | Call `fn` with `context` as `this`. Useful when reusing object methods without losing their binding. |
| `[fn, params, perTaskCallback]` | Invoke `perTaskCallback(err, result)` once the task resolves. |
| `[context, fn, params, perTaskCallback]` | Full control over context, parameters, and per-task side-effects. |

The dispatcher normalises each item and performs the following:

1. Launches up to `parallelism` tasks in flight. The default is 1 (sequential execution).
2. Optionally staggers launches with `delay` milliseconds between each `process()` call.
3. Collects results in the order tasks were supplied, even if their callbacks resolve out of order.
4. Short-circuits on the first error and forwards the error to the final callback.

### Signatures at a glance

The helper is implemented with `fp()` and supports multiple signatures. The most common calls are:

```javascript
call_multi(tasks, finalCallback);
call_multi(tasks, parallelism, finalCallback);
call_multi(tasks, parallelism, delay, finalCallback);
call_multi(tasks, finalCallback, returnParams);
```

When `returnParams` is `true` the result becomes an array of `[params, value]` pairs so you can rebuild join tables or continue processing without relying on closure state.

### Example: throttled API calls

```javascript
const lang = require('lang-mini');

const users = [1, 2, 3, 4, 5];
const tasks = users.map((userId) => [fetchUser, [userId]]);

lang.call_multi(tasks, 2, 50, (err, results) => {
        if (err) {
                console.error('Failed to load users', err);
                return;
        }
        console.log('Loaded', results.length, 'users');
});
```

The above launches two requests at a time, spacing them by 50 ms. Because results are indexed, `results[i]` corresponds to `users[i]` regardless of completion order.

### Per-task callbacks and context binding

Per-task callbacks receive the normal `(err, result)` pair and are triggered before the master callback resolves. Context-aware tasks are invoked via `Function.prototype.apply`, ensuring that `this` points to the supplied object:

```javascript
const actor = {
        multiplier: 4,
        compute(value, cb) {
                cb(null, value * this.multiplier);
        }
};

const tasks = [
        [actor, actor.compute, [3], (err, res) => console.log('partial', res)],
        [actor, actor.compute, [7]]
];

lang.call_multi(tasks, (err, results) => {
        if (err) throw err;
        console.log(results); // → [12, 28]
});
```

## `Fns`

`lang.Fns(array)` is a thin wrapper that decorates a task array with a `.go()` helper. `.go()` accepts the same permutations as `call_multi`, which keeps pipeline composition terse:

```javascript
const steps = lang.Fns([
        (cb) => cb(null, 1),
        (value, cb) => cb(null, value + 1),
        (value, cb) => cb(null, value * 3)
]);

steps.go((err, results) => {
        if (err) throw err;
        console.log(results); // → [1, 2, 6]
});
```

You can opt into parallel execution by passing additional arguments: `steps.go(2, 0, finalCallback)` will keep two tasks active at once.

## `Publisher`

`Publisher` extends `Evented_Class`, registering a one-time listener for the `ready` event inside its constructor. It provides a `when_ready` getter that returns a promise. The promise resolves immediately if `is_ready === true` or waits for the next `ready` event otherwise.

```javascript
const publisher = new lang.Publisher();

async function setup() {
        await publisher.when_ready;
        publisher.raise('data', { payload: 'prepared' });
}

setup();
setTimeout(() => publisher.raise('ready'), 0);
```

Because `when_ready` is a getter it returns a fresh promise every time, enabling idempotent `await publisher.when_ready` calls even after readiness.

## Error handling patterns

- **Centralised failure:** The final callback receives the first error. This is ideal for early bail-out semantics where subsequent tasks should not run once one fails.
- **Per-task inspection:** Attach `perTaskCallback` functions when you need to log or recover from task-specific issues while still halting the overall sequence.
- **Promise bridges:** Wrap the final callback in a promise (as demonstrated in the Jest tests) to integrate with async/await code bases without rewriting the internals.

## Testing references

The Jest suite in `tests/async-coordination.test.js` exercises concurrency limits, per-task callbacks, context binding, error propagation, `Fns.go`, and `Publisher.when_ready`. Use it as executable documentation when experimenting with new task shapes or concurrency strategies.
