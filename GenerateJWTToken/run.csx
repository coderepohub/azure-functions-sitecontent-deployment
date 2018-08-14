using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text; 
using System.Net;
using System.Collections.Generic;

public static async Task<HttpResponseMessage> Run(HttpRequestMessage req, TraceWriter log)
{
    log.Info($"C# HTTP trigger function processed a request.--> {req}");
    string name = string.Empty;
      // Get request body
        dynamic data = await req.Content.ReadAsAsync<JObject>();
          log.Info($"C# data--> {data}");

        const string secKey = "591abd3e44453b954555b7a0812e1081c39b740293f765eae731f5a65ed1";

        log.Info($"11111--> 111111");

        IEnumerable<string> headerValues = req.Headers.GetValues("Authorization");

        log.Info($"22222--> 22222");
        var authKey = headerValues.FirstOrDefault().Split(' ')[1];

        log.Info($"authKey--> {authKey}");

        string guId = data?.guId;
        string pan = data?.pan;
        string userId = data?.userId;
        string userType = data?.userType;
        string refNo = data?.refNo;
    
           // Define const Key this should be private secret key  stored in some safe place
            string key = string.Concat(authKey,secKey);
            log.Info($"key --> {key}");
            log.Info($"authKey --> {authKey}");

            // Create Security key  using private key above:
            // not that latest version of JWT using Microsoft namespace instead of System
            var securityKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));

            // Also note that securityKey length should be >256b
            // so you have to make sure that your private key has a proper length
            var credentials = new Microsoft.IdentityModel.Tokens.SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);

            //  Finally create a Token
            var header = new JwtHeader(credentials);

            //Some PayLoad that contain information about the  customer
            var payload = new JwtPayload {
                { "guId",guId },
                { "pan",pan },
                { "userId",userId },
                { "userType",userType },
                { "refNo",refNo }
            };
            //
            var secToken = new JwtSecurityToken(header, payload);
            var handler = new JwtSecurityTokenHandler();

            // Token to String so you can use it in your client
            var tokenString = handler.WriteToken(secToken);

             dynamic tokenObj = new { accesToken=tokenString , guId =guId, userType =userType};

            var jsonToken = JsonConvert.SerializeObject(tokenObj);

            log.Info($"token--> {jsonToken}");

            return new HttpResponseMessage(HttpStatusCode.OK) {
        Content = new StringContent(jsonToken, Encoding.UTF8, "application/json")
    };
}
