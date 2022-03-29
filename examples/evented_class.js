/*
    Dont want to rely on observable here right now.

08/06/2019 - latest coding has corrupted Evented_Class somehow.
    Need to fix that
    Put in examples and tests that detect failures on the lowest point of the platform
    Could example / test functionality that is used to make higher pointes in the platform.


*/

// Different conventions / problems in mfp doing this?

const lang = require('../lang-mini');
const {Evented_Class} = lang;

let ec = new Evented_Class();

ec.on('next', data => {
    console.log('ec next data', data);
});

//console.log('pre raise');
ec.raise('next', 'hello');


//console.log('pre raise');
ec.raise('next', {name: 'data', value: 'hello'});

// can the 'complete' event be raised twice?
//  throwing an error if calling complete or error once it's finished?