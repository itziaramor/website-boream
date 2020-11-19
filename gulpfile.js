var gulp = require("gulp");

var babel = require("gulp-babel");
var imagemin = require("gulp-imagemin");
var changed = require("gulp-changed");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var assets = require("postcss-assets");
var autoprefixer = require("autoprefixer");
var sourcemaps = require("gulp-sourcemaps");
var mqpacker = require("css-mqpacker");
var cssnano = require("cssnano");
var plumber = require("gulp-plumber");
var uglify = require("gulp-uglify");
var pump = require("pump");
var jshint = require("gulp-jshint");
var stylish = require("jshint-stylish");
var runSequence = require("run-sequence");
var browserSync = require("browser-sync").create();
var clean = require("gulp-clean");
var del = require("del");
var vinylPaths = require("vinyl-paths");
var iconfont = require("gulp-iconfont");
var iconfontCss = require("gulp-iconfont-css");
var series = require("stream-series");
var inject = require("gulp-inject");
var replace = require("gulp-replace-path");
var svgmin = require("gulp-svgmin");
var rename = require("gulp-rename");
var htmlreplace = require("gulp-html-replace");
var concat = require("gulp-concat");
var pug = require("gulp-pug");
var data = require("gulp-data");
var path = require("path");

var config = require("./config.json");

// DEVELOPMENT SERVER
gulp.task("browserSync", function() {
  browserSync.init({
    server: {
      baseDir: config.server
    }
  });
});

// CLEAN
gulp.task("clean:dist", function() {
  return gulp.src(config.paths.dist.root, { read: false }).pipe(clean());
});

// BORRO HTML
gulp.task("clean:html", function() {
  return gulp.src(config.paths.dist.files, { read: false }).pipe(clean());
});

// CLEAN JS
gulp.task("clean:tmp", function() {
  return gulp.src(config.paths.tmp.root, { read: false }).pipe(clean());
});

// IMPORT LIBARIES
gulp.task("import:libs", function() {
  gulp
    .src(config.paths.dev.jsLibFiles)
    .pipe(gulp.dest(config.paths.dist.jsLibFolder));
});

// COPY FONTS
gulp.task("copy:fonts", function() {
  gulp
    .src(config.paths.dev.fonts)
    .pipe(changed(config.paths.dist.fonts))
    .pipe(gulp.dest(config.paths.dist.fonts));
});

// COPY SPRITE
gulp.task("copy:sprite", function() {
  gulp
    .src(config.paths.dev.svgSprite)
    .pipe(gulp.dest(config.paths.dist.images));
});

// COPY FILES
gulp.task("copy:files", function() {
  gulp
    .src(config.paths.dev.root + "*.*", { base: config.paths.dev.root })
    .pipe(gulp.dest(config.paths.dist.root));

  gulp
    .src(config.paths.dev.fonts)
    .pipe(changed(config.paths.dist.fonts))
    .pipe(gulp.dest(config.paths.dist.fonts));

  gulp
    .src(config.paths.dev.video)
    .pipe(changed(config.paths.dist.video))
    .pipe(gulp.dest(config.paths.dist.video));

  // gulp.src(config.paths.dev.cssAllFiles).pipe(gulp.dest(config.paths.dist.css));

  gulp
    .src(config.paths.dev.imagesAllFiles)
    .pipe(gulp.dest(config.paths.dist.images));
});

// COPY EMAILS
gulp.task("copy:emails", function() {
  gulp.src(config.paths.dev.emails).pipe(gulp.dest(config.paths.dist.root));
});

// COMPILE SCSS
gulp.task("scss", function() {
  function handleErrors() {
    var gutil = require("gulp-util");
    var args = Array.prototype.slice.call(arguments);

    gutil.log(gutil.colors.white.bgRed.underline.bold("Gulp error:"));
    gutil.log(gutil.colors.red(args));

    // continue with gulp tasks
    this.emit("end");
  }

  var postCssOpts = [
    assets({ loadPaths: [config.paths.dev.images] }),
    autoprefixer({
      overrideBrowserslist: [
        "last 2 versions",
        "safari 5",
        "ie 11",
        "opera 12.1",
        "ios 6",
        "android 4"
      ],
      grid: "autoplace"
    }),
    mqpacker({
      sort: true
    }),
    cssnano
  ];

  return gulp
    .src(config.paths.dev.scssIndex)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(postcss(postCssOpts))
    .pipe(
      sourcemaps.write(".", {
        includeContent: false,
        sourceRoot: config.paths.dev.scss
      })
    )
    .on("error", handleErrors)
    .pipe(gulp.dest(config.paths.dist.css));
});

