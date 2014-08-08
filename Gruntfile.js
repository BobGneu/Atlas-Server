(function (module) {
	'use strict';

	module.exports = function (grunt) {

		var files = ['Gruntfile.js', 'app.js', 'src/**/*.js', 'routes/**/*.js', 'bin/www'];

		grunt.initConfig({
			jshint: {
				options: {
					curly: true,
					eqeqeq: true,
					eqnull: true,
					browser: false
				},
				all: files
			},
			jscs: {
				src: files,
				options: {
					preset: 'google',
					validateIndentation: '\t',
					maximumLineLength: 120
				}
			}
		});

		grunt.loadNpmTasks('grunt-contrib-jshint');
		grunt.loadNpmTasks('grunt-jscs-checker');

		grunt.registerTask('default', 'Perform full build and test of the entire project.', ['jshint', 'jscs']);
	};
})(module);
