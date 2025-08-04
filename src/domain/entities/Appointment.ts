export type AppointmentStatus = 'pending' | 'completed';



export class Appointment {

    public  insuredId: string;
    public  scheduleId: number;
    public  countryISO: 'PE' | 'CL';
    public status: AppointmentStatus = 'pending';
    public createdAt: Date = new Date();

  constructor(
      insuredId:string,
      scheduleId:number,
      countryISO : 'PE' | 'CL',
     status :AppointmentStatus,
     createdAt :Date 
  ) {
    this.insuredId= insuredId;
    this.scheduleId = scheduleId;
    this.countryISO = countryISO;
    this.status = status??"pending";
    this.createdAt = createdAt ? new Date(createdAt) : new Date();
    console.log("******  validate ****" , this);
     console.log("******  validate **** insuredId" , insuredId);

    // this.validate();
  }

  private validate(): void {
    if (!/^\d{5}$/.test(this.insuredId)) {
      throw new Error('Invalid insuredId format (should be 5 digits)');
    }

    if (!['PE', 'CL'].includes(this.countryISO)) {
      throw new Error('Invalid countryISO (must be "PE" or "CL")');
    }

    if (typeof this.scheduleId !== 'number' || this.scheduleId <= 0) {
      throw new Error('Invalid scheduleId (must be a positive number)');
    }
  }

  complete(): void {
    this.status = 'completed';
  }

  toJSON() {
    return {
      insuredId: this.insuredId,
      scheduleId: this.scheduleId,
      countryISO: this.countryISO,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
    };
  }

  static fromPlain(obj: any): Appointment {
    return new Appointment(
      obj.insuredId,
      obj.scheduleId,
      obj.countryISO,
      obj.status || 'pending',
      obj.createdAt ? new Date(obj.createdAt) : new Date()
    );
  }
}
