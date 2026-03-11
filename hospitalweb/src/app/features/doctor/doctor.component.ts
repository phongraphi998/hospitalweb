import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import {
  AppointmentService,
  Appointment as ApiAppointment,
} from "../../services/appointment.service";
import { PatientService } from "../../services/patient.service";

export interface Appointment {
  id: string;
  patient: string;
  time: string;
  date: string;
  type: string;
  status: "confirmed" | "pending" | "completed";
  room: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  blood: string;
  phone: string;
  condition: string;
  lastVisit: string;
  avatar: string;
}

export interface MedicalRecord {
  id: string;
  patient: string;
  date: string;
  diagnosis: string;
  notes: string;
  doctor: string;
}

export interface Prescription {
  id: string;
  patient: string;
  date: string;
  medication: string;
  dosage: string;
  duration: string;
  status: "active" | "completed" | "cancelled";
}

@Component({
  selector: "app-doctor",
  templateUrl: "./doctor.component.html",
  styleUrls: ["./doctor.component.css"],
})
export class DoctorComponent {
  activeTab: "appointments" | "patients" | "records" | "prescriptions" =
    "appointments";

  // ── Modals ──
  showRecordModal = false;
  showRxModal = false;

  // ── Record form ──
  newRecord: Partial<MedicalRecord> = {};

  // ── Prescription form ──
  newRx: Partial<Prescription> = {};

  // ── Toast ──
  toastMsg = "";
  toastVisible = false;
  private toastTimer: any;

  appointments: Appointment[] = [];

  patients: Patient[] = [];

  records: MedicalRecord[] = [
    {
      id: "REC-001",
      patient: "Somchai Jaidee",
      date: "26 Feb 2026",
      diagnosis: "Stage 1 Hypertension",
      notes:
        "BP 145/92 mmHg. Prescribed Amlodipine 5mg. Advised low-sodium diet and regular exercise.",
      doctor: "Dr. doctor01",
    },
    {
      id: "REC-002",
      patient: "Prasert Khumma",
      date: "18 Feb 2026",
      diagnosis: "Diabetes Type 2 – Stable",
      notes:
        "HbA1c 7.2%. Continue Metformin 500mg. Blood glucose monitoring twice daily.",
      doctor: "Dr. doctor01",
    },
    {
      id: "REC-003",
      patient: "Napa Taweesuk",
      date: "15 Feb 2026",
      diagnosis: "Chronic Migraine",
      notes:
        "Frequency: 4–5 episodes/month. Prescribed Topiramate 25mg preventive therapy.",
      doctor: "Dr. doctor01",
    },
    {
      id: "REC-004",
      patient: "Malee Srisuk",
      date: "10 Feb 2026",
      diagnosis: "Atrial Fibrillation",
      notes:
        "ECG confirmed AF. Referred to cardiologist. Anticoagulation therapy initiated.",
      doctor: "Dr. doctor01",
    },
  ];

  prescriptions: Prescription[] = [
    {
      id: "RX-001",
      patient: "Somchai Jaidee",
      date: "26 Feb 2026",
      medication: "Amlodipine 5mg",
      dosage: "1 tablet once daily",
      duration: "30 days",
      status: "active",
    },
    {
      id: "RX-002",
      patient: "Prasert Khumma",
      date: "18 Feb 2026",
      medication: "Metformin 500mg",
      dosage: "1 tablet twice daily with meals",
      duration: "60 days",
      status: "active",
    },
    {
      id: "RX-003",
      patient: "Napa Taweesuk",
      date: "15 Feb 2026",
      medication: "Topiramate 25mg",
      dosage: "1 tablet at bedtime",
      duration: "90 days",
      status: "active",
    },
    {
      id: "RX-004",
      patient: "Somchai Jaidee",
      date: "10 Jan 2026",
      medication: "Lisinopril 10mg",
      dosage: "1 tablet once daily",
      duration: "30 days",
      status: "completed",
    },
    {
      id: "RX-005",
      patient: "Malee Srisuk",
      date: "10 Feb 2026",
      medication: "Warfarin 5mg",
      dosage: "1 tablet once daily",
      duration: "30 days",
      status: "active",
    },
  ];

  ngOnInit() {
    this.loadAppointmentsFromApi();
    this.loadPatientsFromApi();
  }

  loadAppointmentsFromApi() {
    this.appointmentService.getAppointments().subscribe(
      (data) => {
        if (data.length) {
          this.appointments = data.map((a) => ({
            id: String(a.id),
            patient: a.patient,
            time: a.time,
            date: a.date,
            type: a.department || 'General',
            status: a.status as 'confirmed' | 'pending' | 'completed',
            room: a.department || 'Room 101',
          }));
        }
      },
      (err) => console.error('Doctor appointment fetch failed', err),
    );
  }

