const express = require("express");
const AWS = require('aws-sdk');

const dotenv = require('dotenv');
dotenv.config();

const app = express();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-west-2'
});

const cloudwatchLogs = new AWS.CloudWatchLogs();

function logRequests(req, res, next) {
  const logGroupName = 'NODE_APP';
  const logStreamName = 'NODE_APP_STREAM';
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url} ${req.get('user-agent')} ${req.get('x-forwarded-for')}`;

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
      console.error('Log gönderimi başarısız:', err);
    } else {
      console.log('Log başarıyla gönderildi:', data);
    }
  });

  next();
}

app.use(logRequests);

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});

app.get("/", (req, res) => {
  res.json({ message: "Welcome to my application" });
});
