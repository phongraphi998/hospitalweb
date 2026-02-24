import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  id = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit(): void {
    this.error = '';
    const res = this.auth.login(this.id.trim(), this.password);
    if (res.ok && res.role) {
      // route by role
      switch (res.role) {
        case 'doctor': this.router.navigate(['/doctor']); break;
        case 'nurse': this.router.navigate(['/nurse']); break;
        case 'admin': this.router.navigate(['/admin']); break;
        default: this.router.navigate(['/']);
      }
    } else {
      this.error = 'Invalid ID or Password';
    }
  }
}
