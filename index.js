var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var yaml = require('js-yaml');

// const s3EnvVars = require('s3-env-vars');
// var doc = s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
//   if(err) console.log(err);
//   else console.log(data);
// });
module.exports = function(bucket, path, filename, callback) {
    function DynamicEnvVars(doc) {
        var baseDoc = doc;

        this.baseDoc = function() {
            return baseDoc;
        };

        this._get = function(key) {
            return this.baseDoc()[key];
        };

        this.get = function(key) {
            var replacementExpr = /(@)(.+)(@)/;
            //console.log("key => ", key);
            var str = this._get(key);
            //console.log("str => ", str);
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
                return this.get();
            }
            var currentKey = splitPath.shift();
            //console.log("length of splitPath =>", splitPath.length);
            if(splitPath.length == 0) {
                return this.get(currentKey)
            } else {
                //console.log("current key is ", currentKey);
                //console.log("about to create subVars with =>", this.get(currentKey));
                var subVars = new DynamicEnvVars(this.get(currentKey));
                return subVars.path(splitPath.join(finalDelimeter), finalDelimeter);
            }
        };
    }
    var s3Params = {
        Bucket: bucket,
        Key: path + "/" + filename
    };
    s3.getObject(s3Params, function(err, data) {
        if (err) callback(err, err.stack); // an error occurred
        else {
            try {
                var doc = yaml.safeLoad(data.Body);
                callback(null, new DynamicEnvVars(doc));
            } catch (e) {
                callback(e, "error reading yml file"); // an error occurred reading the yml file
            }
        }
    });
};