module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

	try {
		//context.log('req.body -->  '+ req.body);
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { 
                    "response" : [
                        {
                            "transactionStatus": {
                                "date": null,
                                "ct": {
                                    "processed": "0",
                                    "clarification": "0",
                                    "underProcessTxn": "0",
                                    "rejectedTxn": "0",
                                    "reversedTxn": "0",
                                    "totalTxn": "0"
                                },
                                "nct": {
                                    "processed": "0",
                                    "clarification": "0",
                                    "underProcessTxn": "0",
                                    "rejectedTxn": "0",
                                    "reversedTxn": "0",
                                    "totalTxn": "0"
                                }
                            }
                        }
                    ]
                    
            }
        };
	}catch (err) {
		var errStr = err.toString().replace(/\"/gi, "");
		var errorData =  JSON.stringify(errObjArray(errStr));
		//context.setVariable("errorData",errorData);
		throw errorData;
		context.done();
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