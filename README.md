# SimpleBridge
A simple bridge API endpoint using NestJS, Typescript and serverless

## Installation

To install the project, simply run the following commands
```
npm install
```

Then, to build the project, use
```
npm run build
```

To test the serverless app locally, you can use serverless offline
```
npx sls offline
```

## Deployment

To deploy the projet, you must first configure your AWS Credentials
https://www.serverless.com/framework/docs/providers/aws/guide/credentials/

Then, use serverless deploy
```
npx sls deploy
```