// INJECT DEPENDENCIES (PUG)
gulp.task("inject", function() {
  var target = gulp.src(config.paths.dev.pugIncludesHead);
  var sources = gulp.src(config.paths.dev.cssMainFile, { read: false });
  var vendorStream = gulp.src(["./dev/js/vendors/*.js"], { read: false });
  var appStream = gulp.src(config.paths.dev.jsAppFiles, { read: false });

  return target
    .pipe(inject(series(sources, vendorStream, appStream)))
    .pipe(replace(/\/dev\//g, "assets/"))
    .pipe(gulp.dest(config.paths.dev.pugIncludes))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// COMPILE PUG
gulp.task("pug", function buildHTML() {
  return gulp
    .src(config.paths.dev.pugFiles)
    .pipe(
      data(function(file) {
        // return JSON.parse(fs.readFileSync('tmp/data.json'))
        return require(config.paths.data + path.basename(file.path) + ".json");
      })
    )
    .pipe(
      pug({
        doctype: "html",
        basedir: "./",
        pretty: true
      })
    )
    .on("error", function(err) {
      process.stderr.write(err.message + "\n");
      this.emit("end");
    })
    .pipe(gulp.dest(config.paths.dist.root));
});

// JSHINT
gulp.task("jshint", function() {
  return gulp
    .src(config.paths.dev.jsFiles)
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// OPTIMIZE SVG
gulp.task("optimize:svg", function() {
  return gulp
    .src(config.paths.dev.icons)
    .pipe(
      svgmin({
        js2svg: {
          pretty: true
        }
      })
    )
    .pipe(gulp.dest(config.paths.dist.icons));
});

// CONCAT ALL SCRIPTS
gulp.task("minify", ["minify:scripts"], function() {
  return gulp
    .src([
      "./dist/assets/js/vendors/*.js",
      "./tmp/js/*.js",
      "!./tmp/js/scripts.js",
      "!./tmp/js/main.min.js"
    ])
    .pipe(concat("main.min.js"))
    .pipe(gulp.dest("./dist/assets/js"));
});

// MINIFY SCRIPTS
gulp.task("minify:scripts", function(cb) {
  return gulp
    .src("dist/assets/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest(config.paths.tmp.js));
  // pump(
  //   [gulp.src('dist/assets/js/*.js'), uglify(), gulp.dest(config.paths.tmp.js)],
  //   cb
  // );
});

// ICONS SVG
gulp.task("iconfont", function() {
  return gulp
    .src([config.paths.dev.svgIcons], { base: "dev/" })
    .pipe(
      iconfontCss({
        fontName: config.icons.iconFontName,
        path: config.paths.dev.svgFontsTemplate,
        targetPath: config.paths.dev.svgScss,
        fontPath: config.paths.dev.svgFonts,
        firstGlyph: 0xb001,
        cssClass: config.icons.iconFontClass
      })
    )
    .pipe(
      iconfont({
        fontName: config.icons.iconFontName,
        prependUnicode: true,
        normalize: true,
        fontHeight: 1001,
        formats: ["ttf", "eot", "woff", "woff2", "svg"],
        timestamp: Math.round(Date.now() / 1000)
      })
    )
    .pipe(gulp.dest(config.paths.dev.svgFontsDev))
    .pipe(
      browserSync.reload({
        stream: true
      })
    );
});

// REPLACE ASSETS
gulp.task("htmlreplace", function() {
  gulp
    .src("dist/*.html")
    .pipe(
      htmlreplace({
        css: "assets/css/styles.min.css",
        js: "assets/js/main.min.js"
      })
    )
    .pipe(gulp.dest("dist/"));
});

// IMAGES
gulp.task("images", function() {
  gulp
    .src(["dev/images/**/*"])
    .pipe(changed(config.paths.dist.images))
    .pipe(imagemin())
    .pipe(gulp.dest("dist/assets/images"));
});

// RENAME CSS
gulp.task("rename:css", function() {
  gulp
    .src("dist/assets/css/styles.css")
    .pipe(vinylPaths(del))
    .pipe(rename("styles.min.css"))
    .pipe(gulp.dest("dist/assets/css"));
});

gulp.task("es6", function() {
  gulp
    .src(["dev/js/*.js"])
    .pipe(babel({ presets: ["@babel/preset-env"] }))
    .pipe(gulp.dest("dist/assets/js"));
});

function reload(done) {
  browserSync.reload();
  done();
}

gulp.task("watch", ["browserSync"], function() {
  // gulp.watch(config.paths.dev.svgIcons, ['iconfont']);
  gulp.watch(config.paths.dev.scssFiles, ["scss", browserSync.reload]);
  gulp.watch(config.paths.dev.pugAllFiles, ["pug", browserSync.reload]);
  gulp.watch(config.paths.dev.svgSprite, ["copy:sprite"]);
  gulp.watch(config.paths.dev.icons, ["optimize:svg"]);
  gulp.watch(config.paths.dev.jsFiles, ["jshint"]);
  gulp.watch(config.paths.dev.jsFiles, ["es6"]);
  gulp.watch(config.paths.dev.imagesAllFiles, ["images"]);
  gulp.watch(config.paths.dev.emails, ["copy:emails", browserSync.reload]);
});

gulp.task("dev", function() {
  runSequence(
    "clean:html",
    "copy:files",
    "copy:emails",
    "copy:sprite",
    ["import:libs", "optimize:svg"],
    ["es6", "scss"],
    // ['iconfont', 'scss'],
    ["inject"],
    ["pug"],
    ["browserSync", "watch"]
  );
});

gulp.task("build", function() {
  runSequence(
    "clean:dist",
    "copy:files",
    "copy:emails",
    "copy:sprite",
    "pug",
    "import:libs",
    "optimize:svg",
    "scss",
    "es6",
    ["minify"],
    ["rename:css"],
    ["htmlreplace"],
    ["clean:tmp"],
    "images"
  );
});

gulp.task("default", [process.env.NODE_ENV === "production" ? "build" : "dev"]);
