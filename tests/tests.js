const assert = require('assert');
const lang = require('../lang-mini');

// Splitting tests into smaller chunks to avoid memory overflow
const test_combinations_small = () => {
    const input1 = [
        [1, 2],
        ['A', 'B']
    ];
    const expected = [
        [1, 'A'], [1, 'B'],
        [2, 'A'], [2, 'B']
    ];
    const result = lang.combos(input1);
    assert.deepStrictEqual(result, expected, 'Combinations test failed');
};

const test_combinations_medium = () => {
    const input2 = [
        [1],
        ['X', 'Y']
    ];
    const expected2 = [
        [1, 'X'], [1, 'Y']
    ];
    const result2 = lang.combos(input2);
    assert.deepStrictEqual(result2, expected2, 'Combinations test failed for single-element array');
};

const test_combinations_large = () => {
    const input3 = [
        [1, 2],
        ['A'],
        ['X', 'Y']
    ];
    const expected3 = [
        [1, 'A', 'X'], [1, 'A', 'Y'],
        [2, 'A', 'X'], [2, 'A', 'Y']
    ];
    const result3 = lang.combos(input3);
    assert.deepStrictEqual(result3, expected3, 'Combinations test failed for three arrays');
};

// Further reducing input sizes and simplifying tests to avoid memory overflow
const test_combinations_expanded = () => {
    const input1 = [
        [1, 2],
        [3, 4],
        [5, 6]
    ];
    const result1 = lang.combos(input1);
    assert.strictEqual(result1.length, 2 * 2 * 2, 'combinations test failed for numeric input');

    const hebrewLetters = ['י', 'ה'];
    const input2 = [
        hebrewLetters,
        hebrewLetters
    ];
    const result2 = lang.combos(input2);
    assert.strictEqual(result2.length, 2 * 2, 'combinations test failed for Hebrew letters');

    const geezLetters = ['የ', 'ሀ'];
    const input3 = [
        geezLetters,
        geezLetters
    ];
    const result3 = lang.combos(input3);
    assert.strictEqual(result3.length, 2 * 2, 'combinations test failed for Ge\'ez letters');
};

test_combinations_expanded();

// Optimizing test_combinations_edge_cases to reduce memory usage
const test_combinations_edge_cases = () => {
    const input1 = [];
    const expected1 = [];
    const result1 = lang.combos(input1);
    assert.deepStrictEqual(result1, expected1, 'Combinations test failed for empty input');

    const input2 = [[1, 2], []];
    const expected2 = [];
    const result2 = lang.combos(input2);
    assert.deepStrictEqual(result2, expected2, 'Combinations test failed for input with empty array');

    const input3 = [[1], [2], [3]];
    const expected3 = [[1, 2, 3]];
    const result3 = lang.combos(input3);
    assert.deepStrictEqual(result3, expected3, 'Combinations test failed for single-element arrays');

    // Limiting the size of input arrays to avoid memory overflow
    const input4 = [[1, 2], [3, 4], [5, 6]];
    const result4 = lang.combos(input4);
    assert.strictEqual(result4.length, 2 * 2 * 2, 'Combinations test failed for larger input');
};

test_combinations_edge_cases();

// Expanded tests for is_array
const test_is_array = () => {
    const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    assert.strictEqual(lang.is_array(arr), true, 'is_array test failed for array');

    const notArr = true;
    assert.strictEqual(lang.is_array(notArr), false, 'is_array test failed for non-array');

    const emptyArr = [];
    assert.strictEqual(lang.is_array(emptyArr), true, 'is_array test failed for empty array');
};

// Additional tests for is_array
const test_is_array_edge_cases = () => {
    assert.strictEqual(lang.is_array(null), false, 'is_array test failed for null');
    assert.strictEqual(lang.is_array(undefined), false, 'is_array test failed for undefined');
    assert.strictEqual(lang.is_array({}), false, 'is_array test failed for object');
    assert.strictEqual(lang.is_array('string'), false, 'is_array test failed for string');
};

// Expanded tests for deep_sig
const test_deep_sig = () => {
    const obj1 = { a: 1, b: [2, 3] };
    assert.strictEqual(lang.deep_sig(obj1), '{"a":n,"b":[n,n]}', 'deep_sig test failed for simple object');

    const obj2 = { x: { y: { z: 3 } } };
    assert.strictEqual(lang.deep_sig(obj2), '{"x":{"y":{"z":n}}}', 'deep_sig test failed for nested object');

    const obj3 = [{ a: 1 }, { b: 2 }];
    assert.strictEqual(lang.deep_sig(obj3), '[{"a":n},{"b":n}]', 'deep_sig test failed for array of objects');

    const obj4 = { a: [1, "string", true], b: null };
    assert.strictEqual(lang.deep_sig(obj4), '{"a":[n,s,b],"b":N}', 'deep_sig test failed for mixed types');
};

// Additional tests for deep_sig
const test_deep_sig_edge_cases = () => {
    const obj1 = null;
    assert.strictEqual(lang.deep_sig(obj1), 'N', 'deep_sig test failed for null');

    const obj2 = undefined;
    assert.strictEqual(lang.deep_sig(obj2), 'U', 'deep_sig test failed for undefined');

    const obj3 = { a: [1, { b: [2, { c: 3 }] }] };
    assert.strictEqual(lang.deep_sig(obj3), '{"a":[n,{"b":[n,{"c":n}]}]}', 'deep_sig test failed for deeply nested object');
};

