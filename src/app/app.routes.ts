import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
    canActivate: [LoginGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./layouts/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'documents',
        loadComponent: () => import('./pages/documents/documents.component').then(m => m.DocumentsComponent)
      },
      {
        path: 'share',
        loadComponent: () => import('./pages/share/share.component').then(m => m.ShareComponent)
      },
      {
        path: 'consent',
        loadComponent: () => import('./pages/consent/consent.component').then(m => m.ConsentComponent)
      },
      {
        path: 'verify',
        loadComponent: () => import('./pages/verify/verify.component').then(m => m.VerifyComponent)
      },
      {
        path: 'analytics',
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      {
        path: 'students',
        loadComponent: () => import('./pages/students/students.component').then(m => m.StudentsComponent)
      },
      {
        path: 'transfers',
        loadComponent: () => import('./pages/transfers/transfers.component').then(m => m.TransfersComponent)
      },
      {
        path: 'verification',
        loadComponent: () => import('./pages/institute-verification/institute-verification.component').then(m => m.InstituteVerificationComponent)
      },
      {
        path: 'notifications',
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      {
        path: '',
        loadComponent: () => import('./components/dashboard-redirect/dashboard-redirect.component').then(m => m.DashboardRedirectComponent)
      }
    ]
  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
