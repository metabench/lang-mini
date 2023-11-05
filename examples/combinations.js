const lang = require('../lang-mini');
const {each, combos} = lang;
const util = require('util');

const combo1 = () => {

    const input1 = [
        [1, 2, 3],
        [4, 5, 6, 'A', 'B', 'C'],
        [7, 8, 9]
    ]

    const res = combos(input1);
    console.log('combo1 res', res);

    return res;

}


const combo2 = () => {

    const arr_five_most_frequent_hebrew_letters = ['י', 'ה', 'ו', 'ל', 'א'];

    /*
    const input1 = [
        ['י', 'ה', 'ו', 'ל', 'א'],
        ['י', 'ה', 'ו', 'ל', 'א'],
        ['י', 'ה', 'ו', 'ל', 'א']
    ]
    */
    const input1 = [
        arr_five_most_frequent_hebrew_letters,
        arr_five_most_frequent_hebrew_letters,
        arr_five_most_frequent_hebrew_letters
    ]

    const res = combos(input1);
    //console.log('combo2 res', res);

    return res;

}



const combo3 = () => {
    // https://www.omniglot.com/conscripts/sehefata.htm
    const arr_five_geez_letters_equivalent_to_five_most_frequent_hebrew_letters = ['የ', 'ሀ', 'ወ', 'ለ', 'አ'];

    
    const input1 = [
        arr_five_geez_letters_equivalent_to_five_most_frequent_hebrew_letters,
        arr_five_geez_letters_equivalent_to_five_most_frequent_hebrew_letters,
        arr_five_geez_letters_equivalent_to_five_most_frequent_hebrew_letters
    ]

    const res = combos(input1);
    //console.log('combo2 res', res);

    return res;

}




if (require.main === module) {
    const res1 = combo1();
    console.log('res1', res1);
    console.log('res1.length', res1.length);

    const res2 = combo2();
    //console.log('res2', res2);

    console.log('res2', util.inspect(res2, {
        maxArrayLength: 10000, // Set the max length option
        //compact: true // Optional: Make the output more concise
    }));

    //console.log('res2', JSON.stringify(res2));
    console.log('res2.length', res2.length);


    const r2_as_words = res2.map(x => x.reverse().join(''));

    console.log('r2_as_words', util.inspect(r2_as_words, {
        maxArrayLength: 10000, // Set the max length option
        //compact: true // Optional: Make the output more concise
    }));

    const res3 = combo3();
    //console.log('res2', res2);

    console.log('res3', util.inspect(res3, {
        maxArrayLength: 10000, // Set the max length option
        //compact: true // Optional: Make the output more concise
    }));

    //console.log('res2', JSON.stringify(res2));
    console.log('res3.length', res3.length);

    const r3_as_words = res3.map(x => x.join(''));

    console.log('r3_as_words', util.inspect(r3_as_words, {
        maxArrayLength: 10000, // Set the max length option
        //compact: true // Optional: Make the output more concise
    }));

    //console.log('r3_as_words', r3_as_words);


}

const eg_combos = [combo1];
module.exports = eg_combos;