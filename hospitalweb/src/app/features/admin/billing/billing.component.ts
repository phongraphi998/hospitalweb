import { Component, OnInit } from "@angular/core";
import { BillingService, ApiBilling } from "../../../services/billing.service";
import { DataService } from "../../../services/data.service";

export interface BillItemLocal {
  description: string;
  qty: number;
  price: number;
  total: number;
}

@Component({
  selector: "app-billing",
  templateUrl: "./billing.component.html",
  styleUrls: ["./billing.component.css"],
})
export class BillingComponent implements OnInit {
  searchTerm = "";
  showForm = false;
  selectedBill: ApiBilling | null = null;
  billings: ApiBilling[] = [];
  loading = false;

  // Form state
  newPatient = "";
  newDiscount = 0;
  selectedAppointmentId: number | null = null;
  newItems: BillItemLocal[] = [];
  newItem: BillItemLocal = { description: "", qty: 1, price: 0, total: 0 };

  constructor(
    private billingService: BillingService,
    public data: DataService
  ) {}

  ngOnInit(): void {
    this.loadBillings();
  }

  loadBillings(): void {
    this.loading = true;
    this.billingService.getBillings().subscribe((data) => {
      this.billings = data;
      this.loading = false;
    });
  }

  // ==================== CREATE FORM ====================

  openCreate(): void {
    this.newPatient = "";
    this.newDiscount = 0;
    this.selectedAppointmentId = null;
    this.newItems = [];
    this.newItem = { description: "", qty: 1, price: 0, total: 0 };
    this.showForm = true;
  }

  onAppointmentChange(): void {
    if (this.selectedAppointmentId) {
      const appt = this.data.appointmentList.find(
        (a) => a.id === this.selectedAppointmentId
      );
      if (appt) {
        this.newPatient = appt.patient;
      }
    }
  }

  closeForm(): void {
    this.showForm = false;
  }

  addItem(): void {
    if (!this.newItem.description || this.newItem.price <= 0) {
      alert("Please enter description and valid price");
      return;
    }

    const item: BillItemLocal = {
      description: this.newItem.description,
      qty: this.newItem.qty,
      price: this.newItem.price,
      total: this.newItem.qty * this.newItem.price,
    };

    this.newItems.push(item);
    this.newItem = { description: "", qty: 1, price: 0, total: 0 };
  }

  removeItem(index: number): void {
    this.newItems.splice(index, 1);
  }

  get subtotal(): number {
    return this.newItems.reduce((sum, i) => sum + i.total, 0);
  }

  get grandTotal(): number {
    return this.subtotal - (this.newDiscount || 0);
  }

  saveBill(): void {
    if (!this.newPatient) {
      alert("Please select patient");
      return;
    }

    if (this.newItems.length === 0) {
      alert("Please add at least one item");
      return;
    }

    const payload = {
      appointment_id: this.selectedAppointmentId || null,
      discount: this.newDiscount,
      patient_name: this.newPatient,
      items: this.newItems.map((i) => ({
        description: i.description,
        qty: i.qty,
        price: i.price,
      })),
    };

    this.billingService.createBilling(payload).subscribe((result) => {
      if (result) {
        this.showForm = false;
        this.loadBillings();
      } else {
        alert("Failed to create billing");
      }
    });
  }

  // ==================== ACTIONS ====================

  markPaid(bill: ApiBilling): void {
    this.billingService.markPaid(bill.id).subscribe((result) => {
      if (result) {
        this.loadBillings();
      }
    });
  }

  deleteBill(id: number): void {
    if (!confirm("Are you sure you want to delete this billing?")) return;

    this.billingService.deleteBilling(id).subscribe(() => {
      this.loadBillings();
    });
  }

  // ==================== PRINT RECEIPT ====================

  openPrint(bill: ApiBilling): void {
    this.selectedBill = bill;
  }

  closeReceipt(): void {
    this.selectedBill = null;
  }

  printReceipt(): void {
    window.print();
  }

  // ==================== HELPERS ====================

  getPatientInitial(bill: ApiBilling): string {
    return (bill.patient_name || "?").charAt(0).toUpperCase();
  }

  getInvoiceNo(bill: ApiBilling): string {
    return "RC-" + bill.id.toString().padStart(5, "0");
  }

  getItemsTotal(bill: ApiBilling): number {
    if (!bill.items || bill.items.length === 0) return 0;
    return bill.items.reduce((sum, i) => sum + Number(i.total), 0);
  }

  get filteredBills(): ApiBilling[] {
    if (!this.searchTerm) return this.billings;
    const term = this.searchTerm.toLowerCase();
    return this.billings.filter(
      (b) =>
        (b.patient_name || "").toLowerCase().includes(term) ||
        this.getInvoiceNo(b).toLowerCase().includes(term)
    );
  }
}
