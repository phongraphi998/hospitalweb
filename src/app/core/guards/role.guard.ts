import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const requiredRoles: string[] = route.data['roles'] || [];
    const role = this.auth.getRole();
    if (!role) return this.router.parseUrl('/login');
    if (requiredRoles.length === 0 || requiredRoles.includes(role)) return true;
    return this.router.parseUrl('/login');
  }
}
