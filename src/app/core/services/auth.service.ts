import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export type UserRole = 'doctor' | 'nurse' | 'admin' | null;

interface Credentials {
  id: string;
  password: string;
  role: UserRole;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly STORAGE_KEY = 'medilab_user';

  // Mock accounts
  private accounts: Credentials[] = [
    { id: 'doctor01', password: 'Doc@1234', role: 'doctor' }, //ก้องโอม
    { id: 'nurse01', password: 'Nurse@1234', role: 'nurse' }, 
    { id: 'admin01', password: 'Admin@1234', role: 'admin' } //ไอซ์/ของกิ๊กนะไอซ์
  ];

  constructor(private router: Router) {}

  login(id: string, password: string): { ok: boolean; role?: UserRole } {
    const match = this.accounts.find(a => a.id === id && a.password === password);
    if (match) {
      const payload = { id: match.id, role: match.role };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(payload));
      return { ok: true, role: match.role };
    }
    return { ok: false };
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.STORAGE_KEY);
  }

  getRole(): UserRole {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw).role as UserRole; } catch { return null; }
  }

  getUserId(): string | null {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw).id as string; } catch { return null; }
  }
}
