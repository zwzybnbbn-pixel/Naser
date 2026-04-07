import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/services/student.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.studentService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  // --- دالة إضافة موظف جديد عبر نافذة منبثقة ---
  async addNewEmployee() {
    const { value: formValues } = await Swal.fire({
      title: 'إضافة موظف جديد',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="اسم الموظف">' +
        '<input id="swal-input2" class="swal2-input" placeholder="المسمى الوظيفي">' +
        '<input id="swal-input3" class="swal2-input" type="number" placeholder="الراتب الأساسي">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'حفظ البيانات',
      cancelButtonText: 'إلغاء',
      preConfirm: () => {
        const name = (document.getElementById('swal-input1') as HTMLInputElement).value;
        const jobTitle = (document.getElementById('swal-input2') as HTMLInputElement).value;
        const baseSalary = (document.getElementById('swal-input3') as HTMLInputElement).value;

        if (!name || !jobTitle || !baseSalary) {
          Swal.showValidationMessage('يرجى ملء جميع الحقول');
        }
        return { name, jobTitle, baseSalary: Number(baseSalary) };
      }
    });

    if (formValues) {
      this.studentService.addEmployee(formValues).subscribe(() => {
        Swal.fire('تم بنجاح', 'تمت إضافة الموظف وسجلت العملية في النظام', 'success');
        this.loadEmployees();
      });
    }
  }

  // --- دالة السحب المالي ---
  async onWithdraw(emp: any) {
    const { value: amount } = await Swal.fire({
      title: `سحب مبلغ لـ ${emp.name}`,
      input: 'number',
      inputLabel: 'المبلغ المسحوب (RY)',
      showCancelButton: true,
      confirmButtonColor: '#f43f5e',
      confirmButtonText: 'تأكيد الخصم'
    });

    if (amount && amount > 0) {
      this.studentService.addWithdrawal(emp.id, Number(amount));
      Swal.fire('تم الخصم', `تم تسجيل سحبية بقيمة ${amount}`, 'success');
      this.loadEmployees();
    }
  }

  // --- دالة إضافة مكافأة ---
  async onBonus(emp: any) {
    const { value: amount } = await Swal.fire({
      title: `إضافة مكافأة لـ ${emp.name}`,
      input: 'number',
      inputLabel: 'قيمة المكافأة (RY)',
      showCancelButton: true,
      confirmButtonColor: '#eab308',
      confirmButtonText: 'تأكيد الإضافة'
    });

    if (amount && amount > 0) {
      this.studentService.addBonus(emp.id, Number(amount));
      Swal.fire('تمت الإضافة', `تم منح مكافأة بقيمة ${amount}`, 'success');
      this.loadEmployees();
    }
  }
}
