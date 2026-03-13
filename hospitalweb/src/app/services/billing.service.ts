import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';

// ==================== Interfaces ====================

export interface ApiBillingItem {
  id: number;
  billing_id: number;
  description: string;
  qty: number;
  price: number;
  total: number;
}

export interface ApiBilling {
  id: number;
  appointment_id: number | null;
  total_amount: number;
  status: 'UNPAID' | 'PAID';
  issued_at: string;
  paid_at: string | null;
  patient_name?: string;
  doctor_name?: string;
  patient_id?: number;
  doctor_id?: number;
  appointment_date?: string;
  items: ApiBillingItem[];
}

export interface BillingCreatePayload {
  appointment_id?: number | null;
  total_amount?: number;
  discount?: number;
  patient_name?: string;
  items: {
    description: string;
    qty: number;
    price: number;
  }[];
}

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class BillingService {

  constructor(private http: HttpClient) {}

  // ==================== GET all billings ====================
  getBillings(params?: { [key: string]: any }): Observable<ApiBilling[]> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(k => {
        if (params[k] !== undefined && params[k] !== null) {
          httpParams = httpParams.set(k, String(params[k]));
        }
      });
    }

    return this.http
      .get<ApiBilling[]>(`${API_URL}/billing`, { params: httpParams })
      .pipe(
        catchError(err => {
          console.error('Failed to fetch billings from API', err);
          return of([] as ApiBilling[]);
        })
      );
  }

  // ==================== GET billing by ID ====================
  getBillingById(id: number): Observable<ApiBilling | null> {
    return this.http
      .get<ApiBilling>(`${API_URL}/billing/${id}`)
      .pipe(
        catchError(err => {
          console.error('Failed to fetch billing', err);
          return of(null);
        })
      );
  }

  // ==================== CREATE billing ====================
  createBilling(payload: BillingCreatePayload): Observable<ApiBilling | null> {
    return this.http
      .post<ApiBilling>(`${API_URL}/billing`, payload)
      .pipe(
        catchError(err => {
          console.error('Failed to create billing', err);
          return of(null);
        })
      );
  }

  // ==================== UPDATE billing ====================
  updateBilling(id: number, payload: { status?: string; total_amount?: number }): Observable<ApiBilling | null> {
    return this.http
      .put<ApiBilling>(`${API_URL}/billing/${id}`, payload)
      .pipe(
        catchError(err => {
          console.error('Failed to update billing', err);
          return of(null);
        })
      );
  }

  // ==================== MARK PAID ====================
  markPaid(id: number): Observable<ApiBilling | null> {
    return this.http
      .put<ApiBilling>(`${API_URL}/billing/${id}/pay`, {})
      .pipe(
        catchError(err => {
          console.error('Failed to mark billing as paid', err);
          return of(null);
        })
      );
  }

  // ==================== DELETE billing ====================
  deleteBilling(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${API_URL}/billing/${id}`)
      .pipe(
        catchError(err => {
          console.error('Failed to delete billing', err);
          return of({ message: 'delete failed' });
        })
      );
  }
}
