import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transfer';
  isRead: boolean;
  timestamp: Date;
  actionRequired?: boolean;
  actionUrl?: string;
  relatedUser?: string;
  relatedDocument?: string;
}

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
  notifications = signal<Notification[]>([]);
  filteredNotifications = signal<Notification[]>([]);
  selectedType = signal('all');
  showUnreadOnly = signal(false);

  constructor() {}

  ngOnInit(): void {
    this.loadNotifications();
    this.filterNotifications();
  }

  private loadNotifications(): void {
    // Sample notifications
    const sampleNotifications: Notification[] = [
      {
        id: '1',
        title: 'Transfer Request Received',
        message: 'A new transfer request has been submitted by Priya Singh for Computer Science program.',
        type: 'transfer',
        isRead: false,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
        actionRequired: true,
        actionUrl: '/dashboard/transfers',
        relatedUser: 'Priya Singh',
        relatedDocument: 'Transfer Request'
      },
      {
        id: '2',
        title: 'Document Verification Completed',
        message: 'Degree certificate for Rahul Kumar has been successfully verified.',
        type: 'success',
        isRead: false,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
        relatedUser: 'Rahul Kumar',
        relatedDocument: 'Degree Certificate'
      },
      {
        id: '3',
        title: 'New Student Registration',
        message: 'Anita Sharma has completed registration for Electronics Engineering program.',
        type: 'info',
        isRead: true,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
        relatedUser: 'Anita Sharma'
      },
      {
        id: '4',
        title: 'Document Verification Pending',
        message: 'Multiple documents are pending verification. Please review and approve.',
        type: 'warning',
        isRead: false,
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
        actionRequired: true,
        actionUrl: '/dashboard/verification'
      },
      {
        id: '5',
        title: 'System Maintenance Scheduled',
        message: 'DigiLocker system will undergo maintenance on Sunday, 2:00 AM - 4:00 AM.',
        type: 'info',
        isRead: true,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        id: '6',
        title: 'Transfer Request Approved',
        message: 'Transfer request for Vikash Patel to Mumbai Institute has been approved.',
        type: 'success',
        isRead: true,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        relatedUser: 'Vikash Patel',
        relatedDocument: 'Transfer Request'
      },
      {
        id: '7',
        title: 'Document Upload Failed',
        message: 'Failed to upload marksheet for Sneha Gupta. Please try again.',
        type: 'error',
        isRead: true,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        relatedUser: 'Sneha Gupta',
        relatedDocument: 'Marksheet'
      }
    ];
    
    this.notifications.set(sampleNotifications);
  }

  filterNotifications(): void {
    let filtered = this.notifications();
    
    // Type filter
    if (this.selectedType() !== 'all') {
      filtered = filtered.filter(notification => notification.type === this.selectedType());
    }
    
    // Unread filter
    if (this.showUnreadOnly()) {
      filtered = filtered.filter(notification => !notification.isRead);
    }
    
    // Sort by timestamp (newest first)
    filtered = filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    this.filteredNotifications.set(filtered);
  }

  onTypeChange(): void {
    this.filterNotifications();
  }

  onUnreadToggle(): void {
    this.filterNotifications();
  }

  markAsRead(notification: Notification): void {
    const updatedNotifications = this.notifications().map(n => 
      n.id === notification.id ? { ...n, isRead: true } : n
    );
    this.notifications.set(updatedNotifications);
    this.filterNotifications();
  }

  markAllAsRead(): void {
    const updatedNotifications = this.notifications().map(n => ({ ...n, isRead: true }));
    this.notifications.set(updatedNotifications);
    this.filterNotifications();
  }

  deleteNotification(notification: Notification): void {
    const updatedNotifications = this.notifications().filter(n => n.id !== notification.id);
    this.notifications.set(updatedNotifications);
    this.filterNotifications();
  }

  getUnreadCount(): number {
    return this.notifications().filter(n => !n.isRead).length;
  }

  formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'info': return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'success': return 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'warning': return 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'error': return 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z';
      case 'transfer': return 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4';
      default: return 'M15 17h5l-1.405-1.405A2.032 2.032 0 0113 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9';
    }
  }

  getNotificationColor(type: string): string {
    switch (type) {
      case 'info': return 'text-blue-600';
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'transfer': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  }

  getNotificationBgColor(type: string): string {
    switch (type) {
      case 'info': return 'bg-blue-100';
      case 'success': return 'bg-green-100';
      case 'warning': return 'bg-yellow-100';
      case 'error': return 'bg-red-100';
      case 'transfer': return 'bg-purple-100';
      default: return 'bg-gray-100';
    }
  }
}