  loadPatientsFromApi() {
    this.patientService.patients$.subscribe((data) => {
      if (data.length > 0) {
        this.patients = data.map((p) => {
          // Calculate age from dob
          let age = 0;
          if (p.dob) {
            const birthYear = new Date(p.dob).getFullYear();
            age = new Date().getFullYear() - birthYear;
          }
          // Avatar: first letters of first + last name
          const parts = p.name.split(' ');
          const avatar = parts.length >= 2
            ? parts[0][0] + parts[1][0]
            : parts[0]?.substring(0, 2) ?? 'PT';
          return {
            id: String(p.id),
            name: p.name,
            age,
            gender: p.gender || '—',
            blood: p.bloodGroup || '—',
            phone: p.phone || '—',
            condition: p.condition || '—',
            lastVisit: p.lastVisit || '—',
            avatar: avatar.toUpperCase(),
          };
        });
      }
    });
    this.patientService.loadPatients();
  }

  // ─── Getters ───────────────────────────────────────
  get todayAppointments() {
    return this.appointments.filter((a) => a.status !== "completed").length;
  }

  get activePatients() {
    return this.patients.length;
  }

  get activePrescriptions() {
    return this.prescriptions.filter((p) => p.status === "active").length;
  }

  get patientNames(): string[] {
    return this.patients.map((p) => p.name);
  }

  // ─── Tab ───────────────────────────────────────────
  setTab(tab: "appointments" | "patients" | "records" | "prescriptions") {
    this.activeTab = tab;
  }

  countByStatus(items: { status: string }[], status: string): number {
    return items.filter((i) => i.status === status).length;
  }

  // ─── Appointments ──────────────────────────────────
  markCompleted(apt: Appointment) {
    if (!apt.id) return;

    this.appointmentService
      .updateStatus(Number(apt.id), 'completed')
      .subscribe(
        (updated) => {
          apt.status = updated.status as 'confirmed' | 'pending' | 'completed';
          this.showToast(`✓ Appointment ${apt.id} marked as completed`);
        },
        (err) => {
          console.error('Failed to update appointment status', err);
          this.showToast(`⚠️ ไม่สามารถอัปเดตสถานะได้`);
        },
      );
  }

  // ─── Medical Record Modal ──────────────────────────
  openRecordModal() {
    this.newRecord = { patient: "", diagnosis: "", notes: "" };
    this.showRecordModal = true;
  }

  closeRecordModal() {
    this.showRecordModal = false;
  }

  submitRecord() {
    if (
      !this.newRecord.patient ||
      !this.newRecord.diagnosis ||
      !this.newRecord.notes
    )
      return;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const id = `REC-${String(this.records.length + 1).padStart(3, "0")}`;
    this.records.unshift({
      id,
      patient: this.newRecord.patient!,
      date: dateStr,
      diagnosis: this.newRecord.diagnosis!,
      notes: this.newRecord.notes!,
      doctor: `Dr. ${this.auth.getUserId() || "Doctor"}`,
    });
    this.closeRecordModal();
    this.showToast(`✓ Medical record ${id} saved successfully`);
  }

  // ─── Prescription Modal ────────────────────────────
  openRxModal() {
    this.newRx = { patient: "", medication: "", dosage: "", duration: "" };
    this.showRxModal = true;
  }

  closeRxModal() {
    this.showRxModal = false;
  }

  submitRx() {
    if (
      !this.newRx.patient ||
      !this.newRx.medication ||
      !this.newRx.dosage ||
      !this.newRx.duration
    )
      return;
    const today = new Date();
    const dateStr = today.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const id = `RX-${String(this.prescriptions.length + 1).padStart(3, "0")}`;
    this.prescriptions.unshift({
      id,
      patient: this.newRx.patient!,
      date: dateStr,
      medication: this.newRx.medication!,
      dosage: this.newRx.dosage!,
      duration: this.newRx.duration!,
      status: "active",
    });
    this.closeRxModal();
    this.showToast(`✓ Prescription ${id} issued successfully`);
  }

  // ─── Toast ─────────────────────────────────────────
  showToast(msg: string) {
    this.toastMsg = msg;
    this.toastVisible = true;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toastVisible = false), 3000);
  }

  constructor(
    public auth: AuthService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
  ) {}

  logout(): void {
    this.auth.logout();
  }
}
