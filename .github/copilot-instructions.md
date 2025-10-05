# AI Coding Agent Instructions for lang-mini

## Project Overview
`lang-mini` is a lightweight JavaScript utility library for functional programming, event handling, and data manipulation. It works in both Node.js and browser environments. The library emphasizes polymorphic functions, type validation, and event-driven patterns.

## Architecture & Key Components

### Core Module Structure
- **Single-file library**: `lang-mini.js` (~2850 lines) contains all functionality
- **Dual environment**: Runtime detection via `running_in_browser` / `running_in_node`
- **Export module**: `lib-lang-mini.js` re-exports functions for external use
- **No external dependencies** in production (only `fnl` for dev)

### Major Feature Categories
1. **Core Utilities** (`each`, `is_array`, `clone`, `get_truth_map_from_arr`)
2. **Functional Programming** (`fp`, `mfp`, `vectorify`, `distance_between_points`)
3. **Type System** (`tof`, `tf`, `deep_sig`, `Functional_Data_Type`)
4. **Event Handling** (`Evented_Class`, `eventify`)
5. **Data Binding** (`field`, `prop` - requires eventified objects)
6. **Grammar & Validation** (`Grammar` class for structured data recognition)

## Critical Conventions

### Testing Philosophy
- **Test frameworks**: Jest for modern tests (`.test.js` files), legacy custom runner for older tests
- **Test organization**: Separate files by feature category in `tests/` directory
  - `core-utils-test.js`, `functional-programming-test.js`, `collections-test.js`, etc.
- **Jest setup**: Configured in `jest.config.js`, runs all `*.test.js` files
- **Legacy test format**: Custom numbered tests with `✓`/`✗` logging
- **Error handling**: Wrap tests in `runTest()` helper with try-catch (legacy tests)
- **Test summary**: Display passed/failed counts and success rate at end
- **Exit codes**: Exit with code 1 if any tests fail (for CI/CD)

Example Jest test structure:
```javascript
describe('Feature Name', () => {
    test('specific behavior description', () => {
        const result = langMini.someFunction(input);
        expect(result).toBe(expected);
    });
});
```

Example legacy test structure:
```javascript
let testCounter = 0, passedTests = 0, failedTests = 0;
const runTest = (testName, testFn) => {
    try {
        testFn();
        console.log(`✓ Test ${++testCounter}: ${testName} - PASSED`);
        passedTests++;
    } catch (error) {
        console.log(`✗ Test ${++testCounter}: ${testName} - FAILED`);
        console.error(`  Error: ${error.message}`);
        failedTests++;
    }
};
```

### Code Modification Rules (CRITICAL)
- **DO NOT modify library functions** in `lang-mini.js` during testing phases
- **Document issues** in `AI-NOTES.md` instead of fixing them immediately
- **Only fix syntax errors** or conclusively proven bugs with approval
- **Add attribution comments** when implementing NYI (Not Yet Implemented) sections:
  ```javascript
  // Implementation added by GitHub Copilot
  ```

### Type System Patterns
- **Type signatures**: Short codes (`n`=number, `s`=string, `a`=array, `o`=object, `b`=boolean, `u`=undefined/null)
- **Polymorphic dispatch**: `mfp()` routes by signature strings like `'n,n'` or `'s,s'`
- **Deep signatures**: `deep_sig()` recursively generates structure fingerprints: `'{"a":n,"b":[n,n]}'`

### Event System Requirements
- **Objects must be eventified**: Use `langMini.eventify(obj)` before using `field()` or `prop()`
- **Event raising**: Eventified objects have `.raise(eventName, data)` method
- **Change events**: Property setters automatically raise `'change'` events with old/new values

### Data Validation Approach
- **Functional_Data_Type**: Define validation with `validate` function and optional `parse_string`
- **Field binding**: `field(obj, name, type, default)` creates validated properties
- **Parse-then-validate**: String values are parsed before validation if `parse_string` exists

