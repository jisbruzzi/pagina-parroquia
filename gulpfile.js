let gulp = require("gulp")
let File=require("vinyl")
let replace = require('gulp-replace');


gulp.task("compilar",function(){
    gulp.src(["cosa1.txt","cosa2.txt"])
        
        .pipe(replace("11","2"))
        .pipe(miIncluder())
        .pipe(gulp.dest("./compilado/"))
})

let through=require("through2")
var miIncluder=function(){

    let files={}

    function bufferContents(file,enc,cb){
        // ignore empty files
        if (file.isNull()) {
            cb();
            return;
        }
        // we don't do streams (yet)
        if (file.isStream()) {
            this.emit('error', new Error('gulp-concat: Streaming not supported'));
            cb();
            return;
        }

        console.log(file)
        files[file.path.replace(file.base,"")]=file.contents.toString()

        cb();
    }

    function endStream(cb){
        let results=combine(files);
        for(let fName in results){
            let file=new File({
                cwd:"/",
                base:"/",
                path:"/"+fName,
                contents:Buffer.from(results[fName],"utf8")
            });
            this.push(file);
        }
        cb(null);
    }

    return through.obj(bufferContents,endStream)
}


function combine(files){
    //get the files that are not included by any other file
    let includedByNone=Object.keys(files).filter(fname=>includedBy(fname,files).length==0)
    // TODO:    error on includedByNone==0
    console.log("Included by none:",includedByNone)

    //build the final files
    let finalFiles={};
    for(let fname of includedByNone){
        finalFiles[fname]=buildFile(fname,files)
    }
    console.log(finalFiles);
    return finalFiles;
}

function includedBy(testedFname,files){
    let ret =  Object.keys(files).filter((possibleIncluder)=>{
        //does posibleIncluder include the testedFname?
        let regexp=new RegExp("(//|#|<!--) *include +"+testedFname+" *(-->)?")
        let includerContent=files[possibleIncluder]
        return regexp.test(includerContent)
    })
    console.log(testedFname+" is included by "+ret);
    return ret;
}

//no loop detection
function buildFile(finalName,files){//TODO: ERROR ON LOOPS (agregar un historial)
    console.log("building "+finalName)
    let ret=files[finalName];
    for(let fname in files){
        //if the file is found, build it and then add it
        let regexp=new RegExp("(//|#|<!--) *include +"+fname+" *(-->)?")
        if(regexp.test(ret)){
            ret=ret.replace(regexp,buildFile(fname,files))//recursive call, skipped for files with no #includes
        }
    }
    console.log("Result: "+ret);
    return ret;
}