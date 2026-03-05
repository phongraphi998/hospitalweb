import { Injectable } from '@angular/core';

export interface Department {
  id: string;
  name: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private departments: Department[] = [
    {
      id: '1',
      name: 'Neurology',
      description: 'Specialized treatment for nervous system disorders, brain conditions, and neurological diseases with cutting-edge diagnostic and therapeutic approaches',
      icon: 'bi-lightning-charge'
    },
    {
      id: '2',
      name: 'Orthopedics',
      description: 'Comprehensive orthopedic services including bone surgery, joint repairs, sports medicine, and rehabilitation programs for optimal mobility',
      icon: 'bi-hammer'
    },
    {
      id: '3',
      name: 'Pharmacy',
      description: 'Professional pharmaceutical services including medication dispensing, drug counseling, and personalized medication management for patient safety',
      icon: 'bi-prescription2'
    },
    {
      id: '4',
      name: 'Cardiology',
      description: 'Advanced cardiac care and cardiovascular treatment using state-of-the-art technology and specialized cardiac procedures for heart health',
      icon: 'bi-heart-pulse'
    }
  ];

  getDepartments(): Department[] {
    return this.departments;
  }

  getDepartmentById(id: string): Department | undefined {
    return this.departments.find(d => d.id === id);
  }
}
