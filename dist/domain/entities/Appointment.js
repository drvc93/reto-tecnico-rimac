"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(insuredId, scheduleId, countryISO, status = 'pending', createdAt = new Date()) {
        this.insuredId = insuredId;
        this.scheduleId = scheduleId;
        this.countryISO = countryISO;
        this.status = status;
        this.createdAt = createdAt;
    }
    complete() {
        this.status = 'completed';
    }
}
exports.Appointment = Appointment;
