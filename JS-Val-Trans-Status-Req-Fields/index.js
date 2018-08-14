module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');
    try
    {
        // get the variables from context
        var jsonBodyObject     = JSON.parse(req.body); 
        //var jsonBodyObject     = req.body;
        context.log('jsonBodyObject-->  '+ jsonBodyObject);
        //context.log("JsonBodyObject: " + JSON.stringify(jsonBodyObject)); 
        //context.log("JsonBodyObject: " + jsonBodyObject); 
        var guId               = jsonBodyObject.guId;
        var distId             = jsonBodyObject.distId;
        var pan                = jsonBodyObject.pan;
        var userId             = jsonBodyObject.userId;
        var userType           = jsonBodyObject.userType;
        var folioId            = jsonBodyObject.folioId;
        var userGuId           = jsonBodyObject.guId;
        var SP_CHR             = jsonBodyObject.SPCHR;
        var validationResult   = [];
        var reqFields          = [];
        var invalidParamList   = "";
        var emptyParamList     = "";
        var errObj             = "";
        //var transactionStatus         = "transactionStatus";

        //context.setVariable("request.queryparam.transactionStatus", transactionStatus);

        var strInputDate        = jsonBodyObject.strInputDate;     //request.queryparam.strInputDate
        var strTxnType          = jsonBodyObject.strTxnType;       //request.queryparam.strTxnType

        var queryString = jsonBodyObject.queryString; 
        var regex = new RegExp(SP_CHR);
    	         
        if (!isEmpty(queryString)) {
            var queryObj = JSON.parse(queryStringToJSON(queryString));
            invalidParamList += checkSPCharset(queryObj, regex, "");
        }

        reqFields.push({"key":"guId","value": userGuId});
        reqFields.push({"key":"userType","value": userType});
        reqFields.push({"key":"userId","value": userId});
        reqFields.push({"key":"strInputDate","value": strInputDate});
        reqFields.push({"key":"strTxnType","value": strTxnType});
            
        emptyParamList += reqFieldCheck(reqFields);
        
        if (userGuId && !(guId.toUpperCase() === userGuId.toUpperCase())) {
            invalidParamList += "guId,";
        }

        emptyParamList += distFolioCheck(userType, distId, pan);
        if (emptyParamList !== null && emptyParamList !== "") {
            validationResult.push("The following mandatory field(s) are blank: " + emptyParamList.substring(0, emptyParamList.length -1));
        }
        if (invalidParamList !== null && invalidParamList !== "") {
            validationResult.push("The following field(s) are invalid: " + invalidParamList.substring(0, invalidParamList.length -1));
        }

        errObj =  errObjArray(validationResult);
        context.res = {
				//status: 200, /* Defaults to 200 */
				body: { 
					"erroObject":{
						"errorData":JSON.stringify(errObj),
						"errLen":errObj.length,
						"severity":"2",
                    }		   
                }
			};
    }catch(err){
        var errStr = err.toString().replace(/\"/gi, "");
        var errorData =  JSON.stringify(errObjArray(errStr));
        context.log('inside err  2 errorData--'+errorData);
        context.res = {
        status: 400, /* Defaults to 200 */
            body: { 
                "errorData":errorData,                    		
            }
        };
        throw errorData;
    }
    context.log("Response: " + JSON.stringify(context.res)); 
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

// Mandatory Check
function distFolioCheck(userType, distId, pan) {
    var emptyParamList  = "";
    
    //  Validate folio and distId basing on userType
    if ((userType == 20) || (userType == 30) || (userType == 40)) {
        if (isEmpty(distId)) {
            emptyParamList += "distId,";
        }
    }
    else if (userType == 10) {
        if (isEmpty(pan)) {
            emptyParamList += "pan,";
        }
    }
    return emptyParamList;
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

// convert queryString to JSON
function queryStringToJSON(str) {            
    var pairs = str.split('&');
    var result = {};
    for (var p=0; p< pairs.length; p++) {
        var pair = pairs[p].split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    }
    return JSON.stringify(result);
}
