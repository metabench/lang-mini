module.exports = {
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
    collectCoverageFrom: [
        'lang-mini.js',
        'lib-lang-mini.js',
        '!node_modules/**'
    ],
    coverageDirectory: 'coverage',
    verbose: true
};
