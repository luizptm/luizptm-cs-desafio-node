module.exports = function(config) {
    config.set({
        frameworks: ['mocha', 'chai', 'sinon'],

        browsers: ['PhantomJS'],

        files: [
            '../public/scripts/main.js',
            '*.js'
        ],

        singleRun: true,

        phantomjsLauncher: {
            exitOnResourceError: true
        }
    });
};