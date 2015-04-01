module.exports = function (grunt) {

// Project configuration.
grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    devRoot: 'src',
    distRoot: 'dist',
    demoRoot: 'demo',
    pluginName: 'modal',
    watch: {
        options: {
            livereload: true
        },
        css: {
            files: '<%= devRoot %>/scss/*',
            tasks: ['sass:demo']
        },
        js: {
            files: '<%= devRoot %>/js/*',
            tasks: ['copy:js']
        },
        gruntfile: {
            files: ['Gruntfile.js']
        },
        html: {
            files: ['<%= demoRoot %>/*.html']
        }
    },
    sass: {
        options: {
            sourcemap: 'none'
        },
        demo: {
            files: {
                '<%= demoRoot %>/css/main.css': '<%= devRoot %>/scss/<%= pluginName %>-demo.scss'
            }
        },
        dist: {
            files: {
                '<%= distRoot %>/css/<%= pluginName %>.css': '<%= devRoot %>/scss/<%= pluginName %>-dist.scss'
            }
        }
    },
    copy: {
        js: {
            files: [
                {
                    expand: true,
                    cwd: '<%= devRoot %>/js',
                    src: '**',
                    dest: '<%= demoRoot %>/js/'
                },
                {
                    expand: true,
                    cwd: '<%= devRoot %>/js',
                    src: '**',
                    dest: '<%= distRoot %>/js/'
                }
            ]
        }
    },
    uglify: {
        dist: {
            files: {
                '<%= distRoot %>/js/<%= pluginName %>.min.js': ['<%= devRoot %>/js/<%= pluginName %>.js']
            }
        }
    },
    connect: {
        server: {
            options: {
                hostname: '0.0.0.0',
                base: '<%= demoRoot %>/',
                livereload: true
            }
        }
    }
});

grunt.loadNpmTasks('grunt-contrib-copy');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-uglify');

grunt.registerTask('default', ['sass:demo', 'connect','watch']);
grunt.registerTask('build', ['sass:dist', 'copy:js', 'uglify']);
};