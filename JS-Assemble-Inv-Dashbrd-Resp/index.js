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
    jObjRes.investorDashboardObject = {};
    var widget = jsonBodyObject.widget;
    if(isEmpty(widget))
    {
        context.log('jsonBodyObject -->'+jsonBodyObject);
        //var investorProfileStr     = jsonBodyObject.investorProfile.toString();
        //context.log('investorProfileStr -->'+investorProfileStr);
        var investorProfile = JSON.parse(jsonBodyObject.investorProfile.toString());
        context.log('investorProfile -->'+investorProfile);
        var sipDetails          = jsonBodyObject.sipDetails==''?'': JSON.parse(jsonBodyObject.sipDetails.toString());
        context.log('sipDetailsStr --> '+jsonBodyObject.sipDetails.toString());
        var sipContent          = jsonBodyObject.sipContent==''?'':JSON.parse(jsonBodyObject.sipContent.toString());
        context.log('sipContentStr --> '+jsonBodyObject.sipContent.toString());
        context.log('sipContent--> '+sipContent);
        if(!isEmpty(sipContent)){
            if(!isEmpty(sipContent["accounts-content"])){
            var content =sipContent["accounts-content"]["my-sip"].content;
                }
            }
        
        var transactionSummary  = jsonBodyObject.transactionSummary==''?'':JSON.parse(jsonBodyObject.transactionSummary.toString());
        
        context.log('trans summOBJ--> '+transactionSummary);
        var divHistory  = jsonBodyObject.divHistory==''?'':JSON.parse(jsonBodyObject.divHistory.toString());
        var unclaimedTrans  = jsonBodyObject.unclaimedTrans==''?'':JSON.parse(jsonBodyObject.unclaimedTrans.toString());
        var monthlyInvestments = 0;
        var quarterlyInvestments = 0;
        var annualInvestments = 0;
        var hasInvested = "N";
        var sipLen = 0;
        var totalSIPCount = 0;
        var mySips = {};
        if(!isEmpty(sipDetails)) {
            var sipList = sipDetails.retrieveSip;
            if(!isEmpty(sipList)) {
                sipLen = sipList.length;
            }
            
            for(var y=0; y < sipLen; y++) {
                hasInvested = "Y";
                var sip = sipList[y];
                var amount = parseInt(sip.amount);
                if(!isEmpty(sip.totalInstallmentNum)){
                    totalSIPCount += parseInt(sip.totalInstallmentNum);
                }else{
                    totalSIPCount+=0;
                }
                if ("Monthly".toUpperCase()===sip.frequency.toUpperCase()) {
                    monthlyInvestments += amount;
                } else if ("Quarterly".toUpperCase()===sip.frequency.toUpperCase()) {
                    quarterlyInvestments += amount;
                } else if ("annually".toUpperCase()===sip.frequency.toUpperCase()) {
                    annualInvestments += amount;
                }
            }
        mySips.monthlyInvestments = accounting.formatNumber(monthlyInvestments, 2).toString();
        mySips.quarterlyInvestments = accounting.formatNumber(quarterlyInvestments, 2).toString();
        mySips.annualInvestments = accounting.formatNumber(annualInvestments, 2).toString();
            
        }else if((!isEmpty(sipContent))) {
            if(Array.isArray(sipContent)){
                if(!isEmpty(sipContent["accounts-content"])){
                    mySips.description = sipContent["accounts-content"][0].content;	
                }
            }
            else{
                mySips.description = content;
            }	
        }else if((isEmpty(sipDetails))&&(isEmpty(sipContent))){
            mySips=null;
    
		}
        if(mySips===null){
			mySips={};
		}
        mySips.hasInvested = hasInvested;
        mySips.totalActiveSips = totalSIPCount;
            
        var myTransactions = {};
        if(!isEmpty(transactionSummary)) {
            if(!isEmpty(transactionSummary.portfolioDetails)) {
                if(!isEmpty(transactionSummary.portfolioDetails.grandTotal)) {
                myTransactions.currentCost = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentCost, 2).toString();
                myTransactions.currentValue = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentValue, 2).toString();
            }
            }
            if(!isEmpty(transactionSummary.aumSplitDetails)) {
                myTransactions.fundValues = transactionSummary.aumSplitDetails.chartData;
            }
        }
    
        var dividendAmount = "";
        if(!isEmpty(divHistory)) {
            dividendAmount = divHistory.grandTotal;
        }
        
        var unclaimedAmount = "";
        if(!isEmpty(unclaimedTrans)) {
            unclaimedAmount = accounting.formatNumber(unclaimedTrans.grandTotal, 2).toString();
        }
        jObjRes.investorDashboardObject.loginDate       =  jsonBodyObject.loginDate;
        jObjRes.investorDashboardObject.loginTime       =  jsonBodyObject.loginTime;
        jObjRes.investorDashboardObject.lastLogin       =  jsonBodyObject.lastLogin;
        jObjRes.investorDashboardObject.profileDetails       =  investorProfile;
        jObjRes.investorDashboardObject.mySips       =  mySips;
        jObjRes.investorDashboardObject.myTransactions       =  myTransactions;
        jObjRes.investorDashboardObject.dividendHistory          =  dividendAmount;
        jObjRes.investorDashboardObject.unclaimedAmount    =  unclaimedAmount;
    }else if((!isEmpty(widget)) && (widget.toUpperCase()=== "profileDetails".toUpperCase()))
    {
		//var investorProfile      = jsonBodyObject.investorProfile;
		jObjRes.investorDashboardObject.loginDate       =  jsonBodyObject.loginDate;
		jObjRes.investorDashboardObject.loginTime       =  jsonBodyObject.loginTime;
		jObjRes.investorDashboardObject.lastLogin       =  jsonBodyObject.lastLogin;
		jObjRes.investorDashboardObject.profileDetails       =  investorProfile;
    }else if((!isEmpty(widget)) && (widget.toUpperCase()=== "myTransactions".toUpperCase()))
    { 
    var transactionSummary  = jsonBodyObject.transactionSummary==''?'': JSON.parse(jsonBodyObject.transactionSummary);
    var myTransactions = {};
        if(!isEmpty(transactionSummary)) {
            if(!isEmpty(transactionSummary.portfolioDetails)) {
                if(!isEmpty(transactionSummary.portfolioDetails.grandTotal)) {
                    myTransactions.currentCost = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentCost, 2).toString();
                    myTransactions.currentValue = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentValue, 2).toString();
                }
            }
            if(!isEmpty(transactionSummary.aumSplitDetails)) {
            myTransactions.fundValues = transactionSummary.aumSplitDetails.chartData;
            }
        }
        jObjRes.investorDashboardObject.myTransactions       =  myTransactions;
    }else if((!isEmpty(widget)) && (widget.toUpperCase()=== "myInvestments".toUpperCase()))
    {
		//var investorProfile      = jsonBodyObject.investorProfile;
		jObjRes.investorDashboardObject.loginDate       =  jsonBodyObject.loginDate;
		jObjRes.investorDashboardObject.loginTime       =  jsonBodyObject.loginTime;
		jObjRes.investorDashboardObject.lastLogin       =  jsonBodyObject.lastLogin;
		jObjRes.investorDashboardObject.profileDetails       =  investorProfile;
	
	var transactionSummary  =  jsonBodyObject.transactionSummary==''?'':JSON.parse(jsonBodyObject.transactionSummary);
    var myTransactions = null;
        if(!isEmpty(transactionSummary)) {
            myTransactions = {};
            if(!isEmpty(transactionSummary.portfolioDetails)) {
                if(!isEmpty(transactionSummary.portfolioDetails.grandTotal)) {
                    myTransactions.currentCost = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentCost, 2).toString();
                    myTransactions.currentValue = accounting.formatNumber(transactionSummary.portfolioDetails.grandTotal.currentValue, 2).toString();
                }
            }
            if(!isEmpty(transactionSummary.aumSplitDetails)) {
                myTransactions.fundValues = transactionSummary.aumSplitDetails.chartData;
            }
        }
        jObjRes.investorDashboardObject.myTransactions       =  myTransactions;
    }else if((!isEmpty(widget)) && (widget.toUpperCase() ==="mySips".toUppserCase()))
    { 
        var sipDetails  = jsonBodyObject.sipDetails==''?'':JSON.parse(jsonBodyObject.sipDetails);
        var sipContent  = jsonBodyObject.sipContent==''?'':JSON.parse(jsonBodyObject.sipContent);
        if(!isEmpty(sipContent)){
            if(!isEmpty(sipContent["accounts-content"])){
                var content =sipContent["accounts-content"]["my-sip"].content;
                }
            }
        var monthlyInvestments = 0;
        var quarterlyInvestments = 0;
        var annualInvestments = 0;
        var hasInvested = "N";
        var sipLen = 0;
        var totalSIPCount = 0;
        var mySips = {};
        if(!isEmpty(sipDetails)) {
            var sipList = sipDetails.retrieveSip;
            if(!isEmpty(sipList)) {
            sipLen = sipList.length;
            }
            for(var y=0; y < sipLen; y++) {
                hasInvested = "Y";
                var sip = sipList[y];
                var amount = parseInt(sip.amount);
                if(!isEmpty(sip.totalInstallmentNum)){
                            totalSIPCount += parseInt(sip.totalInstallmentNum);
                    }else{
                    totalSIPCount+=0;
                }                       
                if ("Monthly".toUpperCase()===sip.frequency.toUpperCase()) {
                    monthlyInvestments += amount;
                } else if ("Quarterly".toUpperCase()===sip.frequency.toUpperCase()) {
                    quarterlyInvestments += amount;
                } else if ("annually".toUpperCase()===sip.frequency.toUpperCase()) {
                    annualInvestments += amount;
                }
            }            
        mySips.monthlyInvestments = accounting.formatNumber(monthlyInvestments, 2).toString();
        mySips.quarterlyInvestments = accounting.formatNumber(quarterlyInvestments, 2).toString();
        mySips.annualInvestments = accounting.formatNumber(annualInvestments, 2).toString();
        } else if((!isEmpty(sipContent))) {
            if(Array.isArray(sipContent)){
                if(!isEmpty(sipContent["accounts-content"])){
                mySips.description = sipContent["accounts-content"][0].content;	
                }
            }
            else{
                mySips.description = content;
            }	
        } else if((isEmpty(sipDetails))&&(isEmpty(sipContent))){
                mySips=null;
            }if(mySips===null){
                    mySips={};
                }
        mySips.hasInvested = hasInvested;
        mySips.totalActiveSips = totalSIPCount;
        jObjRes.investorDashboardObject.mySips       =  mySips;
    }else if((!isEmpty(widget)) && (widget.toUpperCase() ==="dividendHistory".toUppserCase()))
    {
        var divHistory  = jsonBodyObject.divHistory==''?'':JSON.parse(jsonBodyObject.divHistory);
        var dividendAmount = "";
        if(!isEmpty(divHistory)) {
            dividendAmount = divHistory.grandTotal;
        }
        jObjRes.investorDashboardObject.dividendHistory          =  dividendAmount;
    }else if((!isEmpty(widget)) && (widget.toUpperCase() === "unclaimedAmount".toUpperCase())){
        var unclaimedTrans  = jsonBodyObject.unclaimedTrans==''?'':JSON.parse(jsonBodyObject.unclaimedTrans);
        var unclaimedAmount = "";
        if(!isEmpty(unclaimedTrans)) {
                unclaimedAmount = accounting.formatNumber(unclaimedTrans.grandTotal, 2).toString();
            }
        jObjRes.investorDashboardObject.unclaimedAmount    =  unclaimedAmount;
	}else if((!isEmpty(widget)) && (widget.toUpperCase() === "otherInvestments".toUpperCase()))
    {
		var sipDetails  =jsonBodyObject.sipDetails==''?'': JSON.parse(jsonBodyObject.sipDetails.toString());
        var sipContent  = jsonBodyObject.sipContent==''?'':JSON.parse(jsonBodyObject.sipContent.toString());
        if(!isEmpty(sipContent)){
            if(!isEmpty(sipContent["accounts-content"])){
                var content =sipContent["accounts-content"]["my-sip"].content;
            }
        }
        var monthlyInvestments = 0;
        var quarterlyInvestments = 0;
        var annualInvestments = 0;
        var hasInvested = "N";
        var sipLen = 0;
        var totalSIPCount = 0;
        var mySips = {};
        if(!isEmpty(sipDetails)) {
            var sipList = sipDetails.retrieveSip;
            if(!isEmpty(sipList)) {
                sipLen = sipList.length;
            }
            for(var y=0; y < sipLen; y++) {
                hasInvested = "Y";
                var sip = sipList[y];
                var amount = parseInt(sip.amount);
                if(!isEmpty(sip.totalInstallmentNum)){
                    totalSIPCount += parseInt(sip.totalInstallmentNum);
                    }else{
                    totalSIPCount+=0;
                    }
                if ("Monthly".toUpperCase() === sip.frequency.toUpperCase()) {
                    monthlyInvestments += amount;
                } else if ("Quarterly".toUpperCase() === sip.frequency.toUpperCase()) {
                    quarterlyInvestments += amount;
                } else if ("annually".toUpperCase() === sip.frequency.toUpperCase()) {
                    annualInvestments += amount;
                }
            }
    
            mySips.monthlyInvestments = accounting.formatNumber(monthlyInvestments, 2).toString();
            mySips.quarterlyInvestments = accounting.formatNumber(quarterlyInvestments, 2).toString();
            mySips.annualInvestments = accounting.formatNumber(annualInvestments, 2).toString();
        }else if(!(isEmpty(sipContent))) {
            if(Array.isArray(sipContent)){
                if(!isEmpty(sipContent["accounts-content"])){
                    mySips.description = sipContent["accounts-content"][0].content;	
                }   
		    }else{
		        mySips.description = content;
		    }	
        }else if((isEmpty(sipDetails))&&(isEmpty(sipContent))){
            mySips=null;
        }
        if(mySips!==null){
            mySips.hasInvested = hasInvested;
            mySips.totalActiveSips = totalSIPCount;
        }
        jObjRes.investorDashboardObject.mySips       =  mySips;
				
        var divHistory  =jsonBodyObject.divHistory==''?'': JSON.parse(jsonBodyObject.divHistory.toString());
        var dividendAmount = null;
        if(!isEmpty(divHistory)) {
            dividendAmount = divHistory.grandTotal;
        }
        jObjRes.investorDashboardObject.dividendHistory          =  dividendAmount;
            
        var unclaimedTrans  =jsonBodyObject.unclaimedTrans==''?'': JSON.parse(jsonBodyObject.unclaimedTrans.toString());
        var unclaimedAmount = null;
        if(!isEmpty(unclaimedTrans)) {
            unclaimedAmount = accounting.formatNumber(unclaimedTrans.grandTotal, 2).toString();
        }
        if(isEmpty(unclaimedAmount))
        {
            jObjRes.investorDashboardObject.unclaimedAmount    =  null;
        }
        else 
        {
            jObjRes.investorDashboardObject.unclaimedAmount    =  unclaimedAmount;
        }
        jObjRes.investorDashboardObject.smartSolutionGoals  = {};
        jObjRes.investorDashboardObject.smartSolutionGoals.hasGoals  = {};
        jObjRes.investorDashboardObject.smartSolutionGoals.smartSolContent  = null;
        jObjRes.investorDashboardObject.smartSolutionGoals.fsGoalSummary = null;

		var fsGoalSummary        = jsonBodyObject.fsGoalSummary==''?'': JSON.parse(jsonBodyObject.fsGoalSummary.toString());
		var smartSolContent      = jsonBodyObject.smartSolContent==''?'': JSON.parse(jsonBodyObject.smartSolContent.toString());
		var hasGoals = "N";
		if(!isEmpty(fsGoalSummary)) {
				hasGoals = "Y";
				jObjRes.investorDashboardObject.smartSolutionGoals.fsGoalSummary =  fsGoalSummary.fsGoalSummary; 
		}
		else {
            if(!isEmpty(smartSolContent)) {
                hasGoals = "N";
                if(!isEmpty(smartSolContent)) {
                if(!isEmpty(smartSolContent["accounts-content"])){
                    if(!isEmpty(smartSolContent["accounts-content"]["smart-solutions"])){
                        if(!isEmpty(smartSolContent["accounts-content"]["smart-solutions"]["carousel"])){
                jObjRes.investorDashboardObject.smartSolutionGoals.smartSolContent =  smartSolContent["accounts-content"]["smart-solutions"]["carousel"]["carousel-info"]; 
                        }
                    }
                }
            }
            }else{
                jObjRes.investorDashboardObject.smartSolutionGoals.smartSolContent  = null;
            }
        }
		jObjRes.investorDashboardObject.smartSolutionGoals.hasGoals = hasGoals;
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