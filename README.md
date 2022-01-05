# Lambda-Error-Reporter

## About
The Architecture of this whole process is simple. It uses Publisher/Subscriber pattern to push any new updates. 
Imagine that there are some Lambda functions and you want to be notified about any critical errors occuring in them. So, you make the `AWS CloudWatch` monitor the logs from these Lambda functions and invoke an “error processing” Lambda function whenever a log entry matches a `filter pattern`, for example, ERROR, CRITICAL, or a custom error.
This error processing Lambda function in turn publishes a message to an `Amazon SNS Topic`, to which anyone can subscribe and thus get an email when the error occurs.

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

First of all, clone this repository and open it in your command prompt. This is important because you'll be using the files attached in this repository as input to many of the CLI commands mentioned below.

**Pre-requisites:**

This guide assumes that you've already installed ***AWS CLI*** and set up the ***AWS Profile*** where you want the reporter to be.
If you've not done any of these steps, here are some helpful links:
- [Installing AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Configuring the Profile](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html)

Also, make sure that you have the required permissions to make changes to these AWS Services. Contact the Dev Ops team if you encounter any ***AccessDenied*** Exception.

**Creating an AWS SNS Topic**

CLI command to create an SNS topic:
```
aws sns create-topic --cli-input-json file://sns-topic.json
```
Copy the `Topic ARN` that is returned upon executing this command. It will be used in the next step.

Check out the `sns-topic.json` file above to find out information about parameters to this command.
- `Name` is the name of the topic that will be created.
- `DisplayName` is the alias that will be used as the sender of the Email/SMS etc. whenever a new message is published.

You can refer to the [official docs](https://docs.aws.amazon.com/cli/latest/reference/sns/create-topic.html) on this for further details.

**Subscribing to the Topic**

CLI command to subscribe to an SNS topic:
```
aws sns subscribe --cli-input-json file://subscribe.json
```

Check out the `subscribe.json` file above to find out information about parameters to this command.
- `TopicARN` is the SNS Topic that you copied in the previous step.
- `Protocol` is the mode of communication that will be used to update the subscriber.
- `Endpoint` is the actual user that subscribes to the topic. It can be an Email/Phone Number/URL depending on teh protocol being used.

You can refer to the [official docs](https://docs.aws.amazon.com/cli/latest/reference/sns/subscribe.html) on this for further details.

**Confirming the Subscrition**

By now, you will have received an Email (or an SMS, depending on subscription type) on the Endpoint that you specified in the previous step to confirm this subscription.
And it will probably look something like this:
<img width="765" alt="Screen Shot 2022-01-05 at 1 51 58 PM" src="https://user-images.githubusercontent.com/53145353/148188798-4a23f000-39f2-4038-85ce-d48383d5dd9f.png">
<br />Confirm the subscription before moving on to the next step.

**Creating a Policy**

CLI command to create a Policy:
```
aws iam create-policy --policy-name error-report-policy --policy-document file://policy.json
```

Copy the `Policy ARN` that is returned upon executing this command. It will be used in the next step.

Check out the `policy.json` file above to find out information about the policy statement that we're creating.

You need to make the following changes to the `policy.json` to reflect your use case:
- On Line 7, paste the `TopicARN` of the SNS Topic created in the earlier steps.  
- On Line 16, update `Resource` info and add a name for the Lambda Function you'll create in the next steps.
<br />Sample Policy:
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sns:Publish",
            "Resource": "arn:aws:sns:<region>:<AWS account number>:<name of the SNS topic from previous step>"
        },
        {
            "Effect": "Allow",
            "Action": [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "arn:aws:logs:<region>:<AWS account number>:log-group:/aws/lambda/<name of the lambda function you are going to create in next step>:*"
        }
    ]
}
```
You can refer to the [official docs](https://docs.aws.amazon.com/cli/latest/reference/iam/create-policy.html) on this for further details.

**Creating a Role**

CLI command to create a Role:
```
aws iam create-role --role-name error-report-role --assume-role-policy-document file://trust-policy.json
```

Check out the `trust-policy.json` file above to find out information about the policy statement that we're creating. It basically allows a Lambda (and no one else) to assume this role.

You can refer to the [official docs](https://docs.aws.amazon.com/cli/latest/reference/iam/create-role.html) on this for further details.

Now, we need to attach the Policy Created in the previous step to this Role.

CLI command to attach a Policy with this Role:
```
aws iam attach-role-policy --policy-arn arn:aws:iam::213912083787:policy/error-report-policy --role-name error-report-role
```
You can refer to the [official docs](https://docs.aws.amazon.com/cli/latest/reference/iam/attach-role-policy.html) on this for further details.

**Creating the Lambda Function**

**Adding the Cloudwatch Trigger**
