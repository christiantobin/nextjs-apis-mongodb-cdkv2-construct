# Next.js DocumentDB CDK Construct

This project is a CDK construct that provides a complete setup for deploying a Next.js application with a backend powered by AWS Lambda functions and Amazon DocumentDB. It's an excellent starting point for developers looking to build scalable, serverless web applications using AWS services.

## Features

- **Next.js Application**: Deploys a Next.js app to an S3 bucket, served as a static site.
- **Amazon DocumentDB**: A fully managed NoSQL database service that is MongoDB-compatible, used here as the application's backend database.
- **AWS Lambda Functions**: Serverless compute functions written in TypeScript, connecting to DocumentDB to handle API requests.
- **API Gateway**: Exposes the Lambda functions as HTTP endpoints to interact with the frontend.

## Getting Started

### Prerequisites

- [AWS CDK](https://docs.aws.amazon.com/cdk/latest/guide/cli.html) installed
- AWS account with necessary permissions
- Node.js and npm installed

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/christiantobin/nextjs-documentdb-cdk.git
   cd nextjs-documentdb-cdk
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the Next.js application**:

   The Next.js app is located in the `next-app` directory. You can customize it as needed. To install dependencies and build the app:

   ```bash
   cd next-app
   npm install
   npm run build
   npm run export
   ```

### Deployment

To deploy the infrastructure to AWS, run the following command:

```bash
cdk deploy
```

### Outputs

After a successful deployment, CDK will provide two key outputs:

- **API Gateway URL**: The endpoint where your API is exposed.
- **S3 Bucket URL**: The URL of the deployed Next.js static site.

### Example Usage

After deployment, you can start making requests to your API endpoint and see the results directly on your Next.js site. For example:

```bash
curl -X POST -H "Content-Type: application/json" -d '{"name": "Test", "value": "123"}' https://<api-gateway-id>.execute-api.<region>.amazonaws.com/prod/
```

## Project Structure

- **lib/nextjs-documentdb-stack.ts**: CDK stack that defines the infrastructure.
- **lambda/handler.ts**: Example Lambda function that connects to DocumentDB.
- **next-app/**: Next.js application that is deployed to an S3 bucket.

## Customization

Feel free to customize the CDK construct and Next.js application to fit your specific needs. This project is designed to be a starting point, so you can add additional AWS services, modify the Next.js configuration, or extend the Lambda functions as required.

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
