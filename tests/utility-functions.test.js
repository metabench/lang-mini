const langMini = require('../lang-mini');

describe('lang-mini utility functions', () => {
    describe('arr_trim_undefined', () => {
        test('removes trailing undefined entries while preserving preceding values', () => {
            const input = [1, undefined, 3, undefined, undefined];
            expect(langMini.arr_trim_undefined(input)).toEqual([1, undefined, 3]);
        });

        test('returns empty array when all entries are undefined', () => {
            expect(langMini.arr_trim_undefined([undefined, undefined])).toEqual([]);
        });
    });

    describe('ll_set and ll_get', () => {
        test('sets nested properties and retrieves them', () => {
            const target = {};
            langMini.ll_set(target, 'a.b.c', 42);
            expect(target).toEqual({ a: { b: { c: 42 } } });
            expect(langMini.ll_get(target, 'a.b.c')).toBe(42);
        });

        test('overwrites existing values', () => {
            const target = { a: { b: { c: 1 } } };
            langMini.ll_set(target, 'a.b.c', 99);
            expect(target.a.b.c).toBe(99);
        });
    });

    describe('array tree helpers', () => {
        test('set_arr_tree_value updates deep array entries', () => {
            const tree = [[0, 1], [2, 3]];
            langMini.set_arr_tree_value(tree, [1, 0], 99);
            expect(tree[1][0]).toBe(99);
        });

        test('get_arr_tree_value retrieves nested array entries', () => {
            const tree = [[0, 1], [2, 3]];
            expect(langMini.get_arr_tree_value(tree, [0, 1])).toBe(1);
        });
    });

    describe('deep_arr_iterate', () => {
        test('iterates over every leaf value with its path', () => {
            const data = [[1, 2], [3, [4]]];
            const visits = [];
            langMini.deep_arr_iterate(data, [], (path, value) => {
                visits.push({ path, value });
            });
            expect(visits).toEqual([
                { path: [0, 0], value: 1 },
                { path: [0, 1], value: 2 },
                { path: [1, 0], value: 3 },
                { path: [1, 1, 0], value: 4 }
            ]);
            const uniqueReferences = new Set(visits.map((entry) => entry.path));
            expect(uniqueReferences.size).toBe(visits.length);
        });
    });

    describe('prom', () => {
        test('resolves promise when callback succeeds', async () => {
            const base = (value, callback) => {
                setTimeout(() => callback(null, value * 2), 0);
            };
            const promisified = langMini.prom(base);
            await expect(promisified(5)).resolves.toBe(10);
        });

        test('rejects promise when callback receives an error', async () => {
            const base = (shouldFail, callback) => {
                setTimeout(() => {
                    if (shouldFail) {
                        callback(new Error('boom'));
                    } else {
                        callback(null, 'ok');
                    }
                }, 0);
            };
            const promisified = langMini.prom(base);
            await expect(promisified(true)).rejects.toThrow('boom');
            await expect(promisified(false)).resolves.toBe('ok');
        });

        test('invokes callback directly when provided', (done) => {
            const base = (value, callback) => {
                setTimeout(() => callback(null, value + 1), 0);
            };
            const promisified = langMini.prom(base);
            promisified(7, (err, result) => {
                expect(err).toBeNull();
                expect(result).toBe(8);
                done();
            });
        });
    });

    describe('vector operations', () => {
        test('performs scalar addition', () => {
            expect(langMini.v_add(2, 3)).toBe(5);
        });

        test('adds two vectors element-wise', () => {
            expect(langMini.v_add([1, 2], [3, 4])).toEqual([4, 6]);
        });

        test('multiplies vector by scalar', () => {
            expect(langMini.v_multiply([2, 3], 2)).toEqual([4, 6]);
        });

        test('computes distance between points using Pythagorean theorem', () => {
            expect(langMini.distance_between_points([[0, 0], [3, 4]])).toBe(5);
        });
    });

    describe('typed arrays', () => {
        test('creates typed array from input values', () => {
            const result = langMini.get_typed_array('ui8', [1, 2, 3]);
            expect(result).toBeInstanceOf(Uint8Array);
            expect(Array.from(result)).toEqual([1, 2, 3]);
        });

        test('creates typed array of a given length', () => {
            const result = langMini.get_typed_array('f32', 4);
            expect(result).toBeInstanceOf(Float32Array);
            expect(result.length).toBe(4);
        });
    });

    describe('object and array utilities', () => {
        test('to_arr_strip_keys returns array of values preserving order', () => {
            const obj = { a: 1, b: 2, c: 3 };
            expect(langMini.to_arr_strip_keys(obj)).toEqual([1, 2, 3]);
        });

        test('arr_objs_to_arr_keys_values_table builds table representation', () => {
            const data = [
                { id: 1, name: 'Alice' },
                { id: 2, name: 'Bob' }
            ];
            const [keys, rows] = langMini.arr_objs_to_arr_keys_values_table(data);
            expect(keys).toEqual(['id', 'name']);
            expect(rows).toEqual([
                [1, 'Alice'],
                [2, 'Bob']
            ]);
        });
    });

    describe('truth helper', () => {
        test('only returns true for literal boolean true', () => {
            expect(langMini.truth(true)).toBe(true);
            expect(langMini.truth(1)).toBe(false);
            expect(langMini.truth('true')).toBe(false);
            expect(langMini.truth(false)).toBe(false);
        });
    });

    describe('iterate_ancestor_classes', () => {
        test('visits chain until no superclass exists', () => {
            const base = { name: 'base' };
            const middle = { name: 'middle', _superclass: base };
            const derived = { name: 'derived', _superclass: middle };
            const visited = [];
            langMini.iterate_ancestor_classes(derived, (cls) => {
                visited.push(cls.name);
            });
            expect(visited).toEqual(['derived', 'middle', 'base']);
        });

        test('stop prevents visiting further ancestors', () => {
            const base = { name: 'base' };
            const derived = { name: 'derived', _superclass: base };
            const visited = [];
            langMini.iterate_ancestor_classes(derived, (cls, stop) => {
                visited.push(cls.name);
                if (cls.name === 'derived') {
                    stop();
                }
            });
            expect(visited).toEqual(['derived']);
        });
    });
});
