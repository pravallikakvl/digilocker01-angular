import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface TransferRequest {
  id: string;
  studentName: string;
  studentEmail: string;
  rollNumber: string;
  fromInstitute: string;
  toInstitute: string;
  course: string;
  year: string;
  reason: string;
  documents: string[];
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  requestDate: Date;
  responseDate?: Date;
  comments?: string;
}

@Component({
  selector: 'app-transfers',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.scss']
})
export class TransfersComponent implements OnInit {
  transferRequests = signal<TransferRequest[]>([]);
  filteredRequests = signal<TransferRequest[]>([]);
  selectedStatus = signal('all');
  searchTerm = signal('');
  showDetailsModal = signal(false);
  selectedRequest = signal<TransferRequest | null>(null);
  
  // For outgoing requests
  outgoingRequests = signal<TransferRequest[]>([]);
  
  constructor() {}

  ngOnInit(): void {
    this.loadTransferRequests();
    this.filterRequests();
  }

  private loadTransferRequests(): void {
    // Sample incoming transfer requests
    const incomingRequests: TransferRequest[] = [
      {
        id: '1',
        studentName: 'Priya Singh',
        studentEmail: 'priya.singh@student.edu',
        rollNumber: 'CS2021001',
        fromInstitute: 'ABC College of Engineering',
        toInstitute: 'Delhi University',
        course: 'Computer Science',
        year: '3rd Year',
        reason: 'Family relocation to Delhi',
        documents: ['Transfer Certificate', 'Academic Transcript', 'Character Certificate'],
        status: 'pending',
        requestDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: '2',
        studentName: 'Rahul Kumar',
        studentEmail: 'rahul.kumar@student.edu',
        rollNumber: 'IT2020045',
        fromInstitute: 'XYZ Institute of Technology',
        toInstitute: 'Delhi University',
        course: 'Information Technology',
        year: '4th Year',
        reason: 'Better academic opportunities',
        documents: ['Transfer Certificate', 'Academic Transcript', 'Migration Certificate'],
        status: 'approved',
        requestDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        responseDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        comments: 'All documents verified. Transfer approved.'
      }
    ];

    // Sample outgoing transfer requests
    const outgoingRequests: TransferRequest[] = [
      {
        id: '3',
        studentName: 'Anita Sharma',
        studentEmail: 'anita.sharma@student.edu',
        rollNumber: 'EC2022078',
        fromInstitute: 'Delhi University',
        toInstitute: 'Mumbai Institute of Technology',
        course: 'Electronics',
        year: '2nd Year',
        reason: 'Job opportunity for parents',
        documents: ['Transfer Certificate', 'Academic Transcript'],
        status: 'completed',
        requestDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        responseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        comments: 'Transfer completed successfully'
      }
    ];
    
    this.transferRequests.set(incomingRequests);
    this.outgoingRequests.set(outgoingRequests);
  }

  filterRequests(): void {
    let filtered = this.transferRequests();
    
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
        request.fromInstitute.toLowerCase().includes(search)
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

  viewDetails(request: TransferRequest): void {
    this.selectedRequest.set(request);
    this.showDetailsModal.set(true);
  }

  approveRequest(request: TransferRequest): void {
    const updatedRequests = this.transferRequests().map(r => 
      r.id === request.id 
        ? { ...r, status: 'approved' as const, responseDate: new Date(), comments: 'Transfer request approved' }
        : r
    );
    this.transferRequests.set(updatedRequests);
    this.filterRequests();
    alert('Transfer request approved successfully');
  }

  rejectRequest(request: TransferRequest): void {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      const updatedRequests = this.transferRequests().map(r => 
        r.id === request.id 
          ? { ...r, status: 'rejected' as const, responseDate: new Date(), comments: reason }
          : r
      );
      this.transferRequests.set(updatedRequests);
      this.filterRequests();
      alert('Transfer request rejected');
    }
  }

  closeModal(): void {
    this.showDetailsModal.set(false);
    this.selectedRequest.set(null);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'pending': return 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'approved': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'rejected': return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'completed': return 'M5 13l4 4L19 7';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }
}