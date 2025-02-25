import { APIGatewayProxyHandler } from 'aws-lambda';
import * as dotenv from 'dotenv';
import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';

dotenv.config();

const sqsClient = new SQSClient({ region: 'us-east-1' });

export const handler: APIGatewayProxyHandler = async (event) => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Request body is required' }),
    };
  }

  const body = JSON.parse(event.body);

  const queueUrl = process.env.QUEUE_URL || 'queue_url';
  if (!queueUrl) {
    console.error('Queue URL is not defined in environment variables.');
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal server error: Queue URL is missing',
      }),
    };
  }

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: JSON.stringify(body),
    });

    const response = await sqsClient.send(command);
    console.log('Message sent successfully:', response.MessageId);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'Message sent successfully!',
        messageId: response.MessageId,
      }),
    };
  } catch (error) {
    console.error('SQS Send Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Failed to send message to SQS',
        error: error instanceof Error ? error.message : 'Internal Server Error',
      }),
    };
  }
};
