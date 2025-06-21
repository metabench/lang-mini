const lang = require('../lang-mini');

const { deep_sig } = lang;

// Example 1: Simple object
const obj1 = { a: 1, b: [2, 3] };
console.log('Example 1:', deep_sig(obj1));
// Expected Output: '{"a":n,"b":[n,n]}'

// Example 2: Nested object
const obj2 = { x: { y: { z: 3 } } };
console.log('Example 2:', deep_sig(obj2));
// Expected Output: '{"x":{"y":{"z":n}}}'

// Example 3: Array of objects
const obj3 = [{ a: 1 }, { b: 2 }];
console.log('Example 3:', deep_sig(obj3));
// Expected Output: '[{"a":n},{"b":n}]'

// Example 4: Mixed types
const obj4 = { a: [1, "string", true], b: null };
console.log('Example 4:', deep_sig(obj4));
// Expected Output: '{"a":[n,s,b],"b":N}'

/*
    Could include the expected results in the examples too.
    Would then make these functions easier to test as well.

    Defining mfp self-contained function?
    // Has no parameters?
    //  Save this idea.

    I'd paused for a while before starting mfp, it's now a lot clearer what API is needed.
    Don't add too much to it.
    Maybe do more on another module / function system that uses mfp and / or ofp.

    the ofp system may be worth doing more work on, making full? use of mfp?
    wrapping mfp functions, while also using mfp for its own implementation.

    

    

*/