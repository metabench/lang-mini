const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Data Types Tests
 * These tests verify the functionality of data types in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `Functional_Data_Type` validation
 * Verifies that it correctly validates data according to the defined rules.
 */
const test_functional_data_type_validation = () => {
    console.log(`Running test ${++testCounter}: Functional_Data_Type - validation`);
    const latLongType = new langMini.Functional_Data_Type({
        name: '[latitude, longitude]',
        validate: (x) => Array.isArray(x) && x.length === 2 &&
            typeof x[0] === 'number' && x[0] >= -90 && x[0] <= 90 &&
            typeof x[1] === 'number' && x[1] >= -180 && x[1] <= 180
    });

    assert.strictEqual(latLongType.validate([45, 90]), true, 'Functional_Data_Type test failed for valid lat/long');
    assert.strictEqual(latLongType.validate([100, 200]), false, 'Functional_Data_Type test failed for invalid lat/long');
};

/**
 * Test for `Functional_Data_Type` parsing
 * Verifies that it correctly parses strings into the defined data type.
 */
const test_functional_data_type_parsing = () => {
    console.log(`Running test ${++testCounter}: Functional_Data_Type - parsing`);
    const integerType = new langMini.Functional_Data_Type({
        name: 'integer',
        validate: (x) => Number.isInteger(x),
        parse_string: (str) => {
            const parsed = parseInt(str, 10);
            return (!isNaN(parsed) && parsed.toString() === str) ? parsed : undefined;
        }
    });

    assert.strictEqual(integerType.parse_string('42'), 42, 'Functional_Data_Type test failed for valid integer string');
    assert.strictEqual(integerType.parse_string('42.5'), undefined, 'Functional_Data_Type test failed for invalid integer string');
    assert.strictEqual(integerType.parse_string('abc'), undefined, 'Functional_Data_Type test failed for non-numeric string');
};

/**
 * Test for `Functional_Data_Type` with composite types
 * Verifies that it correctly validates and parses composite data types.
 */
const test_functional_data_type_composite = () => {
    console.log(`Running test ${++testCounter}: Functional_Data_Type - composite types`);
    const latLongType = new langMini.Functional_Data_Type({
        name: '[latitude, longitude]',
        validate: (x) => Array.isArray(x) && x.length === 2 &&
            typeof x[0] === 'number' && x[0] >= -90 && x[0] <= 90 &&
            typeof x[1] === 'number' && x[1] >= -180 && x[1] <= 180,
        parse_string: (str) => {
            const parts = str.split(',').map(s => parseFloat(s.trim()));
            if (parts.length === 2 &&
                !isNaN(parts[0]) && parts[0] >= -90 && parts[0] <= 90 &&
                !isNaN(parts[1]) && parts[1] >= -180 && parts[1] <= 180) {
                return parts;
            }
            return undefined;
        }
    });

    assert.strictEqual(latLongType.validate([45, 90]), true, 'Functional_Data_Type test failed for valid lat/long array');
    assert.strictEqual(latLongType.validate([100, 200]), false, 'Functional_Data_Type test failed for invalid lat/long array');
    assert.deepStrictEqual(latLongType.parse_string('45, 90'), [45, 90], 'Functional_Data_Type test failed for valid lat/long string');
    assert.strictEqual(latLongType.parse_string('100, 200'), undefined, 'Functional_Data_Type test failed for invalid lat/long string');
};

/**
 * Test for `Grammar` class
 * Verifies that it correctly handles grammar definitions and type inference.
 */
const test_grammar = () => {
    console.log(`Running test ${++testCounter}: Grammar - basic functionality`);

    const grammarDef = {
        user: {
            def: ['string', 'number'],
            plural: 'users'
        },
        location: {
            def: ['latitude', 'longitude'],
            plural: 'locations'
        }
    };

    const grammar = new langMini.Grammar({ name: 'Test Grammar', def: grammarDef });

    // Test single forms
    assert.strictEqual(grammar.tof(['John', 42]), 'user', 'Grammar test failed for single form inference');
    assert.strictEqual(grammar.tof([45, 90]), 'location', 'Grammar test failed for single form inference');

    // Test plural forms
    assert.strictEqual(grammar.sig([['John', 42], ['Jane', 30]]), 'users', 'Grammar test failed for plural form inference');
    assert.strictEqual(grammar.sig([[45, 90], [30, 60]]), 'locations', 'Grammar test failed for plural form inference');
};

// Run all tests
test_functional_data_type_validation();
test_functional_data_type_parsing();
test_functional_data_type_composite();
test_grammar();

console.log(`\nCompleted ${testCounter} tests in data-types-test.js`);