import { Injectable, signal } from '@angular/core';
import { Document, DocumentCategory, DocumentActivity } from '../models/document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private documents = signal<Document[]>([]);
  public documents$ = this.documents.asReadonly();

  private activities = signal<DocumentActivity[]>([]);
  public activities$ = this.activities.asReadonly();

  constructor() {
    // Load from localStorage
    this.loadDocuments();
    this.initializeSampleDocuments();
  }

  private initializeSampleDocuments(): void {
    // Add sample documents if none exist for demo purposes
    if (this.documents().length === 0) {
      const sampleDocs: Document[] = [
        {
          id: 'sample-doc-1',
          userId: '1', // Student user
          fileName: 'semester_3_marksheet.pdf',
          originalFileName: 'Semester 3 Marksheet',
          fileType: 'application/pdf',
          fileSize: 245760, // 240 KB
          category: 'marksheet',
          uploadDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
          status: 'verified',
          isEncrypted: true,
          verificationCode: 'VER123ABC',
          metadata: { uploadedBy: '1', version: 1 }
        },
        {
          id: 'sample-doc-2',
          userId: '1',
          fileName: 'degree_certificate.pdf',
          originalFileName: 'Degree Certificate',
          fileType: 'application/pdf',
          fileSize: 512000, // 500 KB
          category: 'certificate',
          uploadDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          status: 'verified',
          isEncrypted: true,
          verificationCode: 'VER456DEF',
          metadata: { uploadedBy: '1', version: 1 }
        },
        {
          id: 'sample-doc-3',
          userId: '1',
          fileName: 'aadhaar_card.pdf',
          originalFileName: 'Aadhaar Card',
          fileType: 'application/pdf',
          fileSize: 156000, // 152 KB
          category: 'identity',
          uploadDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'verified',
          isEncrypted: true,
          verificationCode: 'VER789GHI',
          metadata: { uploadedBy: '1', version: 1 }
        },
        {
          id: 'sample-doc-4',
          userId: '1',
          fileName: 'pan_card.pdf',
          originalFileName: 'PAN Card',
          fileType: 'application/pdf',
          fileSize: 89000, // 87 KB
          category: 'identity',
          uploadDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          lastModified: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
          status: 'verified',
          isEncrypted: true,
          verificationCode: 'VER012JKL',
          metadata: { uploadedBy: '1', version: 1 }
        }
      ];
      
      this.documents.set(sampleDocs);
      this.saveDocuments();
    }
  }

  private loadDocuments(): void {
    const saved = localStorage.getItem('documents');
    if (saved) {
      this.documents.set(JSON.parse(saved).map((doc: any) => ({
        ...doc,
        uploadDate: new Date(doc.uploadDate),
        lastModified: new Date(doc.lastModified)
      })));
    }
  }

  private saveDocuments(): void {
    localStorage.setItem('documents', JSON.stringify(this.documents()));
    localStorage.setItem('activities', JSON.stringify(this.activities()));
  }

  uploadDocument(file: File, category: DocumentCategory, userId: string): string {
    const docId = Date.now().toString();
    const newDocument: Document = {
      id: docId,
      userId,
      fileName: `${docId}_${file.name}`,
      originalFileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      category,
      uploadDate: new Date(),
      lastModified: new Date(),
      status: 'pending',
      isEncrypted: true,
      verificationCode: this.generateVerificationCode(),
      metadata: {
        uploadedBy: userId,
        version: 1
      }
    };

    this.documents.update(docs => [...docs, newDocument]);
    
    // Log activity
    this.logActivity({
      id: Date.now().toString(),
      documentId: docId,
      userId,
      action: 'upload',
      timestamp: new Date(),
      details: { fileName: file.name }
    });

    this.saveDocuments();
    return docId;
  }

  getDocumentsByUser(userId: string): Document[] {
    return this.documents().filter(doc => doc.userId === userId);
  }

  getDocumentById(id: string): Document | undefined {
    return this.documents().find(doc => doc.id === id);
  }

  deleteDocument(id: string, userId: string): void {
    this.documents.update(docs => docs.filter(doc => doc.id !== id));
    
    this.logActivity({
      id: Date.now().toString(),
      documentId: id,
      userId,
      action: 'delete',
      timestamp: new Date()
    });

    this.saveDocuments();
  }

  updateDocument(id: string, updates: Partial<Document>): void {
    this.documents.update(docs => 
      docs.map(doc => 
        doc.id === id ? { ...doc, ...updates, lastModified: new Date() } : doc
      )
    );
    this.saveDocuments();
  }

  getDocumentsByCategory(userId: string, category: DocumentCategory): Document[] {
    return this.documents().filter(
      doc => doc.userId === userId && doc.category === category
    );
  }

  getDocumentStats(userId: string) {
    const userDocs = this.getDocumentsByUser(userId);
    return {
      total: userDocs.length,
      byCategory: this.groupBy(userDocs, 'category'),
      byStatus: this.groupBy(userDocs, 'status'),
      totalSize: userDocs.reduce((sum, doc) => sum + doc.fileSize, 0)
    };
  }

  private groupBy(array: any[], key: string) {
    return array.reduce((result, item) => {
      const value = item[key];
      result[value] = (result[value] || 0) + 1;
      return result;
    }, {});
  }

  generateVerificationCode(): string {
    return Math.random().toString(36).substring(2, 15).toUpperCase();
  }

  generateQRCode(documentId: string): string {
    return `https://digilocker.com/verify/${documentId}`;
  }

  private logActivity(activity: DocumentActivity): void {
    this.activities.update(activities => [...activities, activity]);
    // Keep only last 100 activities
    if (this.activities().length > 100) {
      this.activities.update(activities => activities.slice(-100));
    }
  }

  getActivityByDocument(documentId: string): DocumentActivity[] {
    return this.activities().filter(activity => activity.documentId === documentId);
  }
}

