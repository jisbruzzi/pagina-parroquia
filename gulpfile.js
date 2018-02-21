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
        .pipe(addsrc(["src/**.css","src/**.html"]))
        .pipe(new Combiner([
            regexIncluder("# *include +(\\S+)\\s*",0),
            regexIncluder("// *include +(\\S+)\\s*",0),
            regexIncluder("<!-- *include +(\\S+)\\s*-->",0),
            regexIncluder("!\\s*(\\S+)\\s*!",0)
        ]))
        .pipe(rename(path=>{
            console.log(path);
            path.dirname=path.dirname.replace("src","");
        }))
        .pipe(gulp.dest("./docs/"))
})


gulp.task("default",["compilar"])