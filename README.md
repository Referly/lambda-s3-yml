# lambda-s3-yml
Access yml files from S3 as JS objects

## Usage

```js
const s3EnvVars = require('s3-env-vars');
const s3EnvVars = require('s3-env-vars');
s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
   if(err) console.log(err);
   else console.log(data);
});
```