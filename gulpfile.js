/// <binding ProjectOpened='default' />
const { watch, src, dest, on } = require('gulp');
const del = require('del');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const transformManifest = require('./gulp-transformManifest');

const version = "9.2.0";

const scriptSource = 'uSync.Assets/scripts';
const styleSource = 'uSync.Assets/css';

// we still need to do this on dev to copy the lang files.
const pluginSource = 'uSync.Assets/App_Plugins/';

const destination = 'uSync.Site/App_Plugins/';
const minDest = 'uSync.Assets/wwwroot';

function copy(path, baseFolder) {
    return src(path, { base: baseFolder })
        .pipe(dest(destination));
}

function minifyJs(path) {

    return src(path, { base: path })
        .pipe(sourcemaps.init())
            .pipe(concat('usync.' + version + '.min.js'))
            .pipe(uglify({ mangle: false }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(minDest));
}


function minifyCss(path) {
    return src(path, { base: path })
        .pipe(cleanCSS({ compatibility: 'ie8'}))
        .pipe(concat('usync.' + version + '.min.css'))
        .pipe(dest(minDest));
}

function copyRequired(path, baseFolder, destFolder) {
    return src([path, '!**/*.manifest', '!**/*.js', '!**/*.css'], { base: baseFolder })
        .pipe(dest(destFolder));
}

function time() {
    return '[' + new Date().toISOString().slice(11, -5) + ']';
}

/*
function updateManifest(manifest) {

    return src(manifest)
        .pipe(transformManifest({
            folder : pluginName,
            name: pluginName.toLowerCase(),
            version: version
        }))
        .pipe(dest(minDest + pluginName));

}
*/

function doMinify(cb)
{
    let jsfiles = scriptSource + '**/*.js';
    let cssFiles = styleSource + '**/*.css';

    minifyJs(jsfiles);
    minifyCss(cssFiles);
}

////////////
exports.default = function() 
{
        let source = pluginSource + '**/*';

        // let jsfiles = scriptSource + '**/*.js';
        // let cssFiles = styleSource + '**/*.css';
        
        watch(source, { ignoreInitial: false })
            .on('change', function (path, stats) {
                console.log(time(), path, 'changed');
                copy(path, pluginSource);
                doMinify();
            })
            .on('add', function (path, stats) {
                console.log(time(), path, 'processed');
                copy(path, pluginSource);
                doMinify();
            });
}

exports.minify = function (cb) {
    doMinify();
    cb();
};