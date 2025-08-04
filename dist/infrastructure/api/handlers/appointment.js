"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getByInsuredId = exports.create = void 0;
const CreateAppointmentUseCase_1 = require("../../../application/usecases/CreateAppointmentUseCase");
const GetAppointmentsByInsuredUseCase_1 = require("../../../application/usecases/GetAppointmentsByInsuredUseCase");
const DynamoAppointmentRepository_1 = require("../../aws/dynamodb/DynamoAppointmentRepository");
const validators_1 = require("../../../shared/utils/validators");
const create = (event) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = JSON.parse(event.body || '{}');
        const { insuredId, scheduleId, countryISO } = body;
        // Validaciones
        if (!(0, validators_1.isValidInsuredId)(insuredId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'insuredId debe tener 5 dígitos numéricos.' }),
            };
        }
        if (!(0, validators_1.isValidScheduleId)(scheduleId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'scheduleId debe ser un número positivo.' }),
            };
        }
        if (!(0, validators_1.isValidCountryISO)(countryISO)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'countryISO debe ser PE o CL.' }),
            };
        }
        // Crear cita (estado 'pending') en DynamoDB
        const repo = new DynamoAppointmentRepository_1.DynamoAppointmentRepository();
        const useCase = new CreateAppointmentUseCase_1.CreateAppointmentUseCase(repo);
        const appointment = yield useCase.execute({ insuredId, scheduleId, countryISO });
        // TODO: publicar en SNS aquí (se puede hacer en un service)
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Agendamiento en proceso',
                appointment,
            }),
        };
    }
    catch (error) {
        console.error('Error en POST /appointments', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
});
exports.create = create;
const getByInsuredId = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const insuredId = (_a = event.pathParameters) === null || _a === void 0 ? void 0 : _a.insuredId;
        if (!insuredId || !(0, validators_1.isValidInsuredId)(insuredId)) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'insuredId inválido o ausente' }),
            };
        }
        const repo = new DynamoAppointmentRepository_1.DynamoAppointmentRepository();
        const useCase = new GetAppointmentsByInsuredUseCase_1.GetAppointmentsByInsuredUseCase(repo);
        const appointments = yield useCase.execute(insuredId);
        return {
            statusCode: 200,
            body: JSON.stringify({ appointments }),
        };
    }
    catch (error) {
        console.error('Error en GET /appointments/{insuredId}', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error interno del servidor' }),
        };
    }
});
exports.getByInsuredId = getByInsuredId;
