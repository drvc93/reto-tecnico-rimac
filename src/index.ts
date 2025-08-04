// src/index.ts

import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppointmentController } from './interfaces/http/controllers/AppointmentController';

const controller = new AppointmentController();

export const createAppointment: APIGatewayProxyHandler = async (event) => {
  return controller.create(event);
};

export const getAppointmentsByInsuredId: APIGatewayProxyHandler = async (event) => {
  return controller.getByInsuredId(event);
};
