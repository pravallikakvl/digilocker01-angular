import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RegisterData } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerData: RegisterData = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'student',
    mobileNumber: '',
    dateOfBirth: undefined,
    gender: '',
    studentId: '',
    userId: ''
  };
  
  confirmPassword = '';
  error = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.error.set('');
    
    // Validation
    if (!this.registerData.email || !this.registerData.password || !this.registerData.firstName || 
        !this.registerData.lastName || !this.registerData.mobileNumber || !this.registerData.gender) {
      this.error.set('Please fill in all required fields');
      return;
    }

    // Student-specific validation
    if (this.registerData.role === 'student' && !this.registerData.studentId) {
      this.error.set('Student ID is required for student registration');
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    if (this.registerData.password.length < 6) {
      this.error.set('Password must be at least 6 characters long');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.registerData.email)) {
      this.error.set('Please enter a valid email address');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(this.registerData.mobileNumber.replace(/\D/g, ''))) {
      this.error.set('Please enter a valid 10-digit mobile number');
      return;
    }

    this.loading.set(true);
    
    try {
      const success = await this.authService.register(this.registerData);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Registration failed. Email might already exist.');
        this.loading.set(false);
      }
    } catch (error) {
      console.error('Registration error:', error);
      this.error.set('Connection error. Please check if the server is running.');
      this.loading.set(false);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}