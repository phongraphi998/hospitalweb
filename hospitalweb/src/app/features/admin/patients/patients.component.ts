import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PatientService, Patient } from '../../../services/patient.service';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css'],
})
export class PatientsComponent implements OnInit, OnDestroy {
  showForm: boolean = false;
  editMode: boolean = false;
  searchTerm: string = '';
  loading: boolean = false;
  saving: boolean = false;
  errorMsg: string = '';

  patients: Patient[] = [];
  newPatient: Patient = this.resetForm();

  private sub?: Subscription;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.sub = this.patientService.patients$.subscribe((data) => {
      this.patients = data;
    });
    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  loadPatients(): void {
    this.loading = true;
    this.patientService.loadPatients(this.searchTerm || undefined);
    // loading flag will reset after small delay (patients$ will emit)
    this.sub = this.patientService.patients$.subscribe((data) => {
      this.patients = data;
      this.loading = false;
    });
  }

  onSearch(): void {
    this.patientService.loadPatients(this.searchTerm || undefined);
  }

  resetForm(): Patient {
    return {
      id: 0,
      name: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      phone: '',
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      status: 'Active',
      lastVisit: '',
      condition: '',
    };
  }

  openAdd(): void {
    this.editMode = false;
    this.newPatient = this.resetForm();
    this.errorMsg = '';
    this.showForm = true;
  }

  openEdit(patient: Patient): void {
    this.editMode = true;
    // split 'name' back to first/last if needed
    const parts = patient.name?.trim().split(' ') ?? [];
    this.newPatient = {
      ...patient,
      first_name: patient.first_name || parts[0] || '',
      last_name: patient.last_name || parts.slice(1).join(' ') || '',
    };
    this.errorMsg = '';
    this.showForm = true;
  }

  savePatient(): void {
    if (!this.newPatient.first_name.trim()) {
      this.errorMsg = 'First name is required';
      return;
    }
    if (!this.newPatient.last_name.trim()) {
      this.errorMsg = 'Last name is required';
      return;
    }
    if (!this.newPatient.gender) {
      this.errorMsg = 'Please select gender';
      return;
    }

    this.saving = true;
    this.errorMsg = '';

    // keep .name in sync
    this.newPatient.name = `${this.newPatient.first_name} ${this.newPatient.last_name}`.trim();

    if (this.editMode) {
      this.patientService.updatePatient(this.newPatient).subscribe({
        next: () => {
          this.saving = false;
          this.closeForm();
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = 'Failed to update patient. Please try again.';
          console.error(err);
        },
      });
    } else {
      this.patientService.createPatient(this.newPatient).subscribe({
        next: () => {
          this.saving = false;
          this.closeForm();
        },
        error: (err) => {
          this.saving = false;
          this.errorMsg = 'Failed to create patient. Please try again.';
          console.error(err);
        },
      });
    }
  }

  deletePatient(id: number): void {
    if (!confirm('Delete this patient?')) return;
    this.patientService.deletePatient(id).subscribe();
  }

  closeForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.newPatient = this.resetForm();
    this.errorMsg = '';
  }

  get filteredPatients(): Patient[] {
    if (!this.searchTerm.trim()) {
      return this.patients;
    }
    const keyword = this.searchTerm.toLowerCase();
    return this.patients.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.gender.toLowerCase().includes(keyword) ||
        p.phone.toLowerCase().includes(keyword) ||
        p.bloodGroup.toLowerCase().includes(keyword),
    );
  }
}
