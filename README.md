# DigiLocker - Digital Document Management System

A comprehensive digital document management system built with Angular, TypeScript, and Tailwind CSS. DigiLocker provides secure document management for students and educational institutions.

## 🚀 Features

### Authentication & Security
- **Dual User System**: Separate portals for students and institutes
- **Role-based Authentication**: Secure login with email/password
- **Session Management**: Persistent login sessions
- **Digital Signatures**: Cryptographic document signing
- **Audit Trail**: Complete activity logging

### Document Management
- **Upload Documents**: Drag-and-drop file upload with progress tracking
- **Multiple File Types**: Support for PDF, PNG, JPG, JPEG
- **Document Categories**: Personal, Educational, Identity, Certificates, Marksheets
- **Secure Storage**: Encrypted document storage
- **Document Organization**: Categorize and search documents
- **Download & Delete**: Secure document operations

### Sharing & Consent
- **Secure Sharing**: Generate time-limited share links
- **Consent Requests**: Institutes can request document access
- **Multi-factor Verification**: SMS, Email verification methods
- **Share Code Generation**: Unique codes for document sharing

### Verification
- **QR Code Generation**: Each document gets a unique QR code
- **Verification Codes**: Unique verification codes
- **Document Authenticity Check**: Real-time verification
- **Blockchain-ready**: Architecture supports blockchain integration

### User Interface
- **Modern Design**: Clean, intuitive interface
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Interactive Elements**: Drag & drop, smooth animations
- **Dashboard Analytics**: Statistics and reporting

## 📋 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd my-dl-app
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:4200`

## 🎮 Demo Credentials

### Student Login
- Email: `student@example.com`
- Password: Any password
- Role: Student

### Institute Login
- Email: `institute@example.com`
- Password: Any password
- Role: Institute

## 📁 Project Structure

```
src/
├── app/
│   ├── guards/              # Route guards
│   ├── layouts/             # Layout components
│   │   └── dashboard/       # Dashboard layout
│   ├── models/             # TypeScript models
│   ├── pages/              # Page components
│   │   ├── login/         # Login page
│   │   └── documents/     # Documents page
│   └── services/           # Service layer
│       ├── auth.service.ts
│       ├── document.service.ts
│       ├── sharing.service.ts
│       └── verification.service.ts
├── styles.scss             # Global styles with Tailwind
└── main.ts                # Application entry point
```

## 🛠️ Tech Stack

- **Angular 20**: Latest Angular framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Angular Signals**: Modern reactive state management
- **LocalStorage**: Client-side persistence

## 🎯 Key Components

### Services
- `AuthService`: User authentication and session management
- `DocumentService`: Document CRUD operations
- `SharingService`: Document sharing and consent management
- `VerificationService`: QR codes and verification

### Guards
- `AuthGuard`: Protects authenticated routes
- `LoginGuard`: Redirects authenticated users from login

## 📊 Features in Detail

### For Students
- Personal document management
- Document upload with progress tracking
- Document categorization
- Secure sharing with time-limited links
- Consent request management
- Activity monitoring

### For Institutes
- Student document management
- Document verification
- Request document access
- Bulk operations
- Analytics and reporting

## 🔒 Security Features

- Encrypted document storage
- Digital signatures
- Access control
- Audit trail
- Secure transmission
- Role-based permissions

## 🚧 Future Enhancements

- AI-powered document classification
- Blockchain integration
- Mobile app (PWA)
- Advanced analytics
- Real-time notifications
- Multi-language support
- OCR integration
- Cloud storage integration

## 📝 Development Commands

```bash
# Development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Watch mode
npm run watch
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

Developed with ❤️ for secure digital document management.
