using System;

public static void Run(string myEventHubMessage,out string outputBlob, TraceWriter log)
{
    log.Info($"C# Event Hub trigger function processed a message: {myEventHubMessage}");
    outputBlob = myEventHubMessage;
}
