import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConsentRequest } from '../../models/document.model';
import { SharingService } from '../../services/sharing.service';
import { AuthService } from '../../services/auth.service';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-consent',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss']
})
export class ConsentComponent implements OnInit {
  consentRequests = signal<ConsentRequest[]>([]);
  loading = signal(false);

  constructor(
    private sharingService: SharingService,
    private authService: AuthService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.loadConsentRequests();
  }

  private loadConsentRequests(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.consentRequests.set(this.sharingService.getConsentRequestsForUser(user.id));
    }
  }

  approveRequest(request: ConsentRequest): void {
    this.loading.set(true);
    setTimeout(() => {
      this.sharingService.respondToConsentRequest(request.requestId, 'approved');
      this.loadConsentRequests();
      this.loading.set(false);
    }, 500);
  }

  rejectRequest(request: ConsentRequest): void {
    this.loading.set(true);
    setTimeout(() => {
      this.sharingService.respondToConsentRequest(request.requestId, 'rejected');
      this.loadConsentRequests();
      this.loading.set(false);
    }, 500);
  }

  getDocumentName(documentId: string): string {
    const doc = this.documentService.getDocumentById(documentId);
    return doc?.originalFileName || 'Unknown Document';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }
}