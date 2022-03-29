/*
    Wrap it in an object or functions?

    An array of functions?
    A map of them?

    An array of functions that return objects.



*/

const lang = require('../lang-mini');
const {each} = lang;

// fnl being a dev dependency
const {obs} = require('fnl');

// object constants for testing will be useful.

const constants = {
    arr: {
        '0 to 9': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    obj: {
        // could import mime types from a different document.

        // extension map
        // mime types
        // web mime types

        


    }
}

const egs = {
    '0 to 9': () => {
        const arr = constants.arr['0 to 9'];
        //console.log('arr', arr);

        let res = [];
        each(arr, item => res.push(item));
        return res;
    }
}

// seems like it could be useful...
//  run all functions in object / array, send results to obs

// Items is a very good general name that is not signifying object / array.

// Observables could be very useful for non-async functions.
//  A way of running multiple functions with a single statement.


// run_all is just the kind of thing the platform will provide in the future.
//  for the moment, copy and paste it between examples.

// observables, now using mfp, are broken?

// Return observable instead?
const run_all = (items) => {
    // shouldnt use each?

    // A timeout 0 before running the internal function would work fairly well.
    //  Would mean that by default the .on handlers will always be set up.


    return obs((next, complete, error) => {

        // autodelayed obs?
        //  so that the event handlers can be set up at least?

        // setImmediate? setTimeout?

        // maybe will depend on where it's used.
        //  setTimeout more widely supported.
        //  or the timeouts on the next and complete calls?

        // ??? a setTimeout before the observable inner function gets called?

        //setTimeout(() => {
            each(items, (item, name, stop) => {
                try {
                    let res = item();
                    console.log('res', res);
                    next({
                        name: name,
                        res: res
                    });
                } catch (err) {
                    error(err);
                    stop();
                }
            })
            complete();
        //}, 0);


        
    });
}

// A run all observable function?
//  Then a system to save the given results?

// need to again test observables in fnl.
//  perhaps fnl shouldn't yet use mfp.



if (require.main === module) {
    const o_run_all = run_all(egs);

    o_run_all.on('next', data => {
        console.log('data', data);
    });
    o_run_all.on('error', err => {
        console.log('error', err);
    });
    o_run_all.on('complete', () => {
        console.log('complete');
    });
} else {

}


module.exports = egs;