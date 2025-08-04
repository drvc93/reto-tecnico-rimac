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
exports.DynamoAppointmentRepository = void 0;
const Appointment_1 = require("../../../domain/entities/Appointment");
const aws_sdk_1 = require("aws-sdk");
class DynamoAppointmentRepository {
    constructor() {
        this.table = process.env.DYNAMODB_TABLE;
        this.client = new aws_sdk_1.DynamoDB.DocumentClient();
    }
    save(appointment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.put({
                TableName: this.table,
                Item: {
                    insuredId: appointment.insuredId,
                    scheduleId: appointment.scheduleId,
                    countryISO: appointment.countryISO,
                    status: appointment.status,
                    createdAt: appointment.createdAt.toISOString()
                }
            }).promise();
        });
    }
    findByInsuredId(insuredId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const res = yield this.client.query({
                TableName: this.table,
                KeyConditionExpression: 'insuredId = :id',
                ExpressionAttributeValues: {
                    ':id': insuredId,
                },
            }).promise();
            return ((_a = res.Items) === null || _a === void 0 ? void 0 : _a.map(i => new Appointment_1.Appointment(i.insuredId, i.scheduleId, i.countryISO, i.status, new Date(i.createdAt)))) || [];
        });
    }
    updateStatus(insuredId, scheduleId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.client.update({
                TableName: this.table,
                Key: {
                    insuredId,
                    scheduleId,
                },
                UpdateExpression: 'SET #status = :status',
                ExpressionAttributeNames: {
                    '#status': 'status',
                },
                ExpressionAttributeValues: {
                    ':status': status,
                },
            }).promise();
        });
    }
}
exports.DynamoAppointmentRepository = DynamoAppointmentRepository;
