using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Net;
using Newtonsoft.Json;
using System.Collections.Generic;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info("C# HTTP trigger function processed a request.");

    try
    {

          IEnumerable<string> headerValues = req.Headers.GetValues("Authorization");
        var authKey = headerValues.FirstOrDefault();

        log.Info($"authKey-->{authKey}");


        string tokenString = authKey.Split(' ')[1];
log.Info($"{tokenString}");

    var handler = new JwtSecurityTokenHandler();
    var token = handler.ReadJwtToken(tokenString);
   //  log.Info($"pan--> {token.Payload.GetValueOrDefault("pan")}");

     object guId = string.Empty;
     object pan = string.Empty;
     object userId = string.Empty;
     object userType = string.Empty;
     object refNo = string.Empty;
     token.Payload.TryGetValue("guId",out guId);
     token.Payload.TryGetValue("pan",out pan);
     token.Payload.TryGetValue("userId",out userId);
     token.Payload.TryGetValue("refNo",out refNo);
     token.Payload.TryGetValue("userType",out userType);
    log.Info("5656565656");
       dynamic tokenObj = new { guId =guId?.ToString(),pan = pan?.ToString(),userId=userId?.ToString(), userType =userType?.ToString(),refNo=refNo?.ToString()};
log.Info("57777888888");
         var jsonExtractedObj = JsonConvert.SerializeObject(tokenObj);

         log.Info($"jsn --->> {jsonExtractedObj}");

   return new HttpResponseMessage(HttpStatusCode.OK) {
        Content = new StringContent(jsonExtractedObj, Encoding.UTF8, "application/json")
};
    }
    catch(Exception ex)
    {
        dynamic errorObj = new { errorSource = "AZURE-APIM",errorCode="A0008",errorDescription= "Invalid Access Token"};

         var jsonExtractedErrorObj = JsonConvert.SerializeObject(errorObj);

         log.Info($"jsonExtractedErrorObj --->> {jsonExtractedErrorObj}");
           return new HttpResponseMessage(HttpStatusCode.Unauthorized) {
        Content = new StringContent(jsonExtractedErrorObj, Encoding.UTF8, "application/json")
};
    }

}
