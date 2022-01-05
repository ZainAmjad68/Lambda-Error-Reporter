# Lambda-Error-Reporter

## About

The Architecture of this whole process is simple. There are some Lambda functions and you want to be notified about any critical errors occuring in them. So, you make the CloudWatch Logs monitor the logs from these Lambda functions and invoke an “error processing” Lambda function whenever a log entry matches a filter pattern, for example, ERROR, CRITICAL, or a custom error. This error processing Lambda function in turn publishes a message to an Amazon SNS topic, to which anyone can subscribe and thus get an email when the error occurs.


## Concise Definition
The aim is to go through the whole process using CLI and some pre-configured files and get this Error Reporter up and running in no time.

These are some of the steps involved in achieving that goal:
- Creating an AWS SNS topic and subscribing to it
- Creating an IAM role for allowing the Lambda Function to:
    * publish to an SNS topic
    * have Cloudwatch Logs as a trigger.
- Creating a Lambda function that processes the error message and notifies the Subscribers.
- Adding a CloudWatch Log trigger to the above created Lambda and adding the filter pattern that you want the Logs to monitor.

## Detailed Walkthrough
