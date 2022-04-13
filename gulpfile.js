const { src, dest, parallel, series, watch } = require('gulp'),
    prefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    cssmin = require('gulp-minify-css'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    imageminPngquant = require('imagemin-pngquant'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload;
    
    // Пути
    var path = {
      build: { 
          html: 'build/',
          js: 'build/js/',
          css: 'build/css/',
          img: 'build/img/',
          fonts: 'build/fonts/'
      },
      src: { 
          html: 'src/*.html', 
          js: 'src/js/**/*.js',
          style: 'src/style/**/*.less',
          img: 'src/img/**/*.*', 
          fonts: 'src/fonts/**/*.*'
      },
      watch: { 
          html: 'src/**/*.html',
          js: 'src/js/**/*',
          style: 'src/style/**/*',
          img: 'src/img/**/*.*',
          fonts: 'src/fonts/**/*.*'
      },
      clean: './build'
  };

  var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
};

//Запускаем сервер
function server(){
  build();
  browserSync(config);
}

function build(){
  html();
  css();
  js();
  image();
  fonts();
}

//HTML
function html() {
  return src(path.src.html) //Выберем файлы по нужному пути
  .pipe(dest(path.build.html)) //Выплюнем их в папку build
  .pipe(reload({stream: true})); //И перезагрузим наш сервер для обновлений
}

// Стили
function css() {
  return src(path.src.style) //Выберем наш main.less
  .pipe(sourcemaps.init()) //То же самое что и с js
  .pipe(less()) //Скомпилируем
  .pipe(prefixer()) //Добавим вендорные префиксы
  .pipe(cssmin()) //Сожмем
  .pipe(sourcemaps.write())
  .pipe(dest(path.build.css)) //И в build
  .pipe(reload({stream: true}));
}

// JS
function js() {
  return src(path.src.js) //Найдем наш main файл
  .pipe(sourcemaps.init()) //Инициализируем sourcemap
  .pipe(sourcemaps.write()) //Пропишем карты
  .pipe(dest(path.build.js)) //Выплюнем готовый файл в build
  .pipe(reload({stream: true})); //И перезагрузим сервер
}
console.log(imageminPngquant);
// Картинки
function image(){
  return src(path.src.img) //Выберем наши картинки
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
      ]))
      .pipe(dest(path.build.img)) //И бросим в build
      .pipe(reload({stream: true}));
};

// Шрифты
function fonts(){
  return src(path.src.fonts)
  .pipe(dest(path.build.fonts))
};

// Следим за всеми изменениями
function watchAll(){
  watch(path.watch.html, html);
  watch(path.watch.style, css);
  watch(path.watch.js, js);
  watch(path.watch.img, image);
  watch(path.watch.fonts, fonts);
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.image = image;
exports.fonts = fonts;
exports.default = parallel(server,watchAll);