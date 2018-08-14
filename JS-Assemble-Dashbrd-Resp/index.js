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
       // var jsonBodyObject = JSON.parse(req.body); 
        var jsonBodyObject = req.body; 
        var jsonBody =jsonBodyObject;
        var jsonBodyObject22 = JSON.parse(req.body); 
        context.log('jsonBodyObject22 --> '+jsonBodyObject22);
        context.log("advisorProfile.LastLogin--->"+jsonBodyObject22.lastLogin);
        jsonBodyObject.advisorDashboardObject = [{}];
         context.log('Json stringify-> ' + JSON.stringify(jsonBodyObject22));
        var advisorProfile      = JSON.parse(jsonBodyObject22.advisorProfile);
        context.log('advisorProfile --> '+ advisorProfile);
        var businessHighlights  = JSON.parse(jsonBodyObject22.businessHighlights);
        context.log('businessHighlights --> '+ businessHighlights);
        var profileUserWidgets  = JSON.parse(jsonBodyObject22.profileUserWidgets);
        context.log('profileUserWidgets --> '+ profileUserWidgets);
        var leadsInfo           = JSON.parse(jsonBodyObject22.leadsInfo);
        context.log("advisorProfile.LastLogin--->"+jsonBodyObject22.lastLogin);

        var jObjRes = {};
        jObjRes.advisorDashboardObject = [{}];
        jObjRes.advisorDashboardObject[0].loginDate       =  jsonBodyObject22.loginDate;
        jObjRes.advisorDashboardObject[0].loginTime       =  jsonBodyObject22.loginTime;
        jObjRes.advisorDashboardObject[0].isAccountExists =  leadsInfo==null?"N":leadsInfo.AccExists;
        jObjRes.advisorDashboardObject[0].lastLogin       =  jsonBodyObject22.lastLogin;
        //context.log("lastLogin--->"+jsonBodyObject.advisorDashboardObject[0].lastLogin);
        context.log("lastLogin--->"+jsonBody.lastLogin);
        if(!isEmpty(advisorProfile)) {
            context.log('advisor profile stringify --> '+ JSON.stringify(advisorProfile));
            jObjRes.advisorDashboardObject[0].profileDetails       =  getObjectInArray(advisorProfile,"profileDetails");

            jObjRes.advisorDashboardObject[0].userWidgets          =  getObjectInArray(advisorProfile,"userWidgets");    
        }
        
        if(!isEmpty(businessHighlights)) {
            jObjRes.advisorDashboardObject[0].businessHighlights   =  getObjectInArray(businessHighlights,"businessHighlights");
            jObjRes.advisorDashboardObject[0].rankDetails          =  getObjectInArray(businessHighlights,"rankDetails");    
        }
        
        if(!isEmpty(profileUserWidgets)) {
            jObjRes.advisorDashboardObject[0].transactionStatus    =  getObjectInArray(profileUserWidgets,"transactionStatus");
            jObjRes.advisorDashboardObject[0].sipBookOverview      =  getObjectInArray(profileUserWidgets,"sipBookOverview");    
        }  

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