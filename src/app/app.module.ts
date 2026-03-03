import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./components/header/header.component";
import { FooterComponent } from "./components/footer/footer.component";
import { HomeComponent } from "./pages/home/home.component";
import { AppointmentFormComponent } from "./components/appointment-form/appointment-form.component";
import { LoginComponent } from "./features/login/login.component";
import { DoctorComponent } from "./features/doctor/doctor.component";
import { NurseComponent } from "./features/nurse/nurse.component";
import { AdminComponent } from "./features/admin/admin.component";
import { DepartmentsComponent } from "./features/admin/departments/departments.component";
import { StaffComponent } from "./features/admin/staff/staff.component";
import { PatientsComponent } from "./features/admin/patients/patients.component";
import { AppointmentsComponent } from "./features/admin/appointments/appointments.component";
import { BillingComponent } from "./features/admin/billing/billing.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    AppointmentFormComponent,
    LoginComponent,
    DoctorComponent,
    NurseComponent,
    AdminComponent,
    DepartmentsComponent,
    StaffComponent,
    PatientsComponent,
    AppointmentsComponent,
    BillingComponent,
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    CommonModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
