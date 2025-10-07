import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PersonService } from './services/person.service';
import { Person } from './models/person.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gestión de Personas';
  people: Person[] = [];
  personForm: FormGroup;
  editingPerson: Person | null = null;
  showForm = false;
  loading = false;
  error: string | null = null;

  workOptions = [
    { value: 'desarrollador', label: 'Desarrollador' },
    { value: 'profesor', label: 'Profesor' },
    { value: 'diseñador', label: 'Diseñador' },
    { value: 'otro', label: 'Otro' }
  ];

  constructor(
    private personService: PersonService,
    private fb: FormBuilder
  ) {
    this.personForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      work: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      acceptsCommercial: [false]
    });
  }

  ngOnInit() {
    this.loadPeople();
  }

  loadPeople() {
    this.loading = true;
    this.error = null;
    
    this.personService.getPeople().subscribe({
      next: (people) => {
        this.people = people;
        this.loading = false;
        console.log('People loaded:', people);
      },
      error: (error) => {
        console.error('Error loading people:', error);
        this.error = 'Error al cargar las personas';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.personForm.valid) {
      const personData: Person = {
        ...this.personForm.value,
        age: this.calculateAge(this.personForm.value.birthDate),
        isBirthday: this.checkIsBirthday(this.personForm.value.birthDate)
      };
      
      this.loading = true;

      if (this.editingPerson) {
        // Actualizar
        this.personService.updatePerson(this.editingPerson.id!, personData).subscribe({
          next: () => {
            this.loadPeople();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error updating person:', error);
            this.error = 'Error al actualizar la persona';
            this.loading = false;
          }
        });
      } else {
        // Crear
        this.personService.createPerson(personData).subscribe({
          next: () => {
            this.loadPeople();
            this.resetForm();
          },
          error: (error) => {
            console.error('Error creating person:', error);
            this.error = 'Error al crear la persona';
            this.loading = false;
          }
        });
      }
    }
  }

  editPerson(person: Person) {
    this.editingPerson = person;
    this.personForm.patchValue({
      name: person.name,
      work: person.work,
      birthDate: person.birthDate,
      acceptsCommercial: person.acceptsCommercial
    });
    this.showForm = true;
  }

  deletePerson(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta persona?')) {
      this.loading = true;
      this.personService.deletePerson(id).subscribe({
        next: () => this.loadPeople(),
        error: (error) => {
          console.error('Error deleting person:', error);
          this.error = 'Error al eliminar la persona';
          this.loading = false;
        }
      });
    }
  }

  resetForm() {
    this.personForm.reset();
    this.personForm.patchValue({ acceptsCommercial: false });
    this.editingPerson = null;
    this.showForm = false;
    this.loading = false;
    this.error = null;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.resetForm();
    }
  }

  private calculateAge(birthDate: string): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  private checkIsBirthday(birthDate: string): boolean {
    const today = new Date();
    const birth = new Date(birthDate);
    
    return today.getMonth() === birth.getMonth() && 
           today.getDate() === birth.getDate();
  }

  getWorkLabel(work: string): string {
    const option = this.workOptions.find(opt => opt.value === work);
    return option ? option.label : work;
  }
}