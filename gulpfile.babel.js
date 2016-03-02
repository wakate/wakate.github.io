import gulp         from "gulp";
import loadPlugins  from "gulp-load-plugins";

import del          from "del";
import path         from "path";
import browserSync  from "browser-sync";

import config       from "./config";

const $             = loadPlugins();
const reload        = browserSync.reload;


// ---- configurations ------------------------------------------------
const p             = path.join;
const src           = path.join(__dirname, "source");
const dest          = path.join(__dirname, config.dest);
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
    .pipe($.plumber({
      errorHandler: function(e) {
        console.log(e.messageFormatted);
        this.emit('end');
      }
    }))
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
  browserSync.init({
    open: false,
    proxy: "localhost:4567",
    reloadDelay: 2000
  });

  gulp.watch([stylesPath("**/*.scss")], ["build:scss"]);
  gulp.watch([path.join(src, "**/*")], reload);
});

gulp.task("build", ["build:scss"]);
