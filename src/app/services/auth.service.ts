import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';
import { User, LoginCredentials, RegisterData } from '../models/user.model';

interface LoginResponse {
  success: boolean;
  message: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser = signal<User | null>(null);
  private apiUrl = 'digilocker-angular.vercel.app';
  
  public user = this.currentUser.asReadonly();
  public isAuthenticated = computed(() => this.currentUser() !== null);
  public userRole = computed(() => this.currentUser()?.role);

  constructor(private http: HttpClient, private router: Router) {
    // Load user from localStorage on init
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  async login(credentials: LoginCredentials): Promise<boolean> {
    try {
      console.log('Attempting login with:', credentials);
      
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      );
      
      console.log('Login response:', response);
      
      if (response.success && response.user) {
        this.currentUser.set(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  }

  async register(data: RegisterData): Promise<boolean> {
    try {
      console.log('Attempting registration with:', data);
      
      const response = await firstValueFrom(
        this.http.post<LoginResponse>(`${this.apiUrl}/register`, data)
      );
      
      console.log('Registration response:', response);
      
      if (response.success && response.user) {
        this.currentUser.set(response.user);
        localStorage.setItem('currentUser', JSON.stringify(response.user));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  }

  logout(): void {
    this.currentUser.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUser();
  }

  // Method to get all users (for debugging)
  async getUsers(): Promise<User[]> {
    try {
      return await firstValueFrom(
        this.http.get<User[]>(`${this.apiUrl}/users`)
      );
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }
}

