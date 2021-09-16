let { src, dest } = require('gulp');
let gulp = require('gulp');
let imagemin = require('gulp-imagemin');
let webp = require('imagemin-webp');
let newer = require('gulp-newer');
let rename = require('gulp-rename');
let del = require('del');
let clean = require('gulp-clean');
let fs = require('fs');

let src_folder = 'src';
let oldDirName = src_folder + '/new/';
let newDirName = src_folder + '/img/';

let path = {
  build: {
    images: src_folder + '/new/',
  },
  src: {
    towebp: [src_folder + '/img/**/*.{jpg,png,webp}', '!**/favicon.*'],
    other: [
      src_folder + '/img/**/*.{jpg,png,webp,svg,gif,ico}',
      '!**/favicon.*',
    ],
  },
  clean: src_folder + '/img/',
};

async function renameDir() {
  fs.rename(oldDirName, newDirName, (err) => {
    if (err) {
      throw err;
    }

    console.log('Directory renamed successfully.');
  });
}

function images() {
  return src(path.src.towebp)
    .pipe(newer(path.build.images))
    .pipe(
      imagemin([
        webp({
          quality: 75,
        }),
      ])
    )
    .pipe(
      rename({
        extname: '.webp',
      })
    )
    .pipe(dest(path.build.images))
    .pipe(src(path.clean))
    .pipe(clean(path.clean))
    .pipe(src(path.src.other))
    .pipe(newer(path.build.images))
    .pipe(
      imagemin({
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        interlaced: true,
        optimizationLevel: 3, // 0 to 7
      })
    )
    .pipe(dest(path.build.images));
}

let final = gulp.series(images, renameDir);

exports.images = images;
exports.renameDir = renameDir;
exports.final = final;
