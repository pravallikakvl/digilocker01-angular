import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard-redirect',
  standalone: true,
  template: '<div>Redirecting...</div>'
})
export class DashboardRedirectComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      if (user.role === 'student') {
        this.router.navigate(['/dashboard/documents']);
      } else if (user.role === 'institute') {
        this.router.navigate(['/dashboard/students']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}