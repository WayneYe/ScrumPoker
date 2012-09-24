// Refer: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
module.exports = function(grunt) {
  var path     = require('path'),
      exec     = require('child_process').exec,
      jsPath   = "public/javascripts",
      cssPath  = "public/stylesheets",
      distPath = "dist";

  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.description %>\n* v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Homepage: <%= pkg.homepage + "\n" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.author.homepage %>\n' +
        '* Licensed with <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },  
    concat: {
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
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist.dest>'],
        dest: 'public/javascripts/<%= pkg.name %>.min.js'
      },   
      css: {
        src: [
          path.join(jsPath, "style.css"),
        ],
        dest: 'public/stylesheets/<%= pkg.name %>.min.css'
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
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true
      },  
      globals: {
        exports: true,
        module: false
      }   
    },  
    uglify: {}
  });

  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  //grunt.loadNpmTasks('grunt-sample');

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
  grunt.registerTask('default', 'concat:dist min cssmin');

  // Custom tasks
  //grunt.registerTask('css', 'concat:css, cssmin');

};
