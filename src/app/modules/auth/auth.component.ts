import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
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

    // محاكاة الاتصال بالسيرفر (Delay 1s)
    setTimeout(() => {
      if (this.loginData.email === 'admin' && this.loginData.password === 'admin') {
        console.log('✅ البيانات مطابقة (admin/admin)');

        // الانتقال إلى لوحة التحكم
        this.router.navigate(['/control-room']).then(
          (success) => {
            if (success) {
              console.log('🚀 تم الدخول والانتقال للوحة التحكم بنجاح!');
            } else {
              this.loading = false;
              this.errorMessage = 'فشل الانتقال: تأكد من تعريف المسار في app.routes.ts';
              console.error('❌ المسار /control-room غير معرف');
            }
          },
          (error) => {
            this.loading = false;
            this.errorMessage = 'حدث خطأ فني أثناء التوجيه';
            console.error('🛑 خطأ التوجيه:', error);
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
