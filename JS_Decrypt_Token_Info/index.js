var CryptoJS = require('crypto-js');
module.exports = function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

   try {
       context.log('req.body -->  '+ req.body);
      

       

       var jsonBodyObject = JSON.parse(req.body);
       context.log('jsonBodyObject-->  '+ jsonBodyObject);
    var operation = jsonBodyObject.operation ;// context.getVariable("proxy.pathsuffix");
    var verb = jsonBodyObject.verb;//context.getVariable("request.verb");
    context.log('verb-->  '+ verb);
    var skipVal = false;
    var key = jsonBodyObject.key; //context.getVariable("ED-KEY");
    var authorization  = jsonBodyObject.Authorization;//context.getVariable("request.header.Authorization");
    //--> comments : not needed have to set in policy var verifyDomainList = req.body.verifyDomainList;// context.getVariable("VER-DMN-LST");
   // var guId = decodeURIComponent(context.getVariable("request.queryparam.guId"));
   context.log('authorization header -->  '+ authorization);
   var testCrypt1 = CryptoJS.AES.decrypt(token.toString(), key, {iv: iv}).toString(CryptoJS.enc.Utf8);
    var decryptedAuth = '';
    if (((verb == "OPTIONS") || (operation == "/validateSoftLogin")) && (authorization == null)) {
        skipVal = true;
    } else {
        if (!isEmpty(authorization)) {
            authorization = authorization.split(' ');
            var token = authorization[1];
            var iv  = CryptoJS.enc.Base64.parse(key);
            key = CryptoJS.enc.Base64.parse(key);
            context.log('key -->  '+ key);
            context.log('token -->  '+ token);
            var testCrypt = CryptoJS.AES.decrypt(token.toString(), key, {iv: iv}).toString(CryptoJS.enc.Utf8);
            context.log('testCrypt --> '+testCrypt);
            // Decrypt the access token & guId
            decryptedAuth =  authorization[0] + " " + CryptoJS.AES.decrypt(token.toString(), key, {iv: iv}).toString(CryptoJS.enc.Utf8);
            context.log('decryptedAuth -->  '+ decryptedAuth);
            //context.setVariable("request.header.Authorization", authorization[0] + " " + CryptoJS.AES.decrypt(token.toString(), key, {iv: iv}).toString(CryptoJS.enc.Utf8));
            //context.setVariable("request.queryparam.guId", CryptoJS.AES.decrypt(guId.toString(), key, {iv: iv}).toString(CryptoJS.enc.Utf8));
        }
    }
     context.res = {
            // status: 200, /* Defaults to 200 */
            body: { 
                "skipVal":skipVal,
                "decryptedAuth": decryptedAuth
            }
        };
        /*
    context.setVariable("skipVal", skipVal);
    context.setVariable("verifyDomainList", verifyDomainList);
    context.setVariable("host", context.getVariable("request.header.host"));
    context.setVariable("scheme", context.getVariable("client.scheme"));
    context.setVariable("reqUri", context.getVariable("request.uri"));
    context.setVariable("reqVerb", context.getVariable("request.verb"));
    context.setVariable("reqPayload", context.getVariable("request.content"));*/
} catch (err) {
    context.log('inside err -- '+err);
    var errStr = err.toString().replace(/\"/gi, "");
     context.log('inside err  2 errStr--'+errStr);
     context.log('inside err  2 errStr--'+errStr);
    var errorData =  JSON.stringify(errObjArray(errStr));
    context.log('inside err  2 errorData--'+errorData);
     context.res = {
             status: 400, /* Defaults to 200 */
            body: { 
                "errorData":errorData,
            }
        };
} 
  context.log('My Response --> '+context.res);
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


