module.exports = function(grunt) {
  'use strict';

  var sourceFiles = [
    'turtle.js', 'service-turtle.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sync: {
      all: {
        options: {
          sync: ['author', 'name', 'version', 'main',
            'private', 'license', 'keywords', 'homepage'],
        }
      }
    },

    jshint: {
      all: sourceFiles,
      options: {
        jshintrc: 'utils/.jshintrc'
      }
    },

    eslint: {
      target: sourceFiles,
      options: {
        config: 'utils/eslint.json',
        rulesdir: ['./node_modules/eslint-rules']
      }
    },

    jscs: {
      src: sourceFiles,
      options: {
          config: 'utils/jscs.json'
      }
    },

    'gh-pages': {
      options: {
        base: '.'
      },
      src: [
        'index.html',
        'README.md',
        'turtle.js',
        'service-turtle.js',
        'node_modules/console-log-div/console-log-div.js'
      ]
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['jshint', 'eslint', 'jscs']);
  grunt.registerTask('default', ['nice-package', 'deps-ok', 'sync', 'lint']);
};
