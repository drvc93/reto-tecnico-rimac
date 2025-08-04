import { GetAppointmentsByInsuredIdUseCase } from '../../application/usecases/GetAppointmentsByInsuredIdUseCase';
import { Appointment } from '../../domain/entities/Appointment';

describe('GetAppointmentsByInsuredIdUseCase', () => {
  it('should return a list of appointments', async () => {
    const mockAppointments: Appointment[] = [
      new Appointment('01234', 100, 'PE', 'pending', new Date()),
    ];

    const mockRepo = {
       findByInsuredId: jest.fn().mockResolvedValue(mockAppointments),
       save: jest.fn(), // mock vacío
       updateStatus: jest.fn(), // mock vacío
    };

    const useCase = new GetAppointmentsByInsuredIdUseCase(mockRepo);

    const result = await useCase.execute('01234');

    expect(result).toEqual(mockAppointments);
    expect(mockRepo.findByInsuredId).toHaveBeenCalledWith('01234');
  });
});
