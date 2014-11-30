module.exports = function (grunt) {
    grunt.initConfig({
        cssmin: {
            production: {
                expand: true,
                cwd: 'build/css',
                src: ['*.css'],
                dest: 'build/css'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-cssmin');
};