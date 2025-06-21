const lang = require('../lib-lang-mini');
const { each, get_a_sig, Grammar, deep_sig, tf, tof, mfp, Functional_Data_Type } = lang;

// Example 1: Integer validation
const fdt_int = new Functional_Data_Type({
    name: 'integer',
    abbreviated_name: 'int',
    validate: x => Number.isInteger(x)
});

console.log('Example 1:', fdt_int.validate(65)); // Expected Output: true
console.log('Example 1:', fdt_int.validate(65.4)); // Expected Output: false

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

console.log('Example 2:', fdt_lat_long.validate([45, 90])); // Expected Output: true
console.log('Example 2:', fdt_lat_long.validate([100, 200])); // Expected Output: false

