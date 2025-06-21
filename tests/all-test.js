const assert = require('assert');
const langMini = require('../lang-mini');

// Test for `each` function
const test_each = () => {
    console.log('Running test 1: test_each');
    const inputArray = [1, 2, 3];
    const results = [];
    langMini.each(inputArray, (item) => results.push(item * 2));
    assert.deepStrictEqual(results, [2, 4, 6], '`each` test failed for array');

    const inputObject = { a: 1, b: 2 };
    const objectResults = [];
    langMini.each(inputObject, (value, key) => objectResults.push(`${key}:${value}`));
    assert.deepStrictEqual(objectResults, ['a:1', 'b:2'], '`each` test failed for object');
};

test_each();

// Test for `is_array` function
const test_is_array = () => {
    console.log('Running test 2: test_is_array');
    assert.strictEqual(langMini.is_array([1, 2, 3]), true, '`is_array` test failed for array');
    assert.strictEqual(langMini.is_array('not an array'), false, '`is_array` test failed for non-array');
    assert.strictEqual(langMini.is_array([]), true, '`is_array` test failed for empty array');
};

test_is_array();

// Test for `get_truth_map_from_arr` function
const test_get_truth_map_from_arr = () => {
    console.log('Running test 3: test_get_truth_map_from_arr');
    const input = ['a', 'b', 'c'];
    const expected = { a: true, b: true, c: true };
    const result = langMini.get_truth_map_from_arr(input);
    assert.deepStrictEqual(result, expected, '`get_truth_map_from_arr` test failed');
};

test_get_truth_map_from_arr();

// Test for `mfp` function
const test_mfp = () => {
    console.log('Running test 4: test_mfp');
    const multiply_2_numbers = langMini.mfp({
        verb: 'multiply'
    }, {
        'n,n': (num1, num2) => num1 * num2
    });

    assert.strictEqual(multiply_2_numbers(5, 6), 30, '`mfp` test failed for multiply_2_numbers');

    const check_credentials = langMini.mfp({
        name: 'check_credentials',
        grammar: {
            username: 'string',
            password: 'string',
            credentials: '[username, password]'
        },
        noun: 'credentials',
        single: true,
        return_type: 'boolean'
    }, (arr_credentials) => {
        const [username, password] = arr_credentials;
        return username === 'root' && password === 'ubuntu';
    });

    assert.strictEqual(check_credentials(['root', 'ubuntu']), true, '`mfp` test failed for valid credentials');
    assert.strictEqual(check_credentials(['james', 'hello']), false, '`mfp` test failed for invalid credentials');
};

test_mfp();

// Adding a test for `deep_sig` function
const test_deep_sig = () => {
    console.log('Running test 5: test_deep_sig');
    const input = { a: 1, b: [2, 3] };
    const expected = '{"a":n,"b":[n,n]}';
    const result = langMini.deep_sig(input);
    assert.strictEqual(result, expected, '`deep_sig` test failed for simple object');
};

test_deep_sig();

// Adding a test for `combinations` function
const test_combinations = () => {
    console.log('Running test 6: test_combinations');
    const input = [[1, 2], ['A', 'B']];
    const expected = [
        [1, 'A'], [1, 'B'],
        [2, 'A'], [2, 'B']
    ];
    const result = langMini.combinations(input);
    assert.deepStrictEqual(result, expected, '`combinations` test failed');
};

test_combinations();

// Adding a test for `Functional_Data_Type` validation
const test_functional_data_type = () => {
    console.log('Running test 7: test_functional_data_type');
    const fdt_lat_long = new langMini.Functional_Data_Type({
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

// Adding a test for `vectorify` function
const test_vectorify = () => {
    console.log('Running test 8: test_vectorify');
    const add = langMini.vectorify((a, b) => a + b);
    const subtract = langMini.vectorify((a, b) => a - b);

    assert.deepStrictEqual(add([1, 2], [3, 4]), [4, 6], '`vectorify` test failed for addition');
    assert.deepStrictEqual(subtract([5, 6], [2, 3]), [3, 3], '`vectorify` test failed for subtraction');
};

test_vectorify();

// Adding a test for `distance_between_points` function
const test_distance_between_points = () => {
    console.log('Running test 9: test_distance_between_points');
    const points = [[0, 0], [3, 4]];
    const expected = 5; // 3-4-5 triangle
    const result = langMini.distance_between_points(points);
    assert.strictEqual(result, expected, '`distance_between_points` test failed');
};

test_distance_between_points();

// Add more tests as needed for other functions and modules.