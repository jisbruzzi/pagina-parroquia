module.exports=function(strRegex,group){
    return function (fileContent){
        console.log(fileContent)
        let regexp=new RegExp(strRegex,"g")
        let included=[];
        let a=null
        while(a=regexp.exec(fileContent))included.push({
            relPath:a[group+1],
            match:a[0]
        })
        console.log(included)
        return included;
    }
}