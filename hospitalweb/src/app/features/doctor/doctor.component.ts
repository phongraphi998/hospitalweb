import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../core/services/auth.service";
import {
  AppointmentService,
  Appointment as ApiAppointment,
} from "../../services/appointment.service";
import { PatientService } from "../../services/patient.service";
import { PrescriptionService } from "../../services/prescription.service";

export interface Appointment {
  id: string;
  patient: string;
  time: string;
  date: string;
  type: string;
  status: "confirmed" | "pending" | "completed";
  room: string;
  floor: string;
  notes?: string;
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
  selectedAppointmentId: string = "";

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

  prescriptions: Prescription[] = [];

  ngOnInit() {
    this.loadAppointmentsFromApi();
    this.loadPatientsFromApi();
    this.loadPrescriptionsFromApi();
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
            room: a.room || '',
            floor: a.floor || '',
            notes: a.notes,
          }));
          
          // Update patient conditions if patients are already loaded
          if (this.patients.length > 0) {
             this.patients = this.patients.map(p => {
               const apt = this.appointments.find(a => a.patient === p.name && a.notes);
               return { ...p, condition: apt?.notes || p.condition || '—' };
             });
          }
        }
      },
      (err) => console.error('Doctor appointment fetch failed', err),
    );
  }

  loadPatientsFromApi() {
    this.patientService.patients$.subscribe((data) => {
      if (data.length > 0) {
        // Get patient names from appointments (only patients with appointments)
        const appointmentPatientNames = new Set(this.appointments.map(a => a.patient));

        this.patients = data
          .filter((p) => appointmentPatientNames.has(p.name)) // Only patients with appointments
          .map((p) => {
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
            const apt = this.appointments.find(a => a.patient === p.name && a.notes);
            const condition = apt?.notes || p.condition || '—';

            return {
              id: String(p.id),
              name: p.name,
              age,
              gender: p.gender || '—',
              blood: p.bloodGroup || '—',
              phone: p.phone || '—',
              condition: condition,
              lastVisit: p.lastVisit || '—',
              avatar: avatar.toUpperCase(),
            };
          });
      }
    });
    this.patientService.loadPatients();
  }

  loadPrescriptionsFromApi() {
    // Fetch all prescriptions (for testing/demo - no doctor filter)
    this.prescriptionService.getAllPrescriptions().subscribe(
        (response) => {
          if (response.success && response.data) {
            this.prescriptions = response.data.map((p: any) => {
              const items = (p.prescription_items || []).filter((item: any) => item.id !== null);
              return {
                id: `RX-${String(p.prescription_id).padStart(3, '0')}`,
                patient: p.patient_name,
                date: new Date(p.prescription_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }),
                medication: items.map((item: any) => `${item.medicine_name} ${item.dosage}`).join(', ') || '—',
                dosage: items.map((item: any) => item.frequency).join('; ') || '—',
                duration: items.map((item: any) => `${item.duration_days} days`).join('; ') || '—',
                status: "active" as const,
              };
            });
          }
        },
        (error) => {
          console.error('Error loading prescriptions from API:', error);
        }
      );
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
      .updateStatus(Number(apt.id), 'COMPLETED')
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
    this.selectedAppointmentId = "";
    this.showRxModal = true;
  }

  closeRxModal() {
    this.showRxModal = false;
    this.selectedAppointmentId = "";
  }

  // Get appointments for selected patient (exclude those with prescriptions)
  getAvailableAppointmentsForPatient(patientName: string): Appointment[] {
    return this.appointments.filter(apt => 
      apt.patient === patientName && apt.status !== "completed"
    );
  }

  submitRx() {
    if (
      !this.newRx.patient ||
      !this.newRx.medication ||
      !this.newRx.dosage ||
      !this.newRx.duration ||
      !this.selectedAppointmentId
    )
      return;

    // Get appointment details
    const selectedAppointment = this.appointments.find(a => a.id === this.selectedAppointmentId);
    if (!selectedAppointment) {
      this.showToast(`⚠️ Please select a valid appointment`);
      return;
    }

    // Call API to create prescription
    const prescription_items = [
      {
        medicine_name: this.newRx.medication!.split(' ')[0], // Extract medicine name
        dosage: this.newRx.medication!.includes(' ') ? this.newRx.medication!.split(' ')[1] : this.newRx.dosage!,
        frequency: this.newRx.dosage!,
        duration_days: parseInt(this.newRx.duration!) || 30
      }
    ];

    this.prescriptionService.createPrescription(
      Number(selectedAppointment.id),
      prescription_items
    ).subscribe(
      (response) => {
        if (response.success) {
          this.loadPrescriptionsFromApi();
          this.closeRxModal();
          this.showToast(`✓ Prescription issued for ${selectedAppointment.patient}`);
        }
      },
      (error) => {
        console.error('Error creating prescription:', error);
        
        // Handle specific error: duplicate prescription for appointment
        if (error.error?.error === 'Prescription already exists for this appointment') {
          this.showToast(`⚠️ A prescription already exists for this appointment. Please select a different appointment.`);
        } else {
          this.showToast(`✗ Failed to create prescription: ${error.error?.error || error.message}`);
        }
      }
    );
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
    private prescriptionService: PrescriptionService,
  ) {}

  logout(): void {
    this.auth.logout();
  }
}
