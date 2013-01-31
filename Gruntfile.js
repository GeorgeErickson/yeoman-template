module.exports = function( grunt ) {
  'use strict';
  //
  // Grunt configuration:
  //
  // https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
  //
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.initConfig({

    // Project configuration
    // ---------------------

    // specify an alternate install location for Bower
    bower: {
      dir: 'app/components'
    },

    // Coffee to JS compilation
    coffee: {
      compile: {
        files: {
          'temp/js/*.js': 'app/coffee/**/*.coffee'
        },
        options: {
          basePath: 'app/coffee'
        }
      }
    },
    recess: {
      dist: {
          src: [
              'app/less/main.less',
          ],
          dest: 'temp/main.css',
          options: {
              compile: true
          }
      }
    },
    handlebars: {
      compile: {
        files: {
          "temp/templates.js": [
            "app/templates/**/*.hbs"
          ]
        },
        options: {
          namespace: 'App.Templates',
          processName: function(filename) {
            // funky name processing here
            return filename
                    .replace(/^app\/templates\//, '')
                    .replace(/\.hbs$/, '');
          }
        }
      }
    },
    // generate application cache manifest
    manifest:{
      dest: ''
    },

    // headless testing through PhantomJS
    mocha: {
      all: ['test/**/*.html']
    },

    // default watch configuration
    watch: {
      handlebars: {
        files: 'app/templates/**/*.hbs',
        tasks: 'handlebars reload'
      },
      coffee: {
        files: 'app/coffee/**/*.coffee',
        tasks: 'coffee reload'
      },
      recess: {
        files: [
          'app/less/**/*.less'
        ],
        tasks: 'recess reload'
      },
      reload: {
        files: [
          'app/*.html',
          'app/less/**/*.css',
          'app/coffee/**/*.js',
          'app/images/**/*'
        ],
        tasks: 'reload'
      }
    },

    // default lint configuration, change this to match your setup:
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#lint-built-in-task
    lint: {
      files: [
        'Gruntfile.js',
        'app/coffee/**/*.js',
        'test/**/*.js'
      ]
    },

    // specifying JSHint options and globals
    // https://github.com/cowboy/grunt/blob/master/docs/task_lint.md#specifying-jshint-options-and-globals
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
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },

    // Build configuration
    // -------------------

    // the staging directory used during the process
    staging: 'temp',
    // final build output
    output: 'dist',

    mkdirs: {
      staging: 'app/'
    },

    // Below, all paths are relative to the staging directory, which is a copy
    // of the app/ directory. Any .gitignore, .ignore and .buildignore file
    // that might appear in the app/ tree are used to ignore these values
    // during the copy process.

    // concat css/**/*.css files, inline @import, output a single minified css
    css: {
      'styles/main.css': ['styles/**/*.css']
    },

    // renames JS/CSS to prepend a hash of their contents for easier
    // versioning
    rev: {
      js: 'scripts/**/*.js',
      css: 'styles/**/*.css',
      img: 'images/**'
    },

    // usemin handler should point to the file containing
    // the usemin blocks to be parsed
    'usemin-handler': {
      html: 'index.html'
    },

    // update references in HTML/CSS to revved files
    usemin: {
      html: ['**/*.html'],
      css: ['**/*.css']
    },

    // HTML minification
    html: {
      files: ['**/*.html']
    },

    // Optimizes JPGs and PNGs (with jpegtran & optipng)
    img: {
      dist: '<config:rev.img>'
    },

    // rjs configuration. You don't necessarily need to specify the typical
    // `path` configuration, the rjs task will parse these values from your
    // main module, using http://requirejs.org/docs/optimization.html#mainConfigFile
    //
    // name / out / mainConfig file should be used. You can let it blank if
    // you're using usemin-handler to parse rjs config from markup (default
    // setup)
    rjs: {
      // no minification, is done by the min task
      optimize: 'none',
      baseUrl: './scripts',
      wrap: true
    },
  });

  // Alias the `test` task to run the `mocha` task instead
  grunt.registerTask('test', 'mocha');
  grunt.registerTask('compass', 'recess');
  
  //Add Handlebars to server
  grunt.renameTask('clean', 'original-clean');
  grunt.registerTask('clean', 'original-clean handlebars');
};
