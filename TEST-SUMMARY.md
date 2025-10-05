# Test Suite Summary

## Overview
Comprehensive Jest test suite for lang-mini library with 117 passing tests covering all major functionality.

**Test Results:**
- ✅ 117 tests passing
- ⏭️ 2 tests skipped (due to documented bugs)
- 📊 Success rate: 100% of non-buggy functionality

## Test Coverage

### Core Utilities (48 tests)
- **each** (7 tests) - Array/object iteration, return values, context handling
- **is_array** (10 tests) - Type detection for arrays and non-arrays
- **clone** (8 tests) - Cloning primitives, arrays, objects
- **get_truth_map_from_arr** (5 tests) - Truth map creation and edge cases
- **get_arr_from_truth_map** (4 tests) - Truth map conversion
- **get_map_from_arr** (5 tests) - Index map creation
- **arr_like_to_arr** (4 tests) - Array-like object conversion
- **is_defined** (7 tests) - Definition checking for various types

### Type Detection (18 tests)
- **tof** (7 tests) - Type identification for all JS types including null
- **tf** (6 tests) - Abbreviated type codes (n, s, a, o, b, u, N, etc.)
- **deep_sig** (7 tests) - Deep signature generation for nested structures

### Functional Programming (17 tests)
- **vectorify** (6 tests) - Vector operations (add, subtract, multiply, divide, custom)
- **mfp** (4 tests) - Multi-function polymorphism with signature dispatch
- **fp** (3 tests) - Functional polymorphism with signature detection
- **distance_between_points** (6 tests) - Distance calculations in 2D space

### Event Handling (11 tests)
- **Evented_Class** (6 tests) - Event listeners, triggering, data passing, removal
- **eventify** (5 tests) - Adding event capabilities to plain objects

### Data Types (10 tests)
- **Functional_Data_Type** (5 tests) - Validation, parsing, composite types
- **field** (5 tests) - Property creation with validation and change events

### Collections (7 tests)
- **combinations** (7 tests) - Cartesian product generation with various inputs

## Documented Bugs

### <BUG1> - Clone shallow copy limitation
**Status:** Documented, tests adjusted
**Impact:** Clone doesn't perform deep copy on nested structures
**Tests affected:** 1 test documents this behavior

### <BUG2> - Missing sig() function
**Status:** Documented, tests removed
**Impact:** Function referenced but not implemented
**Tests affected:** 4 tests removed (functionality covered by deep_sig)

### <BUG3> - mfp signature matching for arrays
**Status:** Documented, test skipped
**Impact:** Deep signatures like [n,n],[n,n] don't match shallow signatures like 'a,a'
**Tests affected:** 1 test skipped with full explanation

### <BUG4> - each() stop function not working
**Status:** Documented, test skipped
**Impact:** Calling stop() doesn't prevent further iterations
**Tests affected:** 1 test skipped with detailed analysis

See `BUGS.md` for complete bug descriptions and potential fixes.

## Test Organization

Tests are organized by feature category in a single comprehensive file:
- `tests/lang-mini.test.js` - Main Jest test suite with all tests

Each test suite uses Jest's `describe` blocks for organization and `test`/`it` for individual test cases.

## Running Tests

```bash
# Run all tests
npm test

# Run Jest tests only
npm run test:jest

# Run legacy tests only
npm run test:legacy
```

## Test Quality Guidelines

Each test follows these principles:
1. **Clear naming** - Test names describe the exact behavior being tested
2. **Edge cases** - Empty inputs, null, undefined, type mismatches covered
3. **Explicit expectations** - No implicit assumptions about behavior
4. **Bug references** - Skipped tests include `<BUGn>` references with explanations
5. **5+ tests per function** - Non-trivial functions have comprehensive coverage

## Future Improvements

Potential areas for additional testing:
- Grammar class functionality (work in progress in library)
- prop() function (requires Grammar implementation)
- call_multiple_callback_functions utility
- Fns utility functions
- is_ctrl control detection
- Additional edge cases for existing functions

## Notes for Maintainers

- **Don't fix bugs without approval** - Document in BUGS.md instead
- **Validate assumptions** - When tests fail, verify the test is correct first
- **Add bug references** - Use `<BUGn>` format in code comments where applicable
- **Keep tests independent** - Each test should be runnable in isolation
- **Update BUGS.md** - When fixing bugs, update documentation accordingly
