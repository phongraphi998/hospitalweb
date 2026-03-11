import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, of, throwError } from 'rxjs';

export interface ApiAppointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  department_id: number;
  start_time: string;
  status: string;
  reason: string;
  patient_name?: string;
  doctor_name?: string;
  department_name?: string;
}

export interface Appointment {
  id?: string | number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status:
    | 'confirmed'
    | 'pending'
    | 'completed'
    | 'cancelled'
    | 'checked_in'
    | 'scheduled';
  notes: string;
  department?: string;
}

export interface AppointmentForm {
  name: string;
  email: string;
  phone: string;
  date: string;
  department: string;
  doctor: string;
  message?: string;
}

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private appointments: Appointment[] = [];
  private appointmentsSubject = new BehaviorSubject<Appointment[]>([]);

  constructor(private http: HttpClient) {
    this.loadAppointments();
  }

  getAppointments(params?: { [key: string]: any }): Observable<Appointment[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((k) => {
        if (params[k] !== undefined && params[k] !== null) {
          httpParams = httpParams.set(k, String(params[k]));
        }
      });
    }

    return this.http
      .get<ApiAppointment[]>(`${API_URL}/appointments`, { params: httpParams })
      .pipe(
        catchError((err) => {
          console.error('Failed to fetch appointments from API', err);
          return of([] as ApiAppointment[]);
        }),
        map((data) => data.map(this.mapApiToUI)),
      );
  }

  bookAppointment(appointment: AppointmentForm): Observable<Appointment> {
    // map form to backend appointment schema
    const payload = {
      patient_id: 1,
      doctor_id: 1,
      department_id: 1,
      start_time: `${appointment.date}T00:00:00`,
      reason: appointment.message || `${appointment.name} / ${appointment.email}`,
    };

    return this.http
      .post<ApiAppointment>(`${API_URL}/appointments`, payload)
      .pipe(
        catchError((err) => {
          console.error('Failed to book appointment', err);
          return of(null as unknown as ApiAppointment);
        }),
        map((data) => {
          if (!data) {
            throw new Error('Failed to create appointment');
          }
          return this.mapApiToUI(data);
        }),
      );
  }

  updateStatus(id: number, status: string): Observable<Appointment> {
    return this.http
      .put<ApiAppointment>(`${API_URL}/appointments/${id}/status`, { status })
      .pipe(
        catchError((err) => {
          console.error('Failed to update status', err);
          return throwError(() => err);
        }),
        map((data) => this.mapApiToUI(data)),
      );
  }

  deleteAppointment(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${API_URL}/appointments/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Failed to delete appointment', err);
          return of({ message: 'delete failed' });
        }),
      );
  }

  private loadAppointments(): void {
    this.getAppointments().subscribe((data) => {
      this.appointments = data;
      this.appointmentsSubject.next(data);
    });
  }

  private mapApiToUI = (api: ApiAppointment): Appointment => {
    const datetime = new Date(api.start_time);
    return {
      id: api.id,
      patient: api.patient_name || `Patient ${api.patient_id}`,
      doctor: api.doctor_name || `Doctor ${api.doctor_id}`,
      department: api.department_name || `Department ${api.department_id}`,
      date: !Number.isNaN(datetime.getTime())
        ? datetime.toISOString().split('T')[0]
        : api.start_time,
      time: !Number.isNaN(datetime.getTime())
        ? datetime.toTimeString().split(' ')[0]
        : api.start_time,
      status: (() => {
        const s = (api.status || '').toLowerCase();
        if (s === 'pending') return 'pending';
        if (s === 'checked_in' || s === 'checked-in' || s === 'checked in')
          return 'confirmed';
        if (s === 'completed') return 'completed';
        if (s === 'cancelled' || s === 'canceled') return 'cancelled';
        if (s === 'scheduled') return 'confirmed';
        return 'pending';
      })(),
      notes: api.reason || '',
    };
  };
}
