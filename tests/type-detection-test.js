const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Type Detection Tests
 * These tests verify the type detection utilities in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `tof` function
 * Verifies that it correctly identifies the type of various inputs.
 */
const test_tof = () => {
    console.log(`Running test ${++testCounter}: tof - basic types`);
    assert.strictEqual(langMini.tof(42), 'number', '`tof` test failed for number');
    assert.strictEqual(langMini.tof('hello'), 'string', '`tof` test failed for string');
    assert.strictEqual(langMini.tof(true), 'boolean', '`tof` test failed for boolean');
    assert.strictEqual(langMini.tof([]), 'array', '`tof` test failed for array');
    assert.strictEqual(langMini.tof({}), 'object', '`tof` test failed for object');
};

/**
 * Test for `tf` function
 * Verifies that it correctly returns abbreviated type names.
 */
const test_tf = () => {
    console.log(`Running test ${++testCounter}: tf - abbreviated types`);
    assert.strictEqual(langMini.tf(42), 'n', '`tf` test failed for number');
    assert.strictEqual(langMini.tf('hello'), 's', '`tf` test failed for string');
    assert.strictEqual(langMini.tf(true), 'b', '`tf` test failed for boolean');
    assert.strictEqual(langMini.tf([]), 'a', '`tf` test failed for array');
    assert.strictEqual(langMini.tf({}), 'o', '`tf` test failed for object');
};

/**
 * Test for `deep_sig` function
 * Verifies that it correctly generates deep signatures for various inputs.
 */
const test_deep_sig = () => {
    console.log(`Running test ${++testCounter}: deep_sig - nested structures`);
    const input = { a: [1, { b: true }], c: 'hello' };
    const expected = '{"a":[n,{"b":b}],"c":s}';
    const result = langMini.deep_sig(input);
    assert.strictEqual(result, expected, '`deep_sig` test failed for nested structures');
};

// Run all tests
test_tof();
test_tf();
test_deep_sig();

console.log(`\nCompleted ${testCounter} tests in type-detection-test.js`);