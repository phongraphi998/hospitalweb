import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './features/login/login.component';
import { DoctorComponent } from './features/doctor/doctor.component';
import { NurseComponent } from './features/nurse/nurse.component';
import { AdminComponent } from './features/admin/admin.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { DepartmentsComponent } from './features/admin/departments/departments.component';
import { StaffComponent } from './features/admin/staff/staff.component';
import { PatientsComponent } from './features/admin/patients/patients.component';
import { AppointmentsComponent } from './features/admin/appointments/appointments.component';
import { BillingComponent } from './features/admin/billing/billing.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'doctor', component: DoctorComponent },
  { path: 'nurse', component: NurseComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', component: DashboardComponent },
      { path: 'departments', component: DepartmentsComponent },
      { path: 'staff', component: StaffComponent },
      { path: 'patients', component: PatientsComponent },
      { path: 'appointments', component: AppointmentsComponent },
      { path: 'billing', component: BillingComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
 