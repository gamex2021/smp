import { type Id } from "~/_generated/dataModel";

export type Student = {
  email: string;
  id: Id<"users">;
  name: string;
};

export type Class = {
  id: Id<"classes">;
  name: string;
};

export type Payment = {
  _creationTime: number;
  _id: Id<"outstandingPayments">;
  academicYear: string;
  amount: number;
  amountPaid: number;
  class: Class;
  classId: string;
  dueDate: string;
  feeId: string;
  feeName: string;
  isCompulsory: boolean;
  remainingAmount: number;
  schoolId: string;
  status: "unpaid" | "paid" | "partial" | "overdue"; // Extend as needed
  student: Student;
  studentId: string;
  termId: number;
};

export type PaymentData = {
  student: Student;
  class: Class;
  payments: Payment[];
  totalOutstanding: number;
};
