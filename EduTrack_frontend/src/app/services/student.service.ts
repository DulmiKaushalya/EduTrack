import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

export interface Student {
  _id?: string;
  name: string;
  email: string;
  age?: number | null;
  course?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  private getAuthHeaders() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getAll(){
    return this.http.get<Student[]>("http://localhost:3000/students", this.getAuthHeaders());
  }

  create(student: Student){
    return this.http.post<Student>("http://localhost:3000/students", student, this.getAuthHeaders());
  }

  getById(id: string) {
    return this.http.get<Student>(`http://localhost:3000/students/${id}`, this.getAuthHeaders());
  }

  update(id: string, student: Student){
    return this.http.put<Student>(`http://localhost:3000/students/${id}`, student, this.getAuthHeaders());
  }

  delete(id: string) {
    return this.http.delete(`http://localhost:3000/students/${id}`, { ...this.getAuthHeaders(), observe: 'response' });
  }
}

