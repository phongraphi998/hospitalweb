import { Injectable } from '@angular/core';

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
  private doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Walter White',
      specialty: 'Neurology',
      image: 'assets/img/doctors/doctors-1.jpg',
      description: 'Chief Neurologist with extensive expertise in nervous system disorders and neurological conditions'
    },
    {
      id: '2',
      name: 'Dr. Sarah Johnson',
      specialty: 'Orthopedics',
      image: 'assets/img/doctors/doctors-2.jpg',
      description: 'Orthopedic specialist with excellence in bone repair, joint surgery, and sports medicine'
    },
    {
      id: '3',
      name: 'Dr. William Anderson',
      specialty: 'Pharmacy',
      image: 'assets/img/doctors/doctors-3.jpg',
      description: 'Clinical pharmacist with profound knowledge in pharmaceutical sciences and medication management'
    },
    {
      id: '4',
      name: 'Dr. Amanda Jepson',
      specialty: 'Neurology',
      image: 'assets/img/doctors/doctors-4.jpg',
      description: 'Neurosurgeon with specialized expertise in complex neurological procedures and brain disorders'
    }
  ];

  getDoctors(): Doctor[] {
    return this.doctors;
  }

  getDoctorById(id: string): Doctor | undefined {
    return this.doctors.find(d => d.id === id);
  }

  getDoctorsBySpecialty(specialty: string): Doctor[] {
    return this.doctors.filter(d => d.specialty === specialty);
  }
}
