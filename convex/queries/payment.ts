/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { v } from "convex/values";
import { query } from "../_generated/server";

export const getPaymentById = query({
  args: {
    paymentId: v.id("payments"),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db.get(args.paymentId);
    if (!payment) return null;

    const student = await ctx.db.get(payment.studentId);
    const school = await ctx.db.get(payment.schoolId);
    const class_ = await ctx.db.get(payment.classId);

    return {
      ...payment,
      student: student
        ? {
            id: student._id,
            name: student.name,
            email: student.email,
          }
        : null,
      class: class_
        ? {
            id: class_._id,
            name: class_.title,
          }
        : null,
      school,
    };
  },
});

export const getPayments = query({
  args: {
    schoolId: v.id("schools"),
    filters: v.optional(
      v.object({
        academicYear: v.optional(v.string()),
        termId: v.optional(v.number()),
        classId: v.optional(v.id("classes")),
        status: v.optional(
          v.union(
            v.literal("success"),
            v.literal("pending"),
            v.literal("failed"),
          ),
        ),
        paymentMethod: v.optional(
          v.union(
            v.literal("cash"),
            v.literal("transfer"),
            v.literal("card"),
            v.literal("pos"),
            v.literal("cheque"),
          ),
        ),
        query: v.optional(v.string()),
        startDate: v.optional(v.string()),
        endDate: v.optional(v.string()),
        receiptNumber: v.optional(v.string()),
      }),
    ),
    cursor: v.optional(v.string()),
    numItems: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("the cursor", args.cursor);

    let query = ctx.db
      .query("payments")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId));

    if (args.filters) {
      if (args.filters.academicYear) {
        query = query.filter((q) =>
          q.eq(q.field("academicYear"), args.filters!.academicYear!),
        );
      }
      if (args.filters.termId) {
        query = query.filter((q) =>
          q.eq(q.field("termId"), args.filters!.termId!),
        );
      }
      if (args.filters.paymentMethod) {
        query = query.filter((q) =>
          q.eq(q.field("paymentMethod"), args.filters!.paymentMethod!),
        );
      }
      if (args.filters.classId) {
        query = query.filter((q) =>
          q.eq(q.field("classId"), args.filters!.classId!),
        );
      }
      if (args.filters.status) {
        query = query.filter((q) =>
          q.eq(q.field("status"), args.filters!.status!),
        );
      }
      if (args.filters.startDate && args.filters.endDate) {
        query = query.filter((q) =>
          q.and(
            q.gte(q.field("paymentDate"), args.filters!.startDate!),
            q.lte(q.field("paymentDate"), args.filters!.endDate!),
          ),
        );
      }
      if (args.filters.receiptNumber) {
        query = query.filter((q) =>
          q.eq(q.field("receiptNumber"), args.filters!.receiptNumber!),
        );
      }
    }

    const payments = await query
      .order("desc")
      .paginate({ cursor: args.cursor ?? null, numItems: args.numItems });

    // Resolve student details for each payment
    const paymentsWithDetails = await Promise.all(
      payments.page.map(async (payment) => {
        const student = await ctx.db.get(payment.studentId);
        const class_ = await ctx.db.get(payment.classId);

        return {
          ...payment,
          student: student
            ? {
                id: student._id,
                name: student.name,
                email: student.email,
              }
            : null,
          class: class_
            ? {
                id: class_._id,
                name: class_.title,
              }
            : null,
        };
      }),
    );

    return {
      payments: paymentsWithDetails,
      continueCursor: payments.continueCursor,
    };
  },
});

export const getPaymentByReceipt = query({
  args: {
    receiptNumber: v.string(),
  },
  handler: async (ctx, args) => {
    const payment = await ctx.db
      .query("payments")
      .withIndex("by_receipt", (q) => q.eq("receiptNumber", args.receiptNumber))
      .first();

    if (!payment) return null;

    const student = await ctx.db.get(payment.studentId);
    const class_ = await ctx.db.get(payment.classId);

    return {
      ...payment,
      student: student
        ? {
            id: student._id,
            name: student.name,
            email: student.email,
          }
        : null,
      class: class_
        ? {
            id: class_._id,
            name: class_.title,
          }
        : null,
    };
  },
});

