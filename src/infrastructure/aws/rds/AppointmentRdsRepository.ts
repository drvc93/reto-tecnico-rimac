import mysql from 'mysql2/promise';
import { Appointment } from '../../../domain/entities/Appointment';

export class AppointmentRdsRepository {
  private getConnection = async () => {
    return await mysql.createConnection({
      host: process.env.RDS_HOST,
      port: Number(process.env.RDS_PORT),
      user: process.env.RDS_USER,
      password: process.env.RDS_PASSWORD,
      database: process.env.RDS_DATABASE,
    });
  };

  async save(appointment: Appointment, countryCode: 'PE' | 'CL'): Promise<void> {
    const connection = await this.getConnection();

    try {
      console.log(`💽 Insertando appointment en RDS ${countryCode}...`);

      const values = [
        appointment.insuredId ?? null,
        appointment.scheduleId ?? null,
        appointment.countryISO ?? null,
        appointment.status ?? null,
        appointment.createdAt ? appointment.createdAt.toISOString().slice(0, 19).replace('T', ' ') : null,
      ];

      const sql = `
        INSERT INTO appointments (insuredId, scheduleId, countryISO, status, createdAt)
        VALUES (?, ?, ?, ?, ?)
      `;

      await connection.execute(sql, values);

      console.log(' Insert exitoso en RDS');
    } catch (error) {
      console.error(' Error al guardar en RDS:', error);
      throw error;
    } finally {
      await connection.end();
    }


  }

  async findByInsuredId(insuredId: string): Promise<Appointment[]> {
    const connection = await this.getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM appointments WHERE insuredId = ?',
      [insuredId]
    );
    return (rows as any[]).map(Appointment.fromPlain);
  }

}