### Grammar System (Work in Progress)
- **Grammar class**: Defines structured data types with validation rules
- **Type inference**: `tof()` identifies types, `sig()` generates signatures for data structures
- **Plural/singular forms**: Grammar definitions support both forms automatically
- **Resolution**: `resolved_def_to_sig()` recursively processes grammar definitions into signatures
- **Status**: API and documentation are evolving - expect changes and incomplete features
- **NYI sections**: Several methods throw `'NYI'` and need implementation

Example grammar pattern:
```javascript
const grammar = new Grammar({
    name: 'User Authentication',
    def: {
        username: { def: 'string', plural: 'usernames' },
        password: { def: 'string', plural: 'passwords' },
        user_login: { def: ['username', 'password'], plural: 'user_logins' }
    }
});
grammar.tof(['admin', 'pass123']); // Returns: 'user_login'
```

### Module Exports (`lib-lang-mini.js`)
- **Re-export pattern**: `lib-lang-mini.js` selectively exports functions from `lang-mini.js`
- **Public API**: Only exported functions are part of the public API
- **Direct access**: In tests, require `lang-mini.js` directly for internal testing
- **Export list**: Check `lib-lang-mini.js` to see which functions are public vs internal

## Development Workflows

### Running Tests
```bash
npm test  # Runs all test suites
npm run test:jest  # Runs Jest tests specifically
node tests/core-utils-test.js  # Run individual legacy test file
```

### Test Development Cycle
1. Read existing implementation in `lang-mini.js`
2. Write comprehensive tests covering edge cases
3. Document behavior in `AI-NOTES.md`
4. Run tests and verify output
5. Only propose fixes if behavior is clearly incorrect

### Adding New Tests
1. Create test file in `tests/` directory with `.test.js` extension for Jest
2. Use Jest's `describe()` and `test()` or `it()` for test organization
3. Test both success and failure paths
4. Include edge cases: empty inputs, null, undefined, type mismatches
5. For legacy tests, follow the `runTest()` pattern with numbered tests

### Publishing & Deployment
- **Version**: Managed in `package.json` (currently 0.0.40)
- **NPM publishing**: Run `npm publish` after version bump
- **Pre-publish checklist**:
  1. Run full test suite (`npm test`)
  2. Update version in `package.json`
  3. Update `README.md` if API changes
  4. Document changes in release notes
  5. Ensure `lib-lang-mini.js` exports are up to date

### Performance Benchmarking Preparation
- **Benchmark location**: Create `benchmarks/` directory for performance tests
- **Key areas to benchmark**:
  - `combinations()` with large arrays
  - `deep_sig()` with deeply nested structures
  - `each()` with large collections
  - `mfp()` polymorphic dispatch overhead
  - `Grammar` type resolution speed
- **Tools**: Consider using `benchmark.js` or Node's `perf_hooks`
- **Baseline**: Establish performance baselines before optimization
- **Documentation**: Record benchmark results in `benchmarks/results.md`

## Common Pitfalls

1. **Non-eventified objects**: Calling `field()` on plain objects throws "raise is not a function"
   - Solution: Always `eventify()` objects first
   
2. **Empty arrays in combinations**: `combinations([[], [1,2]])` returns `[]` (by design after fix)

3. **Grammar NYI sections**: Some `Grammar` methods throw `'NYI'` - these need implementation

4. **Parse string validation**: In `Functional_Data_Type.parse_string`, always validate parsed value matches original:
   ```javascript
   parse_string: (str) => {
       const parsed = parseInt(str, 10);
       return (!isNaN(parsed) && parsed.toString() === str) ? parsed : undefined;
   }
   ```

5. **Signature inference**: `mfp()` auto-detects types but requires exact matches - `'n,n'` won't match `'s,s'`

## Key Files Reference
- `lang-mini.js`: Main library implementation
- `lib-lang-mini.js`: Module exports
- `AI-NOTES.md`: Implementation notes and observations
- `tests/testing-plan.md`: Testing strategy and coverage gaps
- `README.md`: Public API documentation with examples
- `examples/`: Working code samples for each feature

## When Making Changes
1. Check `AI-NOTES.md` for known issues and current development stage
2. Verify test coverage exists before modifying behavior
3. Add tests first, then fix (if approved to fix)
4. Update documentation in parallel with code changes
5. Maintain backward compatibility unless explicitly requested otherwise
