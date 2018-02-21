let gulp = require("gulp")
let replace = require('gulp-replace');
var fileinclude = require('gulp-file-include');
const Includer=require("./Includer");
const regexIncluder=require("./regexIncluder")

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