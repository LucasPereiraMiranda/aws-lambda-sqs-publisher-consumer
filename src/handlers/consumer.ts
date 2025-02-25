import { SQSEvent, SQSHandler } from 'aws-lambda';

export const handler: SQSHandler = async (event: SQSEvent) => {
  try {
    for (const record of event.Records) {
      const messageBody = JSON.parse(record.body);
      console.log('Received message:', messageBody);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(`Message ${record.messageId} processed.`);
    }
  } catch (error) {
    console.error('Error processing messages:', error);
    throw error;
  }
};
