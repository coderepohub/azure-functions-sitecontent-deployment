module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
        context.res = {
            body: {
                "response": {
                    "status": "Request successfully updated"
                }
            }
        };
    } catch(err) {
        var errStr = err.toString().replace(/\"/gi, "");
        var errorData = JSON.stringify(errObjArray(errStr));
        throw errorData;
    }

    context.done();
};

// set error object
function errorObj(errMsg) {
    var errObj = {};
    errObj.errorCode = "A0004";
    errObj.errorSource = "APG-EDGE";
    errObj.errorDescription = errMsg;
    return errObj;
}

// set error object array
function errObjArray (errors) {
    var result = [];
    if (typeof errors == 'object') {
        for (i=0; i<errors.length; i++) {
            result.push(errorObj(errors[i]));
        }
    }
    else {
        result.push(errorObj(errors));
    }
    return result;
}