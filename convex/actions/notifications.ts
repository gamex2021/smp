/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

"use node";

import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { Resend } from "resend";
import { api, internal } from "../_generated/api";
import { type Id } from "../_generated/dataModel";

const resend = new Resend(process.env.AUTH_RESEND_KEY);

// sendpaymentReceipt
export const sendPaymentReceipt = action({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    // get the student and payment details
    const payment = await ctx.runQuery(api.queries.payment.getPaymentById, {
      paymentId: args.paymentId,
    });

    if (!payment) {
      throw new Error("Payment not found");
    }

    // now send resend message to the student
    try {
      // Send email using Resend
      await resend.emails.send({
        from: `${payment?.school?.name} <noreply@${payment?.school?.domain}>`,
        to: payment?.student?.email ?? "gamex391@gmail.com",
        subject: `Payment Receipt: ${payment?.feeName}`,
        html: `
          <h1>Payment Receipt</h1>
          <p>Dear ${payment?.student?.name},</p>
          <p>Your payment for ${payment?.feeName} has been successfully recorded.</p>
          <p>Details:</p>
          <ul>
            <li>Fee: ${payment?.feeName}</li>
            <li>Amount: ₦${payment?.amount.toLocaleString()}</li>
            <li>Payment Date: ${new Date(payment?.paymentDate).toLocaleDateString()}</li>
            <li>Payment Method: ${payment?.paymentMethod}</li>
            <li>Receipt Number: ${payment?.receiptNumber}</li>
          </ul>
          <p>Thank you for your payment.</p>
        `,
      });
    } catch (error) {
      throw error;
    }
  },
});

export const sendPaymentReminder = action({
  args: {
    studentId: v.id("users"),
    outstandingPaymentId: v.id("outstandingPayments"),
  },
  handler: async (ctx, args) => {
    // console.log("student", args.studentId, args.outstandingPaymentId);
    // Get student and payment details
    const student = await ctx.runQuery(internal.queries.user.getUser, {
      userId: args.studentId,
    });

    const outstanding = await ctx.runQuery(
      internal.queries.fees.getOutstandingPayment,
      {
        outstandingPaymentId: args.outstandingPaymentId,
      },
    );

    // console.log("outstanding payments", outstanding);

    if (!student || !outstanding) {
      throw new Error("Invalid student or payment");
    }

    const school = await ctx.runQuery(internal.queries.school.getSchool, {
      schoolId: outstanding.schoolId,
    });

    // console.log("school", school);
    if (!school) {
      throw new Error("School not found");
    }

    try {
      // Send email using Resend
      await resend.emails.send({
        from: `${school.name} <noreply@${school.domain}>`,
        to: student.email,
        subject: `Payment Reminder: ${outstanding.feeName}`,
        html: `
          <h1>Payment Reminder</h1>
          <p>Dear ${student.name},</p>
          <p>This is a reminder that your payment for ${outstanding.feeName} is ${
            outstanding.status === "overdue" ? "overdue" : "pending"
          }.</p>
          <p>Details:</p>
          <ul>
            <li>Fee: ${outstanding.feeName}</li>
            <li>Total Amount: ₦${outstanding.amount.toLocaleString()}</li>
            <li>Amount Paid: ₦${(outstanding.amountPaid ?? 0).toLocaleString()}</li>
            <li>Remaining Amount: ₦${(outstanding.remainingAmount ?? 0).toLocaleString()}</li>
            <li>Due Date: ${new Date(outstanding.dueDate).toLocaleDateString()}</li>
          </ul>
          ${
            outstanding.installmentStatus
              ? `
            <p>Installment Details:</p>
            <ul>
              <li>Current Installment: ${outstanding.installmentStatus.currentInstallment} of ${
                outstanding.installmentStatus.totalInstallments
              }</li>
              <li>Next Installment Due: ${new Date(
                outstanding.installmentStatus.nextInstallmentDate,
              ).toLocaleDateString()}</li>
              <li>Next Installment Amount: ₦${outstanding.installmentStatus.nextInstallmentAmount.toLocaleString()}</li>
            </ul>
            `
              : ""
          }
          <p>Please ensure to make the payment before the due date to avoid any late payment penalties.</p>
          <p>Thank you for your cooperation.</p>
        `,
      });

      // console.log("school here");

      // Update notification status
      await ctx.runMutation(
        internal.mutations.notifications.updateNotification,
        {
          outstandingPaymentId: args.outstandingPaymentId,
          status: "sent",
          sentAt: new Date().toISOString(),
        },
      );
      return { success: true };
    } catch (error) {
      // Log error and update notification status
      await ctx.runMutation(
        internal.mutations.notifications.updateNotification,
        {
          outstandingPaymentId: args.outstandingPaymentId,
          status: "failed",
          error: (error as Error).message,
        },
      );
      throw error;
    }
  },
});

