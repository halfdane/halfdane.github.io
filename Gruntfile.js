module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: ['build']
        },
        wintersmith: {
            staging: {
                options: {
                    config: './config-staging.json'
                }
            },
            production: {
                options: {
                    config: './config-production.json'
                }
            },
            preview: {
                options: {
                    action: "preview",
                    config: './config-preview.json'
                }
            }
        },
        jshint: {
            work: ['contents/js/*.js', 'Gruntfile.js']
        },
        watch: {
            js: {
                files: ['contents/js/**/*.js'],
                tasks: ['jshint:work', 'browserify2']
            },
            sass: {
                files: ['contents/sass/**/*.scss'],
                tasks: ['compass:dev']
            }
        },
        uglify: {
            production: {
                files: {
                    'build/js/output.js': 'build/js/*.js'
                }
            }
        },
        cssmin: {
            production: {
                expand: true,
                cwd: 'build/css',
                src: ['*.css'],
                dest: 'build/css'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-wintersmith');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};