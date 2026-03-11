import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, map, of } from "rxjs";
/* =========================
  Interfaces
========================= */
export interface Department {
  id: number;
  code: string;
  name: string;
  head: string;
  phone: string;
  floor: string;
  status: "Active" | "Inactive";
}
export interface Staff {
  id: number;
  name: string;
  role: "doctor" | "nurse";
  department: string;
  phone: string;
  email: string;
  license: string;
  shift: string;
  status: "Active" | "Inactive";
}
export interface Patient {
  id: number;
  name: string;
  gender: string;
  dob: string;
  phone: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  status: "Active" | "Discharged";
}
export interface Appointment {
  id: number;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  status: string;
  notes: string;
  patient_id?: number;
  doctor_id?: number;
}
export interface BillItem {
  description: string;
  qty: number;
  price: number;
  total: number;
}
export interface Bill {
  id: number;
  invoiceNo: string;
  patient: string;
  items: BillItem[];
  subtotal: number;
  vat: number;
  discount: number;
  grandTotal: number;
  paymentMethod: "Cash" | "Card" | "Transfer";
  status: "Paid" | "Unpaid";
  createdAt: string;
}
/* =========================
  Service
========================= */
@Injectable({
  providedIn: "root",
})
export class DataService {
  departments: Department[] = [];
  staffList: Staff[] = [];
  patientList: Patient[] = [];
  appointmentList: Appointment[] = [];
  billList: Bill[] = [];
  private readonly API_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {
    this.loadData();
    this.syncAppointmentsFromAPI();
  }
  /* =========================
    Local Storage
 ========================= */
  private loadData() {
    this.departments = JSON.parse(localStorage.getItem("departments") || "[]");
    this.staffList = JSON.parse(localStorage.getItem("staffList") || "[]");
    this.patientList = JSON.parse(localStorage.getItem("patientList") || "[]");
    this.appointmentList = JSON.parse(
      localStorage.getItem("appointmentList") || "[]",
    );
    this.billList = JSON.parse(localStorage.getItem("billList") || "[]");
  }

  private syncAppointmentsFromAPI() {
    this.http
      .get<any[]>(`${this.API_URL}/appointments`)
      .pipe(
        catchError((err) => {
          console.error("Cannot fetch appointments from API", err);
          return of([]);
        }),
        map((data) =>
          data.map((a) => ({
            id: a.id,
            patient: a.patient_name || `Patient ${a.patient_id}`,
            doctor: a.doctor_name || `Doctor ${a.doctor_id}`,
            date: a.start_time ? a.start_time.split("T")[0] : "",
            time: a.start_time ? a.start_time.split("T")[1]?.substr(0, 5) : "",
            status:
              a.status === "completed"
                ? "Completed"
                : a.status === "cancelled"
                ? "Cancelled"
                : a.status === "checked_in"
                ? "Scheduled"
                : a.status === "pending"
                ? "Scheduled"
                : "Scheduled",
            notes: a.reason || "",
          })),
        ),
      )
      .subscribe((appointments) => {
        if (appointments.length) {
          this.appointmentList = appointments;
          this.saveData();
        }
      });
  }

  private saveData() {
    localStorage.setItem("departments", JSON.stringify(this.departments));
    localStorage.setItem("staffList", JSON.stringify(this.staffList));
    localStorage.setItem("patientList", JSON.stringify(this.patientList));
    localStorage.setItem(
      "appointmentList",
      JSON.stringify(this.appointmentList),
    );
    localStorage.setItem("billList", JSON.stringify(this.billList));
  }
  /* =========================
    Department
 ========================= */
  addDepartment(dep: Department) {
    this.departments.push(dep);
    this.saveData();
  }
  updateDepartment(dep: Department) {
    const index = this.departments.findIndex((d) => d.id === dep.id);
    if (index !== -1) {
      this.departments[index] = dep;
      this.saveData();
    }
  }
  deleteDepartment(id: number) {
    this.departments = this.departments.filter((d) => d.id !== id);
    this.saveData();
  }
  /* =========================
    Staff
 ========================= */
  addStaff(staff: Staff) {
    this.staffList.push(staff);
    this.saveData();
  }
  updateStaff(staff: Staff) {
    const index = this.staffList.findIndex((s) => s.id === staff.id);
    if (index !== -1) {
      this.staffList[index] = staff;
      this.saveData();
    }
  }
  deleteStaff(id: number) {
    this.staffList = this.staffList.filter((s) => s.id !== id);
    this.saveData();
  }
  /* =========================
    Patient
 ========================= */
  addPatient(p: Patient) {
    this.patientList.push(p);
    this.saveData();
  }
  updatePatient(p: Patient) {
    const index = this.patientList.findIndex((x) => x.id === p.id);
    if (index !== -1) {
      this.patientList[index] = p;
      this.saveData();
    }
  }
  deletePatient(id: number) {
    this.patientList = this.patientList.filter((x) => x.id !== id);
    this.saveData();
  }
  /* =========================
    Appointment
 ========================= */
  addAppointment(a: Appointment) {
    const payload = {
      patient_id: a.patient_id || 1,
      doctor_id: a.doctor_id || 1,
      department_id: 1, // keeping hardcoded or could add to interface if needed
      start_time: `${a.date}T${a.time}:00`,
      reason: a.notes,
    };

    this.http.post<any>(`${this.API_URL}/appointments`, payload).subscribe(
      (created) => {
        this.appointmentList.push({
          ...a,
          id: created.id,
          patient: created.patient_name || a.patient,
          doctor: created.doctor_name || a.doctor,
          status:`${created.status}`,
        });
        this.saveData();
      },
      (err) => {
        console.error("Cannot create appointment on API, fallback to local", err);
        this.appointmentList.push(a);
        this.saveData();
      },
    );
  }

  updateAppointment(a: Appointment) {
    const index = this.appointmentList.findIndex((x) => x.id === a.id);
    if (index !== -1) {
      // mirror local state
      this.appointmentList[index] = a;
      this.saveData();
    }

    if (a.id) {
      const status = String(a.status).toUpperCase();
      this.http
        .put<any>(`${this.API_URL}/appointments/${a.id}/status`, { status })
        .subscribe({
          error: (err) => {
            console.error("Failed to update appointment status on API", err);
          },
        });
    }
  }

  deleteAppointment(id: number) {
    this.appointmentList = this.appointmentList.filter((x) => x.id !== id);
    this.saveData();
    this.http.delete(`${this.API_URL}/appointments/${id}`).subscribe({
      error: (err) => {
        console.error("Failed to delete appointment from API", err);
      },
    });
  }
  /* =========================
    Billing
 ========================= */
  addBill(bill: Bill) {
    this.billList.push(bill);
    this.saveData();
  }
  updateBill(bill: Bill) {
    const index = this.billList.findIndex((b) => b.id === bill.id);
    if (index !== -1) {
      this.billList[index] = bill;
      this.saveData();
    }
  }
  deleteBill(id: number) {
    this.billList = this.billList.filter((b) => b.id !== id);
    this.saveData();
  }
}
