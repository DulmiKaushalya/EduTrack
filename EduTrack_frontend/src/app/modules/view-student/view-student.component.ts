import { Component, OnInit } from '@angular/core';
import { StudentService, Student } from '../../services/student.service';
import { MatDialog } from '@angular/material/dialog';
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
    private studentService: StudentService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.studentService.getAll().subscribe({
      next: (res) => {
        this.dataSource = res;
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
          next: () => {
            this.snack.open('Student created', 'Close', { duration: 2000 });
            this.fetch();
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
    // Per requirement: delete when clicking delete button (no extra confirm required)
    this.studentService.delete(student._id).subscribe({
      next: () => {
        this.snack.open('Student deleted', 'Close', { duration: 2000 });
        this.fetch();
      },
      error: () => this.snack.open('Failed to delete', 'Close', { duration: 2000 })
    });
  }
}
