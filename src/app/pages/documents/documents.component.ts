import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Document, DocumentCategory } from '../../models/document.model';
import { DocumentService } from '../../services/document.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnInit {
  documents = signal<Document[]>([]);
  searchTerm = signal('');
  selectedCategory = signal<DocumentCategory | 'all'>('all');
  uploadProgress = signal(0);
  showUploadModal = signal(false);
  selectedFile = signal<File | null>(null);
  uploadCategory = signal<DocumentCategory>('personal');

  categories: DocumentCategory[] = ['personal', 'education', 'identity', 'certificate', 'marksheet', 'other'];
  categoryLabels: Record<DocumentCategory, string> = {
    personal: 'Personal Documents',
    education: 'Educational',
    identity: 'Identity',
    certificate: 'Certificate',
    marksheet: 'Marksheet',
    other: 'Other'
  };

  filteredDocuments = computed(() => {
    let filtered = this.documents();

    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(doc =>
        doc.originalFileName.toLowerCase().includes(search) ||
        doc.category.toLowerCase().includes(search)
      );
    }

    if (this.selectedCategory() !== 'all') {
      filtered = filtered.filter(doc => doc.category === this.selectedCategory());
    }

    return filtered;
  });

  constructor(
    private documentService: DocumentService,
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

  openUploadModal(): void {
    this.showUploadModal.set(true);
  }

  closeUploadModal(): void {
    this.showUploadModal.set(false);
    this.selectedFile.set(null);
    this.uploadProgress.set(0);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }

  uploadDocument(): void {
    const file = this.selectedFile();
    if (!file) return;

    const user = this.authService.getCurrentUser();
    if (!user) return;

    this.uploadProgress.set(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      this.uploadProgress.update(p => {
        if (p >= 90) {
          clearInterval(interval);
          return p;
        }
        return p + 10;
      });
    }, 200);

    setTimeout(() => {
      this.documentService.uploadDocument(file, this.uploadCategory(), user.id);
      this.uploadProgress.set(100);
      
      setTimeout(() => {
        this.loadDocuments();
        this.closeUploadModal();
      }, 500);
    }, 2000);
  }

  downloadDocument(doc: Document): void {
    alert(`Downloading ${doc.originalFileName}`);
    // In real app, this would download the actual file
  }

  deleteDocument(doc: Document): void {
    if (confirm(`Are you sure you want to delete ${doc.originalFileName}?`)) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.documentService.deleteDocument(doc.id, user.id);
        this.loadDocuments();
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getCategoryColor(category: DocumentCategory): string {
    const colors: Record<DocumentCategory, string> = {
      personal: 'bg-blue-100 text-blue-800',
      education: 'bg-green-100 text-green-800',
      identity: 'bg-purple-100 text-purple-800',
      certificate: 'bg-yellow-100 text-yellow-800',
      marksheet: 'bg-pink-100 text-pink-800',
      other: 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors.other;
  }
}

