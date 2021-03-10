const { src, dest, series, parallel, watch } = require('gulp');

const sass = require('gulp-sass');
sass.compiler = require('node-sass');	
const cleanCSS = require('gulp-clean-css');
const browserSync = require('browser-sync').create();

const path = {
    src: './src',
    dest: './build'
}

//Compila o sass
const compileSass = async _ => {
    return src(`${path.src}/sass/stylePrincipal.scss`)
        .pipe(sass().on('error', sass.logError))
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(dest(`${path.dest}/css`));
}

// Monta o JS
const javascriptBuild = async _ => {
    return src(`${path.src}/js/scripts_main.js`)
    .pipe(dest(`${path.dest}/js`));
}
const bsReload = _ => browserSync.reload;

// Observa mudanças no sass e no JS
const watchSass = _ =>  watch(path.src+'/**/*.scss', compileSass);

const watchJs = _ =>  watch(path.src+'/**/*.js', javascriptBuild);

const watchReloadJs = _ =>  watch(path.src+'/**/*.js').on("change", browserSync.reload);

const watchReloadJson = _ =>  watch(path.src+'/**/*.json').on("change", browserSync.reload);

const watchReloadCss = _ =>  watch(path.src+'/**/*.scss').on("change", browserSync.reload);

const watchHtml = _ =>  watch('./index.html', bsReload);

const bSyncServer = _ => browserSync.init( { server: { baseDir: "./" }} );

exports.local = series(compileSass, javascriptBuild, parallel( watchHtml, watchSass, watchJs, watchReloadCss, watchReloadJs, watchReloadJson, bSyncServer) );