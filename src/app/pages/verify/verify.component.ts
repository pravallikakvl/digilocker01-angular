import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../../services/document.service';
import { VerificationService } from '../../services/verification.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss']
})
export class VerifyComponent {
  verificationCode = signal('');
  verificationResult = signal<any>(null);
  loading = signal(false);
  myDocuments = signal<any[]>([]);
  showSMSTest = signal(false);
  smsCode = signal('');

  constructor(
    private documentService: DocumentService,
    private verificationService: VerificationService,
    private authService: AuthService
  ) {
    this.loadMyDocuments();
  }

  private loadMyDocuments(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      const docs = this.documentService.getDocumentsByUser(user.id);
      this.myDocuments.set(docs.map(doc => ({
        ...doc,
        qrCode: this.generateQRCodeData(doc.id)
      })));
    }
  }

  verifyDocument(): void {
    if (!this.verificationCode().trim()) return;

    this.loading.set(true);
    
    setTimeout(() => {
      const isValid = this.verificationService.verifyDocument('', this.verificationCode());
      
      if (isValid) {
        this.verificationResult.set({
          isValid: true,
          documentName: 'Sample Document',
          issuer: 'Demo University',
          issueDate: new Date(),
          status: 'Verified'
        });
      } else {
        this.verificationResult.set({
          isValid: false,
          error: 'Invalid verification code'
        });
      }
      
      this.loading.set(false);
    }, 1000);
  }

  generateQRCodeData(documentId: string): string {
    return `VERIFY:${documentId}:${Math.random().toString(36).substring(7).toUpperCase()}`;
  }

  sendSMSCode(): void {
    this.showSMSTest.set(true);
    // Simulate SMS sending
    setTimeout(() => {
      alert('SMS verification code sent to your registered mobile number');
    }, 500);
  }

  verifySMSCode(): void {
    if (this.smsCode() === '123456') {
      alert('SMS verification successful!');
      this.showSMSTest.set(false);
      this.smsCode.set('');
    } else {
      alert('Invalid SMS code. Try 123456 for demo.');
    }
  }

  resetVerification(): void {
    this.verificationCode.set('');
    this.verificationResult.set(null);
  }
}