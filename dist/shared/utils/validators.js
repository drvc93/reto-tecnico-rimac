"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidInsuredId = isValidInsuredId;
exports.isValidCountryISO = isValidCountryISO;
exports.isValidScheduleId = isValidScheduleId;
/**
 * Validación de insuredId
 * Debe tener exactamente 5 dígitos (puede incluir ceros al inicio)
 */
function isValidInsuredId(insuredId) {
    return /^\d{5}$/.test(insuredId);
}
/**
 * Validación de countryISO
 * Solo se acepta "PE" o "CL"
 */
function isValidCountryISO(countryISO) {
    return countryISO === 'PE' || countryISO === 'CL';
}
/**
 * Validación de scheduleId
 * Debe ser un número entero positivo
 */
function isValidScheduleId(scheduleId) {
    return Number.isInteger(scheduleId) && scheduleId > 0;
}
