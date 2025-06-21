const assert = require('assert');
const lang = require('../lang-mini');

// Test for vectorify with addition
const test_vectorify_addition = () => {
    const input1 = [1, 2, 3];
    const input2 = [4, 5, 6];
    const expected = [5, 7, 9];
    const result = lang.v_add(input1, input2);
    assert.deepStrictEqual(result, expected, 'vectorify addition test failed');
};

test_vectorify_addition();

// Test for vectorify with subtraction
const test_vectorify_subtraction = () => {
    const input1 = [10, 20, 30];
    const input2 = [1, 2, 3];
    const expected = [9, 18, 27];
    const result = lang.v_subtract(input1, input2);
    assert.deepStrictEqual(result, expected, 'vectorify subtraction test failed');
};

test_vectorify_subtraction();

// Test for vectorify with scalar multiplication
const test_vectorify_scalar_multiplication = () => {
    const input1 = [2, 4, 6];
    const scalar = 3;
    const expected = [6, 12, 18];
    const result = lang.v_multiply(input1, scalar);
    assert.deepStrictEqual(result, expected, 'vectorify scalar multiplication test failed');
};

test_vectorify_scalar_multiplication();

// Test for vectorify with scalar division
const test_vectorify_scalar_division = () => {
    const input1 = [10, 20, 30];
    const scalar = 2;
    const expected = [5, 10, 15];
    const result = lang.v_divide(input1, scalar);
    assert.deepStrictEqual(result, expected, 'vectorify scalar division test failed');
};

test_vectorify_scalar_division();

// Test for vector magnitude
const test_vector_magnitude = () => {
    const input = [3, 4];
    const expected = 5; // 3-4-5 triangle
    const result = lang.vector_magnitude(input);
    assert.strictEqual(result, expected, 'vector magnitude test failed');
};

test_vector_magnitude();

// Test for distance_between_points
const test_distance_between_points = () => {
    const input = [
        [0, 0],
        [3, 4]
    ];
    const expected = 5; // 3-4-5 triangle
    const result = lang.distance_between_points(input);
    assert.strictEqual(result, expected, 'distance_between_points test failed');
};

test_distance_between_points();

// Test for get_typed_array with Uint8Array
const test_get_typed_array_uint8 = () => {
    const input = ['ui8', [1, 2, 3]];
    const expected = new Uint8Array([1, 2, 3]);
    const result = lang.get_typed_array(...input);
    assert.deepStrictEqual(result, expected, 'get_typed_array test failed for Uint8Array');
};

test_get_typed_array_uint8();

// Test for get_typed_array with Float32Array
const test_get_typed_array_float32 = () => {
    const input = ['f32', [1.1, 2.2, 3.3]];
    const expected = new Float32Array([1.1, 2.2, 3.3]);
    const result = lang.get_typed_array(...input);
    assert.deepStrictEqual(result, expected, 'get_typed_array test failed for Float32Array');
};

test_get_typed_array_float32();

// Test for is_arr_of_t with strings
const test_is_arr_of_t_strings = () => {
    const input = ['a', 'b', 'c'];
    const expected = true;
    const result = lang.is_arr_of_t(input, 'string');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for strings');
};

test_is_arr_of_t_strings();

// Test for is_arr_of_t with mixed types
const test_is_arr_of_t_mixed = () => {
    const input = ['a', 1, 'c'];
    const expected = false;
    const result = lang.is_arr_of_t(input, 'string');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for mixed types');
};

test_is_arr_of_t_mixed();

// Test for clone with primitive values
const test_clone_primitive = () => {
    const input = 42;
    const expected = 42;
    const result = lang.clone(input);
    assert.strictEqual(result, expected, 'clone test failed for primitive value');
};

test_clone_primitive();

// Test for clone with arrays
const test_clone_array = () => {
    const input = [1, 2, 3];
    const expected = [1, 2, 3];
    const result = lang.clone(input);
    assert.deepStrictEqual(result, expected, 'clone test failed for array');
};

test_clone_array();

// Test for clone with objects
const test_clone_object = () => {
    const input = { a: 1, b: 2 };
    const expected = { a: 1, b: 2 };
    const result = lang.clone(input);
    assert.deepStrictEqual(result, expected, 'clone test failed for object');
};

