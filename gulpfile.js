let gulp = require("gulp")
let replace = require('gulp-replace');
const Combiner=require("gulp-file-combiner");
const regexIncluder=require("file-combiner-regex-includer")
const markdown = require('gulp-markdown');
const addsrc = require('gulp-add-src');
const rename=require("gulp-rename")
const del=require("del")

gulp.task("compilar",function(){
    del.sync("docs/*")
    gulp.src("src/md/**.md")
        .pipe(markdown())
        .pipe(addsrc("src/**.html"))
        .pipe(new Combiner([
            regexIncluder("# *include +(\\S+)\\s*",0),
            regexIncluder("// *include +(\\S+)\\s*",0),
            regexIncluder("<!-- *include +(\\S+)\\s*-->",0),
            regexIncluder("!\\s*(\\S+)\\s*!",0)
        ]))
        .pipe(addsrc(["src/**.less","src/**.svg","src/**.jpg"]))
        .pipe(rename(path=>{
            console.log(path);
            path.dirname=path.dirname.replace("src","");
        }))
        .pipe(gulp.dest("./docs/"))
})

var webserver = require('gulp-webserver');
 
gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: true
    }));
});


gulp.task("watch",function(){
    gulp.watch(["src/*.svg","src/index.html","src/md/novedades.md","src/main.less"],["compilar"])
})

gulp.task("default",["watch","webserver"])