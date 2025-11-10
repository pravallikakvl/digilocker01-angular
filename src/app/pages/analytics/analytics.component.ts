import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentService } from '../../services/document.service';
import { SharingService } from '../../services/sharing.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  stats = signal<any>({});
  chartData = signal<any>({});
  recentActivity = signal<any[]>([]);

  constructor(
    private documentService: DocumentService,
    private sharingService: SharingService,
    private authService: AuthService
  ) {}

  categoryKeys = signal<string[]>([]);

  ngOnInit(): void {
    this.loadAnalytics();
  }

  private loadAnalytics(): void {
    const user = this.authService.getCurrentUser();
    if (!user) return;

    const documents = this.documentService.getDocumentsByUser(user.id);
    const stats = this.documentService.getDocumentStats(user.id);
    
    this.stats.set({
      totalDocuments: documents.length,
      verifiedDocuments: documents.filter(d => d.status === 'verified').length,
      pendingDocuments: documents.filter(d => d.status === 'pending').length,
      totalSize: this.formatFileSize(stats.totalSize),
      categoriesCount: Object.keys(stats.byCategory).length,
      monthlyUploads: this.getMonthlyUploads(documents),
      storageUsed: ((stats.totalSize / (100 * 1024 * 1024)) * 100).toFixed(1) // Assuming 100MB limit
    });

    this.chartData.set({
      categories: stats.byCategory,
      statusDistribution: stats.byStatus,
      monthlyTrend: this.getMonthlyTrend(documents)
    });

    this.categoryKeys.set(Object.keys(stats.byCategory || {}));

    this.recentActivity.set([
      { action: 'Document Uploaded', item: 'Degree Certificate', time: '2 hours ago', type: 'upload' },
      { action: 'Document Shared', item: 'Marksheet', time: '1 day ago', type: 'share' },
      { action: 'Consent Approved', item: 'Aadhaar Card', time: '2 days ago', type: 'consent' },
      { action: 'Document Verified', item: 'PAN Card', time: '3 days ago', type: 'verify' }
    ]);
  }

  private getMonthlyUploads(documents: any[]): number {
    const thisMonth = new Date().getMonth();
    return documents.filter(doc => new Date(doc.uploadDate).getMonth() === thisMonth).length;
  }

  private getMonthlyTrend(documents: any[]): any[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    
    return months.slice(Math.max(0, currentMonth - 5), currentMonth + 1).map((month, index) => ({
      month,
      uploads: Math.floor(Math.random() * 5) + 1 // Mock data
    }));
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  getActivityIcon(type: string): string {
    switch (type) {
      case 'upload': return 'M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12';
      case 'share': return 'M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z';
      case 'consent': return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0113 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
      case 'verify': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      default: return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
    }
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'upload': return 'text-blue-600';
      case 'share': return 'text-purple-600';
      case 'consent': return 'text-orange-600';
      case 'verify': return 'text-green-600';
      default: return 'text-gray-600';
    }
  }

  getActivityBgColor(type: string): string {
    switch (type) {
      case 'upload': return 'bg-blue-100';
      case 'share': return 'bg-purple-100';
      case 'consent': return 'bg-orange-100';
      case 'verify': return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  }

  getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      personal: 'bg-blue-500',
      education: 'bg-green-500',
      identity: 'bg-purple-500',
      certificate: 'bg-yellow-500',
      marksheet: 'bg-pink-500',
      other: 'bg-gray-500'
    };
    return colors[category] || colors['other'];
  }
}