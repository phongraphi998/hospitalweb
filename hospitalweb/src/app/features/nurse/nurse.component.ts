import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";
import { AppointmentService } from "../../services/appointment.service";

@Component({
  selector: "app-nurse",
  templateUrl: "./nurse.component.html",
  styleUrls: ["./nurse.component.css"],
})
export class NurseComponent implements OnInit {
  department = "OPD";
  today = new Date().toLocaleDateString();
  queues: Array<any> = [];

  constructor(
    private router: Router,
    public auth: AuthService,
    private appointmentService: AppointmentService,
  ) {}

  ngOnInit() {
    this.loadQueue();
  }

  loadQueue() {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        this.queues = data
          .filter((a) => a.status === "pending" || a.status === "confirmed")
          .map((a) => ({
            id: a.id,
            patient: a.patient,
            department: a.department || "Outpatient Department (OPD)",
            doctor: a.doctor,
            time: a.time,
            room: a.room || '',
            floor: a.floor || '',
            status: a.status.toUpperCase(),
          }));
      },
      (err) => {
        console.error("Cannot load queue", err);
      },
    );
  }

  get waitingQueue() {
    return this.queues.filter((q) => q.status === "PENDING");
  }

  get checkedQueue() {
    return this.queues.filter((q) => q.status === "CONFIRMED");
  }

  checkIn(queue: any) {
    if (!queue.id) return;

    this.appointmentService.updateStatus(Number(queue.id), "CHECKED_IN").subscribe(
      () => {
        queue.status = "CONFIRMED";
      },
      (err) => {
        console.error("Failed to check in", err);
      },
    );
  }

  logout() {
    this.auth.logout();
  }
}
