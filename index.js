const express = require("express");
const AWS = require('aws-sdk');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

app.listen(5001, () => {
    console.log("Server is running on port 5001");
})

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application" });
});

app.get("/logs", (req, res) => {

    AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: 'us-west-2'
    });


    const cloudwatchLogs = new AWS.CloudWatchLogs();

    function sendLogMessage(logGroupName, logStreamName, logMessage) {
    const params = {
        logGroupName: logGroupName,
        logStreamName: logStreamName,
        logEvents: [
        {
            message: logMessage,
            timestamp: new Date().getTime()
        }
        ]
    };

    cloudwatchLogs.putLogEvents(params, function(err, data) {
        if (err) {
            res.json({message: "Log gönderimi başarısız", err})
        } else {
            res.json({message: "Log başarıyla gönderildi", data})
        }
    });
}

    sendLogMessage('NODE_APP', 'NODE_APP_STREAM', 'nodejs uygulamasından gelen log.');
});