import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Appointment {
  id?: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  department: string;
  doctor: string;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor() {
    this.loadAppointments();
  }

  getAppointments(): Observable<Appointment[]> {
    return this.appointmentsSubject.asObservable();
  }

  bookAppointment(appointment: Appointment): Promise<void> {
    return new Promise((resolve) => {
      appointment.id = Date.now().toString();
      this.appointments.push(appointment);
      this.saveAppointments();
      this.appointmentsSubject.next(this.appointments);
      resolve();
    });
  }

  private saveAppointments(): void {
    localStorage.setItem('appointments', JSON.stringify(this.appointments));
  }

  private loadAppointments(): void {
    const saved = localStorage.getItem('appointments');
    if (saved) {
      this.appointments = JSON.parse(saved);
      this.appointmentsSubject.next(this.appointments);
    }
  }
}
