import { SQSEvent } from 'aws-lambda';
import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentRdsRepository } from '../../infrastructure/aws/rds/AppointmentRdsRepository';
import { EventBridgePublisher } from '../../infrastructure/aws/eventbridge/EventBridgePublisher';

const repository = new AppointmentRdsRepository();
const publisher = new EventBridgePublisher();

export const handleAppointmentPE = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const rawBody = typeof record.body === 'string'
        ? JSON.parse(record.body)
        : record.body;

        const rawBodyMessage = JSON.parse(rawBody.Message)
      console.log('📥 Mensaje recibido PE:', rawBody);
       console.log('📥 Mensaje recibido PE Message:', rawBodyMessage );

      const appointment = new Appointment(
      rawBodyMessage.insuredId,
      rawBodyMessage.scheduleId,
      rawBodyMessage.countryISO,
      rawBodyMessage.status ,
      rawBodyMessage.createdAt 
    );

     console.log(' Entidad validada PE  JSON***:', appointment.toJSON);

      console.log(' Entidad validada PE ***:', appointment);

      await repository.save(appointment, 'PE');
      console.log(' Guardado en RDS PE');

      await publisher.publishAppointmentCompleted(appointment);
      console.log(' Publicado en EventBridge desde PE');
    } catch (error) {
      console.error(' Error en handleAppointmentPE:', error);
    }
  }
};

export const handleAppointmentCL = async (event: SQSEvent): Promise<void> => {
  for (const record of event.Records) {
    try {
      const rawBody = typeof record.body === 'string'
        ? JSON.parse(record.body)
        : record.body;

      console.log('📥 Mensaje recibido CL:', rawBody);

      const appointment = Appointment.fromPlain(rawBody);
      console.log('✅ Entidad validada CL:', appointment);

      await repository.save(appointment, 'CL');
      console.log('💾 Guardado en RDS CL');

      await publisher.publishAppointmentCompleted(appointment);
      console.log('📤 Publicado en EventBridge desde CL');
    } catch (error) {
      console.error('❌ Error en handleAppointmentCL:', error);
    }
  }
};
