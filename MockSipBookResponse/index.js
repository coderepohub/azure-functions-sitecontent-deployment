module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

	try {
		//context.log('req.body -->  '+ req.body);
        //var sipBook Response
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: { 
                    "response":{
                                
                                "sipBookDetailsView": {
                                    "sdv1": {
                                        "ytm": {
                                            "date": "",
                                            "activeSip": "0",
                                            "sipThroughput": "0",
                                            "perpetualSip": "0",
                                            "avgTicketSize": "0",
                                            "uniqueInvestor": "0",
                                            "sipsDueRenewal": "0"
                                        },
                                        "monthEnd": {
                                            "date": "",
                                            "activeSip": "0",
                                            "sipThroughput": "0",
                                            "perpetualSip": "0",
                                            "avgTicketSize": "0",
                                            "uniqueInvestor": "0",
                                            "sipsDueRenewal": "0"
                                        }
                                    },
                                    "sdv2": {
                                        "ytm": {
                                            "date": "",
                                            "newSipsAdded": "0",
                                            "sipmMatured": "0",
                                            "sipmCancelled": "0",
                                            "sipStepUp": "0",
                                            "sipPauses": "0",
                                            "sipInstallmentReject": "0"
                                        },
                                        "monthEnd": {
                                            "date": "",
                                            "newSipsAdded": "0",
                                            "sipmMatured": "0",
                                            "sipmCancelled": "0",
                                            "sipStepUp": "0",
                                            "sipPauses": "0",
                                            "sipInstallmentReject": "0"
                                        },
                                        "lastBusinessDay": {
                                            "date": "",
                                            "newSipsAdded": "0",
                                            "sipmMatured": "0",
                                            "sipmCancelled": "0",
                                            "sipStepUp": "0",
                                            "sipPauses": "0",
                                            "sipInstallmentReject": "0"
                                        }
                                    }
                                }
                    }        
            }
        };
	}catch (err) {
		var errStr = err.toString().replace(/\"/gi, "");
		var errorData =  JSON.stringify(errObjArray(errStr));
		//context.setVariable("errorData",errorData);
		throw errorData;
		context.done();
	}
	//context.log("Response: " + JSON.stringify(context.res)); 
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