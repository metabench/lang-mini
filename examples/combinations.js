const lang = require('../lang-mini');
const {each, combos} = lang;


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

if (require.main === module) {
    const res1 = combo1();
    console.log('res1', res1);
    console.log('res1.length', res1.length);

}

const eg_combos = [combo1];
module.exports = eg_combos;