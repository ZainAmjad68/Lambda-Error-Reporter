# Lambda-Error-Reporter

## About
The Architecture of this whole process is simple. There are some Lambda functions and you want to be notified about any critical errors occuring in them. So, you make the CloudWatch Logs monitor the logs from these Lambda functions and invoke an “error processing” Lambda function whenever a log entry matches a filter pattern, for example, ERROR, CRITICAL, or a custom error. This error processing Lambda function in turn publishes a message to an Amazon SNS topic, to which anyone can subscribe and thus get an email when the error occurs.

**Viusal Representation of the Architecture:**

![Visual Representation of the Architecture](./architecture.png)

## What we'll do
The aim is to go through the whole process using CLI and some pre-configured files and get this Error Reporter up and running in no time.

These are some of the steps involved in achieving that goal:
- Creating an AWS SNS topic and subscribing to it
- Creating an IAM role for allowing the Lambda Function to:
    * publish to an SNS topic
    * have Cloudwatch Logs as a trigger.
- Creating a Lambda function that processes the error message and notifies the Subscribers.
- Adding a CloudWatch Log trigger to the above created Lambda and adding the filter pattern that you want the Logs to monitor.

## Detailed Walkthrough

Let's begin the Process of creating this reporter now!!

**Pre-requisites:**

This guide assumes that you've already installed ***AWS CLI*** and set up the ***AWS Profile*** where you want the reporter to be.
If you've not done any of these steps, here are some helpful links:
- [Installing AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Configuring the Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

**Creating an AWS SNS Topic**

**Subscribing to the Topic**

**Creating a Policy**

**Creating a Role**

**Creating the Lambda Function**

**Adding the Cloudwatch Trigger**
