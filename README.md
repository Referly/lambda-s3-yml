# lambda-s3-yml
Access yml files from S3 as JS objects

## Usage

```js
const s3EnvVars = require('lambda-s3-yml');
s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
   if(err) console.log(err);
   else console.log(data);
});
```

The package supports some handy special character sequences in your yaml too.

Suppose you have a yml file like
 
```yml
foo: Tom
bar: '@foo@'
```

When you access foo or bar you get 'Tom'

```js
const s3EnvVars = require('lambda-s3-yml');
s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
   if(err) console.log(err);
   else {
    console.log("Foo is " + data.foo, "Bar is " data.bar);
   }
});
```

The first occurrence of a reference trapped by `@` is always treated as top level, you can
chain them with the `.` symbol

```yml
foo: Tom
characters:
  cat: '@foo@'
  mouse: Jerry
bar: '@characters@.@mouse@'
```

```js
const s3EnvVars = require('lambda-s3-yml');
s3EnvVars("mybucketname", "folderpathinbucket", "filename", function(err, data) {
   if(err) console.log(err);
   else {
    console.log("Foo is " + data.foo, "Bar is " data.bar);
   }
});
```

You can also reference files in the same bucket and directory (maybe someday we can cross directories)

* cat.yml

```yml
name: Tom
```

* mouse.yml

```yml
name: Jerry
```

* candidates.yml

```yml
president: '%cat%/@name@'
vice-president: '%mouse%/@name@'
```