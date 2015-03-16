module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {

		pkg:    grunt.file.readJSON( 'package.json' ),

		coffee: {
			compileWithMaps: {
				options: {
					sourceMap: true
				},
				files: {
					'js/{%= prefix_dashed %}.js': 'js/{%= prefix_dashed %}.coffee'
				}
			}
		},

		coffeelint: {
			all: ['js/*.coffee'],
			options: {
				no_tabs: {
					level: 'ignore'
				},
				indentation: {
					level: 'ignore'
				}
			}
		},

		jshint: {
			all: [
				'Gruntfile.js'
			],
			options: {
				curly:   true,
				eqeqeq:  true,
				immed:   true,
				latedef: true,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   true,
				boss:    true,
				eqnull:  true,
				globals: {
					exports: true,
					module:  false
				}
			}
		},

		uglify: {
			all: {
				files: {
					'js/{%= prefix_dashed %}.min.js': ['js/{%= prefix_dashed %}.js']
				},
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
						' *\n' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %> {%= author_name %}\n' +
						' * Licensed GPLv2+\n' +
						' */\n',
					sourceMap: true,
					sourceMapIn: 'js/{%= prefix_dashed %}.js.map',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},

		sass: {
			all: {
				files: {
					'css/{%= prefix_dashed %}.css': 'css/{%= prefix_dashed %}.sass'
				}
			}
		},

		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' *\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %> {%= author_name %}\n' +
					' * Licensed GPLv2+\n' +
					' */\n'
			},
			minify: {
				expand: true,
				cwd: 'css/',
				src: ['{%= prefix_dashed %}.css'],
				dest: 'css/',
				ext: '.min.css'
			}
		},

		watch:  {
			sass: {
				files: ['css/*.sass'],
				tasks: ['sass', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['js/**/*.coffee', 'js/vendor/**/*.js'],
				tasks: ['coffeelint', 'coffee', 'jshint', 'uglify'],
				options: {
					debounceDelay: 500
				}
			}
		},

		clean: {
			main: ['release/<%= pkg.version %>']
		},

		copy: {
			// Copy the plugin to a versioned release directory
			main: {
				src:  [
					'**',
					'!node_modules/**',
					'!release/**',
					'!.git/**',
					'!.sass-cache/**',
					'!css/**/*.sass',
					'!js/**/*.coffee',
					'!img/src/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules'
				],
				dest: 'release/<%= pkg.version %>/'
			}
		},

		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/{%= prefix_dashed %}.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: '{%= prefix_dashed %}/'
			}
		}
	} );

	// Load other tasks
	grunt.loadNpmTasks( 'grunt-contrib-jshint'   );
	grunt.loadNpmTasks( 'grunt-contrib-concat'   );
	grunt.loadNpmTasks( 'grunt-contrib-coffee'   );
	grunt.loadNpmTasks( 'grunt-coffeelint'       );
	grunt.loadNpmTasks( 'grunt-contrib-uglify'   );
	grunt.loadNpmTasks( 'grunt-contrib-cssmin'   );
	grunt.loadNpmTasks( 'grunt-contrib-sass'     );
	grunt.loadNpmTasks( 'grunt-contrib-watch'    );
	grunt.loadNpmTasks( 'grunt-contrib-clean'    );
	grunt.loadNpmTasks( 'grunt-contrib-copy'     );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );

	// Default task.
	grunt.registerTask( 'default', ['coffeelint', 'coffee', 'jshint', 'uglify', 'sass', 'cssmin'] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.util.linefeed = '\n';
};
