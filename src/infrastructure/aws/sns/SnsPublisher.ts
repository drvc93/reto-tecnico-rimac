// src/infrastructure/sns/SnsPublisher.ts

import { SNSClient, PublishCommand } from '@aws-sdk/client-sns';
import { Appointment } from '../../../domain/entities/Appointment';

const client = new SNSClient({});

const topicArnMap: Record<'PE' | 'CL', string> = {
  PE: process.env.SNS_TOPIC_PE!,
  CL: process.env.SNS_TOPIC_CL!,
};

export class SnsPublisher {
  async publish(appointment: Appointment): Promise<void> {
    const topicArn = topicArnMap[appointment.countryISO];

    const message = {
      insuredId: appointment.insuredId,
      scheduleId: appointment.scheduleId,
      countryISO: appointment.countryISO,
      status: appointment.status,
      createdAt: appointment.createdAt.toISOString(),
    };

     console.log("sns enviado" ,message )
    const command = new PublishCommand({
      TopicArn: topicArn,
      Message: JSON.stringify({
              insuredId: appointment.insuredId,
              scheduleId: appointment.scheduleId,
              countryISO: appointment.countryISO,
              status: appointment.status,
              createdAt: appointment.createdAt.toISOString(), }),
      MessageAttributes: {
        countryISO: {
          DataType: 'String',
          StringValue: appointment.countryISO,
        },
      },
    });

    console.log("sns enviado  send  **")
    console.log( message )
     console.log("*/*/*/*/*/*/*/*/*")
     console.log( command )
    await client.send(command);
    console.log("sns enviado")
  }
}
