/*
    Multi-Function Polymorphism


    For the moment will be a feature of lang-mini
    Could be put into its own module.

    Seems that these test runs rely on observable.

*/

const lang = require('../lang-mini');
const {each, mfp} = lang;
const {obs} = require('fnl');

// Possibility of using grammar with Data_Object and Data_Value.
//   Though does look like it's worth approaching it from a point of simplicity and efficiency too.
//     Efficiency is more important, simplicity can be in an easy and efficient high level API.

// And if it gets called with the wrong data types....?

const multiply_2_numbers = mfp({
    // could name the params?
    verb: 'multiply'
}, {
    // name the params here?
    //  it can parse these keys here, not take them directly.
    'n,n': (num1, num2) => {
        return num1 * num2;
    }
});



// credentials is a somewhat long example.
//  was made to fit a purpose.



// An examples framework, so they can be sloted into a testing framework?
//  Not yet. May use the platform I'm making now.




// named examples

//  demonstrating and testing for specific things...
//  need to do more on this before continuing the CMS.
//   


// setting up, and calling different mfp functions, doing different things.

// using locally defined object templates.


// functions that can be written with multiple internal functions that get called polymorphically depending on parameters used.
//  a system of writing polymorphic functions
//  has an integrated function dispacher.

// more friendly polymorphism


// The examples and tests will be very useful.
// Do want some kind of integrated test suite.
//  Possibly pre-publish.

// Pre return type testing, with runtime errors?
//  Typescript would probably be better.

// return_type_name?
//  the actual types in JavaScript?
//   not always so easy to express when it's compound.
// keep return_type as a string for the moment. maybe call it return_type_name? .rtn? .r?
//  return_type may be very useful for identifying functions that return observables.


// Interpreted types?
// Interpretated standard object types?
// POJO typing.

// Typed POJOs?
// POJO typed inference?

// is_pojo function?

// a 'pojo' type name?
// differentiation between pojos and non-pojos?

// for the moment, won't focus on pojos, but on recognising the basic types, and having local (to start with) object (template?) definitions?
//  compound object definitions?
//  object definitions?
//  array definitions?
//  type definitions?

// defining types representing username, password, credentials (which combines them)
//  defining and using such objects. functions that need credentials, and have flexibility in how they are given.


// .types({...})

// a grammar that is local to the function (execution scope)

//  single function mode... where there is only one set of params
//   the params given are rearranged if necessary and possible.


// Do also want function redirects based on parameters?

//  Function grammar is definitely an important thing to consider

// It needs to be concise
//  It cant take a lot of code to process.
//  

// Will definitely cut down on boilerplate and allow for some more flexibility in coding.
//  Will make documentation much easier through reflection / looking at the function objects when loaded.
//  Automated testing of some kind?
//   Where functions can be called with the param types that they say they can accept.
//    Checking the return types too.

// Explicit function grammar mixed with polymorphism will be very useful.
//  Deep signatures seem important now.


// Possibly make this function async?

// Creating a new type module may help most...?
//   Though having it in lang-mini should be fine.





