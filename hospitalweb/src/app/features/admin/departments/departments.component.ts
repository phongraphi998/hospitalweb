import { Component } from "@angular/core";
import { DataService, Department } from "../../../services/data.service";

@Component({
  selector: "app-departments",
  templateUrl: "./departments.component.html",
  styleUrls: ["./departments.component.css"],
})
export class DepartmentsComponent {
  /*Search*/

  searchTerm: string = "";

  /*  20 Main Departments*/
  departmentOptions: string[] = [
    "Outpatient Department (OPD)",
    "Emergency Room (ER)",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Obstetrics & Gynecology",
    "General Surgery",
    "Internal Medicine",
    "Radiology",
    "Anesthesiology",
    "Oncology",
    "Dermatology",
    "Ophthalmology",
    "ENT (Ear, Nose, Throat)",
    "Psychiatry",
    "Urology",
    "Nephrology",
    "Gastroenterology",
    "Intensive Care Unit (ICU)",
  ];

  /* Modal Control*/
  showForm: boolean = false;
  editMode: boolean = false;

  /* Form Model*/
  newDepartment: Department = this.resetForm();
  constructor(public data: DataService) {}

  /* Reset Form*/
  resetForm(): Department {
    return {
      id: 0,
      code: "",
      name: "",
      head: "",
      phone: "",
      floor: "",
      room: "",
      status: "Active",
    };
  }

  /* Auto Generate Code */
  autoGenerateCode() {
    if (!this.newDepartment.name) {
      this.newDepartment.code = "";
      return;
    }
    const words = this.newDepartment.name
      .replace(/[^A-Za-z ]/g, "")
      .split(" ")
      .filter((w) => w.length > 0);
    this.newDepartment.code = words
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }

  /*Open Add Modal*/
  openAdd() {
    this.editMode = false;
    this.newDepartment = this.resetForm();
    this.showForm = true;
  }

  /*Open Edit Modal*/
  openEdit(dep: Department) {
    this.editMode = true;
    this.newDepartment = { ...dep };
    this.showForm = true;
  }

  /*Save Department */

  saveDepartment() {
    if (!this.newDepartment.code || !this.newDepartment.name) {
      alert("Code and Name are required");
      return;
    }
    if (this.editMode) {
      this.data.updateDepartment(this.newDepartment);
    } else {
      this.newDepartment.id = Date.now();
      this.data.addDepartment(this.newDepartment);
    }
    this.showForm = false;
  }

  /*Delete Department*/
  deleteDepartment(id: number) {
    const confirmDelete = confirm(
      "Are you sure you want to delete this department?",
    );

    if (confirmDelete) {
      this.data.deleteDepartment(id);
    }
  }

  /* Realtime Search Filter*/
  get filteredDepartments(): Department[] {
    if (!this.searchTerm.trim()) {
      return this.data.departments;
    }

    const keyword = this.searchTerm.toLowerCase();
    return this.data.departments.filter(
      (dep) =>
        dep.name.toLowerCase().includes(keyword) ||
        dep.code.toLowerCase().includes(keyword) ||
        dep.head.toLowerCase().includes(keyword) ||
        dep.floor.toLowerCase().includes(keyword) ||
        dep.room.toLowerCase().includes(keyword),
    );
  }
}
