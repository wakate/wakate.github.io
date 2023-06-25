import gulp from "gulp";
import gulpLoadPlugins from 'gulp-load-plugins';
import del from "del";
import path from "path";
import browserSync from 'browser-sync';
import gulpSass from 'gulp-sass';
import dartSass from 'sass';

import config from "./config";

const server = browserSync.create();
const $ = gulpLoadPlugins();
const sass = gulpSass(dartSass);

// ---- configurations ------------------------------------------------
const dest              = config.dest;
const buildDir          = config.build;
const styleEntries      = config.src.styles.entries;
const stylesPath        = path.join(config.src.styles.dir, "**/*.scss");
const styleIncludePaths = config.src.styles.include_paths;
const fontPaths         = config.src.fonts.dirs;

const deployOpts = {
  branch: "master"
};


// ---- styles ------------------------------------------------
gulp.task("lint:scss", () => {
  return gulp.src(stylesPath)
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
});

gulp.task("build:scss", () => {
  const styleFiles = styleEntries.map(file => path.join(config.src.styles.dir, file));
  return gulp.src(styleFiles)
    .pipe($.plumber({
      errorHandler: function(e) {
        console.log(e.messageFormatted);
        this.emit('end');
      }
    }))
    .pipe(sass({includePaths: styleIncludePaths}))
    .pipe(gulp.dest(dest));
});


// ---- misc ------------------------------------------------
gulp.task("clean", () => {
  del([dest], { dot: true });
});

gulp.task("copy:fonts", () => {
  return gulp.src(fontPaths.map(p => path.join(p, "**/*")))
    .pipe(gulp.dest(path.join(dest, "fonts")));
});


// ---- build ------------------------------------------------

// ref: https://github.com/gulpjs/gulp/blob/master/docs/recipes/minimal-browsersync-setup-with-gulp4.md
function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    open: false,
    proxy: "localhost:4567",
    reloadDelay: 2000
  });
  done();
}

const watch = () => {
  gulp.watch(stylesPath, gulp.task("build:scss"));
  gulp.watch("source/**/*", gulp.task(reload));
};

gulp.task("watch", gulp.series(serve, watch));

gulp.task("build", gulp.series("build:scss", "copy:fonts"));

gulp.task("deploy", () => {
  return gulp.src(path.join(buildDir, "**/*"))
    .pipe($.ghPages(deployOpts));
});
