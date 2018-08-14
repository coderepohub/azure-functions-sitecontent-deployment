module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

try {
		//context.log('req.body -->  '+ req.body);
        //var SC-Call-To-Prof-UserWidgets
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                "response":[
                    {
                        "transactionStatus": {
                            "date": "24-Aug-2016",
                            "ct": {
                            "processed": "990",
                            "clarification": "0",
                            "underProcessTxn": "334",
                            "rejectedTxn": "26",
                            "reversedTxn": "0",
                            "totalTxn": "1350"
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
         },
        {
                            "sipBookOverview": {
                            "date": "Feb 2016",
                            "sipCount": "67,708",
                            "sipYtmNew": "184",
                            "sipYtmMatured": "27",
                            "sipYtmCancelled": "0",
                            "sipYtmActive": "76,111"
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