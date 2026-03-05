import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-nurse",
  templateUrl: "./nurse.component.html",
  styleUrls: ["./nurse.component.css"],
})
export class NurseComponent {
  constructor(
    private router: Router,
    public auth: AuthService,
  ) {}

  department = "OPD";
  today = "4 March 2026";

  queues = [
    {
      patient: "Somchai Jaidee",
      department: "Outpatient Department (OPD)",
      doctor: "Dr. doctor01",
      time: "10:00",
      status: "CHECKED_IN",
    },

    {
      patient: "Malee Srisuk",
      department: "Cardiology",
      doctor: "Dr. doctor01",
      time: "10:30",
      status: "PENDING",
    },

    {
      patient: "Prasert Khumma",
      department: "Neurology",
      doctor: "Dr. doctor01",
      time: "11:00",
      status: "PENDING",
    },

    {
      patient: "Napa Taweesuk",
      department: "Orthopedics",
      doctor: "Dr. doctor01",
      time: "11:30",
      status: "PENDING",
    },

    {
      patient: "Wichai Butr",
      department: "Pediatrics",
      doctor: "Dr. doctor01",
      time: "12:00",
      status: "PENDING",
    },
  ];

  get waitingQueue() {
    return this.queues.filter((q) => q.status === "PENDING");
  }

  get checkedQueue() {
    return this.queues.filter((q) => q.status === "CHECKED_IN");
  }

  checkIn(queue: any) {
    queue.status = "CHECKED_IN";
  }

  logout() {
    this.auth.logout();
  }
}
