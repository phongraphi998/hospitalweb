import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserRole } from '../../core/models/auth.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  email = '';
  password = '';
  error = '';
  rememberMe = false;
  showPassword = false;
  isLoading = false;

  private readonly REMEMBER_KEY = 'remember_email';
  private destroy$ = new Subject<void>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Load email from localStorage if "Remember Me" was checked
    const savedEmail = localStorage.getItem(this.REMEMBER_KEY);
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle password visibility
   */
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  /**
   * Handle login form submission
   */
  submit(): void {
    this.error = '';

    // Validation
    if (!this.email.trim() || !this.password.trim()) {
      this.error = 'Please enter both email and password';
      return;
    }

    // Save or remove email based on "Remember Me"
    if (this.rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, this.email.trim());
    } else {
      localStorage.removeItem(this.REMEMBER_KEY);
    }

    this.isLoading = true;

    // Call auth service login
    this.authService.login(this.email.trim(), this.password)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.isLoading = false;
          // Redirect based on user role
          this.redirectByRole(response.user.role);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.message || 'Login failed. Please try again.';
        }
      });
  }

  /**
   * Redirect user to appropriate dashboard based on their role
   */
  private redirectByRole(role: UserRole): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin']);
        break;
      case 'DOCTOR':
        this.router.navigate(['/doctor']);
        break;
      case 'NURSE':
        this.router.navigate(['/nurse']);
        break;
      default:
        this.router.navigate(['/']);
    }
  }
}