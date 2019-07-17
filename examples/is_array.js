

/*
    Multiple is_array examples.

    Some other examples will be much more important.

    Want this to be a really simple test example.
*/
const lang = require('../lang-mini');
const {is_array, each} = lang;

// fnl being a dev dependency
const {obs} = require('fnl');
const constants = {
    arr: {
        '0 to 9': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    },
    obj: {
    }
}
// an inputs or args array would definitely help with the examples.

const egs = {
    '0 to 9': () => {
        const arr = constants.arr['0 to 9'];
        //console.log('arr', arr);
        //let res = [is_array(arr), is_array(true)];
        //each(arr, item => res.push(item));
        return is_array(arr);
    }
}

const run_all = (items) => {
    // shouldnt use each?
    // Timeout of 0 is now standard within observable.
    return obs((next, complete, error) => {
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
    });
}

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