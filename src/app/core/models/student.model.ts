export interface Student {
  id?: string;
  name: string;
  phone: number;
  level: string;        // الصف
  section: string;      // الشعبة
  totalAmount: number;  // المبلغ كامل
  paidAmount: number;   // المبلغ المدفوع
  remainingAmount: number; // المبلغ المتبقي (يُحسب تلقائياً)
  email: string;
  password?: string;
  imageUrl?: string;
  status: 'active' | 'absent' | 'suspended';
}
