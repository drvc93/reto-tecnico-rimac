import { SQSEvent } from 'aws-lambda';
import { DynamoAppointmentRepository } from '../dynamodb/DynamoAppointmentRepository';

export const handler = async (event: SQSEvent): Promise<void> => {
  const repo = new DynamoAppointmentRepository();

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      const { insuredId, scheduleId } = body;

      if (!insuredId || !scheduleId) {
        console.warn('Mensaje inválido:', body);
        continue;
      }

      await repo.updateStatus(insuredId, scheduleId, 'completed');
      console.log(`Estado actualizado: ${insuredId} - ${scheduleId}`);
    } catch (err) {
      console.error('Error procesando mensaje de EventBridge -> SQS:', err);
    }
  }
};
