import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
   constructor(private http: HttpClient) {}

  getAll(){
    return this.http.get<Student[]>("http://localhost:3000/students");
  }

  create(student: Student){
    return this.http.post<Student>("http://localhost:3000/students",student);
  }
getById(id: string) {
        return this.http.get<Student>(`http://localhost:3000/students/${id}`);
    }

  update(id: string, student: Student){
    return this.http.put<Student>(`http://localhost:3000/students/${id}`, student);
  }

  delete(id: string) {
    return this.http.delete(`http://localhost:3000/students/${id}`, { observe: 'response' });
  }
}

