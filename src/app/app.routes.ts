import { Routes } from '@angular/router';
import { AuthComponent } from './modules/auth/auth.component';
import { StudentListComponent } from './modules/students/student-list/student-list.component';
import { ControlRoomComponent } from './modules/control-room/control-room.component';
// تأكد من هذا السطر (استخدم التكملة التلقائية كما شرحت لك أعلاه)
import { EmployeeListComponent } from './modules/employees/employee-list.component';

export const routes: Routes = [
  // 1. عند فتح الموقع، اذهب فوراً لصفحة تسجيل الدخول
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
{
  path: 'reports',
  loadComponent: () => // تأكد أنه بنقطة واحدة فقط في البداية إذا كان الملف في app
import('./modules/reports/reports.component').then(m => m.ReportsComponent)
},
  { path: 'auth', component: AuthComponent },
  { path: 'control-room', component: ControlRoomComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'employees', component: EmployeeListComponent },

  // 2. أي مسار غير معروف، أعده لتسجيل الدخول (أمان أكثر)
  { path: '**', redirectTo: 'auth' }
];
