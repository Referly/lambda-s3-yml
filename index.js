var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var yaml = require('js-yaml');

// const s3EnvVars = require('s3-env-vars');
// var doc = s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err) { console.log(err); });
module.exports = function(bucket, path, filename, errHandler) {
    var s3Params = {
        Bucket: bucket,
        Key: path + "/" + filename
    };
    s3.getObject(s3Params, function(err, data) {
        if (err) errHandler(err); // an error occurred
        else {
            try {
                return yaml.safeLoad(data.Body);
            } catch (e) {
                errHandler(err); // an error occurred reading the yml file
            }
        }
    });

};