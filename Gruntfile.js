// Refer: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
module.exports = function(grunt) {
  var path     = require('path'),
      exec     = require('child_process').exec,
      jsPath   = "public/javascripts",
      cssPath  = "public/stylesheets",
      distPath = "dist";

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: [
         path.join(jsPath, "team-poker-base.js"),
         path.join(jsPath, "team-poker-util.js"),
         path.join(jsPath, "team-poker-socket-client.js"),
         path.join(jsPath, "ui/widgets/widget-base.js"),
         path.join(jsPath, "ui/widgets/popup.js"),
         path.join(jsPath, "ui/widgets/share-link.js"),
         path.join(jsPath, "ui/widgets/login-form.js"),
         path.join(jsPath, "ui/widgets/poker-queue.js"),
         path.join(jsPath, "ui/team-poker-ui.js"),
         path.join(jsPath, "ui/widgets/vote-result-dialog.js"),
         path.join(jsPath, "team-poker.js")
        ],
        dest: 'dist/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= pkg.description %>\n* version <%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) 2011 - <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.homepage %>\n' +
        '* Licensed with <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
        }
      }
    }, 
    lint: {
      all: ['grunt.js', 'app.js', 'public/javascripts/*.js', 'public/javascripts/ui/**/*.js']
    },
    qunit: {
      index: ['test/index.html']
    },
    jshint: {
      all: ['Gruntfile.js', 'routes/index.js', 'public/javascripts/*.js', 'public/javascripts/ui/*.js'],
      options: {
        "boss": true,
        "curly": true,
        "eqeqeq": true,
        "eqnull": true,
        "expr": true,
        "immed": true,
        "noarg": true,
        "onevar": true,
        "quotmark": "double",
        "smarttabs": true,
        "trailing": true,
        "undef": true,
        "unused": true,
        "node": true,

        "globals": {
          "$": true,
          "jQuery": true,
          "_": true,
          "document": true,
          "window": true,
          "sessionStorage": true,
          "localStorage": true,
          "location": true,
          "exports": true,
          "module": false,
          "TeamPoker": true,
        }   
      },
      ignore_warning: {
        options: {
          '-W015': true,
          '-W108': true,
        },
        src: ['**/*.js'],
      }
    }
  });

  grunt.registerTask('cssmin', function() {
    grunt.log.write("Minifying css using yuicompressor \n");
    var cmd = 'java -jar -Xss2048k '
    + __dirname + '/build//yuicompressor-2.4.7.jar --type css '
    + path.join(cssPath, "style.css")
    + ' -o '
    + path.join(distPath, "style.min.css");
    exec(cmd, function(err, stdout, stderr) {
      if(err) throw err;
    });
  });

  // Default task.
  grunt.registerTask('default', ['concat:dist', 'uglify', 'cssmin']);

  // Custom tasks
  //grunt.registerTask('css', 'concat:css, cssmin');
};
