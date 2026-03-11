import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { tap, catchError, map } from "rxjs/operators";
import {
  User,
  LoginRequest,
  LoginResponse,
  UserRole,
} from "../models/auth.models";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private readonly API_URL = "http://localhost:3000/auth";
  private readonly TOKEN_KEY = "auth_token";
  private readonly USER_KEY = "auth_user";

  // Observable for auth state
  private currentUserSubject = new BehaviorSubject<User | null>(
    this.getUserFromStorage(),
  );
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    this.hasToken(),
  );
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  /**
   * Login with email and password
   * Saves token and user data to localStorage
   */
  login(email: string, password: string): Observable<LoginResponse> {
    const loginRequest: LoginRequest = { email, password };

    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, loginRequest)
      .pipe(
        tap((response) => {
          // Save token to localStorage
          localStorage.setItem(this.TOKEN_KEY, response.token);
          // Save user data to localStorage
          localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
          // Update subjects
          this.currentUserSubject.next(response.user);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(this.handleError),
      );
  }

  /**
   * Get current logged-in user
   * Calls GET /auth/me to validate token and get user data
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<{user: User}>(`${this.API_URL}/me`).pipe(
      map(response => response.user),
      tap((user) => {
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSubject.next(user);
      }),
      catchError((error) => {
        // If 401 unauthorized, clear session
        if (error.status === 401) {
          this.logout();
        }
        return throwError(() => error);
      }),
    );
  }

  /**
   * Logout and redirect to login page
   */
  logout(): void {
    // Remove token and user from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);

    // Update subjects
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);

    // Redirect to login
    this.router.navigate(["/login"]);
  }

  /**
   * Get user role from stored user data
   */
  getRole(): UserRole | null {
    const user = this.currentUserSubject.value;
    return user ? user.role : null;
  }

  /**
   * Get user identification for display (email prefix)
   */
  getUserId(): string | null {
    const user = this.currentUserSubject.value;
    return user && user.email ? user.email.split("@")[0] : null;
  }

  /**
   * Check if user has a specific role
   */
  hasRole(role: UserRole): boolean {
    return this.getRole() === role;
  }

  /**
   * Get JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if token exists and user is authenticated
   */
  isAuthenticated(): boolean {
    return this.hasToken() && this.currentUserSubject.value !== null;
  }

  /**
   * Get current user synchronously from localStorage
   */
  getCurrentUserSync(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user as observable
   */
  getCurrentUserAsObservable(): Observable<User | null> {
    return this.currentUser$;
  }

  /**
   * Check token existence
   */
  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Get user from localStorage
   */
  private getUserFromStorage(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    try {
      return userJson ? JSON.parse(userJson) : null;
    } catch {
      return null;
    }
  }

  /**
   * Error handling for HTTP requests
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = "An error occurred";

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage =
        error.error?.message ||
        `Error Code: ${error.status}\nMessage: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
