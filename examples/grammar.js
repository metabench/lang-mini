/*
    Examples will be useful to demonstrate features.
    Making use of the text here would be really good for documentation too.

    Defining the function differently in a json structure?
    // Would be really good to give a language independent / universal view of the function.
    // Specifically what it does
    //  Could go into how it does it....
    // Then it could work on training data for creation of functions from descriptions, either in English or JSON description.

    // Late 2023 - May be worth extending to cover / handle data models.

    // Integrating further withing Data_Object and Data_Value.
    //   lang-tools code and examples involving them would help, being able to have data types specified and (auto) validated.
    //     Including working with async/obs updates too.

    



*/

const lang = require('../lang-mini');
const { each, Grammar, deep_sig, tf, tof, mfp } = lang;


// single_forms_sig
//  take item (can be arguments object) and make a sig version that has plural items as single.

// Lower level grammar processing will be useful for a variety of underlying functionality.
//  Want it to be extendable in some ways?

//  Tests, testing tree?
//   





// and could also apply constraints in a grammar?
//  validation
//   ie say something is a username and password combo but it's not valid.


// Will be useful for recognising arguments, seeing what is plural.

// Dealing with objects with named parameters
// Dealing with arrays
//  params in order.

// Don't think it needs to be that big of a puzzle.
//  The grammar would also be able to identify typed objects by their spec?
//   Or potential types.

// Maybe there should be specific grammars that get created within specific modules.
//  May work out as a clearer separation of concerns.


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
            def: ['username', 'password'],      // also able to specify it as an object.
            plural: 'user_logins'               //  or don't need the plural name? but be able to recognise it and make use of it.
        }
    }
});

console.log('ua_grammar', ua_grammar);
console.log('ua_grammar.maps', ua_grammar.maps);

// Then want to use the grammar to recognise arguments
//  And function calls in general.

// Maybe also define function calls more entirely within the grammar system.
// Be able to identify an array of user logins.
//  treat user_logins, the plural, as if it's going to be / likely to be an array.


// ua_grammar.recognise?
//  .match
//  .tof
//  .tf
//  .sig

// be able to get the signature of an object according to the grammar.
//  will be used when a grammar is specified for a funtion.
//  give the Grammar class the tools, use them in various other places where flexibility is required.

const jcred1 = ['james', 'pwd'];
const t1 = ua_grammar.tof(jcred1);
console.log('t1', t1);

// So when we know the type within a grammar, we should be able to better call functions that use it.

// Need to recognise plurals as well.
//  See if every item in the list has the same sig?
//  See what they all match.
//   And any that intersect all of them.

// tof function detecting an array of arrays?
//  array of defined types?


// OK, recognises it as a plural type.
//  But it just gives the type name.
//  Maybe need some other functions for recognition.

// Want to incorporate this within mfp / function calls.
//  Give a grammar with mfp.
//  Then can use the definitions / types within that grammar to define accepted params.
//   About accepting both singular and plurals?
//    Possibly create a new object to say what they are.

// Want to make it so that a function such as db setup can accept multiple user credentials.
//  Do its normal stuff,
//  Send those credentials, possibly a plural object, over to the add_user function, which will then be able to handle the plural.
//   Be able to specify that we can accept some params in plural, but not others.

// Worth testing mfp with grammar here.

const input2 = {
    users: [
        ['admin', '828982094'],
        ['james', '189038090']
    ]
}

// then want the sig of this.
const rsig1 = ua_grammar.sig(input2);
console.log('rsig1', rsig1);

console.log('');

// Nice, this rsig is working.

const credentials = [
    ['jack', 'pwd1'],
    ['james', 'pwd2']
]

// Should itentify it as user_logins
const t2 = ua_grammar.tof(credentials);
console.log('t2', t2);

