const gulp = require("gulp");
const typescript = require("gulp-typescript");
const rollup = require("rollup-stream")
const sourcemaps = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const source = require("vinyl-source-stream")
const buffer = require("vinyl-buffer")

const tsProject = typescript.createProject("tsconfig.json");

function compile() {
    return gulp.src("./src/*.ts")
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist/lib"));
}

function pack() {
    return rollup({
        input: './dist/lib/index.js',
        sourcemap: true,
        format: "umd",
        name: "mson.js"
    })
        .pipe(source("index.js", "./dist/lib"))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(rename("mson.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("./dist"));
}

function build() {
    return gulp.series(compile, pack)
}

module.exports = {
    compile,
    pack,
    build,
}
