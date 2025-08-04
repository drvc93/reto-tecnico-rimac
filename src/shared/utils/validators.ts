/**
 * Validación de insuredId
 * Debe tener exactamente 5 dígitos (puede incluir ceros al inicio)
 */
export function isValidInsuredId(insuredId: string): boolean {
  return /^\d{5}$/.test(insuredId);
}

/**
 * Validación de countryISO
 * Solo se acepta "PE" o "CL"
 */
export function isValidCountryISO(countryISO: string): boolean {
  return countryISO === 'PE' || countryISO === 'CL';
}

/**
 * Validación de scheduleId
 * Debe ser un número entero positivo
 */
export function isValidScheduleId(scheduleId: number): boolean {
  return Number.isInteger(scheduleId) && scheduleId > 0;
}
