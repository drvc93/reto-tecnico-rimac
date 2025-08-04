import { SQSEvent } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../../infrastructure/aws/dynamodb/DynamoAppointmentRepository';

const repo = new DynamoAppointmentRepository();

export const handle = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const data = JSON.parse(record.body).detail;

    await repo.updateStatus(data.insuredId, data.scheduleId, 'completed');

    console.log(`Updated status for appointment of ${data.insuredId} to completed`);
  }
};
