module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: ['build', 'contents/compiled']
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
                files: ['work/js/**/*.js'],
                tasks: ['jshint:work']
            },
            sass: {
                files: ['work/scss/**/*.scss'],
                tasks: ['compass:dev']
            },
            all: {
                files: ['**/*'],
                options: {
                    livereload: true
                }
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
                    cssDir: 'contents/compiled/css',
                    require: 'susy',
                    environment: 'production'
                }
            },
            dev: {
                options: {
                    sassDir: 'work/scss',
                    cssDir: 'contents/compiled/css',
                    require: ['susy', 'breakpoint'],
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
        },
        concurrent: {
            develop: ['watch', 'preview'],
            options: {
                logConcurrentOutput: true
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
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.registerTask('develop', ['concurrent:develop']);

    grunt.registerTask('preview', [
        'clean:build',
        'compass:dev',
        'wintersmith:preview'
    ]);
    grunt.registerTask('build', [
        'clean:build',
        'compass:dist',
        'wintersmith:production',
        'postbuild'
    ]);

// Tasks that are called within the "public tasks"
    grunt.registerTask('postbuild', [
        'uglify:production',
        'cssmin:production'
    ]);

};