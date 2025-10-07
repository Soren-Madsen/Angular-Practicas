import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Person, ApiResponse } from '../models/person.model';

@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'http://localhost:8080/en/api';

  constructor(private http: HttpClient) {}

  // Obtener listado de personas
  getPeople(): Observable<Person[]> {
    return this.http.get<ApiResponse>(`${this.apiUrl}/listado`).pipe(
      map(response => response.data.people)
    );
  }

  // Crear nueva persona
  createPerson(person: Person): Observable<Person> {
    return this.http.post<any>(`${this.apiUrl}/create`, person).pipe(
      map(response => response.data)
    );
  }

  // Actualizar persona
  updatePerson(id: number, person: Person): Observable<Person> {
    return this.http.put<any>(`${this.apiUrl}/update/${id}`, person).pipe(
      map(response => response.data)
    );
  }

  // Eliminar persona
  deletePerson(id: number): Observable<void> {
    return this.http.delete<any>(`${this.apiUrl}/delete/${id}`).pipe(
      map(() => void 0)
    );
  }
}