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
        watch: {
            js: {
                files: ['work/**/*.js'],
                tasks: ['requirejs', 'uglify:preview']
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
            compile: {
                options: {
                    name: "main",
                    baseUrl: "work/js/",
                    mainConfigFile: "work/js/main.js",
                    out: "contents/compiled/js/site.js",
                    compress: "none"
                }
            }
        },
        uglify: {
            production: {
                files: {
                    'contents/compiled/js/site.js': ['work/js/vendor/require.js', 'contents/compiled/js/site.js']
                }
            },
            preview: {
                files: {
                    'contents/compiled/js/site.js': ['work/js/vendor/require.js', 'contents/compiled/js/site.js']
                },
                options: {
                    mangle: false,
                    compress: false,
                    preserveComments: 'all'
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: 'work/scss',
                    cssDir: 'contents/compiled/css',
                    require: ['susy', 'breakpoint'],
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
        },
        responsive_images: {
            dev: {
                options: {
                    engine: "im",
                    sizes: [
                        { name: 'small', width: 320, quality: 30},
                        { name: 'medium', width: 800, quality: 30},
                        { name: 'large', width: 1024, quality: 60}
                    ]
                },
                sizes: [
                    { width: 320},
                    { width: 800, quality: 0.6},
                    { width: 1024, quality: 0.6}
                ],
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}', '!**/*-{small,medium,large}.*'],
                    cwd: 'contents/',
                    dest: 'contents/'
                }]
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
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('preview', ['concurrent:develop']);

    grunt.registerTask('server', [
        'clean:build',
        'compass:dev',
        'requirejs',
        'responsive_images:dev',
        'uglify:preview',
        'wintersmith:preview'
    ]);

    grunt.registerTask('build', [
        'clean:build',
        'compass:dist',
        'requirejs',
        'responsive_images:dev',
        'uglify:production',
        'cssmin:production',
        'wintersmith:production'
    ]);

};