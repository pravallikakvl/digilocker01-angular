import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { DocumentService } from '../../services/document.service';
import { SharingService } from '../../services/sharing.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser = signal<any>(null);
  stats = signal({ documents: 0, shared: 0, requests: 0, verified: 0 });
  recentActivities = signal<any[]>([]);
  sidebarOpen = signal(true);
  
  isMobile = signal(false);

  constructor(
    private authService: AuthService,
    private documentService: DocumentService,
    private sharingService: SharingService,
    private router: Router
  ) {
    this.currentUser.set(this.authService.getCurrentUser());
  }

  ngOnInit(): void {
    this.loadStats();
    this.checkMobile();
    window.addEventListener('resize', () => this.checkMobile());
  }

  private checkMobile(): void {
    this.isMobile.set(window.innerWidth < 768);
    this.sidebarOpen.set(!this.isMobile());
  }

  private loadStats(): void {
    const user = this.currentUser();
    if (!user) return;

    const documents = this.documentService.getDocumentsByUser(user.id);
    this.stats.set({
      documents: documents.length,
      shared: 0, // TODO: Get from sharing service
      requests: this.sharingService.getConsentRequestsForUser(user.id).length,
      verified: documents.filter(d => d.status === 'verified').length
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  navigate(route: string): void {
    this.router.navigate([`/dashboard/${route}`]);
    if (this.isMobile()) {
      this.sidebarOpen.set(false);
    }
  }
}

