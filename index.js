var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var yaml = require('js-yaml');

// const s3EnvVars = require('s3-env-vars');
// var doc = s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
//   if(err) console.log(err);
//   else console.log(data);
// });
module.exports = function(bucket, path, filename, callback) {
    var s3Params = {
        Bucket: bucket,
        Key: path + "/" + filename
    };
    s3.getObject(s3Params, function(err, data) {
        if (err) callback(err, err.stack); // an error occurred
        else {
            try {
                var doc = yaml.safeLoad(data.Body);
                callback(null, doc);
            } catch (e) {
                callback(e, "error reading yml file"); // an error occurred reading the yml file
            }
        }
    });
};