const old = () => {

    // Function that defines an interface essentially.
    //   Fixed input and return types.



        
    const check_credentials = mfp({
        'name': 'check_credentials',
        // could be derived???
        'verb': 'check',
        //'noun': 'credentials',
        // something like grammar?
        //  
        // one idea for the gammar.
        //  maybe too complex. leave aliases for the moment.

        // A simpler / less ambiguous grammar system would help.
        //  everything declared as strings would be useful.
        //  'username|user': 'string'
        //  would help to declare aliases there
        //   being able to give the params as an object would help.
        //    allow both array and object.
        //    will generally allow more flexible function calls.
        //     ffc?
        //    

        // Leave this for the moment.
        //  Examples could be places for accumulation of idea comments.

        /// *
        //'grammar': {
        //    'username': ['string', ['user']],
        //    'password': ['string', ['pwd']],
        //    //'credentials': '[username, password]'
        //    'credentials': [['username', 'password']]
        //},
        //* /

        /// *
        //'grammar': {

        //}
        //* /

        // best way to define the grammar?
        //  allow more than one?

        // This grammar object is very simple and easy to understand.

        // Definition of single and plural words here?
        //  Or not needed?

        // marking functions as .single and .plural will help a lot.

        // Plain object definitions:
        //  make it a module?
        //  explicit grammar itself?

        // a grammar for the grammar...
        //  use bnf or similar?

        // defining it all as strings helps to keep it simple.

        // these are nouns....
        //  having some grammar capabilities will help, but it's not needed to make it very comprehensive in modelling speech.

        // and defining constraints here could work....
        //  such as a function that gets called on a parameter before the function gets called.
        //   once the param has satisfied any type check.

        'grammar': {
            username: 'string',
            password: 'string',
            credentials: '[username, password]' // user_credential_set really in the singular
            //credentials: 'array(2)' // ???  array(username, password)???
            //credentials: ['username', 'password'] // could be reduced to ['string', 'string']
        },
        // I think a grammar obj would be clearer.
        //  not having to use trees to describe the object definitions.

        'noun': 'credentials', // much more useful / fast use of noun lookup. 
        // Really simple way of defining the grammar.
        //  As an object tree.
        '_noun': {
            // defining it as an array this way?
            //  could be risky.
            //'credentials': ['string username', 'string password'];

            // but how to say it's an array?

            //  or that we want it be in an array in a given order?

            /// *
            //'credentials': {
            //    'username': 'string',
            //    'password': 'string'
            //}
            //* /

            // Needs to understand this as an array.
            //  especially when we have a single function that only accepts one form.
            //  could make use of a specific single form function definition.

            // objects and arrays in the definition tree do work, I think.
            //  This seems like an OK way to define credentials.
            //   need to do some string parsing and processing.

            // Or in a more parsed form?



            // ??? 
            '_credentials': [['username', 'string'], ['password', 'string']],
            '_credentials': '[s,s]', // that may be all we need?

        'credentials': ['username string', 'password string']

        // It's hard to avoid ambiguities when trying to make conventions involving js arrays.
        },

        'single': true, // makes more sense here... checks a single pair of credentials
        'return_type': 'boolean'
    }, (arr_credentials) => {
        // This is really single function polymorphism.
        //  Maybe shouldnt be in mfp?
        //  Or not such a priority?

        // It's modern function poly at least.
        //  Single running function
        //  Call it with the param type given in 'noun'.

        // be able to call this with an array of both username and password
        //  because that matches the credentials template
        //  

        const [username, password] = arr_credentials;
        if (username === 'root') {
            if (password === 'ubuntu') {
                return true;
            }
        } else {
            
        }
        return false;
    });
}



// verb_noun_fn?
//  vn?
//  vn(...)


// using mfp without defining the grammar
//  or a massive shorthand?
//   don't need to always name params too.

// grammar is useful for how objects can be represented in different ways as JSON / JS objects.




