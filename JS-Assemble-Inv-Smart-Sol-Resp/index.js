var accounting = require('accounting-js');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
try{
    context.res={
        headers: {
                'Content-Type': 'application/json'  // ... Set ContenType
            }
    };
   
    // add to the json response using fragments of the responses
    var jsonBodyObject = JSON.parse(req.body); 
    //var jsonBodyObject = req.body; 
    var jObjRes = {};

    var fsGoalSummary        = JSON.parse(jsonBodyObject.fsGoalSummary);
    var smartSolContent      = JSON.parse(jsonBodyObject.smartSolContent);
    var hasGoals = "N";

    if(!isEmpty(fsGoalSummary)) {
            hasGoals = "Y";
            jObjRes.smartSolutionGoals =  fsGoalSummary.fsGoalSummary; 
    }
    else {
        if(!isEmpty(smartSolContent)) {
            if(!isEmpty(smartSolContent["accounts-content"])){
                if(!isEmpty(smartSolContent["accounts-content"]["smart-solutions"])){
                    if(!isEmpty(smartSolContent["accounts-content"]["smart-solutions"]["carousel"])){
                        jObjRes.smartSolutionGoals =  smartSolContent["accounts-content"]["smart-solutions"]["carousel"]["carousel-info"]; 
                    }
                }
            }
        }
    }
    jObjRes.hasGoals = hasGoals;

    context.log('response --> '+JSON.stringify(jObjRes));
    context.res = {
        status:200,
        body:{
            "result":jObjRes
        }

    } ;
}catch(err) {
    var errStr = err.toString().replace(/\"/gi, "");
    var errorData =  JSON.stringify(errObjArray(errStr));
    context.res = {
        status: 400,
        body: { 
            "errorData":errorData,
        }
    };
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
// get the required object from the JSON array
function getObjectInArray(arr, key) {  
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].hasOwnProperty(key)) {
            return arr[i][key];
        }
    }
    return "";
}

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