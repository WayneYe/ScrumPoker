// Refer: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            dist: {
                src: [
                    "team-poker-base.js",
                    "team-poker-util.js",
                    "team-poker-socket-client.js",
                    "ui/widgets/widget-base.js",
                    "",
                    "",
                    "",
                    "",
                    "",
                ],
                dest: 'dist/teampoker.js'
            }
        },
        lint: {
            all: ['grunt.js', 'app.js', 'public/javascripts/*.js', 'public/javascripts/ui/**/*.js']
        },
        jshint: {
            options: {
                browser: true
            }
        },
        qunit: {
            index: ['test/index.html']
        }
    });

    // Load tasks from "grunt-sample" grunt plugin installed via Npm.
    //grunt.loadNpmTasks('grunt-sample');

    // Default task.
    grunt.registerTask('default', 'concat:dist');

};
    //
    //
    //
    //
    //ui/widgets/popup.js
    //ui/widgets/login-form.js
    //ui/widgets/poker-queue.js
    //ui/team-poker-ui.js
    //ui/widgets/vote-result-dialog.js
    //team-poker.js
