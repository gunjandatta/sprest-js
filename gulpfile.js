var clean = require("gulp-clean");
var gulp = require("gulp");
var gulpWebpack = require("gulp-webpack");
var insert = require("gulp-insert");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
var webpack = require("webpack");

// Build
gulp.task("build", ["clean"], () => {
    // Get the source files
    return gulp.src("src/**/*.ts")
        // Send them to the typescript compiler
        .pipe(ts.createProject("tsconfig.json")())
        // Output to the build directory
        .pipe(gulp.dest("build"));
});

// Clean
gulp.task("clean", () => {
    // Get the build and dist folders
    return gulp.src(["./build", "./dist"])
        // Delete them
        .pipe(clean());
});

// Copy the libraries
gulp.task("copy-lib", ["copy-fabric-css", "copy-fabric-js", "copy-fabric-lib-jquery", "copy-fabric-lib-pickadate", "copy-styles"]);

// Copy the fabric css
gulp.task("copy-fabric-css", ["build"], () => {
    // Copy the css libraries
    return gulp.src([
        "node_modules/office-ui-fabric-js/dist/css/fabric.min.css",
        "node_modules/office-ui-fabric-js/dist/css/fabric.components.min.css",
        "src/gd-sprest-js.css"
    ])
        // Copy to the build folder
        .pipe(gulp.dest("build/lib/css"));
});

// Copy the fabric js
gulp.task("copy-fabric-js", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/js/fabric.min.js")
        // Prepend an import of the pickadate library
        .pipe(insert.prepend("require('./pickadate');\n"))
        // Prepend an import of the jquery library
        .pipe(insert.prepend("var $ = require('./jquery');\n"))
        // Append an export statement to the library
        .pipe(insert.append("exports.fabric = fabric;"))
        // Output to the build directory
        .pipe(gulp.dest("build/lib/js"));
});

// Copy the fabric lib-jquery
gulp.task("copy-fabric-lib-jquery", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/lib/jquery.js")
        // Output to the build directory
        .pipe(gulp.dest("build/lib/js"));
});

// Copy the fabric lib-pickadate
gulp.task("copy-fabric-lib-pickadate", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/lib/pickadate.js")
        // Replace the reference to jquery
        .pipe(replace(/\"jquery\"/g, '"./jquery.js"'))
        // Output to the build directory
        .pipe(gulp.dest("build/lib/js"));
});

// Copy the styles
gulp.task("copy-styles", ["build"], () => {
    // Get the source file
    return gulp.src("src/styles.css")
        // Output to the build directory
        .pipe(gulp.dest("build"));
});

// Package the library
gulp.task("package", ["package-bundle", "package-fabric-bundle", "package-minify", "package-fabric-minify"]);

// Bundle the library
gulp.task("package-bundle", ["update-lib-reference"], () => {
    // Get the source files
    return gulp.src(["build/lib/css/gd-sprest-js.css", "build/index.js"])
        // Run webpack to bundle the library
        .pipe(gulpWebpack({
            output: {
                filename: "gd-sprest-js.js",
            },
            module: {
                loaders: [
                    {
                        test: /\.css$/,
                        use: [
                            { loader: "style-loader" },
                            { loader: "css-loader" }
                        ]
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: ["es2015"]
                                }
                            }
                        ]
                    }
                ]
            }
        }, webpack))
        // Save to the dist directory
        .pipe(gulp.dest("dist/"));
});

// Minify the bundle
gulp.task("package-minify", ["package-bundle"], () => {
    // Get the source files
    return gulp.src(["dist/gd-sprest-js.js"])
        // Minify the bundle
        .pipe(uglify())
        // Update the file extension
        .pipe(rename({ suffix: ".min" }))
        // Save to the dist directory
        .pipe(gulp.dest("dist/"));
});

// Bundle the library w/ the fabric-ui css
gulp.task("package-fabric-bundle", ["update-lib-reference"], () => {
    // Get the source files
    return gulp.src(["build/lib/css/fabric.min.css", "build/lib/css/fabric.components.min.css", "build/lib/css/gd-sprest-js.css", "build/index.js"])
        // Run webpack to bundle the library
        .pipe(gulpWebpack({
            output: {
                filename: "gd-sprest-fabric.js",
            },
            module: {
                loaders: [
                    {
                        test: /\.css$/,
                        use: [
                            { loader: "style-loader" },
                            { loader: "css-loader" }
                        ]
                    },
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        use: [
                            {
                                loader: "babel-loader",
                                options: {
                                    presets: ["es2015"]
                                }
                            }
                        ]
                    }
                ]
            }
        }, webpack))
        // Save to the dist directory
        .pipe(gulp.dest("dist/"));
});

// Minify the bundle w/ the fabric-ui css
gulp.task("package-fabric-minify", ["package-fabric-bundle"], () => {
    // Get the source files
    return gulp.src(["dist/gd-sprest-fabric.js"])
        // Minify the bundle
        .pipe(uglify())
        // Update the file extension
        .pipe(rename({ suffix: ".min" }))
        // Save to the dist directory
        .pipe(gulp.dest("dist/"));
});

// Update the lib reference
gulp.task("update-lib-reference", ["copy-lib"], () => {
    // Get the source file
    return gulp.src(["build/fabric/fabric.js", "build/fabric/fabric.d.ts"])
        // Replace the reference to jquery
        .pipe(replace(/office-ui-fabric-js\/dist/g, '../lib'))
        // Output to the build directory
        .pipe(gulp.dest("build/fabric"));
});

// Default
gulp.task("default", ["clean", "build", "copy-lib", "update-lib-reference", "package"]);