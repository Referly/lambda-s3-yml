# lambda-s3-yml
Access yml files from S3 as JS objects

## Usage

```js
const s3EnvVars = require('s3-env-vars');
var doc = s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err) { console.log(err); });
```