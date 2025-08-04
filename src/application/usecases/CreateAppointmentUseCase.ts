import { Console } from 'console';
import { Appointment } from '../../domain/entities/Appointment';
import { AppointmentRepository } from '../../domain/repositories/AppointmentRepository';
import { SnsPublisher } from '../../infrastructure/aws/sns/SnsPublisher';

interface CreateAppointmentInput {
  insuredId: string;
  scheduleId: number;
  countryISO: 'PE' | 'CL';
}

export class CreateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepository,
    private readonly snsPublisher: SnsPublisher
  ) {}

  async execute(input: CreateAppointmentInput): Promise<void> {
    const appointment = new Appointment(
      input.insuredId,
      input.scheduleId,
      input.countryISO,
      'pending',
      new Date() 

    );

    await this.appointmentRepository.save(appointment);
    console.log("****inicio sns****");
    console.log(appointment);
    await this.snsPublisher.publish(appointment);
    console.log("fin sns");
  }
}
