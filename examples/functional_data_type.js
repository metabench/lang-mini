
const lang = require('../lib-lang-mini');
const { each, get_a_sig, Grammar, deep_sig, tf, tof, mfp, Functional_Data_Type } = lang;


const fdt_int = new Functional_Data_Type({
    name: 'integer',
    abbreviated_name: 'int',
    validate: x => {
        return Number.isInteger(x);
    }
})

let res_val = fdt_int.validate(65.4);
console.log('res_val', res_val);


// could (maybe) use this to make more detailed FDTs.
//   May be OK so long as the functions for the data type work - would not need to get into detailed definitions, grammar etc.
//     Could be a relatively easy way to start doing this, likely not the most optimal in the longer run.

// Validating may be the main thing???
//   Maybe parsing from string as well.
//     To / from string, and js objects / classes that represent the type?
//     Want to support classes that define types, but not rely only on them, making use of signatures would be very useful too.

// Registering types within lang-mini and later jsgui will help with the signatures and abbreviations.


// parse_string.

// maybe just call it parse(...a)
///   fp and mfp could work as well here.


const fdt_lat_long = new Functional_Data_Type({
    name: '[latitude, longitude]',
    validate: x => {
        const tx = tof(x);
        // or get the sig.

        const sig_x = get_a_sig(x);

        console.log('tx', tx);
        console.log('sig_x', sig_x);

        console.trace();
        throw 'stop';
    }
});

