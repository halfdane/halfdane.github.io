module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build']
        },
        wintersmith: {
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
                    'build/js/output.js': 'contents/js/**/*.js'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'work/scss',
                    cssDir: 'test/css',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'work/scss',
                    cssDir: 'test/css',
                    environment: 'development'
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
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    grunt.registerTask('preview', [
        'wintersmith:preview'
    ]);
// Tasks that are called within the "public tasks"
    grunt.registerTask('build', [
        'prebuild',
        'wintersmith:production',
        'postbuild'
    ]);

    grunt.registerTask('prebuild', [
        'clean:build'
    ]);
    grunt.registerTask('postbuild', [
        'uglify:production',
        'cssmin:production'
    ]);
};