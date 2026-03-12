import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = 'http://localhost:3000/prescriptions';

  constructor(private http: HttpClient) { }

  getPrescriptionsByDoctor(doctor_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?doctor_id=${doctor_id}`);
  }

  getPrescriptionsByUser(user_id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?user_id=${user_id}`);
  }

  getPrescriptionById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPrescription(appointment_id: number, prescription_items: any[]): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      appointment_id,
      prescription_items
    });
  }

  deletePrescription(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