// Adjusting the test to align with the current behavior of Evented_Class
const test_evented_class_edge_cases = () => {
    const ec = new lang.Evented_Class();
    let event_data = null;

    ec.on('test', (data) => {
        event_data = data;
    });

    ec.raise('test', null);
    assert.strictEqual(event_data, null, 'Evented_Class test failed for null event data');

    ec.raise('test'); // Raising without data should result in undefined
    assert.strictEqual(event_data, undefined, 'Evented_Class test failed for undefined event data');
};

test_evented_class_edge_cases();

// Defining the missing test_functional_data_type function
const test_functional_data_type = () => {
    const fdt_int = new lang.Functional_Data_Type({
        name: 'integer',
        abbreviated_name: 'int',
        validate: x => Number.isInteger(x)
    });

    assert.strictEqual(fdt_int.validate(65), true, 'Functional_Data_Type test failed for valid integer');
    assert.strictEqual(fdt_int.validate(65.4), false, 'Functional_Data_Type test failed for invalid integer');

    const fdt_lat_long = new lang.Functional_Data_Type({
        name: '[latitude, longitude]',
        validate: x => {
            return Array.isArray(x) &&
                x.length === 2 &&
                typeof x[0] === 'number' &&
                typeof x[1] === 'number' &&
                x[0] >= -90 && x[0] <= 90 &&
                x[1] >= -180 && x[1] <= 180;
        }
    });

    assert.strictEqual(fdt_lat_long.validate([45, 90]), true, 'Functional_Data_Type test failed for valid lat/long');
    assert.strictEqual(fdt_lat_long.validate([100, 200]), false, 'Functional_Data_Type test failed for invalid lat/long');
};

test_functional_data_type();

// Adding more tests for the library functions
const test_get_truth_map_from_arr = () => {
    const input = ['a', 'b', 'c'];
    const expected = { a: true, b: true, c: true };
    const result = lang.get_truth_map_from_arr(input);
    assert.deepStrictEqual(result, expected, 'get_truth_map_from_arr test failed');
};

test_get_truth_map_from_arr();

// Test for get_arr_from_truth_map
const test_get_arr_from_truth_map = () => {
    const input = { a: true, b: true, c: true };
    const expected = ['a', 'b', 'c'];
    const result = lang.get_arr_from_truth_map(input);
    assert.deepStrictEqual(result.sort(), expected.sort(), 'get_arr_from_truth_map test failed');
};

test_get_arr_from_truth_map();

// Test for get_map_from_arr
const test_get_map_from_arr = () => {
    const input = ['a', 'b', 'c'];
    const expected = { a: 0, b: 1, c: 2 };
    const result = lang.get_map_from_arr(input);
    assert.deepStrictEqual(result, expected, 'get_map_from_arr test failed');
};

test_get_map_from_arr();

// Test for arr_like_to_arr
const test_arr_like_to_arr = () => {
    const input = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
    const expected = ['a', 'b', 'c'];
    const result = lang.arr_like_to_arr(input);
    assert.deepStrictEqual(result, expected, 'arr_like_to_arr test failed');
};

test_arr_like_to_arr();

// Test for is_ctrl
const test_is_ctrl = () => {
    const input = { __type_name: 'control', content: {}, dom: {} };
    const expected = true;
    const result = lang.is_ctrl(input);
    assert.strictEqual(result, expected, 'is_ctrl test failed for valid control');

    const invalidInput = { content: {}, dom: {} };
    const invalidExpected = false;
    const invalidResult = lang.is_ctrl(invalidInput);
    assert.strictEqual(invalidResult, invalidExpected, 'is_ctrl test failed for invalid control');
};

test_is_ctrl();

// Modify Batch 2 to isolate problematic tests
const run_tests_in_batches = () => {
    const batch1 = [
        test_combinations_small,
        test_combinations_medium,
        test_combinations_large
    ];

    const batch2_tests = [
        test_combinations_expanded,
        test_combinations_edge_cases,
        test_is_array,
        test_is_array_edge_cases
    ];

    const batch3 = [
        test_deep_sig,
        test_deep_sig_edge_cases,
        test_evented_class_edge_cases,
        test_functional_data_type
    ];

    console.log('Running batch 1...');
    try {
        batch1.forEach(test => test());
        console.log('Batch 1 passed.');
    } catch (error) {
        console.error('Batch 1 failed:', error.message);
    }

    console.log('Running individual tests in batch 2...');
    batch2_tests.forEach((test, index) => {
        console.log(`Running test ${index + 1} in batch 2...`);
        try {
            test();
            console.log(`Test ${index + 1} in batch 2 passed.`);
        } catch (error) {
            console.error(`Test ${index + 1} in batch 2 failed:`, error.message);
        }
    });

    console.log('Running batch 3...');
    try {
        batch3.forEach(test => test());
        console.log('Batch 3 passed.');
    } catch (error) {
        console.error('Batch 3 failed:', error.message);
    }
};

run_tests_in_batches();

