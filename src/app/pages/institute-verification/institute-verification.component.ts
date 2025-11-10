import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DocumentVerification {
  id: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  documentType: string;
  documentName: string;
  verificationCode: string;
  qrCode: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedDate: Date;
  verifiedDate?: Date;
  verifiedBy?: string;
  comments?: string;
}

@Component({
  selector: 'app-institute-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './institute-verification.component.html',
  styleUrls: ['./institute-verification.component.scss']
})
export class InstituteVerificationComponent implements OnInit {
  verificationRequests = signal<DocumentVerification[]>([]);
  filteredRequests = signal<DocumentVerification[]>([]);
  verificationCode = signal('');
  verificationResult = signal<any>(null);
  loading = signal(false);
  selectedStatus = signal('all');
  searchTerm = signal('');
  showQRModal = signal(false);
  selectedDocument = signal<DocumentVerification | null>(null);

  constructor() {}

  ngOnInit(): void {
    this.loadVerificationRequests();
    this.filterRequests();
  }

  private loadVerificationRequests(): void {
    // Sample verification requests
    const requests: DocumentVerification[] = [
      {
        id: '1',
        studentName: 'Priya Singh',
        studentEmail: 'priya.singh@student.edu',
        rollNumber: 'CS2021001',
        documentType: 'marksheet',
        documentName: 'Semester 3 Marksheet',
        verificationCode: 'VER123ABC',
        qrCode: 'QR123ABC456',
        status: 'pending',
        submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        studentName: 'Rahul Kumar',
        studentEmail: 'rahul.kumar@student.edu',
        rollNumber: 'IT2020045',
        documentType: 'certificate',
        documentName: 'Degree Certificate',
        verificationCode: 'VER456DEF',
        qrCode: 'QR456DEF789',
        status: 'verified',
        submittedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        verifiedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        verifiedBy: 'Dr. Academic Officer',
        comments: 'Document verified successfully'
      },
      {
        id: '3',
        studentName: 'Anita Sharma',
        studentEmail: 'anita.sharma@student.edu',
        rollNumber: 'EC2022078',
        documentType: 'identity',
        documentName: 'Student ID Card',
        verificationCode: 'VER789GHI',
        qrCode: 'QR789GHI012',
        status: 'verified',
        submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        verifiedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        verifiedBy: 'Admin Officer',
        comments: 'Identity verified'
      }
    ];
    
    this.verificationRequests.set(requests);
  }

  filterRequests(): void {
    let filtered = this.verificationRequests();
    
    // Status filter
    if (this.selectedStatus() !== 'all') {
      filtered = filtered.filter(request => request.status === this.selectedStatus());
    }
    
    // Search filter
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(request => 
        request.studentName.toLowerCase().includes(search) ||
        request.rollNumber.toLowerCase().includes(search) ||
        request.documentName.toLowerCase().includes(search) ||
        request.verificationCode.toLowerCase().includes(search)
      );
    }
    
    this.filteredRequests.set(filtered);
  }

  onStatusChange(): void {
    this.filterRequests();
  }

  onSearchChange(): void {
    this.filterRequests();
  }

  verifyDocument(): void {
    if (!this.verificationCode().trim()) return;

    this.loading.set(true);
    
    setTimeout(() => {
      // Find document by verification code
      const document = this.verificationRequests().find(
        req => req.verificationCode.toLowerCase() === this.verificationCode().toLowerCase()
      );
      
      if (document) {
        this.verificationResult.set({
          isValid: true,
          document: document,
          studentName: document.studentName,
          documentName: document.documentName,
          status: document.status,
          verificationCode: document.verificationCode
        });
      } else {
        this.verificationResult.set({
          isValid: false,
          error: 'Invalid verification code or document not found'
        });
      }
      
      this.loading.set(false);
    }, 1000);
  }

  approveVerification(request: DocumentVerification): void {
    const updatedRequests = this.verificationRequests().map(r => 
      r.id === request.id 
        ? { 
            ...r, 
            status: 'verified' as const, 
            verifiedDate: new Date(), 
            verifiedBy: 'Institute Officer',
            comments: 'Document verified and approved'
          }
        : r
    );
    this.verificationRequests.set(updatedRequests);
    this.filterRequests();
    alert('Document verification approved successfully');
  }

  rejectVerification(request: DocumentVerification): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const updatedRequests = this.verificationRequests().map(r => 
        r.id === request.id 
          ? { 
              ...r, 
              status: 'rejected' as const, 
              verifiedDate: new Date(), 
              verifiedBy: 'Institute Officer',
              comments: reason
            }
          : r
      );
      this.verificationRequests.set(updatedRequests);
      this.filterRequests();
      alert('Document verification rejected');
    }
  }

  viewQRCode(request: DocumentVerification): void {
    this.selectedDocument.set(request);
    this.showQRModal.set(true);
  }

  closeQRModal(): void {
    this.showQRModal.set(false);
    this.selectedDocument.set(null);
  }

  resetVerification(): void {
    this.verificationCode.set('');
    this.verificationResult.set(null);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getDocumentTypeColor(type: string): string {
    switch (type) {
      case 'marksheet': return 'bg-blue-100 text-blue-800';
      case 'certificate': return 'bg-green-100 text-green-800';
      case 'identity': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }
}