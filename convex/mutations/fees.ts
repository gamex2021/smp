/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import type { Id } from "../_generated/dataModel";

export const setClassFeeStructure = mutation({
  args: {
    schoolId: v.id("schools"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    fees: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        amount: v.number(),
        dueDate: v.string(),
        isCompulsory: v.boolean(),
        description: v.optional(v.string()),
        allowsInstallment: v.boolean(),
        installmentConfig: v.optional(
          v.object({
            minimumFirstPayment: v.number(),
            maximumInstallments: v.number(),
            installmentDueDates: v.array(v.string()),
          }),
        ),
        reminderDays: v.array(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // Check if fee structure exists
    const existing = await ctx.db
      .query("classFeeStructure")
      .withIndex("by_class_term", (q) =>
        q
          .eq("classId", args.classId)
          .eq("academicYear", args.academicYear)
          .eq("termId", args.termId),
      )
      .first();

    if (existing) {
      // Update existing structure
      await ctx.db.patch(existing._id, {
        fees: args.fees,
      });

      // Update outstanding payments
      await updateOutstandingPayments(ctx, {
        ...args,
        existingFees: existing.fees,
      });
    } else {
      // Create new structure
      await ctx.db.insert("classFeeStructure", {
        ...args,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Create initial outstanding payments
      await createOutstandingPayments(ctx, args);
    }
  },
});

async function createOutstandingPayments(
  ctx: any,
  args: {
    schoolId: Id<"schools">;
    classId: Id<"classes">;
    academicYear: string;
    termId: number;
    fees: Array<{
      id: string;
      name: string;
      amount: number;
      dueDate: string;
      isCompulsory: boolean;
    }>;
  },
) {
  // Get all students in the class
  const students = await ctx.db
    .query("classStudent")
    .withIndex(
      "by_class",
      (q: { eq: (arg0: string, arg1: Id<"classes">) => any }) =>
        q.eq("classId", args.classId),
    )
    .collect();

  for (const student of students) {
    for (const fee of args.fees) {
      await ctx.db.insert("outstandingPayments", {
        schoolId: args.schoolId,
        studentId: student.studentId,
        classId: args.classId,
        academicYear: args.academicYear,
        termId: args.termId,
        feeId: fee.id,
        feeName: fee.name,
        amount: fee.amount,
        dueDate: fee.dueDate,
        isCompulsory: fee.isCompulsory,
        status: "unpaid",
      });
    }
  }
}

async function updateOutstandingPayments(
  ctx: any,
  args: {
    schoolId: Id<"schools">;
    classId: Id<"classes">;
    academicYear: string;
    termId: number;
    fees: Array<{
      id: string;
      name: string;
      amount: number;
      dueDate: string;
      isCompulsory: boolean;
    }>;
    existingFees: Array<{
      id: string;
      name: string;
      amount: number;
      dueDate: string;
      isCompulsory: boolean;
    }>;
  },
) {
  // Get all outstanding payments for this class and term
  const outstandings = await ctx.db
    .query("outstandingPayments")
    .withIndex(
      "by_class_term",
      (q: {
        eq: (
          arg0: string,
          arg1: Id<"classes">,
        ) => {
          (): any;
          new (): any;
          eq: {
            (
              arg0: string,
              arg1: string,
            ): {
              (): any;
              new (): any;
              eq: { (arg0: string, arg1: number): any; new (): any };
            };
            new (): any;
          };
        };
      }) =>
        q
          .eq("classId", args.classId)
          .eq("academicYear", args.academicYear)
          .eq("termId", args.termId),
    )
    .collect();

  // Update or create outstanding payments based on fee changes
  for (const fee of args.fees) {
    const existingFee = args.existingFees.find((f) => f.id === fee.id);

    if (!existingFee) {
      // New fee added - create outstanding payments for all students
      const students = await ctx.db
        .query("classStudent")
        .withIndex(
          "by_class",
          (q: { eq: (arg0: string, arg1: Id<"classes">) => any }) =>
            q.eq("classId", args.classId),
        )
        .collect();

      for (const student of students) {
        await ctx.db.insert("outstandingPayments", {
          schoolId: args.schoolId,
          studentId: student.studentId,
          classId: args.classId,
          academicYear: args.academicYear,
          termId: args.termId,
          feeId: fee.id,
          feeName: fee.name,
          amount: fee.amount,
          dueDate: fee.dueDate,
          isCompulsory: fee.isCompulsory,
          status: "unpaid",
        });
      }
    } else if (
      existingFee.amount !== fee.amount ||
      existingFee.dueDate !== fee.dueDate ||
      existingFee.isCompulsory !== fee.isCompulsory
    ) {
      // Fee details changed - update existing outstanding payments
      const relevantOutstandings = outstandings.filter(
        (o: { feeId: string; status: string }) =>
          o.feeId === fee.id && o.status !== "paid",
      );

      for (const outstanding of relevantOutstandings) {
        await ctx.db.patch(outstanding._id, {
          amount: fee.amount,
          dueDate: fee.dueDate,
          isCompulsory: fee.isCompulsory,
        });
      }
    }
  }

  // Remove outstanding payments for deleted fees
  const deletedFeeIds = args.existingFees
    .filter((ef) => !args.fees.find((f) => f.id === ef.id))
    .map((f) => f.id);

  for (const outstanding of outstandings) {
    if (deletedFeeIds.includes(outstanding.feeId)) {
      await ctx.db.delete(outstanding._id);
    }
  }
}
