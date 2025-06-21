const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Core Utilities Tests
 * These tests verify the basic utility functions in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `each` function with arrays and objects
 * Verifies that it correctly iterates over arrays and objects,
 * applying the provided function to each element.
 */
const test_each = () => {
    console.log(`Running test ${++testCounter}: each - array iteration`);
    const inputArray = [1, 2, 3];
    const results = [];
    langMini.each(inputArray, (item) => results.push(item * 2));
    assert.deepStrictEqual(results, [2, 4, 6], '`each` test failed for array');

    console.log(`Running test ${++testCounter}: each - object iteration`);
    const inputObject = { a: 1, b: 2 };
    const objectResults = [];
    langMini.each(inputObject, (value, key) => objectResults.push(`${key}:${value}`));
    assert.deepStrictEqual(objectResults, ['a:1', 'b:2'], '`each` test failed for object');
    
    // Test with the stop function
    console.log(`Running test ${++testCounter}: each - with stop function`);
    const arrayWithStop = [1, 2, 3, 4, 5];
    const resultsWithStop = [];
    langMini.each(arrayWithStop, (item, index, stop) => {
        if (item > 3) stop();
        resultsWithStop.push(item);
    });
    assert.deepStrictEqual(resultsWithStop, [1, 2, 3], '`each` test failed with stop function');
};

/**
 * Test for `is_array` function
 * Verifies that it correctly identifies arrays and non-arrays.
 */
const test_is_array = () => {
    console.log(`Running test ${++testCounter}: is_array - with array`);
    assert.strictEqual(langMini.is_array([1, 2, 3]), true, '`is_array` test failed for array');
    
    console.log(`Running test ${++testCounter}: is_array - with non-array`);
    assert.strictEqual(langMini.is_array('not an array'), false, '`is_array` test failed for non-array');
    
    console.log(`Running test ${++testCounter}: is_array - with empty array`);
    assert.strictEqual(langMini.is_array([]), true, '`is_array` test failed for empty array');
    
    console.log(`Running test ${++testCounter}: is_array - with null`);
    assert.strictEqual(langMini.is_array(null), false, '`is_array` test failed for null');
    
    console.log(`Running test ${++testCounter}: is_array - with object`);
    assert.strictEqual(langMini.is_array({}), false, '`is_array` test failed for object');
};

/**
 * Test for `clone` function
 * Verifies that it correctly creates deep copies of various data types.
 */
const test_clone = () => {
    console.log(`Running test ${++testCounter}: clone - with primitive value`);
    const primitive = 42;
    assert.strictEqual(langMini.clone(primitive), primitive, '`clone` test failed for primitive value');
    
    console.log(`Running test ${++testCounter}: clone - with array`);
    const array = [1, 2, 3];
    const clonedArray = langMini.clone(array);
    assert.deepStrictEqual(clonedArray, array, '`clone` test failed for array');
    // Verify it's a true copy by modifying the original
    array.push(4);
    assert.strictEqual(clonedArray.length, 3, '`clone` did not create a deep copy of array');
    
    console.log(`Running test ${++testCounter}: clone - with object`);
    const object = { a: 1, b: 2 };
    const clonedObject = langMini.clone(object);
    assert.deepStrictEqual(clonedObject, object, '`clone` test failed for object');
    // Verify it's a true copy
    object.c = 3;
    assert.strictEqual(clonedObject.c, undefined, '`clone` did not create a deep copy of object');
    
    console.log(`Running test ${++testCounter}: clone - with nested structure`);
    const nested = { a: [1, 2], b: { c: 3 } };
    const clonedNested = langMini.clone(nested);
    assert.deepStrictEqual(clonedNested, nested, '`clone` test failed for nested structure');
};

/**
 * Test for utility mapping functions
 * Verifies get_truth_map_from_arr, get_arr_from_truth_map, get_map_from_arr
 */
const test_mapping_utils = () => {
    console.log(`Running test ${++testCounter}: get_truth_map_from_arr`);
    const input = ['a', 'b', 'c'];
    const truthMap = langMini.get_truth_map_from_arr(input);
    assert.deepStrictEqual(truthMap, { a: true, b: true, c: true }, '`get_truth_map_from_arr` test failed');
    
    console.log(`Running test ${++testCounter}: get_arr_from_truth_map`);
    const backToArray = langMini.get_arr_from_truth_map(truthMap);
    // The order may be different, so sort both
    assert.deepStrictEqual(backToArray.sort(), input.sort(), '`get_arr_from_truth_map` test failed');
    
    console.log(`Running test ${++testCounter}: get_map_from_arr`);
    const indexMap = langMini.get_map_from_arr(input);
    assert.deepStrictEqual(indexMap, { a: 0, b: 1, c: 2 }, '`get_map_from_arr` test failed');
};

/**
 * Test for `is_defined` function
 * Verifies that it correctly identifies defined and undefined values
 */
const test_is_defined = () => {
    console.log(`Running test ${++testCounter}: is_defined - with defined value`);
    assert.strictEqual(langMini.is_defined(0), true, '`is_defined` test failed for defined value');
    assert.strictEqual(langMini.is_defined(''), true, '`is_defined` test failed for empty string');
    assert.strictEqual(langMini.is_defined(null), true, '`is_defined` test failed for null');
    
    console.log(`Running test ${++testCounter}: is_defined - with undefined value`);
    assert.strictEqual(langMini.is_defined(undefined), false, '`is_defined` test failed for undefined');
    
    let obj = {};
    console.log(`Running test ${++testCounter}: is_defined - with missing property`);
    assert.strictEqual(langMini.is_defined(obj.nonExistentProp), false, '`is_defined` test failed for non-existent property');
};

// Run all tests
test_each();
test_is_array();
test_clone();
test_mapping_utils();
test_is_defined();

console.log(`\nCompleted ${testCounter} tests in core-utils-test.js`);