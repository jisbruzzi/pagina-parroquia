
let File=require("vinyl")
let through=require("through2")

const Combiner=require("./Combiner")
module.exports=function(includers,options){
    let combiner=new Combiner(function(content){
        let ret=[]
        for(let i of includers){
            ret=ret.concat(i(content))
        }
        return ret;
    })

    /*
    let combiner=new Combiner(function getIncludes(fileContent){
        console.log("Me llaman!")
        let regexp=new RegExp("!(.*)!","g")
        let included=[];
        let a=null
        while(a=regexp.exec(fileContent)){
            console.log(a);
            included.push({
            relPath:a[1],
            match:a[0]
        })
        }
        console.log(included);
        return included;
    })
    */

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
        combiner.add(file.path.replace(file.cwd,"").slice(1), file.contents.toString());
        cb();
    }

    function endStream(cb){
        
        let results=[]
        let error=null;
        try{
            results=combiner.combinedFiles();
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