import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'HMS Hospital';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Auto-login on app startup if token exists
    this.autoLogin();
  }

  /**
   * Check if token exists and restore user session
   * Redirect to appropriate dashboard based on role
   */
  private autoLogin(): void {
    const token = this.authService.getToken();
    
    if (token) {
      // Validate token by calling GET /auth/me
      this.authService.getCurrentUser().subscribe({
        next: (user) => {
          // Token is valid, redirect based on role
          this.redirectByRole(user.role);
        },
        error: () => {
          // Token is invalid or expired, clear session and stay on current page
          this.authService.logout();
        }
      });
    }
  }

  /**
   * Redirect based on user role
   */
  private redirectByRole(role: string): void {
    // Only redirect if on login page, otherwise stay on current page
    if (this.router.url === '/login') {
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

  isLoginPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url.startsWith('/doctor') || url.startsWith('/nurse') || url.startsWith('/admin');
  }
}