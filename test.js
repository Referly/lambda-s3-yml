const fs = require('fs');
const yaml = require('js-yaml');
const DynamicEnvVars = require('./dynamic-env-vars');

function TestRunner(dynamicEnvVars) {
    var envVars = dynamicEnvVars;

    this.envVars = function() {
      return envVars;
    };

    this.testGet = function (key, expected, description) {
        var actual = this.envVars().get(key);
        if(actual == expected) {
            return this.pass(expected, actual, description);
        } else {
            return this.fail(expected, actual, description);
        }
    };

    this.testPath = function (path, delimeter, expected, description) {
        var actual = this.envVars().path(path, delimeter);
        if(actual == expected) {
            return this.pass(expected, actual, description);
        } else {
            return this.fail(expected, actual, description);
        }
    };

    this.pass = function (expected, actual, description) {
        console.log("PASSED: " + description);
        return true;
    };

    this.fail = function (expected, actual, description) {
        console.log("FAILED in testGet: expected < " + actual + " > to equal < " + expected + " >");
        console.log("Test description: " + description);
        return false;
    }
}
fs.readFile('lambda-s3-yml-test.yml', function(err, data) {
    if (err) throw err;
    test(yaml.safeLoad(data));
});

function test(doc) {
    var envVars = new DynamicEnvVars(doc);
    console.log('SUCCESS LOADING TESTS');
    var pass = true;
    var runner = new TestRunner(envVars);

    pass = pass && runner.testGet('BEARER_TOKEN', 'secret', 'Retrieve simple value for string');

    pass = pass && runner.testGet('literal-dot', 'LITERAL.DOT', 'Do not treat literal dot as a namespace seperator');

    pass = pass && runner.testGet('jerry-friend', 'tom', "Resolve top level @alias@");
    //
    //pass = pass && runner.testPath('tom.friend', '.', 'jerry', "Walk simple hash path");
    //
    //pass = pass && runner.testGet('@cat-name@', 'tom', 'Simple');
    //
    //pass = pass && runner.testPath('cat-name', undefined, 'tom', 'The top level path lookup.');
    //
    //pass = pass && runner.testPath('@cat-name@', undefined, 'tom', 'Top level path lookup with alias.');
    //
    //pass = pass && runner.testPath('jerry-friend', undefined, 'tom', 'Top level path lookup with alias for value.');
    //
    //pass = pass && runner.testPath('tom.name', undefined, 'tom', "Walk hash path and resolve top level @alias@");
    //
    //pass = pass && runner.testPath('jerry.friend.species', undefined, 'cat', "Walk down two hashes");
    //
    //pass = pass && runner.testGet('tom-species', 'cat', 'Alias look up of two depth hash');

    if (pass) {
        console.log("SUCCESS ALL TESTS PASSED.");
    } else {
        console.log("FAILURE: ONE OR MORE TEST FAILED.");
    }
}
