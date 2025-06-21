# Lang-mini

Lang-mini is a lightweight JavaScript utility library designed to simplify common programming tasks. It provides a variety of utility functions, classes, and tools for functional programming, event handling, and data manipulation. The library is modular and can be used in both Node.js and browser environments.

## Table of Contents

1. [Installation](#installation)
2. [API Documentation](#api-documentation)
   - [Utility Functions](#utility-functions)
     - [`each`](#each)
     - [`is_array`](#is_array)
     - [`deep_sig`](#deep_sig)
     - [`combinations`](#combinations)
     - [`get_truth_map_from_arr`](#get_truth_map_from_arr)
     - [`mfp`](#mfp-multi-function-polymorphism)
     - [`vectorify`](#vectorify)
     - [`distance_between_points`](#distance_between_points)
   - [Classes](#classes)
     - [`Evented_Class`](#evented_class)
     - [`Grammar`](#grammar)
     - [`Functional_Data_Type`](#functional_data_type)
3. [Examples](#examples)
4. [Tests](#tests)

## Installation

Install Lang-mini via npm:

```bash
npm install lang-mini
```

Alternatively, clone the repository and include it in your project:

```bash
# Clone the repository
git clone https://github.com/your-repo/lang-mini.git

# Navigate to the project directory
cd lang-mini
```

## API Documentation

### Utility Functions

| Function Name | Parameters | Returns | Description |
|---------------|------------|---------|-------------|
| `each`        | `collection, fn, context` | `Array` or `Object` | Iterates over a collection (array or object) and applies a function to each element. |
| `is_array`    | `value`    | `Boolean` | Checks if a value is an array. |
| `deep_sig`    | `item, max_depth, depth` | `String` | Generates a deep signature for an object or array. |
| `combinations`| `array`    | `Array`  | Generates all possible combinations of elements from nested arrays. |
| `get_truth_map_from_arr` | `array` | `Object` | Converts an array into a truth map, where each element of the array becomes a key with the value `true`. |
| `vectorify`   | `fn`       | `Function` | Applies a numeric operation to vectors. |
| `distance_between_points` | `points` | `Number` | Calculates the distance between two points. |

### Example Usage

#### `each`

The `each` function iterates over a collection (array or object) and applies a function to each element. It supports both arrays and objects.

```javascript
const lang = require('./lang-mini');
const { each } = lang;

// Example 1: Iterate over an array
const arr = [1, 2, 3];
each(arr, (item) => {
    console.log(item * 2);
});
// Output: 2, 4, 6

// Example 2: Iterate over an object
const obj = { a: 1, b: 2 };
each(obj, (value, key) => {
    console.log(`${key}: ${value}`);
});
// Output: a: 1, b: 2

// Example 3: Collect results from an array
const results = [];
each(arr, (item) => {
    results.push(item * 3);
});
console.log(results);
// Output: [3, 6, 9]
```

#### `is_array`

The `is_array` function checks if a given value is an array.

```javascript
const lang = require('./lang-mini');
const { is_array } = lang;

// Example 1: Check if an array is detected correctly
const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
console.log(is_array(arr)); // Expected Output: true

// Example 2: Check if a non-array is detected correctly
const notArr = true;
console.log(is_array(notArr)); // Expected Output: false

// Example 3: Check an empty array
const emptyArr = [];
console.log(is_array(emptyArr)); // Expected Output: true
```

Expected Output:
```
true
false
true
```

#### `deep_sig`

The `deep_sig` function generates a deep signature for an object or array, representing its structure and data types. This is useful for identifying the shape of data.

```javascript
const lang = require('./lang-mini');
const { deep_sig } = lang;

// Example 1: Simple object
const obj1 = { a: 1, b: [2, 3] };
console.log(deep_sig(obj1));
// Expected Output: '{"a":n,"b":[n,n]}'

// Example 2: Nested object
const obj2 = { x: { y: { z: 3 } } };
console.log(deep_sig(obj2));
// Expected Output: '{"x":{"y":{"z":n}}}'

// Example 3: Array of objects
const obj3 = [{ a: 1 }, { b: 2 }];
console.log(deep_sig(obj3));
// Expected Output: '[{"a":n},{"b":n}]'

// Example 4: Mixed types
const obj4 = { a: [1, "string", true], b: null };
console.log(deep_sig(obj4));
// Expected Output: '{"a":[n,s,b],"b":u}'
```

Expected Output:
```
{"a":n,"b":[n,n]}
{"x":{"y":{"z":n}}}
[{"a":n},{"b":n}]
{"a":[n,s,b],"b":u}
```

#### `combinations`

```javascript
const lang = require('./lang-mini');

// Example 1: Numeric combinations
const input1 = [
    [1, 2, 3],
    [4, 5, 6, 'A', 'B', 'C'],
    [7, 8, 9]
];
console.log(lang.combos(input1));
// Expected Output: All possible combinations of elements from the input arrays.

// Example 2: Hebrew letter combinations
const hebrewLetters = ['י', 'ה', 'ו', 'ל', 'א'];
const input2 = [
    hebrewLetters,
    hebrewLetters,
    hebrewLetters
];
console.log(lang.combos(input2));
// Expected Output: All possible combinations of Hebrew letters.

// Example 3: Ge'ez letter combinations
const geezLetters = ['የ', 'ሀ', 'ወ', 'ለ', 'አ'];
const input3 = [
    geezLetters,
    geezLetters,
    geezLetters
];
console.log(lang.combos(input3));
// Expected Output: All possible combinations of Ge'ez letters.
```

Expected Output:
```
[ [1, 4, 7], [1, 4, 8], [1, 4, 9], ... ]
[ ['י', 'י', 'י'], ['י', 'י', 'ה'], ... ]
[ ['የ', 'የ', 'የ'], ['የ', 'የ', 'ሀ'], ... ]
```

### `get_truth_map_from_arr`

The `get_truth_map_from_arr` function converts an array into a truth map, where each element of the array becomes a key with the value `true`.

```javascript
const lang = require('./lang-mini');
const { get_truth_map_from_arr } = lang;

// Example: Convert an array to a truth map
const arr = ['a', 'b', 'c'];
const truthMap = get_truth_map_from_arr(arr);
console.log(truthMap);
// Expected Output: { a: true, b: true, c: true }
```

### `mfp` (Multi-Function Polymorphism)

`mfp` allows you to define polymorphic functions that dynamically dispatch based on the input signature. It simplifies the creation of flexible and reusable functions.

#### Example Usage

```javascript
const lang = require('./lang-mini');
const { mfp } = lang;

// Example 1: Multiply two numbers
const multiply_2_numbers = mfp({
    verb: 'multiply'
}, {
    'n,n': (num1, num2) => num1 * num2
});

console.log(multiply_2_numbers(5, 6)); // Expected Output: 30

// Example 2: Check credentials
const check_credentials = mfp({
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

console.log(check_credentials(['root', 'ubuntu'])); // Expected Output: true
console.log(check_credentials(['james', 'hello'])); // Expected Output: false

// Example 3: Describe arguments
const describe_arguments = mfp({
    name: 'describe_arguments',
    return_type: 'string'
}, {
    's': (str) => `You have called describe_arguments with a string (sig s), length: ${str.length}`,
    'default': (a, sig) => `No specific handler written when calling with signature: ${sig}`
});

console.log(describe_arguments('hello')); // Expected Output: You have called describe_arguments with a string (sig s), length: 5
console.log(describe_arguments(['hello', 'world'])); // Expected Output: No specific handler written when calling with signature: [s,s]
```

Expected Output:
```
30
true
false
You have called describe_arguments with a string (sig s), length: 5
No specific handler written when calling with signature: [s,s]
```

#### `vectorify`

The `vectorify` function applies a numeric operation to vectors.

```javascript
const lang = require('./lang-mini');
const { vectorify } = lang;

// Example: Add two vectors
const add = vectorify((a, b) => a + b);
console.log(add([1, 2], [3, 4])); // Expected Output: [4, 6]
```

#### `distance_between_points`

The `distance_between_points` function calculates the distance between two points.

```javascript
const lang = require('./lang-mini');
const { distance_between_points } = lang;

// Example: Calculate distance between two points
const points = [[0, 0], [3, 4]];
console.log(distance_between_points(points)); // Expected Output: 5
```

## Classes

### `Evented_Class`

`Evented_Class` is a lightweight event emitter that allows you to add, remove, and trigger events.

#### Methods

| Method Name       | Parameters         | Returns  | Description |
|-------------------|--------------------|----------|-------------|
| `on`             | `event, listener` | `void`   | Adds an event listener. |
| `raise`          | `event, data`     | `void`   | Triggers an event with optional data. |

#### Example Usage

```javascript
const lang = require('./lang-mini');

const ec = new lang.Evented_Class();
ec.on('greet', (data) => {
    console.log(`Hello, ${data.name}!`);
});

ec.raise('greet', { name: 'Alice' });
// Output: Hello, Alice!

// Example with multiple events
ec.on('next', (data) => {
    console.log('Next event data:', data);
});

ec.raise('next', 'hello');
// Output: Next event data: hello

ec.raise('next', { name: 'data', value: 'hello' });
// Output: Next event data: { name: 'data', value: 'hello' }
```

### `Grammar`

`Grammar` provides tools for defining and validating structured data types. It allows you to define grammars for specific use cases and recognize data structures based on those definitions.

#### Example Usage

```javascript
const lang = require('./lang-mini');
const { Grammar } = lang;

// Define a grammar for user authentication
const ua_grammar = new Grammar({
    name: 'User Authentication',
    def: {
        username: {
            def: 'string',
            plural: 'usernames'
        },
        password: {
            def: 'string',
            plural: 'passwords'
        },
        user_login: {
            def: ['username', 'password'],
            plural: 'user_logins'
        }
    }
});

// Example 1: Recognize a single user login
const singleLogin = ['james', 'password123'];
console.log(ua_grammar.tof(singleLogin));
// Expected Output: 'user_login'

// Example 2: Recognize multiple user logins
const multipleLogins = [
    ['admin', 'admin123'],
    ['james', 'password123']
];
console.log(ua_grammar.tof(multipleLogins));
// Expected Output: 'user_logins'

// Example 3: Generate a signature for user data
const userData = {
    users: [
        ['admin', 'admin123'],
        ['james', 'password123']
    ]
};
console.log(ua_grammar.sig(userData));
// Expected Output: '{"users":user_logins}'
```

Expected Output:
```
user_login
user_logins
{"users":user_logins}
```

### `Functional_Data_Type`

`Functional_Data_Type` allows you to define and validate custom data types with specific rules.

#### Example Usage

```javascript
const lang = require('./lang-mini');
const { Functional_Data_Type } = lang;

// Example 1: Integer validation
const fdt_int = new Functional_Data_Type({
    name: 'integer',
    abbreviated_name: 'int',
    validate: x => Number.isInteger(x)
});

console.log(fdt_int.validate(65)); // Expected Output: true
console.log(fdt_int.validate(65.4)); // Expected Output: false

// Example 2: Latitude/Longitude validation
const fdt_lat_long = new Functional_Data_Type({
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

console.log(fdt_lat_long.validate([45, 90])); // Expected Output: true
console.log(fdt_lat_long.validate([100, 200])); // Expected Output: false
```

Expected Output:
```
true
false
true
false
```

## Examples

Examples for each function and class are provided in the `examples/` directory. For instance:

- `examples/each.js` demonstrates the `each` function.
- `examples/is_array.js` demonstrates the `is_array` function.
- `examples/mfp.js` demonstrates the `mfp` function.

## Tests

Tests for the library are located in the `tests/` directory. To run the tests, use:

```bash
npm test
```

Example test file: `tests/all-test.js`

```javascript
const assert = require('assert');
const langMini = require('../lang-mini');

// Example test for a function in lang-mini.js
try {
    assert.strictEqual(langMini.someFunction(2, 3), 5, 'someFunction should return the sum of two numbers');
    console.log('Test passed: someFunction correctly adds two numbers.');
} catch (error) {
    console.error('Test failed:', error.message);
}

// Add more tests as needed for other functions and modules.
```

Refer to `tests/new-tests.js` for additional test cases.
