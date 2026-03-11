import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DataService, Appointment } from "../../../services/data.service";
import { PatientService, Patient } from "../../../services/patient.service";
import { catchError, of } from "rxjs";

const API_URL = "http://localhost:3000";

@Component({
  selector: "app-appointments",
  templateUrl: "./appointments.component.html",
  styleUrls: ["./appointments.component.css"],
})
export class AppointmentsComponent implements OnInit {
  searchTerm = "";
  showForm = false;
  editMode = false;

  // Dropdown lists from API
  patientList: Patient[] = [];
  doctorList: { id: number; name: string }[] = [];

  newAppointment: Appointment = this.resetForm();

  constructor(
    public data: DataService,
    private patientService: PatientService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadPatients();
    this.loadDoctors();
  }

  loadPatients(): void {
    // Subscribe to patients$ which emits mapped Patient[] (with .name field)
    this.patientService.patients$.subscribe((data) => {
      this.patientList = data;
    });
    // Trigger the API call to populate patients$
    this.patientService.loadPatients();
  }

  loadDoctors(): void {
    this.http
      .get<any[]>(`${API_URL}/staff`)
      .pipe(catchError(() => of([])))
      .subscribe((data) => {
        this.doctorList = data
          .filter((s) => s.role === 'DOCTOR')
          .map((s) => ({
            id: s.id,
            name: `${s.first_name} ${s.last_name}`.trim(),
          }));
      });
  }

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

    // Look up real IDs from the selected names
    const p = this.patientList.find(x => x.name === this.newAppointment.patient);
    const d = this.doctorList.find(x => x.name === this.newAppointment.doctor);
    
    this.newAppointment.patient_id = p ? p.id : 1;
    this.newAppointment.doctor_id = d ? d.id : 1;

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
        a.doctor.toLowerCase().includes(keyword)
    );
  }
}
