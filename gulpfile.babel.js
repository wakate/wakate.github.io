import gulp         from "gulp";
import loadPlugins  from "gulp-load-plugins";

import del          from "del";
import path         from "path";

import config       from "./config";

const $             = loadPlugins();
const p             = path.join.bind(__dirname)


// ---- tasks ------------------------------------------------

gulp.task("clean", () => {
  del([p(config.dest)], { dot: true });
});

