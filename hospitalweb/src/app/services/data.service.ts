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
  room: string;
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
    this.syncDepartmentsFromAPI();
    this.syncAppointmentsFromAPI();
    this.syncStaffFromAPI();
    this.syncPatientsFromAPI();
    this.syncBillingsFromAPI();
  }
  /* =========================
    Local Storage
 ========================= */
  private loadData() {
    this.patientList = JSON.parse(localStorage.getItem("patientList") || "[]");
    this.appointmentList = JSON.parse(
      localStorage.getItem("appointmentList") || "[]",
    );
    this.billList = JSON.parse(localStorage.getItem("billList") || "[]");
  }

  syncDepartmentsFromAPI() {
    this.http.get<any[]>(`${this.API_URL}/departments`)
      .pipe(
        catchError(err => {
          console.error('Cannot fetch departments from API', err);
          return of([]);
        }),
        map(data => data.map(d => ({
          id: d.id,
          code: d.code || '',
          name: d.name || '',
          head: d.head || '',
          phone: d.phone || '',
          floor: d.floor || '',
          room: d.room || '',
          status: (d.status === 'Inactive' ? 'Inactive' : 'Active') as 'Active' | 'Inactive'
        })))
      )
      .subscribe(departments => {
        if (departments.length) {
          this.departments = departments;
        }
      });
  }

  private syncStaffFromAPI() {
    this.http.get<any[]>(`${this.API_URL}/staff`)
      .pipe(
        catchError(err => {
          console.error("Cannot fetch staff from API", err);
          return of([]);
        }),
        map(data => data.map(s => ({
          id: s.id,
          name: `${s.first_name} ${s.last_name}`,
          role: (s.role ? s.role.toLowerCase() : 'doctor') as "doctor" | "nurse",
          department: s.department_name || '',
          phone: s.phone || '',
          email: s.email || '',
          license: s.specialization || '',
          shift: 'Morning',
          status: 'Active' as "Active" | "Inactive"
        })))
      )
      .subscribe(staff => {
        this.staffList = staff;
      });
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
            status: (() => {
              const s = (a.status || '').toLowerCase();
              if (s === "completed") return "Completed";
              if (s === "cancelled") return "Cancelled";
              if (s === "checked_in") return "Checked In";
              return "Scheduled";
            })(),
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

  private syncPatientsFromAPI() {
    this.http
      .get<any[]>(`${this.API_URL}/patients`)
      .pipe(
        catchError((err) => {
          console.error("Cannot fetch patients from API", err);
          return of([]);
        }),
        map((data) =>
          data.map((p) => ({
            id: p.id,
            name: `${p.first_name} ${p.last_name}`.trim(),
            gender: p.gender || '',
            dob: p.birth_date ? p.birth_date.split('T')[0] : '',
            phone: p.phone || '',
            address: p.address || '',
            bloodGroup: p.blood_group || '',
            emergencyContact: p.emergency_contact || '',
            status: (p.status === 'Discharged' ? 'Discharged' : 'Active') as 'Active' | 'Discharged',
          })),
        ),
      )
      .subscribe((patients) => {
        this.patientList = patients;
        this.saveData();
      });
  }

  private saveData() {
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
    const payload = {
      code: dep.code,
      name: dep.name,
      head: dep.head,
      phone: dep.phone,
      floor: dep.floor,
      room: dep.room,
      status: dep.status || 'Active'
    };
    this.http.post<any>(`${this.API_URL}/departments`, payload).subscribe({
      next: () => {
        this.syncDepartmentsFromAPI();
      },
      error: (err) => {
        console.error('Cannot create department on API', err);
        this.departments.push(dep);
      }
    });
  }
  updateDepartment(dep: Department) {
    const payload = {
      code: dep.code,
      name: dep.name,
      head: dep.head,
      phone: dep.phone,
      floor: dep.floor,
      room: dep.room,
      status: dep.status || 'Active'
    };
    this.http.put<any>(`${this.API_URL}/departments/${dep.id}`, payload).subscribe({
      next: () => {
        this.syncDepartmentsFromAPI();
      },
      error: (err) => {
        console.error('Cannot update department on API', err);
        const index = this.departments.findIndex((d) => d.id === dep.id);
        if (index !== -1) {
          this.departments[index] = dep;
        }
      }
    });
  }
  deleteDepartment(id: number) {
    this.http.delete(`${this.API_URL}/departments/${id}`).subscribe({
      next: () => {
        this.syncDepartmentsFromAPI();
      },
      error: (err) => {
        console.error('Cannot delete department on API', err);
        this.departments = this.departments.filter((d) => d.id !== id);
      }
    });
  }
  /* =========================
    Staff
 ========================= */
  addStaff(staff: Staff) {
    const names = staff.name.split(' ');
    const department_id = this.departments.find(d => d.name === staff.department)?.id || 1;

    // Call /staff with payload to create user + staff simultaneously
    const payload = {
      email: staff.email || `staff${Date.now()}@hospital.com`,
      role: staff.role.toUpperCase(),
      first_name: names[0] || staff.name,
      last_name: names.slice(1).join(' ') || '.',
      department_id: department_id,
      specialization: staff.license,
      phone: staff.phone
    };

    // To make it fully functional without refactoring backend user+staff coupling right now:
    // we'll optimistically update the UI, but log error if backend fails.
    this.http.post<any>(`${this.API_URL}/staff`, payload).subscribe({
       next: (created) => {
         this.syncStaffFromAPI();
       },
       error: (err) => {
         console.error('Cannot create staff on API', err);
         this.staffList.push(staff); // fallback
       }
    });
  }
  
  updateStaff(staff: Staff) {
    const names = staff.name.split(' ');
    const department_id = this.departments.find(d => d.name === staff.department)?.id || 1;

    const payload = {
      first_name: names[0] || staff.name,
      last_name: names.slice(1).join(' ') || '.',
      department_id: department_id,
      specialization: staff.license,
      phone: staff.phone
    };

    this.http.put<any>(`${this.API_URL}/staff/${staff.id}`, payload).subscribe({
      next: () => {
         this.syncStaffFromAPI();
      },
      error: (err) => {
        console.error('Cannot update staff on API', err);
        const index = this.staffList.findIndex((s) => s.id === staff.id);
        if (index !== -1) {
          this.staffList[index] = staff;
        }
      }
    });
  }

  deleteStaff(id: number) {
    this.http.delete(`${this.API_URL}/staff/${id}`).subscribe({
      next: () => {
         this.syncStaffFromAPI();
      },
      error: (err) => {
        console.error('Cannot delete staff on API', err);
        this.staffList = this.staffList.filter((s) => s.id !== id);
      }
    });
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
      start_time: `${a.date || new Date().toISOString().split('T')[0]}T${a.time || '00:00'}:00`,
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
      const statusMap: { [key: string]: string } = {
        'Scheduled': 'PENDING',
        'Pending': 'PENDING',
        'Checked In': 'CHECKED_IN',
        'Completed': 'COMPLETED',
        'Cancelled': 'CANCELLED',
      };
      const status = statusMap[a.status] || String(a.status).toUpperCase();
      const start_time = a.date && a.time
        ? `${a.date}T${a.time.length === 5 ? a.time + ':00' : a.time}`
        : undefined;
      this.http
        .put<any>(`${this.API_URL}/appointments/${a.id}`, {
          status,
          reason: a.notes,
          start_time,
        })
        .subscribe({
          error: (err) => {
            console.error("Failed to update appointment on API", err);
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
  syncBillingsFromAPI() {
    this.http.get<any[]>(`${this.API_URL}/billing`)
      .pipe(
        catchError(err => {
          console.error('Cannot fetch billings from API', err);
          return of([]);
        }),
        map(data => data.map(b => ({
          id: b.id,
          invoiceNo: 'RC-' + String(b.id).padStart(5, '0'),
          patient: b.patient_name || 'N/A',
          items: (b.items || []).map((i: any) => ({
            description: i.description,
            qty: i.qty,
            price: Number(i.price),
            total: Number(i.total),
          })),
          subtotal: (b.items || []).reduce((s: number, i: any) => s + Number(i.total), 0),
          vat: 0,
          discount: 0,
          grandTotal: Number(b.total_amount),
          paymentMethod: 'Cash' as 'Cash' | 'Card' | 'Transfer',
          status: (b.status === 'PAID' ? 'Paid' : 'Unpaid') as 'Paid' | 'Unpaid',
          createdAt: b.issued_at || '',
        })))
      )
      .subscribe(bills => {
        this.billList = bills;
        this.saveData();
      });
  }

  addBill(bill: Bill) {
    const payload = {
      appointment_id: null,
      discount: bill.discount || 0,
      patient_name: bill.patient || null,
      items: bill.items.map(i => ({
        description: i.description,
        qty: i.qty,
        price: i.price,
      })),
    };

    this.http.post<any>(`${this.API_URL}/billing`, payload).subscribe({
      next: () => {
        this.syncBillingsFromAPI();
      },
      error: (err) => {
        console.error('Cannot create billing on API', err);
        this.billList.push(bill);
        this.saveData();
      }
    });
  }
  updateBill(bill: Bill) {
    const statusMap: { [key: string]: string } = { 'Paid': 'PAID', 'Unpaid': 'UNPAID' };
    const apiStatus = statusMap[bill.status] || bill.status;

    this.http.put<any>(`${this.API_URL}/billing/${bill.id}`, {
      status: apiStatus,
      total_amount: bill.grandTotal,
    }).subscribe({
      next: () => {
        this.syncBillingsFromAPI();
      },
      error: (err) => {
        console.error('Cannot update billing on API', err);
        const index = this.billList.findIndex((b) => b.id === bill.id);
        if (index !== -1) {
          this.billList[index] = bill;
          this.saveData();
        }
      }
    });
  }
  deleteBill(id: number) {
    this.http.delete(`${this.API_URL}/billing/${id}`).subscribe({
      next: () => {
        this.syncBillingsFromAPI();
      },
      error: (err) => {
        console.error('Cannot delete billing from API', err);
        this.billList = this.billList.filter((b) => b.id !== id);
        this.saveData();
      }
    });
  }
}
