import { APIGatewayProxyHandler } from 'aws-lambda';
import { AppointmentController } from '../interfaces/http/controllers/AppointmentController';

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crear una nueva cita médica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               insuredId:
 *                 type: string
 *               scheduleId:
 *                 type: integer
 *               countryISO:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *       400:
 *         description: Error de validación
 */
/**
 * @swagger
 * /appointments/{insuredId}:
 *   get:
 *     summary: Listar citas por código de asegurado
 *     parameters:
 *       - in: path
 *         name: insuredId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de citas
 */
// Instanciamos el controller una sola vez por eficiencia
const controller = new AppointmentController();


export const createAppointment: APIGatewayProxyHandler = async (event) => {
  return controller.create(event);
};

export const getAppointmentsByInsuredId: APIGatewayProxyHandler = async (event) => {
  return controller.getByInsuredId(event);
};
