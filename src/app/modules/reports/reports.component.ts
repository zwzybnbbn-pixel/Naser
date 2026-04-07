import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  // 1. تعريف المتغيرات
  activeTab: 'students' | 'finance' | 'employees' = 'students';
  today: Date = new Date(); // حل مشكلة الخطأ تحت توداي

  debtStudents: any[] = [];
  employeeSalaries: any[] = [];
  financeSummary: any = { totalIncome: 0, totalDebt: 0, employeeCost: 0 };

  // 2. حقن السيرفيس (Dependency Injection)
  constructor(private studentService: StudentService) {}

  // 3. التشغيل عند تحميل الصفحة
  ngOnInit() {
    this.loadReportsData();
  }

  // 4. جلب البيانات من السيرفيس
  loadReportsData() {
    this.studentService.getStudents().subscribe(data => {
      this.debtStudents = data.filter(s => s.remainingAmount > 0);
      this.financeSummary.totalDebt = data.reduce((sum, s) => sum + s.remainingAmount, 0);
      this.financeSummary.totalIncome = data.reduce((sum, s) => sum + (s.paidAmount + s.busPaid + s.uniformPaid), 0);
    });

    this.studentService.getEmployees().subscribe(data => {
      this.employeeSalaries = data;
      this.financeSummary.employeeCost = data.reduce((sum, e) => sum + e.netSalary, 0);
    });
  }

  printReport() {
    window.print();
  }
}