const egs = {

    // Looking into arrays as 'standard object templates' would be a good thing too.
    //  want this to be both clear and widely expressive.
    //  being able to recognise arrays sharing a type
    //  being able to (temporarily) treat an array such as [s,s] as username, password

    'credentials': () => {

        // Using grammar with mfp seems fairly useful / interesting.
        //   a kind of grammar specified functional programming system.
        

        const check_credentials = mfp({
            'name': 'check_credentials',
            'verb': 'check',
            'grammar': {
                username: 'string',
                password: 'string',
                credentials: '[username, password]' // user_credential_set really in the singular
                //credentials: 'array(2)' // ???  array(username, password)???
                //credentials: ['username', 'password'] // could be reduced to ['string', 'string']
            },
            // I think a grammar obj would be clearer.
            //  not having to use trees to describe the object definitions.
            'noun': 'credentials',
            'single': true, // makes more sense here... checks a single pair of credentials
            'pure': true,
            'return_type': 'boolean'
        }, (arr_credentials) => {
            const [username, password] = arr_credentials;
            //console.log('[username, password]', [username, password]);
            if (username === 'root') {
                if (password === 'ubuntu') {
                    return true;
                }
            } else {
                
            }
            return false;
        });

        //console.trace();
        //throw 'stop';

        //let res = [];


        let r1 = check_credentials(['james', 'hello']);
        // seems to be working:)



        //console.log('r1', r1);

        let r2 = check_credentials(['root', 'ubuntu']);
        // seems to be working:)

        

        //console.log('**** r2', r2);

        return [r1, r2];
    },



    //  defining string parameters
    //  defining typed parameters

    // defining return type.

    // multiply?
    //  multiplies all the params together

    // any number of params, all params need to be numbers
    //  essentially an array of numbers
    //   but it's the arguments object, and it will get turned into such an array / called as appropriate with the arguments object.


    'multiply_2_numbers': () => {


        // simple way of restricting allowed params.
        //  uses the deep sig though.

        // maybe shallow sig notation would work too.
        //  could have flexi parsing.


        // want to share example functions in various places
        //  the mfp multiply 2 numbers would be nice to use in other places as a building block.

        // This seems like it could be used for functional data type validation.

        // define a type validation and maybe parsing using mfp.
        //   a simple API around validation and parsing.
        //   toUInt8Array, fromUInt8Array   -   Binary (serialisation) options (too)
        //    getUIntArraySerialisationInfo ....
        









        const m2nres = multiply_2_numbers(5, 6);

        return m2nres;
    },




    'describe_arguments': () => {
                
        // Function boilerplate?

        // 10/06/2019 - this is working well!
        //  It's fine for the mfp function to be fairly long. It will help other functions be shorter. More reliable even, less space for implementation errors.

        // Function boilerplate?

        // 10/06/2019 - this is working well!
        //  It's fine for the mfp function to be fairly long. It will help other functions be shorter. More reliable even, less space for implementation errors.

        const describe_arguments = mfp({
            'name': 'describe_arguments',
            'verb': 'describe',
            'single': true, // meaning the singular version of the function. maybe irrelevant in many cases.
            'pure': true,
            'return_type': 'string'
        }, {
            // Not including the outer []. Using deep_sig system.
            //  Code may look less cool, but will take less space, be simpler.
            //   Possibly be clearer, more intuitive.
            's': (str) => {
                //console.log('called with [s]');
                return `You have called describe_arguments with a string (sig s), length: ${str.length}`
                //console.log('You have called describe_params with a string (sig [s])')
            },
            'default': (a, sig) => {
                //console.log('called with default');
                return `No specific handler written when calling with signature: ${sig}`;
            }
        });



        // mfp should assign the function name if given.
        console.log('');
        console.log('describe_arguments.name', describe_arguments.name);
        console.log('describe_arguments.single', describe_arguments.single);
        console.log('describe_arguments.pure', describe_arguments.pure);
        console.log('describe_arguments.return_type', describe_arguments.return_type);

        let res = [];

        // some inspection of the function here?
        //  be able to access the grammar?

        //  then grammar.parse(...)?
        //   could be a useful / interesting function for testing.
        //   

        // look into mfp to see that the different function calls get set up OK.
        //  first with describe_params
        //  then with 

        console.log('\n------ describe_arguments Setup Done -----\n')

        const r1 = describe_arguments('hello');
        console.log('r1', r1);
        res.push(r1);

        // nice, not describing it with the [] outer brackets.
        //  for the moment not using () brackets either - not so sure they are useful or needed.
        const r2 = describe_arguments('hello', 'world');
        console.log('r2', r2);
        res.push(r2);

        const r3 = describe_arguments(['hello', 'world']);
        console.log('r3', r3);
        res.push(r3);

        // very nice, seems to be working well.
        //  more example running code would help.
        //  maybe use mfp etc for that when it's ready.

        // at least mfp seems to be working fine again, different sig defs now.
        //  update obspool?

        // further testing and work?

        /*
        // 
        const r1 = describe_params('hello');
        console.log('r1', r1);
        //console.trace();
        //throw 'stop';

        res.push(r1);
        res.push(describe_params('hello', 'world'));
        res.push(describe_params(['hello', 'world']));

        */
        return res;
    }

    /*
    
    '0 to 9': () => {
        const arr = constants.arr['0 to 9'];
        //console.log('arr', arr);

        let res = [];
        each(arr, item => res.push(item));
        return res;
    }

    */
}

// seems like it could be useful...
//  run all functions in object / array, send results to obs

// Items is a very good general name that is not signifying object / array.

// Observables could be very useful for non-async functions.
//  A way of running multiple functions with a single statement.


// run_all is just the kind of thing the platform will provide in the future.
//  for the moment, copy and paste it between examples.

// Return observable instead?

// Observable functions runner.

// some kind of run(x) function
//  within the observables toolkit.


const run_all = (items) => {
    // shouldnt use each?

    // Itself makes use of mfp, I think.
    //  obs using mfp?
    //  need to be careful.

    return obs((next, complete, error) => {
        console.log('run_all obs');
        // running them all at once?
        // for - of and run asyncronously?
        console.log('items', items);
        each(items, (item, name, stop) => {
            if (name[0] === '_') {

            } else {
                try {
                    let res = item();
                    //console.log('res', res);
                    next({
                        name: name,
                        res: res
                    });
                } catch (err) {
                    console.log('running err', err);
                    error(err);
                    stop();
                }
            }  
        });
        // tiny timeout?
        // complete needs to work even if next has never been called.
        //next({j:'v'});
        //setImmediate(complete);

        // nexttick?
        console.log('obs should be done');
        //setTimeout(() => complete(), 1000);
        complete();
        return [];
    });
}

// A run all observable function?
//  Then a system to save the given results?

if (require.main === module) {
    const o_run_all = run_all(egs);

    //console.log('Object.keys(o_run_all)', Object.keys(o_run_all));

    // strangely the on events are not working!!!

    o_run_all.on('next', data => {
        console.log('data', data);
    });
    o_run_all.on('error', err => {
        console.log('error', err);
    });
    o_run_all.on('complete', () => {
        //console.log('error', err);
        console.log('example run complete');
    });
} else {

}


module.exports = egs;



