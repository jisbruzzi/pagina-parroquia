let gulp = require("gulp")
let replace = require('gulp-replace');
var fileinclude = require('gulp-file-include');
const Combiner=require("gulp-file-combiner");
const regexIncluder=require("file-combiner-regex-includer")

gulp.task("compilar",function(){
    gulp.src(["*.txt","cosas/*.txt"])
        .pipe(replace("11","2"))
        .pipe(new Includer([
            regexIncluder("# *include +(\\S+)\\s*",0),
            regexIncluder("// *include +(\\S+)\\s*",0),
            regexIncluder("<!-- *include +(\\S+)\\s*-->",0),
            regexIncluder("!\\s*(\\S+)\\s*!",0)
        ]))
        .pipe(gulp.dest("./compilado/"))
})