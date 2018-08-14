module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

try {
		//context.log('req.body -->  '+ req.body);
        //var SC-Call-To-Bus-highlights Response
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: {
                "response":[
                            {
                                "businessHighlights": {
                                    "ytd": {
                                        "date": "21 Oct 2016",
                                        "commissionPaid": "0.00",
                                        "grossSales": "2,657,046.00",
                                        "redemptions": "2,408,797.00",
                                        "netSales": "248,248.70",
                                        "newInvestorsAdded": "28,268"
                                    },
                                    "mtd": {
                                        "date": "21 Oct 2016",
                                        "commissionPaid": "0.00",
                                        "grossSales": "177,114.40",
                                        "redemptions": "195,094.70",
                                        "netSales": "-17,980.38",
                                        "newInvestorsAdded": "2,853"
                                    },
                                    "lastThreeMonths": {
                                        "commissionPaid": "0.00"
                                    },
                                    "lastBusinessDay": {
                                        "date": "21 Oct 2016",
                                        "aum": "8,613.80",
                                        "activeUniqueInvestors": "117,100",
                                        "grossSales": "3,545.86",
                                        "redemptions": "859.41",
                                        "netSales": "2,686.46",
                                        "newInvestorsAdded": "124"
                                    },
                                    "lastMonth": {
                                        "date": "Sep 2016",
                                        "commissionPaid": "0.00"
                                    },
                                    "ytm": {
                                        "commissionPaid": "0.00"
                                    }
                                }
                            },
                            {
                                "rankDetails": {
                                    "available": "Yes",
                                    "country": {
                                        "name": "INDIA",
                                        "aumRank": "",
                                        "grossSalesRank": "",
                                        "UDAAN": ""
                                    },
                                    "city": {
                                        "name": "CHENNAI",
                                        "aumRank": "",
                                        "grossSalesRank": "",
                                        "UDAAN": ""
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