import { EventBridgeClient, PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { Appointment } from '../../../domain/entities/Appointment';

export class EventBridgePublisher {
  private readonly client: EventBridgeClient;

  constructor() {
    this.client = new EventBridgeClient({});
  }

  async publishAppointmentCompleted(appointment: Appointment): Promise<void> {
    const event = {
      Source: 'appointment.service',
      DetailType: 'AppointmentCompleted',
      EventBusName: 'default',
      Time: new Date(),
      Detail: JSON.stringify({
        insuredId: appointment.insuredId,
        scheduleId: appointment.scheduleId,
        countryISO: appointment.countryISO,
        status: appointment.status,
        createdAt: appointment.createdAt.toISOString(),
      }),
    };

    const command = new PutEventsCommand({ Entries: [event] });

    try {
         console.log(' ***###***** EventBridge  Mensaje  → Evento enviado:', command);
      const response = await this.client.send(command);
      console.log('📤 EventBridge → Evento enviado:', response);
    } catch (error) {
      console.error('❌ Error al enviar a EventBridge:', error);
      throw error;
    }
  }
}
