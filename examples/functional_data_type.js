
const lang = require('../lib-lang-mini');
const { each, Grammar, deep_sig, tf, tof, mfp, Functional_Data_Type } = lang;


const fdt_int = new Functional_Data_Type({
    name: 'integer',
    abbreviated_name: 'int',
    validate: x => {
        return Number.isInteger(x);
    }
})

let res_val = fdt_int.validate(65.4);
console.log('res_val', res_val);