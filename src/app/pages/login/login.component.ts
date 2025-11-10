import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LoginCredentials } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginCredentials = {
    email: '',
    password: '',
    role: 'student'
  };
  
  error = signal('');
  loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async onSubmit(): Promise<void> {
    this.error.set('');
    
    if (!this.credentials.email || !this.credentials.password) {
      this.error.set('Please fill in all fields');
      return;
    }

    this.loading.set(true);
    
    try {
      const success = await this.authService.login(this.credentials);
      
      if (success) {
        this.router.navigate(['/dashboard']);
      } else {
        this.error.set('Invalid credentials or server error');
        this.loading.set(false);
      }
    } catch (error) {
      console.error('Login error:', error);
      this.error.set('Connection error. Please check if the server is running.');
      this.loading.set(false);
    }
  }

  fillStudentCredentials(): void {
    this.credentials = {
      email: 'rahul@student.edu',
      password: 'password',
      role: 'student'
    };
  }

  fillInstituteCredentials(): void {
    this.credentials = {
      email: 'admin@delhiuniversity.edu',
      password: 'password',
      role: 'institute'
    };
  }
}

