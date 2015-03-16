module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {

		pkg:    grunt.file.readJSON( 'package.json' ),

		coffee: {
			compileWithMaps: {
				options: {
					join: true,
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
				max_line_length: {
					level: 'warn'
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

		compass: {
			dist: {
				options: {
					sassDir: 'css',
					cssDir: 'css',
					imagesDir: 'images',
					sourcemap: true,
					environment: 'production'
				}
			}
		},

		watch:  {
			sass: {
				files: ['css/*.sass'],
				tasks: ['compass'],
				options: {
					debounceDelay: 500
				}
			},
			scripts: {
				files: ['js/**/*.coffee', 'js/vendor/**/*.js'],
				tasks: ['coffeelint', 'coffee', 'jshint', 'uglify', 'clean:js'],
				options: {
					debounceDelay: 500
				}
			}
		},

		clean: {
			main: ['release/<%= pkg.version %>'],
			js: ['js/*.js', '!js/*.min.js', 'js/*.src.coffee', 'js/*.js.map', '!js/*.min.js.map']
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
	grunt.loadNpmTasks( 'grunt-contrib-compass'  );
	grunt.loadNpmTasks( 'grunt-contrib-watch'    );
	grunt.loadNpmTasks( 'grunt-contrib-clean'    );
	grunt.loadNpmTasks( 'grunt-contrib-copy'     );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );

	// Default task.
	grunt.registerTask( 'default', ['coffeelint', 'coffee', 'jshint', 'uglify', 'compass', 'clean:js'] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );

	grunt.util.linefeed = '\n';
};
