import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { StudentService, Student } from '../../services/student.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
// Simple confirmation dialog component
import { Component as NgComponent } from '@angular/core';

@NgComponent({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Confirm Delete</h2>
    <mat-dialog-content>Are you sure you want to delete this student?</mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>No</button>
      <button mat-button color="warn" mat-dialog-close="true">Yes</button>
    </mat-dialog-actions>
  `
})
export class ConfirmDeleteDialog {}
import { CreateStudentComponent } from '../create-student/create-student.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-view-student',
  templateUrl: './view-student.component.html',
  styleUrls: ['./view-student.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule
  ]
})
export class ViewStudentComponent implements OnInit {
  displayedColumns = ['name', 'email', 'age', 'course', 'actions'];
  dataSource: Student[] = [];
  loading = false;

  constructor( 
    private studentService: StudentService, //call backend API.
    private dialog: MatDialog,//Opens popups.
    private snack: MatSnackBar, //toast messages.
    private authService: AuthService, 
    private router: Router
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (res) => {
        // Sort by createdAt descending (newest first)
        this.dataSource = res.sort((a, b) => {
          // If createdAt is missing, treat as oldest
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return dateB - dateA;
        });
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.snack.open('Failed to load students', 'Close', { duration: 3000 });
      }
    });
  }

  openCreate() {
    const ref = this.dialog.open(CreateStudentComponent, {
      width: '420px',
      data: { mode: 'create' }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.create(result).subscribe({
          next: (createdStudent) => {
            this.snack.open('Student created', 'Close', { duration: 2000 });
            // Add new student to top of table
            this.dataSource = [createdStudent, ...this.dataSource];
          },
          error: () => this.snack.open('Failed to create', 'Close', { duration: 2000 })
        });
      }
    });
  }

  openEdit(student: Student) {
    const ref = this.dialog.open(CreateStudentComponent, {
      width: '420px',
      data: { mode: 'edit', student }
    });

    ref.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.update(student._id!, result).subscribe({
          next: () => {
            this.snack.open('Student updated', 'Close', { duration: 2000 });
            this.fetch();
          },
          error: () => this.snack.open('Failed to update', 'Close', { duration: 2000 })
        });
      }
    });
  }

  deleteStudent(student: Student) {
    if (!student._id) return;
    const dialogRef = this.dialog.open(ConfirmDeleteDialog, {
      width: '320px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result && student._id) {
        this.studentService.delete(student._id as string).subscribe({
          next: () => {
            this.snack.open('Student deleted', 'Close', { duration: 2000 });
            this.fetch();
          },
          error: () => this.snack.open('Failed to delete', 'Close', { duration: 2000 })
        });
      }
    });
  }
}
