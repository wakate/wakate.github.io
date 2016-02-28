import gulp         from "gulp";
import loadPlugins  from "gulp-load-plugins";

import del          from "del";
import path         from "path";

import config       from "./config";

const $             = loadPlugins();


// ---- configurations ------------------------------------------------
const dest          = path.join(__dirname, config.dest)
const stylesPath    = path.join.bind(__dirname, config.src.styles.dir);
const styleFiles    = config.src.styles.entries.map(file => stylesPath(file));


// ---- styles ------------------------------------------------
gulp.task("lint:scss", () => {
  return gulp.src(stylesPath("**/*.scss"))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
});

gulp.task("build:scss", () => {
  return gulp.src(styleFiles)
    .pipe($.sassGlob())
    .pipe($.sass())
    .pipe(gulp.dest(dest));
});


// ---- misc ------------------------------------------------
gulp.task("clean", () => {
  del([dest], { dot: true });
});


// ---- build ------------------------------------------------
gulp.task("watch", () => {
  gulp.watch([stylesPath("**/*.scss")], ["build:scss"]);
});

gulp.task("build", ["build:scss"]);
