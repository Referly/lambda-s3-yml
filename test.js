const s3EnvVars = require('./index');
const S3_ENV_VAR_BUCKET='mattermark-public-testing';
const S3_ENV_VAR_BASE_PATH='lambda-s3-yml';
const S3_ENV_VAR_FILENAME='lambda-s3-yml-test.yml';

function TestRunner(dynamicEnvVars) {
    var envVars = dynamicEnvVars;

    this.envVars = function() {
      return envVars;
    };

    this.testGet = function (key, expected, description) {
        var actual = this.envVars().get(key);
        if(actual == expected) {
            console.log("PASSED: " + description);
            return true;
        } else {
            console.log("FAILED in testGet: expected < " + actual + " > to equal < " + expected + " >");
            console.log("Test description: " + description);
            return false;
        }
    };
}

s3EnvVars(S3_ENV_VAR_BUCKET, S3_ENV_VAR_BASE_PATH, S3_ENV_VAR_FILENAME, function(err, data) {
    if (err) {
        console.log('FAILED TO LOAD TEST', err);
    }
    else {
        console.log('SUCCESS LOADING TESTS');
        var pass = true;
        var runner = new TestRunner(data);

        pass = pass && runner.testGet('BEARER_TOKEN', 'secret', 'Retrieve simple value for string');

        pass = pass && runner.testGet('literal-dot', 'LITERAL.DOT', 'Do not treat literal dot as a namespace seperator');

        pass = pass && runner.testGet('jerry-friend', 'tom', "Resolve top level @alias@");

        if(pass) {
            console.log("SUCCESS ALL TESTS PASSED.");
        } else {
            console.log("FAILURE: ONE OR MORE TEST FAILED.");
        }

    }
});