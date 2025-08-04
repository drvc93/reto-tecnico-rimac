export interface AppointmentRequest {
  insuredId: string;      // ej: "01234"
  scheduleId: number;     // ej: 100
  countryISO: 'PE' | 'CL';// solo estos valores
}