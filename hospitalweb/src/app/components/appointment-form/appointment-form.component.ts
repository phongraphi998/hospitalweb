import { Component } from '@angular/core';
import { AppointmentService, Appointment } from '../../services/appointment.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-appointment-form',
  templateUrl: './appointment-form.component.html',
  styleUrls: ['./appointment-form.component.css']
})
export class AppointmentFormComponent {
  departments = this.departmentService.getDepartments();
  submitted = false;
  loading = false;

  appointment: Appointment = {
    name: '',
    email: '',
    phone: '',
    date: '',
    department: '',
    doctor: '',
    message: ''
  };

  constructor(
    private appointmentService: AppointmentService,
    private departmentService: DepartmentService
  ) {}

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    this.loading = true;
    this.appointmentService.bookAppointment(this.appointment)
      .then(() => {
        this.submitted = true;
        this.loading = false;
        this.resetForm();
        setTimeout(() => {
          this.submitted = false;
        }, 5000);
      })
      .catch(() => {
        this.loading = false;
      });
  }

  isFormValid(): boolean {
    return !!(this.appointment.name && this.appointment.email && 
              this.appointment.phone && this.appointment.date && 
              this.appointment.department);
  }

  resetForm(): void {
    this.appointment = {
      name: '',
      email: '',
      phone: '',
      date: '',
      department: '',
      doctor: '',
      message: ''
    };
  }
}
