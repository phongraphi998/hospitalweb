import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
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
import { DashboardComponent } from "./features/admin/dashboard/dashboard.component";
import { DepartmentsComponent } from "./features/admin/departments/departments.component";

import { StaffComponent } from "./features/admin/staff/staff.component";
import { PatientsComponent } from "./features/admin/patients/patients.component";
import { AppointmentsComponent } from "./features/admin/appointments/appointments.component";
import { BillingComponent } from "./features/admin/billing/billing.component";
import { AuthInterceptor } from "./core/interceptors/auth.interceptor";

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
    DashboardComponent,
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
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
