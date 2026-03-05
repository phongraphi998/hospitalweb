import { Component, OnInit } from '@angular/core';
import { DoctorService, Doctor } from '../../services/doctor.service';
import { DepartmentService, Department } from '../../services/department.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  doctors: Doctor[] = [];
  departments: Department[] = [];

  constructor(
    private doctorService: DoctorService,
    private departmentService: DepartmentService
  ) {}

  ngOnInit(): void {
    this.doctors = this.doctorService.getDoctors();
    this.departments = this.departmentService.getDepartments();
  }

  scrollToAppointment(): void {
    const element = document.getElementById('appointment');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
