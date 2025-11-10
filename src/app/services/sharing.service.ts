import { Injectable, signal } from '@angular/core';
import { Document, SharedDocument, ConsentRequest } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class SharingService {
  private sharedDocuments = signal<SharedDocument[]>([]);
  private consentRequests = signal<ConsentRequest[]>([]);

  constructor() {
    this.loadFromStorage();
    this.initializeSampleData();
  }

  private initializeSampleData(): void {
    // Add sample consent requests if none exist
    if (this.consentRequests().length === 0) {
      const sampleRequests: ConsentRequest[] = [
        {
          requestId: '1',
          documentId: 'sample-doc-1',
          requestedBy: 'hr@company.com',
          requestedByName: 'ABC Company HR',
          requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          status: 'pending',
          expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
        },
        {
          requestId: '2',
          documentId: 'sample-doc-2',
          requestedBy: 'admissions@university.edu',
          requestedByName: 'University Admissions',
          requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
          status: 'approved',
          expiresAt: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
          responseAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        }
      ];
      
      this.consentRequests.set(sampleRequests);
      this.saveToStorage();
    }
  }

  private loadFromStorage(): void {
    const saved = localStorage.getItem('sharedDocuments');
    if (saved) {
      this.sharedDocuments.set(JSON.parse(saved).map((doc: any) => ({
        ...doc,
        createdAt: new Date(doc.createdAt),
        expiresAt: new Date(doc.expiresAt)
      })));
    }

    const savedConsents = localStorage.getItem('consentRequests');
    if (savedConsents) {
      this.consentRequests.set(JSON.parse(savedConsents).map((req: any) => ({
        ...req,
        requestedAt: new Date(req.requestedAt),
        expiresAt: new Date(req.expiresAt),
        responseAt: req.responseAt ? new Date(req.responseAt) : undefined
      })));
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('sharedDocuments', JSON.stringify(this.sharedDocuments()));
    localStorage.setItem('consentRequests', JSON.stringify(this.consentRequests()));
  }

  shareDocument(documentId: string, userId: string, expiresInDays: number = 7): SharedDocument {
    const shareCode = this.generateShareCode();
    const sharedDoc: SharedDocument = {
      shareId: Date.now().toString(),
      documentId,
      sharedWith: userId,
      shareCode,
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      accessCount: 0,
      isActive: true
    };

    this.sharedDocuments.update(docs => [...docs, sharedDoc]);
    this.saveToStorage();
    return sharedDoc;
  }

  generateShareCode(): string {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  getSharedDocumentByCode(code: string): SharedDocument | undefined {
    return this.sharedDocuments().find(
      doc => doc.shareCode === code && doc.isActive && new Date(doc.expiresAt) > new Date()
    );
  }

  revokeShare(shareId: string): void {
    this.sharedDocuments.update(docs =>
      docs.map(doc =>
        doc.shareId === shareId ? { ...doc, isActive: false } : doc
      )
    );
    this.saveToStorage();
  }

  incrementAccessCount(shareId: string): void {
    this.sharedDocuments.update(docs =>
      docs.map(doc =>
        doc.shareId === shareId ? { ...doc, accessCount: doc.accessCount + 1 } : doc
      )
    );
    this.saveToStorage();
  }

  // Consent Management
  requestConsent(
    documentId: string,
    requestedBy: string,
    requestedByName: string,
    expiresInDays: number = 7
  ): string {
    const requestId = Date.now().toString();
    const request: ConsentRequest = {
      requestId,
      documentId,
      requestedBy,
      requestedByName,
      requestedAt: new Date(),
      status: 'pending',
      expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
    };

    this.consentRequests.update(requests => [...requests, request]);
    this.saveToStorage();
    return requestId;
  }

  getConsentRequestsForUser(userId: string): ConsentRequest[] {
    // In real implementation, this would be filtered by document ownership
    return this.consentRequests().filter(req => req.status === 'pending');
  }

  respondToConsentRequest(requestId: string, status: 'approved' | 'rejected'): void {
    this.consentRequests.update(requests =>
      requests.map(req =>
        req.requestId === requestId
          ? { ...req, status, responseAt: new Date() }
          : req
      )
    );
    this.saveToStorage();
  }

  getConsentRequestsByDocument(documentId: string): ConsentRequest[] {
    return this.consentRequests().filter(req => req.documentId === documentId);
  }
}

