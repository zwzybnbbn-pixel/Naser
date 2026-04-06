import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true, // تأكد أنها standalone إذا كنت تستخدم Angular 17+
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html', // هذا السطر هو الذي كان مفقوداً وسبب الخطأ
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  // بيانات الدخول الافتراضية التي طلبتها
  loginData = {
    email: '',
    password: ''
  };

  loading: boolean = false;
  errorMessage: string = '';

  constructor(private router: Router) {}

  onLogin() {
  this.loading = true;
  this.errorMessage = '';

  console.log('--- محاولة تسجيل الدخول ---');
  console.log('البيانات المدخلة:', this.loginData);

  setTimeout(() => {
    if (this.loginData.email === 'admin' && this.loginData.password === 'admin') {
      console.log('✅ البيانات مطابقة (admin/admin)');

      // محاولة الانتقال مع رصد النتيجة
      this.router.navigate(['/students']).then(
        (success) => {
          if (success) {
            console.log('🚀 تم الانتقال لصفحة الطلاب بنجاح!');
          } else {
            console.error('❌ فشل الانتقال! قد يكون المسار غير مسجل أو هناك Guard يمنع الدخول.');
          }
        },
        (error) => {
          console.error('🛑 خطأ فني أثناء الانتقال:', error);
        }
      );
    } else {
      this.loading = false;
      this.errorMessage = 'بيانات الدخول غير صحيحة';
      console.warn('⚠️ بيانات خاطئة');
    }
  }, 1000);
}
}
