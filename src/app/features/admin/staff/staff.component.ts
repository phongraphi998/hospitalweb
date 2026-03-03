import { Component } from "@angular/core";

import { DataService, Staff } from "../../../services/data.service";

@Component({
  selector: "app-staff",

  templateUrl: "./staff.component.html",

  styleUrls: ["./staff.component.css"],
})
export class StaffComponent {
  /* ==============================

     STATE CONTROL

  ============================== */

  showForm: boolean = false;

  editMode: boolean = false;

  searchTerm: string = "";

  constructor(public data: DataService) {}

  /* ==============================

     DEFAULT FORM MODEL

  ============================== */

  newStaff: Staff = this.resetForm();

  resetForm(): Staff {
    return {
      id: 0,

      name: "",

      role: "doctor",

      department: "",

      phone: "",

      email: "",

      license: "",

      shift: "Morning",

      status: "Active",
    };
  }

  /* ==============================

     OPEN ADD

  ============================== */

  openAdd(): void {
    this.editMode = false;

    this.newStaff = this.resetForm();

    this.showForm = true;
  }

  /* ==============================

     OPEN EDIT

  ============================== */

  openEdit(staff: Staff): void {
    this.editMode = true;

    this.newStaff = { ...staff };

    this.showForm = true;
  }

  /* ==============================

     SAVE STAFF

  ============================== */

  saveStaff(): void {
    // Basic Validation

    if (!this.newStaff.name.trim()) {
      alert("Name is required");

      return;
    }

    if (!this.newStaff.department) {
      alert("Please select department");

      return;
    }

    if (this.editMode) {
      this.data.updateStaff(this.newStaff);
    } else {
      this.newStaff.id = Date.now();

      this.data.addStaff({ ...this.newStaff });
    }

    this.closeForm();
  }

  /* ==============================

     DELETE

  ============================== */

  deleteStaff(id: number): void {
    const confirmDelete = confirm(
      "Are you sure you want to delete this staff?",
    );

    if (confirmDelete) {
      this.data.deleteStaff(id);
    }
  }

  /* ==============================

     CLOSE MODAL

  ============================== */

  closeForm(): void {
    this.showForm = false;

    this.editMode = false;

    this.newStaff = this.resetForm();
  }

  /* ==============================

     FILTER STAFF (SMART SEARCH)

  ============================== */

  get filteredStaff(): Staff[] {
    if (!this.searchTerm.trim()) {
      return this.data.staffList;
    }

    const keyword = this.searchTerm.toLowerCase();

    return this.data.staffList.filter(
      (s) =>
        s.name.toLowerCase().includes(keyword) ||
        s.role.toLowerCase().includes(keyword) ||
        s.department.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.phone.toLowerCase().includes(keyword),
    );
  }
}
