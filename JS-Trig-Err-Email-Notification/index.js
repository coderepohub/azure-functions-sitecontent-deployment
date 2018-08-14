var moment = require('moment');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    try{
       
    }catch (err) {
        var errStr = err.toString().replace(/\"/gi, "");
        var errorData =  JSON.stringify(errObjArray(errStr));
    // context.setVariable("errorData",errorData);
        throw errorData;    
    }   
    
    context.done();
};


// Check for empty string
function isEmpty(obj) {
	try {
		if (typeof obj == 'object') {
			if (Object.keys(obj).length > 0) {
			return false;
		} else {
			return true;
		}
	} else {
		if ((obj !== null) && (obj !== undefined) && (obj !== "")) {
			return false;
		} else {
			return true;
		}
	}
} catch (err) {
	return true;
	}
}

// Check for empty object
function isObjEmpty(obj) {
    try {
            if (Object.keys(obj).length > 0) {
            return false;
        } else {
			return true;
        }
    } catch (err) {
		return true;
    }
}

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
