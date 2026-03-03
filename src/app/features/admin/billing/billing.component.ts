import { Component } from "@angular/core";

import { DataService, Bill, BillItem } from "../../../services/data.service";

@Component({
  selector: "app-billing",

  templateUrl: "./billing.component.html",

  styleUrls: ["./billing.component.css"],
})
export class BillingComponent {
  searchTerm = "";

  showForm = false;

  selectedBill: Bill | null = null;

  constructor(public data: DataService) {}

  /* ================= CREATE BILL ================= */

  newBill: Bill = this.createEmptyBill();

  newItem: BillItem = {
    description: "",

    qty: 1,

    price: 0,

    total: 0,
  };

  createEmptyBill(): Bill {
    return {
      id: 0,

      invoiceNo: "",

      patient: "",

      items: [],

      subtotal: 0,

      vat: 0,

      discount: 0,

      grandTotal: 0,

      paymentMethod: "Cash",

      status: "Unpaid",

      createdAt: "",
    };
  }

  generateInvoiceNo(): string {
    return "RC-" + Date.now();
  }

  openCreate() {
    this.newBill = this.createEmptyBill();

    this.newItem = { description: "", qty: 1, price: 0, total: 0 };

    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }

  /* ================= ITEMS ================= */

  addItem() {
    if (!this.newItem.description || this.newItem.price <= 0) {
      alert("Please enter description and valid price");

      return;
    }

    const item: BillItem = {
      description: this.newItem.description,

      qty: this.newItem.qty,

      price: this.newItem.price,

      total: this.newItem.qty * this.newItem.price,
    };

    this.newBill.items.push(item);

    this.calculateTotals();

    this.newItem = {
      description: "",

      qty: 1,

      price: 0,

      total: 0,
    };
  }

  removeItem(index: number) {
    this.newBill.items.splice(index, 1);

    this.calculateTotals();
  }

  calculateTotals() {
    this.newBill.subtotal = this.newBill.items.reduce(
      (sum, i) => sum + i.total,
      0,
    );

    // โรงพยาบาลไม่คิด VAT

    this.newBill.vat = 0;

    this.newBill.grandTotal =
      this.newBill.subtotal - (this.newBill.discount || 0);
  }

  /* ================= SAVE ================= */

  saveBill() {
    if (!this.newBill.patient) {
      alert("Please select patient");

      return;
    }

    if (this.newBill.items.length === 0) {
      alert("Please add at least one item");

      return;
    }
    this.newBill.id = Date.now();

    this.newBill.invoiceNo = this.generateInvoiceNo();

    this.newBill.createdAt = new Date().toISOString();

    this.newBill.status = "Unpaid";

    this.calculateTotals();

    this.data.addBill({ ...this.newBill });

    this.showForm = false;
  }

  /* ================= ACTIONS ================= */

  markPaid(bill: Bill) {
    bill.status = "Paid";

    this.data.updateBill(bill);
  }

  deleteBill(id: number) {
    this.data.deleteBill(id);
  }

  /* ================= PRINT ================= */

  openPrint(bill: Bill) {
    this.selectedBill = bill;
  }

  closeReceipt() {
    this.selectedBill = null;
  }

  printReceipt() {
    window.print();
  }

  /* ================= SEARCH ================= */

  get filteredBills() {
    if (!this.searchTerm) return this.data.billList;

    return this.data.billList.filter(
      (b) =>
        b.patient.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        b.invoiceNo.toLowerCase().includes(this.searchTerm.toLowerCase()),
    );
  }
}
