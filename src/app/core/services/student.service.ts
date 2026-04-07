import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private mockStudents: any[] = [];

  // --- سجل العمليات ---
  private transactions: any[] = [
    { id: 1, date: new Date('2026-04-07'), type: 'registration', title: 'تسجيل طالب جديد', detail: 'أحمد محمد علي - الصف الأول', amount: 120000, icon: '👤' },
    { id: 2, date: new Date('2026-04-07'), type: 'payment', title: 'دفع قسط دراسي', detail: 'الطالبة سارة خالد - دفعة أولى', amount: 50000, icon: '💰' },
    { id: 3, date: new Date('2026-04-06'), type: 'expense', title: 'مصروفات تشغيلية', detail: 'شراء أدوات مكتبية وقرطاسية', amount: 15000, icon: '📉' },
    { id: 4, date: new Date('2026-04-07'), type: 'salary', title: 'سحب راتب موظف', detail: 'الأستاذ عصام - راتب شهر مارس', amount: 80000, icon: '🏧' }
  ];

  // --- مصفوفة الموظفين ---
  private employees: any[] = [
    { id: '1', name: 'أستاذ عصام علي', jobTitle: 'مدرس رياضيات', baseSalary: 150000, totalBonuses: 20000, totalWithdrawals: 30000, netSalary: 140000 },
    { id: '2', name: 'أستاذة منى حسن', jobTitle: 'مدرسة لغة عربية', baseSalary: 140000, totalBonuses: 10000, totalWithdrawals: 0, netSalary: 150000 }
  ];

  constructor() {
    this.generateMockData();
  }

  // ================= الدوال الجديدة للموظفين =================

  getEmployees(): Observable<any[]> {
    return of([...this.employees]);
  }

  getEmployeeStats(): Observable<any> {
    const totalSalaries = this.employees.reduce((sum, emp) => sum + (emp.baseSalary || 0), 0);
    const totalBonuses = this.employees.reduce((sum, emp) => sum + (emp.totalBonuses || 0), 0);
    const totalWithdrawals = this.employees.reduce((sum, emp) => sum + (emp.totalWithdrawals || 0), 0);
    const netPaid = (totalSalaries + totalBonuses) - totalWithdrawals;

    return of({
      count: this.employees.length,
      totalSalaries,
      totalBonuses,
      totalWithdrawals,
      netPaid
    });
  }

  addEmployee(emp: any): Observable<any> {
    const newEmp = {
      ...emp,
      id: Math.random().toString(36).substring(2, 9),
      totalBonuses: 0,
      totalWithdrawals: 0,
      netSalary: emp.baseSalary,
      joinDate: new Date()
    };
    this.employees.push(newEmp);
    this.recordTransaction('registration', `تعيين موظف: ${emp.name}`, emp.baseSalary, '👨‍🏫');
    return of(newEmp);
  }

  addWithdrawal(empId: string, amount: number) {
    const emp = this.employees.find(e => e.id === empId);
    if (emp) {
      emp.totalWithdrawals += amount;
      emp.netSalary -= amount;
      this.recordTransaction('salary', `سحبية: ${emp.name}`, amount, '🏧');
    }
  }

  addBonus(empId: string, amount: number) {
    const emp = this.employees.find(e => e.id === empId);
    if (emp) {
      emp.totalBonuses += amount;
      emp.netSalary += amount;
      this.recordTransaction('payment', `مكافأة: ${emp.name}`, amount, '🎁');
    }
  }

  private recordTransaction(type: string, title: string, amount: number, icon: string) {
    this.transactions.unshift({
      id: Date.now(),
      date: new Date(),
      type,
      title,
      amount,
      icon,
      detail: 'عملية مالية مسجلة'
    });
  }

  // ================= الدوال الأصلية (بدون تغيير) =================

  getTransactionsByDate(selectedDate: Date): Observable<any[]> {
    const filtered = this.transactions.filter(t =>
      t.date.toDateString() === selectedDate.toDateString()
    );
    return of(filtered).pipe(delay(300));
  }

  private generateMockData() {
    const genders = ['بنين', 'بنات'];
    const levels = ['اول', 'ثاني', 'ثالث', 'رابع', 'خامس', 'سادس', 'اول ثانوي'];
    const sections = ['أ', 'ب', 'ج'];
    let idCounter = 1;

    genders.forEach(g => {
      levels.forEach(l => {
        sections.forEach(s => {
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
              baseFees: 120000,
              busFees: 30000,
              uniformFees: 15000,
              paidAmount: 50000,
              busPaid: 10000,
              uniformPaid: 15000,
              discount: l === 'اول' ? 5000 : 0,
              discountReason: l === 'اول' ? 'خصم تسجيل مبكر' : '',
              remainingAmount: 100000,
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
