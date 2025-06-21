/*
Multi-Function Polymorphism (mfp)

This module demonstrates the use of mfp, a feature of lang-mini that enables the creation of polymorphic functions. These functions dynamically dispatch based on input signatures, allowing for flexible and reusable function definitions. Key features include:

- Grammar-based parameter validation.
- Support for single and plural forms of parameters.
- Simplified function definitions with integrated dispatch logic.
- Examples include multiplying numbers, checking credentials, and describing arguments.
*/

const lang = require('../lang-mini');
const { each, mfp } = lang;
const { obs } = require('fnl');

const multiply_2_numbers = mfp({
    verb: 'multiply'
}, {
    'n,n': (num1, num2) => num1 * num2
});

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

const describe_arguments = mfp({
    name: 'describe_arguments',
    return_type: 'string'
}, {
    's': (str) => `You have called describe_arguments with a string (sig s), length: ${str.length}`,
    'default': (a, sig) => `No specific handler written when calling with signature: ${sig}`
});

const egs = {
    credentials: () => {
        const r1 = check_credentials(['james', 'hello']);
        const r2 = check_credentials(['root', 'ubuntu']);
        return [r1, r2];
    },
    multiply_2_numbers: () => multiply_2_numbers(5, 6),
    describe_arguments: () => {
        const r1 = describe_arguments('hello');
        const r2 = describe_arguments(['hello', 'world']);
        return [r1, r2];
    }
};

const run_all = (items) => {
    return obs((next, complete, error) => {
        each(items, (item, name, stop) => {
            if (name[0] !== '_') {
                try {
                    const res = item();
                    next({ name, res });
                } catch (err) {
                    error(err);
                    stop();
                }
            }
        });
        complete();
    });
};

if (require.main === module) {
    const o_run_all = run_all(egs);
    o_run_all.on('next', (data) => console.log('data', data));
    o_run_all.on('error', (err) => console.log('error', err));
    o_run_all.on('complete', () => console.log('example run complete'));
}

module.exports = egs;



