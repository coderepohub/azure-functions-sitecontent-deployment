
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    context.log(req.body);
try{   
    // add to the json response using fragments of the responses
    var jsonBodyObject = JSON.parse(req.body); 
    //var jsonBodyObject = req.body; 
    
    //Initalize Variables  
    var authorization       = jsonBodyObject.Authorization;
    var validationResult    = [];
    var invalidParamList    = "";
    var emptyParamList      = "";
    var reqFields           = [];
    var errObj              = "";
    var errLen              = 0;

    if(authorization !== "" && authorization !== null) {
        var guId            = jsonBodyObject.guId;             //accesstoke.guId
        var distId          = jsonBodyObject.distId;
        var userType        = jsonBodyObject.userType; 
        var userId          = jsonBodyObject.userId;
        var userGuId        = jsonBodyObject.guId; //requestparam.guId
        
        reqFields.push({"key":"guId","value": userGuId});
        if (userGuId && !(guId.toUpperCase()===userGuId.toUpperCase())) {
           invalidParamList += "guId,";
        }
    }
	
	var payload = jsonBodyObject.content;
	var regex = new RegExp(jsonBodyObject.SPCHR);
	var folioPanAccNo     = "";
    var folioPanFlag      = ""; 
	var emailId           = ""; 
	
	if (!isEmpty(payload)) {
        payload = JSON.parse(payload);
        folioPanAccNo         = payload.folioPanAccNo;
        folioPanFlag         = payload.folioPanFlag;      
	    emailId             = payload.emailId;
	    
	    invalidParamList += checkSPCharset(payload, regex, "");
    }

	if(folioPanFlag!= "A") {
	    reqFields.push({"key":"emailId","value": emailId});
	}
    reqFields.push({"key":"folioPanAccNo","value": folioPanAccNo});
	reqFields.push({"key":"folioPanFlag","value": folioPanFlag});
		    
    emptyParamList += reqFieldCheck(reqFields);
    
    if (emptyParamList !== null && emptyParamList !== "") {
        validationResult.push("The following mandatory field(s) are blank: " + emptyParamList.substring(0, emptyParamList.length -1));
    }

    if (invalidParamList !== null && invalidParamList !== "") {
        validationResult.push("The following field(s) are invalid: " + invalidParamList.substring(0, invalidParamList.length -1));
    }

    errObj =  errObjArray(validationResult);
    context.log('response --> '+JSON.stringify(errObj));
    context.res = {
        status:200,
        body:{
            "erroObject":{
						"errorData":JSON.stringify(errObj),
						"errLen":errObj.length,
						"severity":"1",
            }
        }

    } ;
    /*if(errLen === 0) {
        // convert json payload into query parameters
        function jsonToQueryParam(json) {
            Object.keys(json).map(function(key) {
                if (!("guId".toUpperCase() === key.toUpperCase())) {
                    context.setVariable("request.queryparam." + key, json[key]);
                    //cannot set the query param variable here this will be done in all operations by with same condition.
                }
            });
            return null;
        }
    }*/
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
//return list of keys whose values have special characters
function checkSPCharset(obj, regex, valResult) {
    for (var i in obj) {
        if (typeof obj[i] == 'object') {
            valResult = checkSPCharset(obj[i], regex, valResult);    
        } else { 
            var isExists = obj[i].toString().match(regex);
            if (!isObjEmpty(isExists)) {
    			//only add if the key is not already in the invalid list
    			if (valResult.indexOf(i) == -1){
                    valResult += i + ",";
                }
            }
        }
    }
    return valResult;
}

// Mandatory Check
function reqFieldCheck(paramList) {
    var emptyParamList  = "";
    for(i = 0; i < paramList.length; i++) {
        
        var key = paramList[i].key;
        var value = paramList[i].value;
        
        if (isEmpty(value)) {
           emptyParamList += key + ",";
        }
    }
    return emptyParamList;
}