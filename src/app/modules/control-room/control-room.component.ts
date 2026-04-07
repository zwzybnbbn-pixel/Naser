import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StudentService } from '../../core/services/student.service';

@Component({
  selector: 'app-control-room',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './control-room.component.html',
  styleUrls: ['./control-room.component.scss']
})
export class ControlRoomComponent implements OnInit {
  // --- إحصائيات الطلاب ---
  totalStudents: number = 0;
  totalCollected: number = 0;
  totalDebt: number = 0;
  paidStudentsCount: number = 0;

  // --- إحصائيات الموظفين ---
  empStats: any = {
    count: 0,
    totalSalaries: 0,
    totalBonuses: 0,
    totalWithdrawals: 0,
    netPaid: 0
  };

  // --- سجل العمليات والوقت ---
  today: Date = new Date();
  dayTransactions: any[] = [];
  selectedDateString: string = new Date().toISOString().split('T')[0];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  // دالة واحدة لجمع كل البيانات عند التشغيل
  loadAllData() {
    this.loadStats();        // بيانات الطلاب والمالية
    this.loadEmployeeData(); // بيانات الموظفين والرواتب
    this.onDateChange(this.selectedDateString); // سجل العمليات اليومي
  }

  loadStats() {
    this.studentService.getStudents().subscribe(students => {
      this.totalStudents = students.length;
      this.totalCollected = students.reduce((sum, s) =>
        sum + (s.paidAmount || 0) + (s.busPaid || 0) + (s.uniformPaid || 0), 0);
      this.totalDebt = students.reduce((sum, s) => sum + (s.remainingAmount || 0), 0);
      this.paidStudentsCount = students.filter(s => s.status === 'Paid').length;
    });
  }

  loadEmployeeData() {
    this.studentService.getEmployeeStats().subscribe(data => {
      this.empStats = data;
    });
  }

  onDateChange(dateString: string) {
    this.selectedDateString = dateString;
    const selectedDate = new Date(dateString);
    this.studentService.getTransactionsByDate(selectedDate).subscribe(data => {
      this.dayTransactions = data;
    });
  }
}
