import { Component } from "@angular/core";

import { DataService } from "../../../services/data.service";

@Component({
  selector: "app-dashboard",

  templateUrl: "./dashboard.component.html",

  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent {
  today: string = new Date().toISOString().split("T")[0];

  constructor(public data: DataService) {}

  /* ===== Today's Appointments ===== */

  get todaysAppointments() {
    if (!this.data.appointmentList) return [];

    return this.data.appointmentList.filter((a) => a.date === this.today);
  }

  /* ===== Total Patients ===== */

  get totalPatients() {
    return this.data.patientList?.length || 0;
  }

  /* ===== Total Staff ===== */

  get totalStaff() {
    return this.data.staffList?.length || 0;
  }

  /* ===== Total Departments ===== */

  get totalDepartments() {
    return this.data.departments?.length || 0;
  }

  /* ===== Today's Revenue ===== */

  get todaysRevenue(): number {
    if (!this.data.billList) return 0;

    return this.data.billList.reduce((sum: number, bill: any) => {
      const total =
        bill.items?.reduce(
          (s: number, i: any) => s + (i.total || 0),

          0,
        ) || 0;

      return sum + total;
    }, 0);
  }

  /* ===== Format Revenue (แทน number pipe) ===== */

  get formattedRevenue(): string {
    return this.todaysRevenue.toLocaleString();
  }
}
