let gulp = require("gulp")
let replace = require('gulp-replace');


gulp.task("compilar",function(){
    gulp.src(["*.txt","cosas/*.txt"])
        .pipe(replace("11","2"))
        .pipe(includer())
        .pipe(gulp.dest("./compilado/"))
})

let File=require("vinyl")
let through=require("through2")

const Includer=require("./Includer")

var includer=function(){
    let includer=new Includer();

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
        //store the contents in memory
        includer.add(file.path.replace(file.cwd,"").slice(1), file.contents.toString());
        cb();
    }

    function endStream(cb){
        
        let results=[]
        let error=null;
        try{
            results=includer.combinedFiles();
        }catch(e){
            this.emit(e.message)
            error=e;
        }
        for(let fName in results){
            let file=new File({
                path:fName,
                contents:Buffer.from(results[fName],"utf8")
            });

            this.push(file);
        }
        cb(error);
    }

    return through.obj(bufferContents,endStream)
}



function buildFile(finalName,files,history){
    //check if we are in a loop
    if(history==null) history=[];
    if(history.includes(finalName)){
        let myPosition=history.indexOf(finalName);
        let relevantHistory=history.splice(myPosition,history.length);
        let messagePart = relevantHistory.concat([finalName]).join(" --> ")
        throw new Error("gulp-includer: Cyclic reference: "+messagePart)
    }
    let nextHistory=history.concat([finalName])

    //check that all includes are OK
    let ret=files[finalName];
    
    for(let f of includedFiles){
        let actualFname=path.join(finalName,"../",f)
        console.log(actualFname);
        if(files[actualFname]==undefined){
            throw new Error("gulp-includer: Cannot include "+f+" in file "+finalName+": gulp includer didn´t receive the file "+actualFname);
        }
    }
    
    //replace the contents of such files
    for(let fname in includedFiles){
        //if the file is found, build it and then add it
        let regexp=new RegExp("(//|#|<!--) *include +"+fname+" *(-->)?")
        if(regexp.test(ret)){
            let actualFname=path.join(finalName,"../",fname)
            ret=ret.replace(regexp,buildFile(actualFname,files,nextHistory))//recursive call, skipped for files with no #includes
        }
    }
    
    return ret;
}