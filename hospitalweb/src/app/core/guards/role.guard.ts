import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Check if user has required role
   * Usage: { path: 'admin', component: AdminComponent, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } }
   */
  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles: UserRole[] = route.data['roles'] || [];
    
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      return this.router.parseUrl('/login');
    }

    // Get current user role
    const userRole = this.authService.getRole();

    // If no roles required, allow access
    if (requiredRoles.length === 0) {
      return true;
    }

    // Check if user role is in required roles
    if (userRole && requiredRoles.includes(userRole)) {
      return true;
    }

    // User doesn't have required role, redirect to login
    return this.router.parseUrl('/login');
  }
}
