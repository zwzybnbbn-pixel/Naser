import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { StudentListComponent } from './modules/students/student-list/student-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: AuthComponent },
  { path: 'students', component: StudentListComponent },
  { path: '**', redirectTo: 'auth' }
];
