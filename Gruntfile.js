module.exports = function(grunt) {

    grunt.initConfig({
        jshint: {
            files: ['Gruntfile.js', 'app/**/*.js', 'test/**/*.js'],
            options: {}
        },
        jsdoc: {
            dist: {
                src: ['public/scripts/*.js'],
                jsdoc: './node_modules/.bin/jsdoc',
                options: {
                    private: true,
                    destination: 'doc',
                    showPrivate: true
                }
            }
        },
        karma: {
            unit: {
                configFile: 'tests/karma.conf.js'
            }
        },
        uglify: { //see: https://github.com/gruntjs/grunt-contrib-uglify
            options: {
                mangle: false
            },
            my_target: {
                files: {
                    'public/scripts/main.min.js': ['public/scripts/main.js']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-jsdoc');
    grunt.loadNpmTasks('grunt-karma');

    grunt.registerTask('default', ['jshint', 'jsdoc', 'uglify']);
};