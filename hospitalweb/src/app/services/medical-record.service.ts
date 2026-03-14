import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MedicalRecordService {
  private apiUrl = 'http://localhost:3000/medical-records';

  constructor(private http: HttpClient) {}

  getMedicalRecordsByDoctor(doctorId?: number): Observable<any> {
    const url = doctorId ? `${this.apiUrl}?doctor_id=${doctorId}` : this.apiUrl;
    return this.http.get<any>(url);
  }

  getMedicalRecordsByUser(userId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?user_id=${userId}`);
  }

  createMedicalRecord(data: { appointment_id: number, diagnosis: string, treatment?: string, notes: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}
