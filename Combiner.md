###Combiner

A module for including files inside files (though it doesn't actually deal with files, it only handles *combining* the files).

###Features

Combiner handles all the logic behind gulp-includer. It detects cyclic references and mispelled filenames.

Also, it allows for heavy customization.

#customize syntax

Because it lets you define how an inclusion is determined, it allows any syntax.

Examples

```javascript
let combiner=new Combiner(require("includer-clike-detector"))
//  #include otherFile.txt
```

```javascript
let combiner=new Combiner(require("includer-comment-detector"))
//  //include otherFile.txt
```

```javascript
let combiner=new Combiner(require("includer-html-comment-detector"))
//  <!--include otherFile.txt-->
```

```javascript
let detector=require("includer-regex-detector")
let combiner=new Combiner(detector("!(.*)!"))
//  !otherFile.txt!
```

#customize how files are accessed
You can add modifiers to change how the names of the files are accessed, allowing absolute dirs, or creating files out of thin air.

Example:
```javascript
//EXAMPLE HERE
```

###API

##Combiner(includeGetter)
creates a new combiner
*includeGetter*: a function that takes the contents of a file and returns an array of objects of the form 
```javascript
{
    relPath:path, //path of thefile to be included, as extracted from the include statement itself
    match:text //the string that will be replaced by the contents of the file
}
```

##combiner.add(name,contents)
Add a file named *name* (String) that has *contents* (String) to the combiner, so it can be combined.

##combiner.combinedFiles()
Returns an object containing the 'root' files (the ones that are not included by any other file), where the absolute paths of the files are the keys and the contents of such files, the value associated with such keys.

```javascript
let result=combiner.combinedFiles() //result[fileName]=fileContents
```

##combiner.buildFile(filename)
Returns a string with the contents of the file after being combined.

##combiner.fileNames()
Returns an array with the names of all added files.

##combiner.includedFiles(filename)
Returns the cwd-relative paths of the files included by the file *filename*.

##combiner.includedByNone()
Returns an array with the names of the files that are not included by any other file.
