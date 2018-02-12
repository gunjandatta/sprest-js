var gulp = require("gulp");
var clean = require("gulp-clean");
var insert = require("gulp-insert");
var replace = require("gulp-replace");
var ts = require("gulp-typescript");
var uglify = require("gulp-uglify");

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

// Copy the fabric css
gulp.task("copy-fabric-css", ["build"], () => {
    // Copy the css libraries
    return gulp.src([
        "node_modules/office-ui-fabric-js/dist/css/fabric.min.css",
        "node_modules/office-ui-fabric-js/dist/css/fabric.components.min.css"
    ])
        // Copy to the build folder
        .pipe(gulp.dest("build/node_modules/office-ui-fabric-js/dist/css"));
});

// Copy the fabric js
gulp.task("copy-fabric-js", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/js/fabric.min.js")
        // Prepend an import of the jquery library
        .pipe(insert.prepend("var $ = require('../lib/jquery');"))
        // Prepend an import of the pickadate library
        .pipe(insert.prepend("require('../lib/pickadate');"))
        // Append an export statement to the library
        .pipe(insert.append("exports.fabric = fabric;"))
        // Output to the build directory
        .pipe(gulp.dest("build/node_modules/office-ui-fabric-js/dist/js"));
});

// Copy the fabric lib-jquery
gulp.task("copy-fabric-lib-jquery", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/lib/jquery.js")
        // Output to the build directory
        .pipe(gulp.dest("build/node_modules/office-ui-fabric-js/dist/lib"));
});

// Copy the fabric lib-pickadate
gulp.task("copy-fabric-lib-pickadate", ["build"], () => {
    // Get the source file
    return gulp.src("node_modules/office-ui-fabric-js/dist/lib/pickadate.js")
        // Replace the reference to jquery
        .pipe(replace(/\"jquery\"/g, '"./jquery.js"'))
        // Output to the build directory
        .pipe(gulp.dest("build/node_modules/office-ui-fabric-js/dist/lib"));
});

// Default
gulp.task("default", ["clean", "build", "copy-fabric-css", "copy-fabric-js", "copy-fabric-lib-jquery", "copy-fabric-lib-pickadate"]);