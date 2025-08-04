import { AppointmentRepository } from '../../../domain/repositories/AppointmentRepository';
import { Appointment } from '../../../domain/entities/Appointment';
import { DynamoDB } from 'aws-sdk';

export class DynamoAppointmentRepository implements AppointmentRepository {
  private readonly table = process.env.APPOINTMENTS_TABLE!;
  private readonly client = new DynamoDB.DocumentClient();

  async save(appointment: Appointment): Promise<void> {
    await this.client.put({
      TableName: this.table,
      Item: {
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        createdAt: appointment.createdAt.toISOString()
      }
    }).promise();
  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const res = await this.client.query({
      TableName: this.table,
      KeyConditionExpression: 'insuredId = :id',
      ExpressionAttributeValues: {
        ':id': insuredId,
      },
    }).promise();

    return res.Items?.map(i => new Appointment(
      i.insuredId,
      i.scheduleId,
      i.countryISO,
      i.status,
      new Date(i.createdAt)
    )) || [];
  }

  async updateStatus(insuredId: string, scheduleId: number, status: string): Promise<void> {
  await this.client.update({
    TableName: this.table,
    Key: {
      insuredId,
      scheduleId,
    },
    UpdateExpression: 'SET #status = :status',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':status': status,
    },
  }).promise();
}
}
