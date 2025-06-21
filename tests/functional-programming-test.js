const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Functional Programming Tests
 * These tests verify the functional programming tools in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `fp` function
 * Verifies that it correctly handles functional polymorphism.
 */
const test_fp = () => {
    console.log(`Running test ${++testCounter}: fp - basic usage`);
    const add = langMini.fp((a, sig) => {
        if (sig === '[n,n]') return a[0] + a[1];
    });
    assert.strictEqual(add(1, 2), 3, '`fp` test failed for addition');

    console.log(`Running test ${++testCounter}: fp - with array`);
    const multiply = langMini.fp((a, sig) => {
        if (sig === '[a]') return a[0].reduce((acc, val) => acc * val, 1);
    });
    assert.strictEqual(multiply([2, 3, 4]), 24, '`fp` test failed for array multiplication');
};

/**
 * Test for `vectorify` function
 * Verifies that it correctly applies numeric operations to vectors.
 */
const test_vectorify = () => {
    console.log(`Running test ${++testCounter}: vectorify - addition`);
    const add = langMini.vectorify((a, b) => a + b);
    assert.deepStrictEqual(add([1, 2], [3, 4]), [4, 6], '`vectorify` test failed for addition');

    console.log(`Running test ${++testCounter}: vectorify - subtraction`);
    const subtract = langMini.vectorify((a, b) => a - b);
    assert.deepStrictEqual(subtract([5, 6], [2, 3]), [3, 3], '`vectorify` test failed for subtraction');
};

/**
 * Test for `mfp` function
 * Verifies that it correctly handles multiple function polymorphism.
 */
const test_mfp = () => {
    console.log(`Running test ${++testCounter}: mfp - basic usage`);
    const multiply = langMini.mfp({
        'n,n': (a, b) => a * b,
        's,s': (a, b) => `${a}${b}`
    });
    assert.strictEqual(multiply(2, 3), 6, '`mfp` test failed for numeric multiplication');
    assert.strictEqual(multiply('Hello, ', 'World!'), 'Hello, World!', '`mfp` test failed for string concatenation');
};

/**
 * Test for `distance_between_points` function
 * Verifies that it correctly calculates the distance between two points.
 */
const test_distance_between_points = () => {
    console.log(`Running test ${++testCounter}: distance_between_points`);
    const points = [[0, 0], [3, 4]];
    const expected = 5; // 3-4-5 triangle
    const result = langMini.distance_between_points(points);
    assert.strictEqual(result, expected, '`distance_between_points` test failed');
};

// Run all tests
test_fp();
test_vectorify();
test_mfp();
test_distance_between_points();

console.log(`\nCompleted ${testCounter} tests in functional-programming-test.js`);