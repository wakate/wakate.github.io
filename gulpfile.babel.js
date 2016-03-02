import gulp         from "gulp";
import loadPlugins  from "gulp-load-plugins";

import del          from "del";
import path         from "path";
import browserSync  from "browser-sync";
import kss          from "kss";

import config       from "./config";

const $             = loadPlugins();
const reload        = browserSync.reload;


// ---- configurations ------------------------------------------------
const p             = path.join;
const src           = path.join(__dirname, "source");
const dest          = path.join(__dirname, config.dest);
const styleEntries  = config.src.styles.entries;
const stylesPath    = path.join.bind(__dirname, config.src.styles.dir);
const styleFiles    = styleEntries.map(file => stylesPath(file));
const styleguideTemplate  = path.join(__dirname, config.src["styleguide-template"].dir)

const kssOpts = {
  source:       stylesPath(),
  destination:  `${dest}/styleguide`,
  mask:         '"*.scss"',
  template:     styleguideTemplate,
  css:          styleEntries.map((entry) => `/${entry.replace(/\.scss$/, ".css")}`)
};


// ---- styles ------------------------------------------------
gulp.task("lint:scss", () => {
  return gulp.src(stylesPath("**/*.scss"))
    .pipe($.sassLint())
    .pipe($.sassLint.format())
    .pipe($.sassLint.failOnError())
});

gulp.task("build:styleguide", $.shell.task([
  `\$(npm bin)/kss-node <%= opts %>`
], {
  templateData: {
    opts: Object.keys(kssOpts).map((k) => `--${k} ${kssOpts[k]}`).join(" ")
  }
}));

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

  gulp.watch([stylesPath("**/*.scss")], ["build:scss", "build:styleguide"]);
  gulp.watch([path.join(src, "**/*")], reload);
});

gulp.task("build", ["build:scss", "build:styleguide"]);
