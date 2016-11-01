module.exports = function DynamicEnvVars(doc, parent) {
    var baseDoc = doc;
    var parentEnvVars = parent;

    this.baseDoc = function() {
        return baseDoc;
    };

    this.parentEnvVars = function() {
        return parentEnvVars;
    };

    this._get = function(key) {
        return this.baseDoc()[key];
    };

    this.get = function(key) {
        console.log("ENTERED GET with key => ", key);
        console.log("Length of the key => ", key.length);
        var replacementExpr = /(@)(.+)(@)/;
        var keyMatches = key.match(replacementExpr);
        if(keyMatches) {
            console.log("key matched replacement expr in #get, new key is => ", keyMatches[2]);
            return this.get(keyMatches[2]);
        }
        console.log("key => ", key);
        var str = this._get(key);
        if(!str) {
            str = this.parentEnvVars().get(key);
        }
        console.log("str => ", str);
        if(typeof str == 'string') {
            var matches = str.match(replacementExpr);
            if (matches) {
                //console.log("matches => ", matches);
                var replacement = this.get(matches[2]);
                str = str.replace(replacementExpr, replacement);
            }
        }
        return str;
    };

    this.path = function(pathStr, delimeter) {
        //console.log("in path", pathStr, delimeter);
        var finalDelimeter = delimeter;
        if(!finalDelimeter) {
            finalDelimeter = '.';
        }
        var splitPath = pathStr.split(finalDelimeter);
        if(splitPath.length == 0) {
            console.log("uh oh hit a dead end in the path.");
            return this.get();
        }
        var currentKey = splitPath.shift();
        //console.log("length of splitPath =>", splitPath.length);
        if(splitPath.length == 0) {
            return this.get(currentKey)
        } else {
            console.log("current key is ", currentKey);
            console.log("about to create subVars with =>", this.get(currentKey));
            var subVars = new DynamicEnvVars(this.get(currentKey), this);

            return subVars.path(splitPath.join(finalDelimeter), finalDelimeter);
        }
    };
};