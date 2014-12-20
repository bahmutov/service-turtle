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
        jshintrc: '.jshintrc'
      }
    },

    eslint: {
      target: sourceFiles,
      options: {
        config: 'eslint.json',
        rulesdir: ['./node_modules/eslint-rules']
      }
    },

    jscs: {
      src: sourceFiles,
      options: {
          config: 'jscs.json'
      }
    }
  });

  var plugins = require('matchdep').filterDev('grunt-*');
  plugins.forEach(grunt.loadNpmTasks);

  grunt.registerTask('lint', ['jshint', 'eslint', 'jscs']);
  grunt.registerTask('default', ['nice-package', 'deps-ok', 'sync', 'lint']);
};
