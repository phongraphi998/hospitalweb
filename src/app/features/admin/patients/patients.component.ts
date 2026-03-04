import { Component } from "@angular/core";
import { DataService, Patient } from "../../../services/data.service";

@Component({
  selector: "app-patients",
  templateUrl: "./patients.component.html",
  styleUrls: ["./patients.component.css"],
})
export class PatientsComponent {
  showForm: boolean = false;
  editMode: boolean = false;
  searchTerm: string = "";
  constructor(public data: DataService) {}
  newPatient: Patient = this.resetForm();
  resetForm(): Patient {
    return {
      id: 0,
      name: "",
      gender: "",
      dob: "",
      phone: "",
      address: "",
      bloodGroup: "",
      emergencyContact: "",
      status: "Active",
    };
  }

  openAdd(): void {
    this.editMode = false;
    this.newPatient = this.resetForm();
    this.showForm = true;
  }

  openEdit(patient: Patient): void {
    this.editMode = true;
    this.newPatient = { ...patient };
    this.showForm = true;
  }

  savePatient(): void {
    if (!this.newPatient.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!this.newPatient.gender) {
      alert("Please select gender");
      return;
    }

    if (this.editMode) {
      this.data.updatePatient(this.newPatient);
    } else {
      this.newPatient.id = Date.now();
      this.data.addPatient({ ...this.newPatient });
    }

    this.closeForm();
  }

  deletePatient(id: number): void {
    const confirmDelete = confirm("Delete this patient?");
    if (confirmDelete) {
      this.data.deletePatient(id);
    }
  }

  closeForm(): void {
    this.showForm = false;
    this.editMode = false;
    this.newPatient = this.resetForm();
  }

  get filteredPatients(): Patient[] {
    if (!this.searchTerm.trim()) {
      return this.data.patientList;
    }

    const keyword = this.searchTerm.toLowerCase();
    return this.data.patientList.filter(
      (p) =>
        p.name.toLowerCase().includes(keyword) ||
        p.gender.toLowerCase().includes(keyword) ||
        p.phone.toLowerCase().includes(keyword) ||
        p.bloodGroup.toLowerCase().includes(keyword),
    );
  }
}
