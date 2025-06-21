const assert = require('assert');
const langMini = require('../lang-mini');

/**
 * Events Tests
 * These tests verify the event handling functionality in lang-mini.
 */

// Test counter for tracking progress
let testCounter = 0;

/**
 * Test for `Evented_Class` event handling
 * Verifies that events can be raised and listened to correctly.
 */
const test_evented_class = () => {
    console.log(`Running test ${++testCounter}: Evented_Class - basic event handling`);
    const ec = new langMini.Evented_Class();
    let eventData = null;

    ec.on('testEvent', (data) => {
        eventData = data;
    });

    ec.raise('testEvent', 'Hello, World!');
    assert.strictEqual(eventData, 'Hello, World!', 'Evented_Class test failed for basic event handling');

    console.log(`Running test ${++testCounter}: Evented_Class - multiple listeners`);
    let counter = 0;
    ec.on('increment', () => counter++);
    ec.on('increment', () => counter++);

    ec.raise('increment');
    assert.strictEqual(counter, 2, 'Evented_Class test failed for multiple listeners');
};

/**
 * Test for `eventify` function
 * Verifies that objects can be eventified and handle events correctly.
 */
const test_eventify = () => {
    console.log(`Running test ${++testCounter}: eventify - basic usage`);
    const obj = {};
    langMini.eventify(obj);

    let eventData = null;
    obj.on('testEvent', (data) => {
        eventData = data;
    });

    obj.raise('testEvent', 'Eventified!');
    assert.strictEqual(eventData, 'Eventified!', '`eventify` test failed for basic usage');
};

// Run all tests
test_evented_class();
test_eventify();

console.log(`\nCompleted ${testCounter} tests in events-test.js`);