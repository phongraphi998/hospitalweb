import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  id = '';
  password = '';
  error = '';
  rememberMe = false;
  showPassword = false;

  private readonly REMEMBER_KEY = 'medilab_remember_id';

  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit(): void {
    // โหลด Staff ID ที่บันทึกไว้ (ถ้ามี)
    const savedId = localStorage.getItem(this.REMEMBER_KEY);
    if (savedId) {
      this.id = savedId;
      this.rememberMe = true;
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  submit(): void {
    this.error = '';

    // บันทึกหรือลบ Staff ID ตาม Remember Me
    if (this.rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, this.id.trim());
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }

    const res = this.auth.login(this.id.trim(), this.password);
    if (res.ok && res.role) {
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