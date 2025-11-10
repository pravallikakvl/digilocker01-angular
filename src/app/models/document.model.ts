export interface Document {
  id: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  fileType: string;
  fileSize: number;
  category: DocumentCategory;
  uploadDate: Date;
  lastModified: Date;
  status: DocumentStatus;
  isEncrypted: boolean;
  verificationCode?: string;
  qrCode?: string;
  digitalSignature?: string;
  tags?: string[];
  metadata?: Record<string, any>;
  sharedWith?: SharedDocument[];
  consentRequests?: ConsentRequest[];
}

export type DocumentCategory = 
  | 'personal' 
  | 'education' 
  | 'identity' 
  | 'certificate' 
  | 'marksheet' 
  | 'other';

export type DocumentStatus = 
  | 'pending' 
  | 'verified' 
  | 'expired' 
  | 'rejected';

export interface SharedDocument {
  shareId: string;
  documentId: string;
  sharedWith: string;
  shareCode: string;
  expiresAt: Date;
  createdAt: Date;
  accessCount: number;
  isActive: boolean;
}

export interface ConsentRequest {
  requestId: string;
  documentId: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  expiresAt: Date;
  responseAt?: Date;
}

export interface DocumentActivity {
  id: string;
  documentId: string;
  userId: string;
  action: 'upload' | 'download' | 'share' | 'delete' | 'view' | 'verify';
  timestamp: Date;
  details?: Record<string, any>;
}

