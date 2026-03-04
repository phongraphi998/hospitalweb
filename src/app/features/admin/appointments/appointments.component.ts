import { Component } from "@angular/core";
import { DataService, Appointment } from "../../../services/data.service";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent {
  searchTerm = "";
  showForm = false;
  editMode = false;
  constructor(public data: DataService) {}
  newAppointment: Appointment = this.resetForm();

  resetForm(): Appointment {
    return {
      id: 0,
      patient: "",
      doctor: "",
      date: "",
      time: "",
      status: "Scheduled",
      notes: "",
    };
  }

  openAdd() {
    this.editMode = false;
    this.newAppointment = this.resetForm();
    this.showForm = true;
  }

  openEdit(a: Appointment) {
    this.editMode = true;
    this.newAppointment = { ...a };
    this.showForm = true;
  }

  saveAppointment() {
    if (
      !this.newAppointment.patient ||
      !this.newAppointment.doctor ||
      !this.newAppointment.date
    ) {
      alert("Please fill required fields");
      return;
    }

    if (this.editMode) {
      this.data.updateAppointment(this.newAppointment);
    } else {
      this.newAppointment.id = Date.now();
      this.data.addAppointment({ ...this.newAppointment });
    }

    this.closeForm();
  }

  deleteAppointment(id: number) {
    this.data.deleteAppointment(id);
  }

  confirmAppointment(a: Appointment) {
    a.status = "Scheduled";
    this.data.updateAppointment(a);
  }

  completeAppointment(a: Appointment) {
    a.status = "Completed";
    this.data.updateAppointment(a);
  }

  cancelAppointment(a: Appointment) {
    a.status = "Cancelled";
    this.data.updateAppointment(a);
  }

  closeForm() {
    this.showForm = false;
    this.editMode = false;
    this.newAppointment = this.resetForm();
  }

  get filteredAppointments() {
    if (!this.searchTerm) {
      return this.data.appointmentList;
    }
    const keyword = this.searchTerm.toLowerCase();
    return this.data.appointmentList.filter(
      (a) =>
        a.patient.toLowerCase().includes(keyword) ||
        a.doctor.toLowerCase().includes(keyword),
    );
  }
}
