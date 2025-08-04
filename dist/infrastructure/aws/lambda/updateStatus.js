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
exports.handler = void 0;
const DynamoAppointmentRepository_1 = require("../dynamodb/DynamoAppointmentRepository");
const handler = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const repo = new DynamoAppointmentRepository_1.DynamoAppointmentRepository();
    for (const record of event.Records) {
        try {
            const body = JSON.parse(record.body);
            const { insuredId, scheduleId } = body;
            if (!insuredId || !scheduleId) {
                console.warn('Mensaje inválido:', body);
                continue;
            }
            yield repo.updateStatus(insuredId, scheduleId, 'completed');
            console.log(`Estado actualizado: ${insuredId} - ${scheduleId}`);
        }
        catch (err) {
            console.error('Error procesando mensaje de EventBridge -> SQS:', err);
        }
    }
});
exports.handler = handler;
