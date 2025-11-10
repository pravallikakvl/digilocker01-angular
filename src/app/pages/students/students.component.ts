import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

interface Student {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  course: string;
  year: string;
  phone: string;
  address: string;
  documentsCount: number;
  status: 'active' | 'inactive';
  joinDate: Date;
}

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.scss']
})
export class StudentsComponent implements OnInit {
  students = signal<Student[]>([]);
  filteredStudents = signal<Student[]>([]);
  searchTerm = signal('');
  selectedCourse = signal('all');
  selectedYear = signal('all');
  showAddModal = signal(false);
  showProfileModal = signal(false);
  selectedStudent = signal<Student | null>(null);
  
  newStudent: Partial<Student> = {
    name: '',
    email: '',
    rollNumber: '',
    course: '',
    year: '',
    phone: '',
    address: ''
  };

  courses = ['Computer Science', 'Information Technology', 'Electronics', 'Mechanical', 'Civil'];
  years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loadStudents();
    this.filterStudents();
  }

  private loadStudents(): void {
    // Sample student data
    const sampleStudents: Student[] = [
      {
        id: '1',
        name: 'Priya Singh',
        email: 'priya.singh@student.edu',
        rollNumber: 'CS2021001',
        course: 'Computer Science',
        year: '3rd Year',
        phone: '+91 9876543210',
        address: '123 University Road, Delhi',
        documentsCount: 8,
        status: 'active',
        joinDate: new Date('2021-08-15')
      },
      {
        id: '2',
        name: 'Rahul Kumar',
        email: 'rahul.kumar@student.edu',
        rollNumber: 'IT2020045',
        course: 'Information Technology',
        year: '4th Year',
        phone: '+91 9876543211',
        address: '456 College Street, Delhi',
        documentsCount: 12,
        status: 'active',
        joinDate: new Date('2020-08-15')
      },
      {
        id: '3',
        name: 'Anita Sharma',
        email: 'anita.sharma@student.edu',
        rollNumber: 'EC2022078',
        course: 'Electronics',
        year: '2nd Year',
        phone: '+91 9876543212',
        address: '789 Campus Avenue, Delhi',
        documentsCount: 5,
        status: 'active',
        joinDate: new Date('2022-08-15')
      },
      {
        id: '4',
        name: 'Vikash Patel',
        email: 'vikash.patel@student.edu',
        rollNumber: 'ME2021089',
        course: 'Mechanical',
        year: '3rd Year',
        phone: '+91 9876543213',
        address: '321 Student Colony, Delhi',
        documentsCount: 7,
        status: 'inactive',
        joinDate: new Date('2021-08-15')
      },
      {
        id: '5',
        name: 'Sneha Gupta',
        email: 'sneha.gupta@student.edu',
        rollNumber: 'CV2023012',
        course: 'Civil',
        year: '1st Year',
        phone: '+91 9876543214',
        address: '654 Hostel Block A, Delhi',
        documentsCount: 3,
        status: 'active',
        joinDate: new Date('2023-08-15')
      }
    ];
    
    this.students.set(sampleStudents);
  }

  filterStudents(): void {
    let filtered = this.students();
    
    // Search filter
    if (this.searchTerm()) {
      const search = this.searchTerm().toLowerCase();
      filtered = filtered.filter(student => 
        student.name.toLowerCase().includes(search) ||
        student.email.toLowerCase().includes(search) ||
        student.rollNumber.toLowerCase().includes(search)
      );
    }
    
    // Course filter
    if (this.selectedCourse() !== 'all') {
      filtered = filtered.filter(student => student.course === this.selectedCourse());
    }
    
    // Year filter
    if (this.selectedYear() !== 'all') {
      filtered = filtered.filter(student => student.year === this.selectedYear());
    }
    
    this.filteredStudents.set(filtered);
  }

  onSearchChange(): void {
    this.filterStudents();
  }

  onCourseChange(): void {
    this.filterStudents();
  }

  onYearChange(): void {
    this.filterStudents();
  }

  viewProfile(student: Student): void {
    this.selectedStudent.set(student);
    this.showProfileModal.set(true);
  }

  editProfile(): void {
    // Implementation for editing student profile
    alert('Edit profile functionality would be implemented here');
  }

  addStudent(): void {
    if (!this.newStudent.name || !this.newStudent.email || !this.newStudent.rollNumber) {
      alert('Please fill in all required fields');
      return;
    }

    const student: Student = {
      id: Date.now().toString(),
      name: this.newStudent.name!,
      email: this.newStudent.email!,
      rollNumber: this.newStudent.rollNumber!,
      course: this.newStudent.course!,
      year: this.newStudent.year!,
      phone: this.newStudent.phone!,
      address: this.newStudent.address!,
      documentsCount: 0,
      status: 'active',
      joinDate: new Date()
    };

    this.students.update(students => [...students, student]);
    this.filterStudents();
    this.closeAddModal();
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
    this.newStudent = {
      name: '',
      email: '',
      rollNumber: '',
      course: '',
      year: '',
      phone: '',
      address: ''
    };
  }

  closeProfileModal(): void {
    this.showProfileModal.set(false);
    this.selectedStudent.set(null);
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  }

  getStatusColor(status: string): string {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  }
}