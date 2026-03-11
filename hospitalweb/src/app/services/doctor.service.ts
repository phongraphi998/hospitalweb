import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:3000/staff';

  constructor(private http: HttpClient) {}

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(staff => staff
        // If your API returns role, you might want to filter: .filter(s => s.role === 'DOCTOR')
        .map(s => ({
          id: s.id.toString(),
          name: `Dr. ${s.first_name} ${s.last_name}`,
          // If the backend has specialization, use it. Otherwise placeholder
          specialty: s.specialization || s.department_name || 'General Medicine',
          // Re-use mock images based on modulus ID 
          image: `assets/img/doctors/doctors-${((s.id - 1) % 4) + 1}.jpg`,
          description: s.specialization 
            ? `Experienced ${s.specialization} with excellent patient care.` 
            : 'Dedicated medical professional with extensive expertise in health and patient care.'
        }))
      ),
      catchError(err => {
        console.error('Failed to fetch doctors', err);
        return of([]);
      })
    );
  }

  getDoctorById(id: string): Observable<Doctor | undefined> {
    return this.getDoctors().pipe(
      map(doctors => doctors.find(d => d.id === id))
    );
  }

  getDoctorsBySpecialty(specialty: string): Observable<Doctor[]> {
    return this.getDoctors().pipe(
      map(doctors => doctors.filter(d => d.specialty === specialty))
    );
  }
}
