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

// Copy the libraries
gulp.task("copy-lib", ["copy-fabric-css", "copy-fabric-js", "copy-fabric-lib-jquery", "copy-fabric-lib-pickadate", "copy-styles"]);

// Copy the fabric css
gulp.task("copy-fabric-css", ["build"], () => {
    // Copy the css libraries
    return gulp.src([
        "node_modules/office-ui-fabric-js/dist/css/fabric.min.css",
        "node_modules/office-ui-fabric-js/dist/css/fabric.components.min.css"
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

// Update the lib reference
gulp.task("update-lib-reference", ["copy-lib"], () => {
    // Get the source file
    return gulp.src(["build/fabric.js", "build/fabric.d.ts"])
        // Replace the reference to jquery
        .pipe(replace(/office-ui-fabric-js\/dist/g, './lib'))
        // Output to the build directory
        .pipe(gulp.dest("build"));
});

// Default
gulp.task("default", ["clean", "build", "copy-lib", "update-lib-reference"]);