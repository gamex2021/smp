/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { customAlphabet } from "nanoid";

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
  return date.toISOString().split("T")[0];
}

export function generatePaymentReceipt(
  payment: any,
  school: any,
  student: any,
) {
  const receiptDate = new Date(payment.paymentDate).toLocaleDateString();
  const receiptTime = new Date(payment.paymentDate).toLocaleTimeString();

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; }
        .receipt { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .school-info { margin-bottom: 20px; }
        .payment-info { margin-bottom: 20px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        .table th, .table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .footer { text-align: center; margin-top: 30px; font-size: 0.9em; }
        .amount { font-weight: bold; }
        .watermark {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 100px;
          opacity: 0.1;
          pointer-events: none;
        }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="watermark">PAID</div>
        
        <div class="header">
          <h1>${school.name}</h1>
          <p>${school.address}</p>
          <p>Tel: ${school.phone} | Email: ${school.email}</p>
          <h2>PAYMENT RECEIPT</h2>
        </div>

        <div class="school-info">
          <p><strong>Receipt No:</strong> ${payment.receiptNumber}</p>
          <p><strong>Date:</strong> ${receiptDate}</p>
          <p><strong>Time:</strong> ${receiptTime}</p>
        </div>

        <div class="payment-info">
          <p><strong>Student Name:</strong> ${student.name}</p>
          <p><strong>Class:</strong> ${student.currentClass?.title}</p>
          <p><strong>Academic Year:</strong> ${payment.academicYear}</p>
          <p><strong>Term:</strong> ${payment.termName}</p>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${payment.feeName}</td>
              <td>₦${formatCurrency(payment.amount)}</td>
            </tr>
            ${
              payment.isInstallment
                ? `
              <tr>
                <td colspan="2">
                  <small>Installment ${payment.installmentNumber} of ${payment.totalInstallments}</small>
                </td>
              </tr>
            `
                : ""
            }
          </tbody>
          <tfoot>
            <tr>
              <th>Total Amount Paid</th>
              <td class="amount">₦${formatCurrency(payment.amount)}</td>
            </tr>
          </tfoot>
        </table>

        <div class="payment-info">
          <p><strong>Payment Method:</strong> ${payment.paymentMethod.toUpperCase()}</p>
          ${payment.description ? `<p><strong>Notes:</strong> ${payment.description}</p>` : ""}
        </div>

        <div class="footer">
          <p>This is a computer-generated receipt and requires no signature.</p>
          <p>Thank you for your payment!</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
