import { CreateAppointmentUseCase } from '../../application/usecases/CreateAppointmentUseCase';
import { Appointment } from '../../domain/entities/Appointment';

describe('CreateAppointmentUseCase', () => {
  it('should create and publish an appointment', async () => {
    const mockRepo = {
      save: jest.fn().mockResolvedValue(undefined),
      findByInsuredId: jest.fn().mockResolvedValue(undefined),
      updateStatus : jest.fn().mockResolvedValue(undefined)
     
    };

    const mockPublisher = {
      publish: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new CreateAppointmentUseCase(mockRepo, mockPublisher);
    
    const input = {
      insuredId: '01234',
      scheduleId: 101,
      countryISO: 'PE' as const,
    };

    await useCase.execute(input);

    expect(mockRepo.save).toHaveBeenCalledWith(expect.any(Appointment));
    expect(mockPublisher.publish).toHaveBeenCalledWith(expect.any(Appointment));
  });
});
