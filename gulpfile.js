var clean = require("gulp-clean");
var gulp = require("gulp");
var gulpWebpack = require("gulp-webpack");
var insert = require("gulp-insert");
var rename = require("gulp-rename");
var replace = require("gulp-replace");
var sass = require("gulp-sass");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");
var uglifycss = require("gulp-uglifycss");
var webpack = require("webpack");

// Build
gulp.task("build", ["clean", "fabric-minify"], () => {
    // Get the source files
    return gulp.src("src/**/*.ts")
        // Send them to the typescript compiler
        .pipe(ts.createProject("tsconfig.json")())
        // Output to the build directory
        .pipe(gulp.dest("build"));
});

// Build SASS (Components Only)
gulp.task("build-sass-components", () => {
    // Get the source files
    return gulp.src("src/sass/fabric.components.scss")
        // Send them to the node-sass compiler
        .pipe(sass().on("error", sass.logError))
        // Fix the ms-ContextualHost class
        .pipe(replace(/\.fabric \.ms-ContextualHost/g, ".fabric.ms-ContextualHost"))
        // Fix the ms-PanelHost class
        .pipe(replace(/\.fabric \.ms-PanelHost/g, ".fabric.ms-PanelHost"))
        // Output to a css file
        .pipe(gulp.dest("build/lib/css"));
});

// Build SASS (Fabric Core + Components)
gulp.task("build-sass-fabric", ["build-sass-components"], () => {
    // Get the source files
    return gulp.src("src/sass/fabric.scss")
        // Send them to the node-sass compiler
        .pipe(sass().on("error", sass.logError))
        // Fix the ms-ContextualHost class
        .pipe(replace(/\.fabric \.ms-ContextualHost/g, ".fabric.ms-ContextualHost"))
        // Fix the ms-PanelHost class
        .pipe(replace(/\.fabric \.ms-PanelHost/g, ".fabric.ms-PanelHost"))
        // Output to a css file
        .pipe(gulp.dest("build/lib/css"));
});

// Clean
gulp.task("clean", () => {
    // Get the build and dist folders
    return gulp.src(["./build", "./dist"])
        // Delete them
        .pipe(clean());
});

// Copy the libraries
gulp.task("copy-lib", ["copy-fabric-js", "copy-fabric-lib-jquery", "copy-fabric-lib-pickadate"]);

// Copy the css
gulp.task("copy-css", ["build"], () => {
    // Get the source file
    return gulp.src(["build/lib/css/fabric.css", "build/lib/css/fabric.min.css", "build/lib/css/fabric.components.css", "build/lib/css/fabric.components.min.css"])
        // Output to the dist directory
        .pipe(gulp.dest("dist"));
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

// Minify the fabric css file
gulp.task("fabric-minify", ["build-sass-fabric"], () => {
    // Get the source files
    return gulp.src(["build/lib/css/fabric.css", "build/lib/css/fabric.components.css"])
        // Minify the bundle
        .pipe(uglifycss({
            "maxLineLen": 80,
            "uglyComments": true
        }))
        // Update the file extension
        .pipe(rename({ suffix: ".min" }))
        // Save to the dist directory
        .pipe(gulp.dest("build/lib/css/"));
});

// Package the library
gulp.task("package", ["package-minify-components", "package-minify-fabric"]);

// Bundle the library
gulp.task("package-components", ["update-lib-reference"], () => {
    // Get the source files
    return gulp.src(["build/lib/css/fabric.components.min.css", "node_modules/core-js/es6/promise", "build/index.js"])
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

// Bundle the library with fabric
gulp.task("package-fabric", ["update-lib-reference"], () => {
    // Get the source files
    return gulp.src(["build/lib/css/fabric.min.css", "node_modules/core-js/es6/promise", "build/index.js"])
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

// Minify the bundle
gulp.task("package-minify-components", ["package-components"], () => {
    // Get the source files
    return gulp.src(["dist/gd-sprest-js.js"])
        // Minify the bundle
        .pipe(uglify())
        // Update the file extension
        .pipe(rename({ suffix: ".min" }))
        // Save to the dist directory
        .pipe(gulp.dest("dist/"));
});

// Minify the bundle
gulp.task("package-minify-fabric", ["package-fabric"], () => {
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
gulp.task("default", ["clean", "build", "copy-css", "copy-lib", "update-lib-reference", "package"]);