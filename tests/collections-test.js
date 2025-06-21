const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Collections Tests
 * These tests verify the collection manipulation functions in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `combinations` function
 * Verifies that it correctly generates all combinations of input arrays.
 */
const test_combinations = () => {
    console.log(`Running test ${++testCounter}: combinations - basic usage`);
    const input = [[1, 2], ['A', 'B']];
    const expected = [
        [1, 'A'], [1, 'B'],
        [2, 'A'], [2, 'B']
    ];
    const result = langMini.combinations(input);
    assert.deepStrictEqual(result, expected, '`combinations` test failed for basic usage');

    console.log(`Running test ${++testCounter}: combinations - with empty array`);
    const inputWithEmpty = [[1, 2], []];
    const expectedEmpty = [];
    const resultEmpty = langMini.combinations(inputWithEmpty);
    assert.deepStrictEqual(resultEmpty, expectedEmpty, '`combinations` test failed for input with empty array');
};

/**
 * Test for `arr_like_to_arr` function
 * Verifies that it correctly converts array-like objects to arrays.
 */
const test_arr_like_to_arr = () => {
    console.log(`Running test ${++testCounter}: arr_like_to_arr`);
    const input = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
    const expected = ['a', 'b', 'c'];
    const result = langMini.arr_like_to_arr(input);
    assert.deepStrictEqual(result, expected, '`arr_like_to_arr` test failed');
};

/**
 * Test for `get_map_from_arr` function
 * Verifies that it correctly maps array elements to their indices.
 */
const test_get_map_from_arr = () => {
    console.log(`Running test ${++testCounter}: get_map_from_arr`);
    const input = ['a', 'b', 'c'];
    const expected = { a: 0, b: 1, c: 2 };
    const result = langMini.get_map_from_arr(input);
    assert.deepStrictEqual(result, expected, '`get_map_from_arr` test failed');
};

// Run all tests
test_combinations();
test_arr_like_to_arr();
test_get_map_from_arr();

console.log(`\nCompleted ${testCounter} tests in collections-test.js`);