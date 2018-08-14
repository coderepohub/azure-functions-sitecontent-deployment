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
    jObjRes.smartSavingsAccount={};
    jObjRes.smartSavingsAccount.currentValue = {};
    jObjRes.invFinDetails= {};
    jObjRes.oneTouchInvest={};
    jObjRes.oneTouchInvest.status={};
    
    
    var smartContent    = JSON.parse(jsonBodyObject.smartContent);
    var invFinDetails   = JSON.parse(jsonBodyObject.invFinDetails);
    
    var amount = "0";
    var flag = "No";
    if(!isEmpty(invFinDetails)) {
        if(!isEmpty(invFinDetails.parkMymoney)) {
            var pmmPurchase = invFinDetails.parkMymoney.purchase;
        }
        if(!isEmpty(invFinDetails.oneTouchInvest)) {
        var otiPurchase = invFinDetails.oneTouchInvest.purchase;
        }
        if (!isEmpty(pmmPurchase)) {
            amount = pmmPurchase.currentValue;
        }
        
        if (!isEmpty(otiPurchase)) {
            flag = "Yes";
        }
    }    
    
    // set the json response
    if(!isEmpty(smartContent)) {
        if(!isEmpty(smartContent["accounts-content"])) {
            jObjRes.smartSavingsAccount =  smartContent["accounts-content"].smartSavingsAccount;
        }
    }
    jObjRes.smartSavingsAccount.currentValue = "0";
    if(!isEmpty(smartContent)) {
        if(!isEmpty(smartContent["accounts-content"])) {
            jObjRes.banner =  smartContent["accounts-content"].banner;
        }
    }
    if(!isEmpty(smartContent)) {
        if(!isEmpty(smartContent["accounts-content"])) {
            jObjRes.oneTouchInvest =  smartContent["accounts-content"]["one-touch-invest"];
        }
    }
    jObjRes.invFinDetails  = invFinDetails;
    jObjRes.smartSavingsAccount.currentValue  = amount;
    jObjRes.oneTouchInvest.status  = flag;


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