test_clone_object();

// Test for deep_sig with nested objects
const test_deep_sig_nested = () => {
    const input = { a: { b: [1, 2, { c: 3 }] } };
    const expected = '{"a":{"b":[n,n,{"c":n}]}}';
    const result = lang.deep_sig(input);
    assert.strictEqual(result, expected, 'deep_sig test failed for nested objects');
};

test_deep_sig_nested();

// Test for deep_sig with arrays
const test_deep_sig_array = () => {
    const input = [1, [2, 3], { a: 4 }];
    const expected = '[n,[n,n],{"a":n}]';
    const result = lang.deep_sig(input);
    assert.strictEqual(result, expected, 'deep_sig test failed for arrays');
};

test_deep_sig_array();

// Test for combinations with single array
const test_combinations_single_array = () => {
    const input = [[1, 2, 3]];
    const expected = [[1], [2], [3]];
    const result = lang.combinations(input);
    assert.deepStrictEqual(result, expected, 'combinations test failed for single array');
};

test_combinations_single_array();

// Test for combinations with multiple arrays
const test_combinations_multiple_arrays = () => {
    const input = [[1, 2], ['a', 'b']];
    const expected = [
        [1, 'a'], [1, 'b'],
        [2, 'a'], [2, 'b']
    ];
    const result = lang.combinations(input);
    assert.deepStrictEqual(result, expected, 'combinations test failed for multiple arrays');
};

test_combinations_multiple_arrays();

// Test for vectorify with mixed operations
const test_vectorify_mixed_operations = () => {
    const input1 = [1, 2, 3];
    const input2 = [4, 5, 6];
    const addition = lang.v_add(input1, input2);
    const subtraction = lang.v_subtract(input1, input2);
    const expectedAddition = [5, 7, 9];
    const expectedSubtraction = [-3, -3, -3];
    assert.deepStrictEqual(addition, expectedAddition, 'vectorify addition test failed');
    assert.deepStrictEqual(subtraction, expectedSubtraction, 'vectorify subtraction test failed');
};

test_vectorify_mixed_operations();

// Test for is_arr_of_t with empty array
const test_is_arr_of_t_empty = () => {
    const input = [];
    const expected = true;
    const result = lang.is_arr_of_t(input, 'string');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for empty array');
};

test_is_arr_of_t_empty();

// Test for is_arr_of_t with numbers
const test_is_arr_of_t_numbers = () => {
    const input = [1, 2, 3];
    const expected = true;
    const result = lang.is_arr_of_t(input, 'number');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for numbers');
};

test_is_arr_of_t_numbers();

// Test for is_arr_of_t with booleans
const test_is_arr_of_t_booleans = () => {
    const input = [true, false, true];
    const expected = true;
    const result = lang.is_arr_of_t(input, 'boolean');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for booleans');
};

test_is_arr_of_t_booleans();

// Test for is_arr_of_t with mixed booleans and numbers
const test_is_arr_of_t_mixed_booleans_numbers = () => {
    const input = [true, 1, false];
    const expected = false;
    const result = lang.is_arr_of_t(input, 'boolean');
    assert.strictEqual(result, expected, 'is_arr_of_t test failed for mixed booleans and numbers');
};

test_is_arr_of_t_mixed_booleans_numbers();

// Test for clone with nested objects
const test_clone_nested_object = () => {
    const input = { a: { b: { c: 1 } } };
    const expected = { a: { b: { c: 1 } } };
    const result = lang.clone(input);
    assert.deepStrictEqual(result, expected, 'clone test failed for nested object');
};

test_clone_nested_object();

// Test for deep_sig with deeply nested arrays
const test_deep_sig_deeply_nested_arrays = () => {
    const input = [[1, [2, [3, [4]]]]];
    const expected = '[[n,[n,[n,[n]]]]]';
    const result = lang.deep_sig(input);
    assert.strictEqual(result, expected, 'deep_sig test failed for deeply nested arrays');
};

test_deep_sig_deeply_nested_arrays();

// Test for combinations with empty arrays
const test_combinations_empty_arrays = () => {
    const input = [[], []];
    const expected = [];
    const result = lang.combinations(input);
    assert.deepStrictEqual(result, expected, 'combinations test failed for empty arrays');
};

test_combinations_empty_arrays();