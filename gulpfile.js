let gulp = require("gulp")
let replace = require('gulp-replace');
const Combiner=require("gulp-file-combiner");
const regexIncluder=require("file-combiner-regex-includer")
const markdown = require('gulp-markdown');
const addsrc = require('gulp-add-src');

gulp.task("compilar",function(){
    gulp.src("src/md/**.md")
        .pipe(markdown())
        .pipe(addsrc(["src/**.css","src/**.html"]))
        .pipe(new Combiner([
            regexIncluder("# *include +(\\S+)\\s*",0),
            regexIncluder("// *include +(\\S+)\\s*",0),
            regexIncluder("<!-- *include +(\\S+)\\s*-->",0),
            regexIncluder("!\\s*(\\S+)\\s*!",0)
        ]))
        .pipe(gulp.dest("./docs/"))
})


gulp.task("default",["compilar"])