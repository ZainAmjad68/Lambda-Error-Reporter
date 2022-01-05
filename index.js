// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// To Decompress the Gzip Log
const zlib = require('zlib');

// Set region
AWS.config.update({region: 'us-east-1'});

exports.handler = async (event, context) => {
  if (event.awslogs && event.awslogs.data) {
    const payload = Buffer.from(event.awslogs.data, 'base64');

    const uncompressedLog = JSON.parse(zlib.unzipSync(payload).toString());

    let functionName = uncompressedLog.logGroup.split('/')[3];
    let errorMsg = uncompressedLog.logEvents[0].message;
    let logStream = uncompressedLog.logStream;
    let subscriptionFilters = uncompressedLog.subscriptionFilters;
    
    let emailBody = `
    One of the Lambda Functions suffered an Error and needs your immediate attention for smooth operation. 
    Pertinent Details are below:
    
    ###########################
    Function Name: ${functionName}
    Log Stream: ${logStream}
    Subscription Filter invoked: ${subscriptionFilters}
                
    Error Message: ${errorMsg}
    ############################
    `
  
    // Create publish parameters
    var params = {
      Message: emailBody, /* required */
      TargetArn: process.env.snsARN, /* required */
      Subject: `Attention!! Execution Error for Lambda function - ${functionName}` /* optional */
    };
    
    // Create SNS service object
    var sns = new AWS.SNS({apiVersion: '2010-03-31'});
    
    try {
      let response = await sns.publish(params).promise();
      console.log('Success Sending Email. ', response);
    } catch(err) {
      console.log('Error Encountered.',err)
    }
      
  }
};