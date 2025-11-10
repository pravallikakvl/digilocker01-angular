export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'institute';
  mobileNumber?: string;
  dateOfBirth?: Date;
  gender?: string;
  studentId?: string;
  userId?: string;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
  fullName?: string;
}

export interface Student extends User {
  role: 'student';
  studentId?: string;
  phone?: string;
  address?: string;
}

export interface Institute extends User {
  role: 'institute';
  instituteName: string;
  registrationNumber: string;
  address: string;
  contactPerson: string;
  phone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role: 'student' | 'institute';
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'institute';
  mobileNumber: string;
  dateOfBirth?: Date;
  gender: string;
  studentId?: string;
  userId?: string;
}

