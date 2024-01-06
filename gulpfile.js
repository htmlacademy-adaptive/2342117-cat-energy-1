import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import squoosh from 'gulp-libsquoosh';
import svgo from 'gulp-svgmin';
import svgstore from 'gulp-svgstore';
import del from 'del';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(gulp.dest('build'));
}

// Scripts

const scripts = () => {
  return gulp.src('source/js/script.js')
    .pipe(gulp.dest('build/js'))
    .pipe(browser.stream());
}

// Images

const optimizeImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh())
    .pipe(gulp.dest('build/img'))
}

const copyImages = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(gulp.dest('build/img'))
}

// WebP

const createWebp = () => {
  return gulp.src('source/img/**/*.{png,jpg}')
    .pipe(squoosh({
      webp: {}
    }))
    .pipe(gulp.dest('build/img'))
}

// SVG

const svg = () =>
  gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
    .pipe(svgo())
    .pipe(gulp.dest('build/img'));

const sprite = () => {
  return gulp.src('source/img/icons/*.svg')
    .pipe(svgo())
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('build/img'));
}

// Copy

const copy = (done) => {
  gulp.src([
    'source/fonts/*.{woff2,woff}',
    'source/*.ico',
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

// Clean

const clean = () => {
  return del('build');
};

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/sass/**/*.scss', gulp.series(styles));
  gulp.watch('source/js/script.js', gulp.series(scripts));
  gulp.watch('source/*.html', gulp.series(html, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  optimizeImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  copyImages,
  gulp.parallel(
    styles,
    html,
    scripts,
    svg,
    sprite,
    createWebp
  ),
  gulp.series(
    server,
    watcher
  ));




// Gulp — автоматизирует процессы, например компиляцию sass в css, минификацию файлов, оптимизацию картинок и т д. Инструкции для автоматизации находятся в

// gulpfile.js — файл с управляющими инструкциями, которые указывают, как именно будет происходить автоматизация.


// из чего состоит gulpfile.js.
// ПЕРВАЯ ЧАСТЬ - ДОБАВЛЯЕТ ПРОГРАММЫ:
// import gulp from 'gulp' - подключает сборку
// и ниже пошли подключение пакетов описанные в package.json



// ВТОРАЯ ЧАСТЬ - СОЗДАНИЕ ЗАДАЧ ПО АВТОМАТИЗАЦИИ
// 1. компилирует файлы SCSS в CSS, применяет к ним постобработку и сохраняет результаты в указанной директории
// export const styles = () => {
//   return gulp.src('source/sass/style.scss', { sourcemaps: true })
//     .pipe(plumber())
//     .pipe(sass().on('error', sass.logError))
//     .pipe(postcss([
//       autoprefixer(),
//       csso()
//     ]))
//     .pipe(rename('style.min.css'))
//     .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
//     .pipe(browser.stream());
// }
// Загружает файл "style.scss" из директории "source/sass
// Компилирует SCSS в CSS с использованием плагина Gulp - sass, обрабатывая ошибки при помощи плагина Plumber.
// Применяет постобработку CSS с помощью плагинов PostCSS, таких как Autoprefixer и Csso.
// Переименовывает итоговый файл в "style.min.css".
// Сохраняет итоговый файл в директории "build/css" с созданием карты исходного кода.
// Обновляет браузер при помощи BrowserSync.

// 2. копирует файлов HTML из директории "source" в директорию "build".
// const html = () => {
//   return gulp.src('source/*.html')
//     .pipe(gulp.dest('build'));
// }

// 3. копирует файлы "script.js" из директории "source/js" в директорию "build/js".
// const scripts = () => {
//   return gulp.src('source/js/script.js')
//     .pipe(gulp.dest('build/js'))
//     .pipe(browser.stream());
// }

// 4. обрабатывает PNG и JPG
// const optimizeImages = () => {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     .pipe(squoosh())
//     .pipe(gulp.dest('build/img'))
// }
// Загружает PNG и JPG из директории "source/img", сжимает изображения с помощью плагина squoosh.
// Сохраняет сжатые изображения в директорию "build/img".

// const copyImages = () => {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     .pipe(gulp.dest('build/img'))
// }
// Копирует PNG и JPG из директории "source/img" в директорию "build/img" без сжатия.

// 5. Конвертирует изображения в формат WebP
// const createWebp = () => {
//   return gulp.src('source/img/**/*.{png,jpg}')
//     .pipe(squoosh({
//       webp: {}
//     }))
//     .pipe(gulp.dest('build/img'))
// }
// Загружает PNG и JPG из директории "source/img" с помощью gulp.src.
// Конвертирует изображения в формат WebP с помощью плагина squoosh.
// Сохраняет конвертированные изображения в директорию "build/img".
//   WebP - это формат изображений, который обеспечивает более высокое сжатие и более быструю загрузку изображений в сравнении с форматами PNG и JPG.

// 6. оптимизируют svg

// const svg = () =>
//   gulp.src(['source/img/*.svg', '!source/img/icons/*.svg'])
//     .pipe(svgo())
//     .pipe(gulp.dest('build/img'));
//     Загружает SVG - из директории "source/img", кроме тех, которые находятся "source/img/icons".
//     Оптимизирует SVG -  с помощью плагина svgo.
//     Сохраняет оптимизированные SVG - в "build/img".

// const sprite = () => {
//   return gulp.src('source/img/icons/*.svg')
//     .pipe(svgo())
//     .pipe(svgstore({
//       inlineSvg: true
//     }))
//     .pipe(rename('sprite.svg'))
//     .pipe(gulp.dest('build/img'));
// }
// Загружает SVG - из "source/img/icons".
// Оптимизирует SVG - с помощью плагина svgo.
// Объединяет SVG -  в один файл с помощью плагина svgstore.
// Переименовывает итоговый файл в "sprite.svg".
// Сохраняет итоговый файл в директорию "build/img".

// 7. Copy - копирует файлы шрифтов и файлы иконок в директорию "build"
// const copy = (done) => {
//   gulp.src([
//     'source/fonts/*.{woff2,woff}',
//     'source/*.ico',
//   ], {
//     base: 'source'
//   })
//     .pipe(gulp.dest('build'))
//   done();
// }

// 8. // Clean - Удаляет все файлы из директории "build" с помощью плагина del

// const clean = () => {
//   return del('build');
// };

// 9. // Server - запускает  сервер BrowserSync

// const server = (done) => {
//   browser.init({
//     server: {
//       baseDir: 'build'
//     },
//     cors: true,
//     notify: false,
//     ui: false,
//   });
//   done();
// }

// 10. // Reload перезагружает подключенные браузеры, тем самым автоматически обновляет отображения стр

// const reload = (done) => {
//   browser.reload();
//   done();
// }

// ТРЕТЬЯ ЧАСТЬ - НАБЛЮДАТЕЛИ
// Здесь перечислены наблюдатели или вотчеры, которые следят за указанными файлами и при любых изменениях в наблюдаемых файлах запускают задачи.
// 11. // Watcher - эта функция отслеживает изменения в файлах и запускает соответствующих задачи. Это позволяет увидеть изменения в реальном времени, без необходимости вручную обновлять страницу в браузере.
// const watcher = () => {
//   gulp.watch('source/sass/**/*.scss', gulp.series(styles));
//   gulp.watch('source/js/script.js', gulp.series(scripts));
//   gulp.watch('source/*.html', gulp.series(html, reload));
// }

// Файлы .scss - вызывает задачу styles.
// Файл script.js - вызывает задачу scripts.
// Файлы .html -  вызывает задачу html, а затем перезагружает страницу в браузере с помощью функции reload.

// 12. // Build - сборка

// export const build = gulp.series(
//   clean,
//   copy,
//   optimizeImages,
//   gulp.parallel(
//     styles,
//     html,
//     scripts,
//     svg,
//     sprite,
//     createWebp
//   ),
// );
// Очищает директорию "build" с помощью функции clean.
// Копирует необходимые файлы в директорию "build" с помощью функции copy.
// Оптимизирует изображения с помощью функции optimizeImages.
// Запускает параллельно несколько задач с помощью функции gulp.parallel:
// Компилирует SASS - файлы в CSS с помощью функции styles.
// Компилирует HTML - файлы с помощью функции html.
// Компилирует JavaScript - файлы с помощью функции scripts.
// Обрабатывает SVG - изображения с помощью функции svg.
// Создает спрайт SVG - изображений с помощью функции sprite.
// Конвертирует изображения в формат WebP с помощью функции createWebp.

// ЧЕТВЕРТАЯ ЧАСТЬ - ЦЕПОЧКИ ЗАДАЧ
// Описание самых главных задач, которые управляют всеми мелкими задачами.
// 13. // Default - запускает задачи по умолчанию

// export default gulp.series(
//   clean,
//   copy,
//   copyImages,
//   gulp.parallel(
//     styles,
//     html,
//     scripts,
//     svg,
//     sprite,
//     createWebp
//   ),
//   gulp.series(
//     server,
//     watcher
//   ));



// Функция Default выполняет следующие действия:
// Очищает директорию "build" с помощью функции clean.
// Копирует необходимые файлы в директорию "build" с помощью функции copy.
// Копирует изображения в директорию "build/img" с помощью функции copyImages.
// Запускает параллельно несколько задач с помощью функции gulp.parallel:
// Компилирует SASS - файлы в CSS с помощью функции styles.
// Компилирует HTML - файлы с помощью функции html.
// Компилирует JavaScript - файлы с помощью функции scripts.
// Обрабатывает SVG - изображения с помощью функции svg.
// Создает спрайт SVG - изображений с помощью функции sprite.
// Конвертирует изображения в формат WebP с помощью функции createWebp.
// Запускает последовательно две задачи с помощью функции gulp.series:
// Запускает сервер BrowserSync с помощью функции server.
// Запускает наблюдение за изменениями файлов с помощью функции watcher.
// Экспортирует функцию Default в качестве значения по умолчанию.