// 2022 - Grammar seems allright enough with some simple types.
//   Not so sure right now about having it work with the more complex types (1 signifier, n representations)
//   In normal programming terminology, Array is a Complex Type.
//     Will need to call them Signifier-Representations types?
//       Signified Representations Types.
//         Sig_Reps
//   In JS these are kind of a L2 class?.
//   Need some kind of subtype / inheritance here.
//     Or more to do with category linkage than actual inheritance.
//       Meaning that a signifier could be a subsignifier.
//   Date type
//     Then could have a subtype of dates that is for UNIX-compatable dates - restricted range.
//   Some specific types could have restricted resolutions or capacities or whatever?.

// eg unixdatetime extends datetime (with restrictions), and the types within it become more specific, or limited.

// Type_Restriction? Type_Signifier_Restriction?
//   This Grammar system does seem somewhat concerned with types like these.
//   Seems best to work on them separately, unless their functionality can support other - likely best with 1 as platform for other,
//     This SR_Type system seems more developed from the ground-up to solve issues to do with HTML controls and views.






// type.extend({restrictions: [...]})









// grammar tof needs more work.

// OK, got it to work, recognising these plural (compound) types (according to the (local) grammar).
//  Next, want it to work within function calling.
//  Relatively simple param recognition according to the grammar will be a great help.
//   Will be better able to move to the assumption of giving the right types if the code is written with correct idioms.
//   Will retaining / enabling flexibility to do with the types.
//    Look into interators before long too.
//     Not a conventional array, but acts as one, (in an async way?)



// Now want some proper function calls to recognise these sigs and types.















// Then will need some code of moderate complexity that makes use of these grammars, probably within mfp.
//  Grammars will become a feature of polymorphism. Being able to define a grammar, or use a defined grammar, and this will automatically
//   change / transform the parameters that go into a function.

// Maybe other fns will deal with fn call pluralisation, using knowledge within the grammars.



















/*

const t1 = ua_grammar.tof(['james', '27s89sa72']);
console.log('t1', t1);
*/



// 







/*

grammar({
    // So we can identify parameters in order when they are in an array.
    //  Quick changing between array and object formats.

    // Type annotations on the pojos?
    //  .__type_name annotation once identified would make sense.
    //   (but not always! it would change the object)
    //  no annotations for now for that reason.
    //   maybe on arrays.

    // So we have overlapping definitions
    //  Can't tell them apart.
    //  Don't test for them?

    // Only test for some types when they are expected in a function?
    //  Would be quicker. Maybe avoid some contradictions.

    username: {
        def: 'string'   // constraints in the definition?
    },
    password: {
        def: 'string'   // constraints in the definition?
    },
    user_login: {
        plural: 'user_logins',
        def: 'username, password'//,
        //sig: 's,s'
        // sig can be obtained from the def.

        // with this, should be able to identify a user (or at least the type match)
        //  and then an array of users as well.

        // be able to say when we have an array containing a type that's in the grammar.
        //  array of users

        // rgb colors?
        // rgba colors?
    }
});

*/

// Specific matching, so that when a function gets called, we can match the input params against what we are looking for.
//  Will be efficient enough when there are only a handful of items to match against the grammar.


// Find matches against all / any types in the grammar?
// Find best / top match?


// check against specific types
//  and get info back about the type too, such as if it's a plural of something else, info on that.
/// really dont want to spend that long on these grammars. want them to save time when writing functions though!

// Being able to define a function easily in an idiom that allows it to be called flexibly, and provides extra io monitoring features too.
//  Think we'll need to go moderately large / expansive on the grammar system.

// Specific grammar functions / objects?
//  Grammar definition object / class?
//   Use the grammar for identifying objects?

// Seems like grammar contexts will be useful for this.
//  Be able to give grammar to a function?
//   So that the params / io can be understood according to that grammar.




















/*
identify_obj_against_grammar_matches
match_against_grammar
matches_grammar_type




*/





// Then should be able to use sig and type functions that identify these defined types.
//  Will be very useful for some flexible forms of function processing.
