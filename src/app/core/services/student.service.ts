import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private mockStudents: any[] = [];

  constructor() {
    this.generateMockData();
  }

  // دالة لتوليد طلاب لكل الصفوف والشعب تلقائياً للتجربة
  private generateMockData() {
    const genders = ['بنين', 'بنات'];
    const levels = ['اول', 'ثاني', 'ثالث', 'رابع', 'خامس', 'سادس', 'اول ثانوي'];
    const sections = ['أ', 'ب', 'ج'];
    let idCounter = 1;

    genders.forEach(g => {
      levels.forEach(l => {
        sections.forEach(s => {
          // إضافة طالبين في كل شعبة للتأكد من امتلاء النظام
          for (let i = 1; i <= 2; i++) {
            this.mockStudents.push({
              id: (idCounter++).toString(),
              name: `طالب ${g === 'بنين' ? 'مجتهد' : 'مجتهدة'} (${idCounter})`,
              gender: g,
              level: l,
              section: s,
              email: `student${idCounter}@majd.com`,
              password: '123',
              imageUrl: 'assets/user.png',
              // بيانات مالية افتراضية
              baseFees: 120000,
              busFees: 30000,
              uniformFees: 15000,
              paidAmount: 50000,
              busPaid: 10000,
              uniformPaid: 15000,
              discount: l === 'اول' ? 5000 : 0, // مثال لخصم في الصف الأول
              discountReason: l === 'اول' ? 'خصم تسجيل مبكر' : '',
              remainingAmount: 100000,
              // بيانات أكاديمية افتراضية لشهر أبريل (Index 3)
              attendance: { "month_3": [2, 5, 10] },
              grades: {
                "month_3": {
                  "الرياضيات": { monthly: 28, exam: 65 },
                  "اللغة العربية": { monthly: 25, exam: 55 }
                }
              }
            });
          }
        });
      });
    });
  }

  getStudents(): Observable<any[]> {
    // تحديث المبالغ المتبقية قبل الإرسال لضمان دقة العرض في القائمة
    this.mockStudents.forEach(s => {
      s.remainingAmount = (s.baseFees + (s.busFees || 0) + (s.uniformFees || 0)) -
                          ((s.paidAmount || 0) + (s.busPaid || 0) + (s.uniformPaid || 0) + (s.discount || 0));
    });
    return of([...this.mockStudents]).pipe(delay(500));
  }

  updateStudent(updated: any): Observable<any> {
    const index = this.mockStudents.findIndex(s => s.id === updated.id);
    if (index !== -1) {
      this.mockStudents[index] = { ...updated };
    }
    return of(updated).pipe(delay(300));
  }

  addStudent(student: any): Observable<any> {
    const newStudent = {
      ...student,
      id: Math.random().toString(36).substring(2, 9)
    };
    this.mockStudents.push(newStudent);
    return of(newStudent);
  }
}
