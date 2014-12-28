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
        watch: {
            js: {
                files: ['work/**/*.js'],
                tasks: ['requirejs:preview']
            },
            sass: {
                files: ['work/**/*.scss'],
                tasks: ['compass:dev']
            },
            all: {
                files: ['**/*'],
                options: {
                    livereload: true
                }
            }
        },
        requirejs: {
            options: {
                name: "main",
                baseUrl: "work/js/",
                mainConfigFile: "work/js/main.js",
                out: "contents/compiled/js/site.js"
            },
            production: {
                // overwrites the default config above
                options: {
                optimize: "uglify" 
                }
            },
            preview: {
                // overwrites the default config above
                options: {
                    optimize: "none" // no minification
                }
            }
        },

        uglify: {
            production: {
                files: {
                    'contents/compiled/js/site.js': 'contents/compiled/js/site.js'
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
            develop: ['watch', 'server'],
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
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('preview', ['concurrent:develop']);

    grunt.registerTask('server', [
        'clean:build',
        'compass:dev',
        'requirejs:preview',
        'wintersmith:preview'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'compass:dist',
        'requirejs:production',
        'wintersmith:production',
        'uglify:production',
        'cssmin:production'
    ]);

};