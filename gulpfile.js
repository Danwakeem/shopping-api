const gulp = require('gulp');
const zip = require('gulp-zip');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');

const zipper = (name) => gulp.src([`${name}/*.js`, 'node_modules/**', 'package.json'], { base : "." })
  .pipe(gulpif(`${name}/*.js`, rename((path) => path.dirname = '')))
  .pipe(zip(`${name}.zip`, {base: './source/'}))
  .pipe(gulp.dest('build'));

gulp.task('zip:find:find', () => zipper('GET/find'));

gulp.task('zip:id:id', () => zipper('GET/id'));

gulp.task('zip', [
  'zip:id:id',
  'zip:find:find',
]);