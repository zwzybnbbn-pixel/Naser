import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../core/services/student.service';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.scss']
})
export class StudentListComponent implements OnInit {
  students: any[] = [];
  viewMode: 'gender' | 'levels' | 'sections' | 'students' = 'gender';
  selectedGender = '';
  selectedLevel = '';
  selectedSection = '';
  showModal = false;
  currentStudent: any = null;
  isFinanceEditing = false; // وضع تعديل الحسابات

  selectedMonthIndex = new Date().getMonth();
  months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
  daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  subjects = ['القرآن الكريم', 'التربية الإسلامية', 'اللغة العربية', 'اللغة الإنجليزية', 'الرياضيات', 'العلوم'];

  constructor(private studentService: StudentService) {}

  ngOnInit() {
    this.studentService.getStudents().subscribe(data => this.students = data);
  }

  get monthKey() { return `month_${this.selectedMonthIndex}`; }

  openDetails(student: any) {
    this.currentStudent = JSON.parse(JSON.stringify(student));
    // ضمان وجود الحقول المالية الافتراضية إذا لم تكن موجودة
    this.currentStudent.baseFees = this.currentStudent.baseFees || 0;
    this.currentStudent.paidAmount = this.currentStudent.paidAmount || 0;
    this.currentStudent.busFees = this.currentStudent.busFees || 0;
    this.currentStudent.busPaid = this.currentStudent.busPaid || 0;
    this.currentStudent.uniformFees = this.currentStudent.uniformFees || 0;
    this.currentStudent.uniformPaid = this.currentStudent.uniformPaid || 0;
    this.currentStudent.discount = this.currentStudent.discount || 0;

    if (!this.currentStudent.attendance) this.currentStudent.attendance = {};
    if (!this.currentStudent.grades) this.currentStudent.grades = {};

    this.isFinanceEditing = false;
    this.showModal = true;
  }

  toggleFinanceEdit() {
    this.isFinanceEditing = !this.isFinanceEditing;
  }

 // دالة التحضير الذكية
toggleAttendance(day: number) {
  // التأكد من وجود سجل للشهر الحالي
  if (!this.currentStudent.attendance[this.monthKey]) {
    this.currentStudent.attendance[this.monthKey] = {};
  }

  const currentStatus = this.currentStudent.attendance[this.monthKey][day];

  if (!currentStatus || currentStatus === 'absent') {
    // النقرة الأولى أو إذا كان غائباً -> يتحول لحاضر
    this.currentStudent.attendance[this.monthKey][day] = 'present';
  } else {
    // النقرة الثانية (إذا كان حاضراً) -> يتحول لغائب
    this.currentStudent.attendance[this.monthKey][day] = 'absent';
  }
}

// دالة لفحص الحالة في الواجهة
getDayStatus(day: number): 'present' | 'absent' | 'none' {
  return this.currentStudent.attendance[this.monthKey]?.[day] || 'none';
}
// أضف هذه المصفوفة داخل كلاس الـ Component
discountReasons = [
  'يتيم / يتيمة',
  'حافظ / حافظة للقرآن',
  'ابن / ابنة مدرسـ/ـة',
  'تفوق أكاديمي',
  'ظروف مادية',
  'أخوة في المدرسة',
  'أخرى (كتابة يدوية)'
];

// دالة لتصفير السبب إذا كان الخصم 0 (اختياري)
onDiscountChange() {
  if (this.currentStudent.discount === 0) {
    this.currentStudent.discountReason = '';
  }
}
  isAbsent(day: number) {
    return this.currentStudent.attendance[this.monthKey]?.includes(day) || false;
  }

  getGrade(sub: string) {
    if (!this.currentStudent.grades[this.monthKey]) this.currentStudent.grades[this.monthKey] = {};
    if (!this.currentStudent.grades[this.monthKey][sub]) this.currentStudent.grades[this.monthKey][sub] = { monthly: 0, exam: 0 };
    return this.currentStudent.grades[this.monthKey][sub];
  }

  save() {
    // تحديث المبالغ المتبقية قبل الحفظ
    this.currentStudent.remainingAmount = (this.currentStudent.baseFees + this.currentStudent.busFees + this.currentStudent.uniformFees) -
                                          (this.currentStudent.paidAmount + this.currentStudent.busPaid + this.currentStudent.uniformPaid + this.currentStudent.discount);

    this.studentService.updateStudent(this.currentStudent).subscribe(() => {
      this.ngOnInit();
      this.showModal = false;
    });
  }

  // دوال التنقل
  selectGender(g: string) { this.selectedGender = g; this.viewMode = 'levels'; }
  selectLevel(l: string) { this.selectedLevel = l; this.viewMode = 'sections'; }
  selectSection(s: string) { this.selectedSection = s; this.viewMode = 'students'; }

  get filteredStudents() {
    return this.students.filter(s => s.gender === this.selectedGender && s.level === this.selectedLevel && s.section === this.selectedSection);
  }
}
