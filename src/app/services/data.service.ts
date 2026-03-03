import { Injectable } from "@angular/core";
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
  status: "Scheduled" | "Completed" | "Cancelled";
  notes: string;
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
  constructor() {
    this.loadData();
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
    this.appointmentList.push(a);
    this.saveData();
  }
  updateAppointment(a: Appointment) {
    const index = this.appointmentList.findIndex((x) => x.id === a.id);
    if (index !== -1) {
      this.appointmentList[index] = a;
      this.saveData();
    }
  }
  deleteAppointment(id: number) {
    this.appointmentList = this.appointmentList.filter((x) => x.id !== id);
    this.saveData();
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
