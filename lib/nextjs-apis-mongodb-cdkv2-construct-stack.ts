import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as lambda from "aws-cdk-lib/aws-lambda-nodejs";
import * as docdb from "aws-cdk-lib/aws-docdb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3deploy from "aws-cdk-lib/aws-s3-deployment";
import * as path from "path";
import { Runtime } from "aws-cdk-lib/aws-lambda";

export class NextjsDocumentdbStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, "NextjsVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Create a DocumentDB cluster
    const cluster = new docdb.DatabaseCluster(this, "DocumentDBCluster", {
      masterUser: {
        username: "admin",
      },
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.SMALL,
      ),
      vpc,
    });

    // Create a Lambda function that connects to DocumentDB

    const apiLambda = new lambda.NodejsFunction(this, "ApiLambda", {
      runtime: Runtime.NODEJS_LATEST,
      entry: path.join(__dirname, "../lambda/handler.ts"),
      handler: "handler",
      vpc,
      environment: {
        CLUSTER_ENDPOINT: cluster.clusterEndpoint.socketAddress,
        MASTER_USERNAME: "admin",
        MASTER_PASSWORD: cluster
          .secret!.secretValueFromJson("password")
          .toString(),
      },
    });

    // Create an API Gateway
    const api = new apigateway.LambdaRestApi(this, "ApiGateway", {
      handler: apiLambda,
    });

    new cdk.CfnOutput(this, "ApiUrl", {
      value: api.url!,
    });

    // S3 bucket to host the Next.js static files
    const bucket = new s3.Bucket(this, "NextjsBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
    });

    // Deploy the Next.js app to the S3 bucket
    new s3deploy.BucketDeployment(this, "NextjsDeployment", {
      sources: [s3deploy.Source.asset("../next-app/out")],
      destinationBucket: bucket,
    });

    new cdk.CfnOutput(this, "BucketUrl", {
      value: bucket.bucketWebsiteUrl,
    });
  }
}