export const getPaymentMetrics = query({
  args: {
    schoolId: v.id("schools"),
    academicYear: v.optional(v.string()),
    termId: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("payments")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId));

    if (args.academicYear) {
      query = query.filter((q) =>
        q.eq(q.field("academicYear"), args.academicYear),
      );
    }
    if (args.termId) {
      query = query.filter((q) => q.eq(q.field("termId"), args.termId));
    }

    const payments = await query.collect();

    // Calculate metrics
    const totalRevenue = payments
      .filter((p) => p.status === "success")
      .reduce((sum, p) => sum + p.amount, 0);

    const successfulPayments = payments.filter((p) => p.status === "success");
    const pendingPayments = payments.filter((p) => p.status === "pending");
    const failedPayments = payments.filter((p) => p.status === "failed");

    // Calculate month-over-month changes
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthPayments = successfulPayments.filter((p) => {
      const date = new Date(p.paymentDate);
      return (
        date.getMonth() === currentMonth && date.getFullYear() === currentYear
      );
    });

    const lastMonthPayments = successfulPayments.filter((p) => {
      const date = new Date(p.paymentDate);
      return (
        date.getMonth() === currentMonth - 1 &&
        date.getFullYear() === currentYear
      );
    });

    const thisMonthRevenue = thisMonthPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    );
    const lastMonthRevenue = lastMonthPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    );
    const revenueChange =
      lastMonthRevenue === 0
        ? 0
        : ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;

    return {
      totalRevenue,
      successfulPayments: successfulPayments.length,
      pendingPayments: pendingPayments.length,
      failedPayments: failedPayments.length,
      thisMonthRevenue,
      lastMonthRevenue,
      revenueChange,
      monthlyData: getMonthlyData(successfulPayments),
    };
  },
});

interface Payment {
  paymentDate: string;
  amount: number;
}

function getMonthlyData(payments: Payment[]) {
  const monthlyData = new Map();

  payments.forEach((payment) => {
    const date = new Date(payment.paymentDate);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    const currentTotal = monthlyData.get(monthKey) || 0;
    monthlyData.set(monthKey, currentTotal + payment.amount);
  });

  return Array.from(monthlyData.entries())
    .map(([key, value]) => {
      const [year, month] = key.split("-");
      return {
        name: new Date(
          Number.parseInt(year),
          Number.parseInt(month) - 1,
        ).toLocaleString("default", {
          month: "short",
        }),
        value,
      };
    })
    .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
}

export const getPaymentAnalytics = query({
  args: {
    schoolId: v.id("schools"),
    timeframe: v.union(
      v.literal("year"),
      v.literal("month"),
      v.literal("week"),
    ),
    year: v.string(),
  },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .filter((q) => q.eq(q.field("status"), "success"))
      .collect();

    // Filter payments by year
    const yearPayments = payments.filter(
      (p) => new Date(p.paymentDate).getFullYear().toString() === args.year,
    );

    // Calculate trends
    const trends = getTrends(yearPayments, args.timeframe);

    // Calculate payment methods distribution
    const methodCounts = yearPayments.reduce(
      (acc, payment) => {
        acc[payment.paymentMethod] = (acc[payment.paymentMethod] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalPayments = yearPayments.length;
    const paymentMethods = Object.entries(methodCounts).map(
      ([method, count]) => ({
        method: method.toUpperCase(),
        percentage: count / totalPayments,
      }),
    );

    // Calculate payment status distribution
    const statusCounts = yearPayments.reduce(
      (acc, payment) => {
        acc[payment.status] = (acc[payment.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const paymentStatus = Object.entries(statusCounts).map(
      ([status, count]) => ({
        status: status.toUpperCase(),
        percentage: count / totalPayments,
      }),
    );

    // Calculate summary metrics
    const totalRevenue = yearPayments.reduce((sum, p) => sum + p.amount, 0);
    const totalTransactions = yearPayments.length;
    const averageTransaction =
      totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    return {
      trends,
      paymentMethods,
      paymentStatus,
      totalRevenue,
      totalTransactions,
      averageTransaction,
    };
  },
});

function getTrends(payments: any[], timeframe: string) {
  const grouped = new Map();

  payments.forEach((payment) => {
    const date = new Date(payment.paymentDate);
    let key;

    switch (timeframe) {
      case "week":
        key = `Week ${getWeekNumber(date)}`;
        break;
      case "month":
        key = date.toLocaleString("default", { month: "short" });
        break;
      case "year":
        key = date.toLocaleString("default", { month: "short" });
        break;
    }

    const current = grouped.get(key) || 0;
    grouped.set(key, current + payment.amount);
  });

  return Array.from(grouped.entries()).map(([name, amount]) => ({
    name,
    amount,
  }));
}

function getWeekNumber(date: Date) {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}