export const sendBulkPaymentReminders = action({
  args: {
    schoolId: v.id("schools"),
    studentIds: v.array(v.id("users")),
    filters: v.object({
      classId: v.optional(v.id("classes")),
      academicYear: v.optional(v.string()),
      termId: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    // Get all outstanding payments for the selected students
    const outstandingPayments = await Promise.all(
      args.studentIds.map(async (studentId) => {
        return await ctx.runQuery(api.queries.fees.getOutstandingPayments, {
          schoolId: args.schoolId,
          studentId,
          ...args.filters,
        });
      }),
    );

    // Group payments by student
    const paymentsByStudent = outstandingPayments.flat().reduce(
      (acc, payment) => {
        if (!payment.student) return acc;
        if (!acc[payment.student.id]) {
          acc[payment.student.id as Id<"users">] = [];
        }
        acc[payment.student.id].push(payment);
        return acc;
      },
      {} as Record<Id<"users">, (typeof outstandingPayments)[0]>,
    );

    const school = await ctx.runQuery(internal.queries.school.getSchool, {
      schoolId: args.schoolId,
    });

    if (!school) {
      throw new Error("School not found");
    }

    // Send emails to each student
    for (const [studentId, payments] of Object.entries(paymentsByStudent)) {
      const student = await ctx.runQuery(internal.queries.user.getUser, {
        userId: studentId as Id<"users">,
      });

      if (!student) continue;

      try {
        const totalOutstanding = payments.reduce(
          (sum, p) => sum + (p.remainingAmount ?? 0),
          0,
        );
        const overduePayments = payments.filter((p) => p.status === "overdue");

        await resend.emails.send({
          from: `${school.name} <noreply@${school.domain}>`,
          to: student.email,
          subject: `Outstanding Payments Reminder`,
          html: `
            <h1>Outstanding Payments Reminder</h1>
            <p>Dear ${student.name},</p>
            <p>This is a reminder about your outstanding payments:</p>
            <ul>
              ${payments
                .map(
                  (payment) => `
                <li>
                  ${payment.feeName}: ₦${(payment.remainingAmount ?? 0).toLocaleString()}
                  (${payment.status})
                  ${
                    payment.installmentStatus
                      ? `<br>
                    Installment ${payment.installmentStatus.currentInstallment} of ${
                      payment.installmentStatus.totalInstallments
                    }`
                      : ""
                  }
                </li>
              `,
                )
                .join("")}
            </ul>
            <p><strong>Total Outstanding: ₦${totalOutstanding.toLocaleString()}</strong></p>
            ${
              overduePayments.length > 0
                ? `
              <p style="color: red;">
                You have ${overduePayments.length} overdue payment(s). 
                Please settle these payments as soon as possible.
              </p>
            `
                : ""
            }
            <p>Please ensure to make the payments before their respective due dates.</p>
            <p>Thank you for your cooperation.</p>
          `,
        });

        // Update notification status for each payment
        for (const payment of payments) {
          await ctx.runMutation(
            internal.mutations.notifications.updateNotification,
            {
              outstandingPaymentId: payment._id,
              status: "sent",
              sentAt: new Date().toISOString(),
            },
          );
        }
      } catch (error) {
        // Log error and update notification status
        for (const payment of payments) {
          await ctx.runMutation(
            internal.mutations.notifications.updateNotification,
            {
              outstandingPaymentId: payment._id,
              status: "failed",
              error: (error as Error).message,
            },
          );
        }
      }
    }
  },
});

// send term progress notification
export const sendTermProgressionNotification = internalAction({
  args: {
    schoolId: v.id("schools"),
    fromTerm: v.object({
      termNumber: v.number(),
      name: v.string(),
    }),
    toTerm: v.object({
      termNumber: v.number(),
      name: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    const school = await ctx.runQuery(internal.queries.school.getSchool, {
      schoolId: args.schoolId,
    });

    if (!school) {
      throw new Error("School not found");
    }

    // send email to the school telling them of the term progression with resend
    try {
      // Send email using Resend
      await resend.emails.send({
        from: `${process.env.PRIVATE_EMAIL} <noreply@${school?.domain}>`,
        to: school?.email ?? "gamex391@gmail.com",
        subject: `Term progression done`,
        html: `<p>Term progression done from ${args.fromTerm.name} to ${args.toTerm.name}</p>`,
      });
    } catch (error) {
      throw error;
    }
  },
});
