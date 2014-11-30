module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: [ 'build' ]
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

    grunt.loadNpmTasks('grunt-contrib-cssmin');
};