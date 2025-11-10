import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { SharingService } from '../../services/sharing.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-share',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {
  documents = signal<Document[]>([]);
  selectedDocument = signal<Document | null>(null);
  shareCode = signal('');
  shareUrl = signal('');
  expiryDuration = signal(7);
  showShareModal = signal(false);
  showQRCode = signal(false);

  constructor(
    private documentService: DocumentService,
    private sharingService: SharingService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  private loadDocuments(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.documents.set(this.documentService.getDocumentsByUser(user.id));
    }
  }

  shareDocument(doc: Document): void {
    this.selectedDocument.set(doc);
    const user = this.authService.getCurrentUser();
    if (user) {
      const sharedDoc = this.sharingService.shareDocument(doc.id, user.id, this.expiryDuration());
      this.shareCode.set(sharedDoc.shareCode);
      this.shareUrl.set(`https://digilocker.demo.com/verify/${sharedDoc.shareCode}`);
      this.showShareModal.set(true);
    }
  }

  generateQRCode(doc: Document): void {
    this.selectedDocument.set(doc);
    this.showQRCode.set(true);
  }

  copyShareCode(): void {
    navigator.clipboard.writeText(this.shareCode());
    alert('Share code copied to clipboard!');
  }

  copyShareUrl(): void {
    navigator.clipboard.writeText(this.shareUrl());
    alert('Share URL copied to clipboard!');
  }

  closeModal(): void {
    this.showShareModal.set(false);
    this.showQRCode.set(false);
    this.selectedDocument.set(null);
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }
}