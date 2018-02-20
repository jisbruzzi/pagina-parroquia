const path=require("path")

/**
 * Searches for the included files and returns an array of relative paths
 * @param {String} fileContent 
 */
function getIncludes(fileContent){
    let regexp=new RegExp("(#|//|<!--) *include +([^\\s(-->)]+)(\\s*)(-->)?","g")
    let included=[];
    let a=null
    while(a=regexp.exec(fileContent))included.push(a[2])
    return included;
}

/**
 * Returns the paths of the included files, relative to cwd
 * @param {String} name 
 */
function includedFiles(name){
    let includes=getIncludes(this.getFile(name));
    console.log(name,includes);
    let ret=includes.map(relPath => {
        let ret = {
            absolute:path.join(name,"../",relPath),
            relative:relPath
        }
        return ret;
    })
    console.log(name,ret);
    return ret;
}

function buildFile(name,history){

    console.log("Building file ",name)
    //check if we are in a loop
    if(history==null) history=[];
    if(history.includes(name)){
        let myPosition=history.indexOf(name);
        let relevantHistory=history.splice(myPosition,history.length);
        let messagePart = relevantHistory.concat([name]).join(" --> ")
        throw new Error("gulp-includer: Cyclic reference: "+messagePart)
    }
    let nextHistory=history.concat([name])

    //check that all includes are OK
    for(let f of this.includedFiles(name)){
        if(this.getFile(f.absolute)==undefined){
            throw new Error("gulp-includer: Cannot include "+f.relative+" in file "+name+": gulp includer didn´t receive the file "+f.absolute);
        }
    }


    //replace the contents of such files
    let ret=this.getFile(name);
    for(let f of this.includedFiles(name)){
        //if the file is found, build it and then add it
        let regexp=new RegExp("(//|#|<!--) *include +"+f.relative+" *(-->)?","g")
        console.log(regexp);
        if(regexp.test(ret)){
            console.log(f.relative,"is in",name)
            ret=ret.replace(regexp,this.buildFile(f.absolute,nextHistory))//recursive call, skipped for files with no #includes
        }
    }
    console.log(ret);
    return ret;

}

function includedByNone(){
    let inclusions={};
    for(let name of this.fileNames()){
        inclusions[name]=0;
    }

    for(let name of this.fileNames()){
        let includes=this.includedFiles(name);
        for(let include of includes){
            inclusions[include.absolute]+=1;
        }
    }

    let ret=[]
    for(let name of this.fileNames()){
        if(inclusions[name]==0){
            ret.push(name)
        }
    }

    return ret;
}

module.exports=function(){
    let files={};

    function add(fileName,fileContent){
        console.log("Agrego: "+fileName);
        files[fileName]=fileContent
    }

    function getFile(name){
        return files[name]
    }
    
    function fileNames(){
        return Object.keys(files);
    }



    function combinedFiles(){
        //if there are no root files, there are cycles
        if(this.includedByNone().length==0){
            throw new Error("gulp-includer: all files are included by other files")
        }

        //build the final files
        let finalFiles={};
        for(let fname of this.includedByNone()){
            finalFiles[fname]=this.buildFile(fname)
        }
        return finalFiles;
    }

    return {
        add:add,
        combinedFiles:combinedFiles,
        getFile:getFile,
        getIncludes:getIncludes,
        buildFile:buildFile,
        fileNames:fileNames,
        includedFiles:includedFiles,
        includedByNone:includedByNone
    }

}