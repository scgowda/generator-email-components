// Generated on <%%= (new Date).toISOString().split('T')[0] %> using
'use strict';

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Configurable paths
  var config = {
    app: '<%= devFolder%>',
    <%
    if (stagingPath) { %>
      staging: '<%= stagingPath%>', <%
    } %>
    dist: '<%= buildFolder%>'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {

      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%%= connect.options.livereload %>'
        },
        files: [
          '<%%= config.app %>/{,*/}*.html',
          '<%%= config.app %>/img/{,*/}*'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        open: true,
        livereload: 35729,
        // Change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function(connect) {
            return [
              connect.static(config.app)
            ];
          }
        }
      },
      test: {
        options: {
          open: false,
          port: 9001,
          middleware: function(connect) {
            return [
              connect.static(config.app)
            ];
          }
        }
      },
      dist: {
        options: {
          base: '<%%= config.dist %>',
          livereload: false
        }
      }
    },

    dom_munger: {
      prepare: {
        options: {
          update: {
            selector: 'a',
            attribute: 'target',
            value: '_blank'
          },
          callback: function($) {
            $('img').each(function() {
              var $this = $(this),
                src = ($this.attr('src')).split('/');

              src = src[src.length - 1];
              $this.attr('src', 'img/' + src);

              if (['p.gif', 'cleardot.gif'].indexOf(src) === -1) {
                if (!$this.attr('alt')) {
                  throw new Error('Alt tag missing from ' + src);
                }
              }
            });
          }
        },
        src: '<%%= config.dist %>/{,*/}*.html'
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*'
          ]
        }]
      }
    },
    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            '{,*/}img/{,*/}*.{ico,png,txt,gif,jpg}',
            '{,*/}*.html'
          ]
        }]
      },
      staging: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.dist %>',
          dest: '<%%= config.staging %>',
          src: [
            '{,*/}img/{,*/}*.{ico,png,txt,gif,jpg}',
            '{,*/}*.html'
          ]
        }]
      }
    }
  });

  grunt.registerTask('serve', 'start the server and preview your app, --allow-remote for remote access', function(target) {
    if (grunt.option('allow-remote')) {
      grunt.config.set('connect.options.hostname', '0.0.0.0');
    }
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function(target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run([target ? ('serve:' + target) : 'serve']);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'copy:dist',
    'dom_munger:prepare'
  ]);

  <%
  if (stagingPath) { %>
    grunt.registerTask('staging', [
      'build',
      'copy:staging'
    ]); <%
  } %>

  grunt.registerTask('default', [
    'build'
  ]);
};