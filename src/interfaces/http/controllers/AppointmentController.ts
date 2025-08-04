// src/interfaces/http/controllers/AppointmentController.ts

// src/interfaces/http/controllers/AppointmentController.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { CreateAppointmentUseCase } from '../../../application/usecases/CreateAppointmentUseCase';
import { DynamoAppointmentRepository } from '../../../infrastructure/aws/dynamodb/DynamoAppointmentRepository';
import { SnsPublisher } from '../../../infrastructure/aws/sns/SnsPublisher';
import { GetAppointmentsByInsuredIdUseCase } from '../../../application/usecases/GetAppointmentsByInsuredIdUseCase';

export class AppointmentController {
  private createUseCase: CreateAppointmentUseCase;
  private getUseCase: GetAppointmentsByInsuredIdUseCase;

  constructor() {
    const repository = new DynamoAppointmentRepository();
    const publisher = new SnsPublisher();
    this.createUseCase = new CreateAppointmentUseCase(repository, publisher);
    this.getUseCase = new GetAppointmentsByInsuredIdUseCase(repository)
  }

  async create(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const body = JSON.parse(event.body || '{}');

      const { insuredId, scheduleId, countryISO } = body;

      if (!insuredId || !scheduleId || !countryISO) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'Missing required fields' }),
        };
      }

      await this.createUseCase.execute({ insuredId, scheduleId, countryISO });

      return {
        statusCode: 202,
        body: JSON.stringify({ message: 'Appointment created and processing started' }),
      };
    } catch (error: any) {
      console.error('Error creating appointment:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  }

  async getByInsuredId(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    try {
      const insuredId = event.pathParameters?.insuredId;

      if (!insuredId) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: 'insuredId is required' }),
        };
      }

      const appointments = await this.getUseCase.execute(insuredId);

      return {
        statusCode: 200,
        body: JSON.stringify(appointments),
      };
    } catch (error) {
      console.error('Error fetching appointments:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Internal server error' }),
      };
    }
  }
}
