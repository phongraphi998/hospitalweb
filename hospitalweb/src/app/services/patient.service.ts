import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of, tap, map } from 'rxjs';

/* =====================
   API Model (matches DB)
===================== */
export interface ApiPatient {
  id: number;
  first_name: string;
  last_name: string;
  gender: string;
  birth_date: string | null;
  phone: string;
  address: string;
  blood_group: string | null;
  emergency_contact: string | null;
  status: string;
  last_visit: string | null;
  condition: string | null;
  created_at?: string;
}

/* =====================
   UI Model (used in components)
===================== */
export interface Patient {
  id: number;
  name: string;         // first_name + last_name
  first_name: string;
  last_name: string;
  gender: string;
  dob: string;          // birth_date
  phone: string;
  address: string;
  bloodGroup: string;   // blood_group
  emergencyContact: string; // emergency_contact
  status: 'Active' | 'Discharged';
  lastVisit: string;    // last_visit from appointments
  condition: string;    // latest diagnosis from medical_records
}

const API_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class PatientService {
  private patientsSubject = new BehaviorSubject<Patient[]>([]);
  patients$ = this.patientsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadPatients();
  }

  /* =====================
     Load / Get
  ===================== */
  loadPatients(search?: string): void {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    this.http
      .get<ApiPatient[]>(`${API_URL}/patients`, { params })
      .pipe(
        catchError((err) => {
          console.error('Cannot fetch patients from API', err);
          return of([] as ApiPatient[]);
        })
      )
      .subscribe((data) => {
        this.patientsSubject.next(data.map(this.mapApiToUI));
      });
  }

  getPatients(search?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http
      .get<ApiPatient[]>(`${API_URL}/patients`, { params })
      .pipe(
        catchError((err) => {
          console.error('Cannot fetch patients', err);
          return of([] as ApiPatient[]);
        }),
        map((data) => {
          const mapped = data.map(this.mapApiToUI);
          this.patientsSubject.next(mapped);
          return mapped;
        })
      );
  }

  getPatientById(id: number): Observable<Patient> {
    return this.http
      .get<ApiPatient>(`${API_URL}/patients/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Cannot fetch patient', err);
          return of(null as any);
        }),
        tap((data) => data)
      ) as any;
  }

  /* =====================
     Create
  ===================== */
  createPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
    const payload = this.mapUIToApi(patient as Patient);
    return this.http
      .post<ApiPatient>(`${API_URL}/patients`, payload)
      .pipe(
        catchError((err) => {
          console.error('Cannot create patient', err);
          return of(null as any);
        }),
        tap(() => this.loadPatients())
      ) as any;
  }

  /* =====================
     Update
  ===================== */
  updatePatient(patient: Patient): Observable<Patient> {
    const payload = this.mapUIToApi(patient);
    return this.http
      .put<ApiPatient>(`${API_URL}/patients/${patient.id}`, payload)
      .pipe(
        catchError((err) => {
          console.error('Cannot update patient', err);
          return of(null as any);
        }),
        tap(() => this.loadPatients())
      ) as any;
  }

  /* =====================
     Delete
  ===================== */
  deletePatient(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${API_URL}/patients/${id}`)
      .pipe(
        catchError((err) => {
          console.error('Cannot delete patient', err);
          return of({ message: 'delete failed' });
        }),
        tap(() => this.loadPatients())
      );
  }

  /* =====================
     Mappers
  ===================== */
  mapApiToUI = (api: ApiPatient): Patient => ({
    id: api.id,
    name: `${api.first_name} ${api.last_name}`.trim(),
    first_name: api.first_name,
    last_name: api.last_name,
    gender: api.gender || '',
    dob: api.birth_date ? api.birth_date.split('T')[0] : '',
    phone: api.phone || '',
    address: api.address || '',
    bloodGroup: api.blood_group || '',
    emergencyContact: api.emergency_contact || '',
    status: (api.status === 'Discharged' ? 'Discharged' : 'Active') as 'Active' | 'Discharged',
    lastVisit: api.last_visit || '—',
    condition: api.condition || '—',
  });

  mapUIToApi = (ui: Patient): Partial<ApiPatient> => ({
    first_name: ui.first_name || ui.name?.split(' ')[0] || '',
    last_name:  ui.last_name  || ui.name?.split(' ').slice(1).join(' ') || '',
    gender: ui.gender,
    birth_date: ui.dob || null,
    phone: ui.phone,
    address: ui.address,
    blood_group: ui.bloodGroup || null,
    emergency_contact: ui.emergencyContact || null,
    status: ui.status || 'Active',
  });
}
