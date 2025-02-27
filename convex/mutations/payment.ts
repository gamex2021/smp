import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { api, internal } from "../_generated/api";
import { generateReceiptNumber } from "../lib/utils";

export const createPayment = mutation({
  args: {
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    amount: v.number(),
    feeId: v.string(),
    feeName: v.string(),
    paymentDate: v.string(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("transfer"),
      v.literal("card"),
      v.literal("pos"),
      v.literal("cheque"),
    ),
    isInstallment: v.boolean(),
    installmentNumber: v.optional(v.number()),
    totalInstallments: v.optional(v.number()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    const receiptNumber = generateReceiptNumber();

    // Create payment record
    const paymentId = await ctx.db.insert("payments", {
      ...args,
      receiptNumber,
      status: "success",
      createdAt: now,
      updatedAt: now,
    });

    // Update outstanding payment record
    const outstanding = await ctx.db
      .query("outstandingPayments")
      .withIndex("by_class_term", (q) =>
        q
          .eq("classId", args.classId)
          .eq("academicYear", args.academicYear)
          .eq("termId", args.termId),
      )
      .filter(
        (q) =>
          q.eq(q.field("studentId"), args.studentId) &&
          q.eq(q.field("feeId"), args.feeId),
      )
      .first();

    if (outstanding) {
      const amountPaid = (outstanding.amountPaid ?? 0) + args.amount;
      const remainingAmount = outstanding.amount - amountPaid;
      const status =
        remainingAmount <= 0
          ? "paid"
          : args.isInstallment
            ? "partial"
            : new Date(outstanding.dueDate) < new Date()
              ? "overdue"
              : "partial";

      await ctx.db.patch(outstanding._id, {
        amountPaid,
        remainingAmount,
        status,
        updatedAt: now,
        ...(args.isInstallment && {
          installmentStatus: {
            currentInstallment: args.installmentNumber!,
            totalInstallments: args.totalInstallments!,
            nextInstallmentDate:
              args.installmentNumber! < args.totalInstallments!
                ? getNextInstallmentDate(
                    args.paymentDate,
                    args.installmentNumber!,
                  )
                : "",
            nextInstallmentAmount:
              remainingAmount /
              (args.totalInstallments! - args.installmentNumber!),
          },
        }),
      });
    }

    // Create audit log
    await ctx.db.insert("paymentAuditLogs", {
      schoolId: args.schoolId,
      paymentId,
      action: "payment_created",
      performedBy: args.studentId,
      details: `Payment of ₦${args.amount} recorded for ${args.feeName}`,
      timestamp: now,
    });

    // Send payment receipt
    await ctx.scheduler.runAfter(
      0,
      api.actions.notifications.sendPaymentReceipt,
      {
        paymentId,
      },
    );

    return { paymentId, receiptNumber };
  },
});

// get payment by its paymentId

export const recordInstallment = mutation({
  args: {
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    outstandingPaymentId: v.id("outstandingPayments"),
    amount: v.number(),
    paymentMethod: v.union(
      v.literal("cash"),
      v.literal("transfer"),
      v.literal("card"),
      v.literal("pos"),
      v.literal("cheque"),
    ),
    paymentDate: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const outstanding = await ctx.db.get(args.outstandingPaymentId);
    if (!outstanding) {
      throw new ConvexError("Outstanding payment not found");
    }

    const now = new Date().toISOString();
    const receiptNumber = generateReceiptNumber();

    // Create payment record
    const paymentId = await ctx.db.insert("payments", {
      schoolId: args.schoolId,
      studentId: args.studentId,
      classId: outstanding.classId,
      academicYear: outstanding.academicYear,
      termId: outstanding.termId,
      amount: args.amount,
      feeId: outstanding.feeId,
      feeName: outstanding.feeName,
      receiptNumber,
      paymentDate: args.paymentDate,
      paymentMethod: args.paymentMethod,
      status: "success",
      isInstallment: true,
      installmentNumber:
        (outstanding.installmentStatus?.currentInstallment ?? 0) + 1,
      totalInstallments: outstanding.installmentStatus?.totalInstallments,
      description: args.description,
      createdAt: now,
      updatedAt: now,
    });

    // Update outstanding payment
    const amountPaid = (outstanding.amountPaid ?? 0) + args.amount;
    const remainingAmount = outstanding.amount - amountPaid;
    const currentInstallment =
      (outstanding.installmentStatus?.currentInstallment ?? 0) + 1;

    await ctx.db.patch(args.outstandingPaymentId, {
      amountPaid,
      remainingAmount,
      status: remainingAmount <= 0 ? "paid" : "partial",
      updatedAt: now,
      installmentStatus: {
        currentInstallment,
        totalInstallments:
          outstanding.installmentStatus?.totalInstallments ?? 0,
        nextInstallmentDate:
          outstanding.installmentStatus?.totalInstallments !== undefined &&
          currentInstallment < outstanding.installmentStatus.totalInstallments
            ? getNextInstallmentDate(args.paymentDate, currentInstallment)
            : "",
        nextInstallmentAmount:
          remainingAmount /
          ((outstanding.installmentStatus?.totalInstallments ?? 0) -
            currentInstallment),
      },
    });

    // Create audit log
    await ctx.db.insert("paymentAuditLogs", {
      schoolId: args.schoolId,
      paymentId,
      outstandingPaymentId: args.outstandingPaymentId,
      action: "payment_created",
      performedBy: args.studentId,
      details: `Installment payment of ₦${args.amount} recorded for ${outstanding.feeName}`,
      timestamp: now,
    });

    // Send payment receipt
    await ctx.scheduler.runAfter(
      0,
      api.actions.notifications.sendPaymentReceipt,
      {
        paymentId,
      },
    );

    return { paymentId, receiptNumber };
  },
});

export const updatePaymentStatus = mutation({
  args: {
    paymentId: v.id("payments"),
    status: v.union(
      v.literal("success"),
      v.literal("pending"),
      v.literal("failed"),
    ),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) {
      throw new ConvexError("Payment not found");
    }

    const now = new Date().toISOString();

    // Update payment status
    await ctx.db.patch(args.paymentId, {
      status: args.status,
      updatedAt: now,
    });

    // Create audit log
    await ctx.db.insert("paymentAuditLogs", {
      schoolId: payment.schoolId,
      paymentId: args.paymentId,
      action: "status_changed",
      performedBy: payment.studentId,
      details: `Payment status updated to ${args.status}${args.reason ? `: ${args.reason}` : ""}`,
      timestamp: now,
    });

    // If payment failed, update outstanding payment
    if (args.status === "failed") {
      const outstanding = await ctx.db
        .query("outstandingPayments")
        .withIndex("by_class_term", (q) =>
          q
            .eq("classId", payment.classId)
            .eq("academicYear", payment.academicYear)
            .eq("termId", payment.termId),
        )
        .filter(
          (q) =>
            q.eq(q.field("studentId"), payment.studentId) &&
            q.eq(q.field("feeId"), payment.feeId),
        )
        .first();

      if (outstanding) {
        const amountPaid = (outstanding.amountPaid ?? 0) - payment.amount;
        const remainingAmount = outstanding.amount - amountPaid;

        await ctx.db.patch(outstanding._id, {
          amountPaid,
          remainingAmount,
          status: "unpaid",
          updatedAt: now,
        });
      }
    }
  },
});

function getNextInstallmentDate(
  currentDate: string,
  installmentNumber: number,
): string {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + 30 * installmentNumber); // Add 30 days per installment
  return date.toISOString().split("T")[0];
}
