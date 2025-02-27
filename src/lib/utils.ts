import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Create a custom nanoid with only uppercase letters and numbers
const generateId = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

export function generateReceiptNumber(prefix = "RCP"): string {
  const timestamp = Date.now().toString().slice(-6);
  const uniqueId = generateId();
  return `${prefix}-${timestamp}-${uniqueId}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function calculateInstallments(
  totalAmount: number,
  numberOfInstallments: number,
  minimumFirstPayment: number,
): number[] {
  if (numberOfInstallments <= 0) return [totalAmount];
  if (numberOfInstallments === 1) return [totalAmount];

  const remainingAmount = totalAmount - minimumFirstPayment;
  const installmentAmount = Math.ceil(
    remainingAmount / (numberOfInstallments - 1),
  );

  const installments = [minimumFirstPayment];
  for (let i = 0; i < numberOfInstallments - 2; i++) {
    installments.push(installmentAmount);
  }

  // Add the last installment (adjusting for any rounding)
  const lastInstallment = totalAmount - installments.reduce((a, b) => a + b, 0);
  installments.push(lastInstallment);

  return installments;
}

export function getNextInstallmentDate(
  startDate: string,
  installmentNumber: number,
  intervalDays = 30,
): string {
  const date = new Date(startDate);
  date.setDate(date.getDate() + installmentNumber * intervalDays);
  return date.toISOString().split("T")[0] ?? "";
}
