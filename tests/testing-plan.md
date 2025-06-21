# Lang-Mini Testing Notes

## Test Organization Plan

1. Create specific test files for each major feature category:
   - `core-utils-test.js`: Basic utility functions (each, is_array, clone, etc.)
   - `functional-programming-test.js`: FP tools (fp, mfp, vectorify, etc.)
   - `collections-test.js`: Collection manipulation (combinations, arr_like_to_arr, etc.)
   - `data-types-test.js`: Data Type functionality (Functional_Data_Type, etc.)
   - `events-test.js`: Event handling (Evented_Class, eventify, etc.)
   - `type-detection-test.js`: Type utilities (tof, tf, deep_sig, etc.)

2. Ensure each test file:
   - Has numbered tests with descriptive names
   - Includes clear explanation of what's being tested
   - Verifies edge cases and standard use cases

## Coverage Analysis

Current incomplete/underdeveloped features:
- Data binding code in `field` and `prop` functions appears incomplete
- Some Grammar class functionality may be unstable
- The Functional_Data_Type.parse_string method has incomplete implementation
- Publisher class is minimally tested

## Notes on Incomplete Features

### Data Binding (field/prop)
The data binding system using `field` and `prop` functions has incomplete validation logic and potential bugs:
- Type validation could be enhanced
- Error handling is minimal 
- Performance testing needed

### Grammar Class
The Grammar class appears to be a work in progress:
- Complex nested grammars not fully tested
- Error handling is minimal
- Documentation is sparse

### Data Types
Functional_Data_Type could be expanded:
- parse_string methods have incomplete implementation
- Validation is simple and could be extended
- Composition of types not fully implemented

## Next Steps

1. Create the structured test files
2. Implement comprehensive tests for core features
3. Add targeted tests for edge cases
4. Document unclear or complex functionality
5. Identify and prioritize incomplete features for improvement