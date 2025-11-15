const langMini = require('../lang-mini');

describe('lang-mini asynchronous coordination helpers', () => {
    const callMulti = (args, signature = 'default') => {
        return new Promise((resolve, reject) => {
            const callback = (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            };

            if (signature === 'default') {
                langMini.call_multi(...args, callback);
            } else if (signature === 'returnParams') {
                langMini.call_multi(...args, callback, true);
            } else {
                langMini.call_multi(...args, callback);
            }
        });
    };

    describe('call_multi', () => {
        test('executes tasks sequentially and preserves result order', async () => {
            const tasks = [
                (cb) => setTimeout(() => cb(null, 'first'), 5),
                (cb) => setTimeout(() => cb(null, 'second'), 0),
                (cb) => setTimeout(() => cb(null, 'third'), 1)
            ];

            const results = await callMulti([tasks]);
            expect(results).toEqual(['first', 'second', 'third']);
        });

        test('respects concurrency limits when provided', async () => {
            let active = 0;
            let maxActive = 0;
            const createTask = (label, delay) => (cb) => {
                active += 1;
                maxActive = Math.max(maxActive, active);
                setTimeout(() => {
                    active -= 1;
                    cb(null, label);
                }, delay);
            };

            const tasks = [
                createTask('A', 10),
                createTask('B', 5),
                createTask('C', 1),
                createTask('D', 1)
            ];

            const results = await new Promise((resolve, reject) => {
                langMini.call_multi(tasks, 2, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            expect(maxActive).toBeLessThanOrEqual(2);
            expect(results).toEqual(['A', 'B', 'C', 'D']);
        });

        test('invokes per-task callbacks and returns params when requested', async () => {
            const sideEffects = [];
            const double = (value, cb) => cb(null, value * 2);
            const upper = (value, cb) => cb(null, value.toUpperCase());

            const tasks = [
                [double, [21], (err, res) => sideEffects.push(['double', err, res])],
                [upper, ['lang'], (err, res) => sideEffects.push(['upper', err, res])]
            ];

            const results = await callMulti([tasks], 'returnParams');

            expect(results).toHaveLength(2);
            const [first, second] = results;
            expect(first[1]).toBe(42);
            expect(first[0][0]).toBe(21);
            expect(typeof first[0][1]).toBe('function');
            expect(second[1]).toBe('LANG');
            expect(second[0][0]).toBe('lang');
            expect(typeof second[0][1]).toBe('function');
            expect(sideEffects).toEqual([
                ['double', null, 42],
                ['upper', null, 'LANG']
            ]);
        });

        test('passes provided context to task functions', async () => {
            const context = {
                factor: 3,
                compute(cb) {
                    cb(null, this.factor * 7);
                }
            };

            const tasks = [
                [context, context.compute]
            ];

            const results = await callMulti([tasks]);
            expect(results).toEqual([21]);
        });

        test('propagates errors to the final callback', async () => {
            const tasks = [
                (cb) => cb(new Error('boom')), 
                (cb) => cb(null, 'never')
            ];

            await expect(
                new Promise((resolve, reject) => {
                    langMini.call_multi(tasks, (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                })
            ).rejects.toThrow('boom');
        });
    });

    describe('Fns.go', () => {
        test('executes array of functions using default callback semantics', async () => {
            const calls = [];
            const tasks = langMini.Fns([
                (cb) => { calls.push('first'); cb(null, 1); },
                (cb) => { calls.push('second'); cb(null, 2); }
            ]);

            const results = await new Promise((resolve, reject) => {
                tasks.go((err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            expect(calls).toEqual(['first', 'second']);
            expect(results).toEqual([1, 2]);
        });

        test('supports specifying parallelism and delay parameters', async () => {
            let active = 0;
            let maxActive = 0;
            const tasks = langMini.Fns([
                (cb) => {
                    active += 1;
                    maxActive = Math.max(maxActive, active);
                    setTimeout(() => {
                        active -= 1;
                        cb(null, 'a');
                    }, 5);
                },
                (cb) => {
                    active += 1;
                    maxActive = Math.max(maxActive, active);
                    setTimeout(() => {
                        active -= 1;
                        cb(null, 'b');
                    }, 5);
                },
                (cb) => {
                    active += 1;
                    maxActive = Math.max(maxActive, active);
                    setTimeout(() => {
                        active -= 1;
                        cb(null, 'c');
                    }, 5);
                }
            ]);

            const results = await new Promise((resolve, reject) => {
                tasks.go(2, 1, (err, res) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            });

            expect(results).toEqual(['a', 'b', 'c']);
            expect(maxActive).toBeGreaterThan(1);
            expect(maxActive).toBeLessThanOrEqual(2);
        });
    });

    describe('Publisher', () => {
        test('resolves when_ready once the ready event fires', async () => {
            const publisher = new langMini.Publisher();

            const readyPromise = publisher.when_ready;
            setTimeout(() => {
                publisher.raise('ready', null, null);
                // The second raise ensures handlers registered with one() fire even though
                // Evented_Class.raise_event iterates using the original length snapshot.
                publisher.raise('ready', null, null);
            }, 0);

            await expect(readyPromise).resolves.toBeUndefined();
            expect(publisher.is_ready).toBe(true);
        });

        test('resolves immediately if already ready', async () => {
            const publisher = new langMini.Publisher();
            publisher.raise('ready');
            await publisher.when_ready;

            const immediate = await publisher.when_ready;
            expect(immediate).toBeUndefined();
        });
    });
});
