const s3EnvVars = require('./index');
const S3_ENV_VAR_BUCKET='mm-dev-mattermark-ops';
const S3_ENV_VAR_BASE_PATH='lambda-environments';
const S3_ENV_VAR_FILENAME='bindings-caldwecr.yml';

function TestRunner(dynamicEnvVars) {
    var envVars = dynamicEnvVars;

    this.envVars = function() {
      return envVars;
    };

    this.testGet = function (key, expected) {
        var actual = this.envVars().get(key);
        if(actual == expected) {
            return true;
        } else {
            console.log("FAILED in testGet: expected < " + actual + " > to equal < " + expected + " >");
            return false;
        }
    };
}

s3EnvVars(S3_ENV_VAR_BUCKET, S3_ENV_VAR_BASE_PATH, S3_ENV_VAR_FILENAME, function(err, data) {
    if (err) console.log('FAILED TO LOAD TEST');
    else {
        console.log('SUCCESS LOADING TESTS');
        var pass = true;
        var runner = new TestRunner(data);

        pass = pass && runner.testGet('BEARER_TOKEN', 'securetoken');


        if(pass) {
            console.log("SUCCESS ALL TESTS PASSED.");
        } else {
            console.log("FAILURE: ONE OR MORE TEST FAILED.");
        }

    }
});