/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { ConvexError, v } from "convex/values";
import { mutation } from "../_generated/server";
import type { Id } from "../_generated/dataModel";
import { checkAdmin } from "./helpers";
import { getAuthUserId } from "@convex-dev/auth/server";

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
            installmentDueDates: v.optional(v.array(v.string())),
          }),
        ),
        reminderDays: v.array(v.number()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
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

// function to create outstanding payment for just one student of a class
export const createOutstandingPaymentForStudent = mutation({
  args: {
    schoolId: v.id("schools"),
    studentId: v.id("users"),
    classId: v.id("classes"),
    academicYear: v.string(),
    termId: v.number(),
    feeId: v.string(),
    feeName: v.string(),
    amount: v.number(),
    dueDate: v.string(),
    isCompulsory: v.boolean(),
    remainingAmount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // CHECK IF THE REQUESTING USER IS AN ADMIN
    await checkAdmin(ctx);

    await ctx.db.insert("outstandingPayments", {
      schoolId: args.schoolId,
      studentId: args.studentId,
      classId: args.classId,
      academicYear: args.academicYear,
      termId: args.termId,
      feeId: args.feeId,
      feeName: args.feeName,
      amountPaid: 0,
      remainingAmount: args?.remainingAmount ?? args.amount,
      amount: args.amount,
      dueDate: args.dueDate,
      isCompulsory: args.isCompulsory,
      status: "unpaid",
    });
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
        amountPaid: 0,
        remainingAmount: fee.amount,
        amount: fee.amount,
        dueDate: fee.dueDate,
        isCompulsory: fee.isCompulsory,
        status: "unpaid",
      });
    }
  }
}



// *UPDATE OUTSTANDING PAYMENT FOR THE STUDENT BY THE OUTSTANDING PAYMENT ID
export const updateOutstandingPaymentById = mutation({
  args: {
    outstandingId: v.id("outstandingPayments"),
    remainingAmount: v.number(),
  },
  handler: async (ctx, args) => {
    // CHECK IF THE REQUESTING USER IS AN ADMIN
    await checkAdmin(ctx);

    //EDIT THE EXISTING AMOUNT OF THE OUTSTANDING PAYMENT
    await ctx.db.patch(args.outstandingId, {
      remainingAmount: args.remainingAmount,
    });

    return { success: true };
  },
});

//  * FUNCTION TO DELETE AN OUTSTANDING PAYMENT BY THE OUTSTANDING PAYMENT ID
export const deleteOutstandingPaymentById = mutation({
  args: {
    outstandingId: v.id("outstandingPayments"),
  },
  handler: async (ctx, args) => {
    // CHECK IF THE REQUESTING USER IS AN ADMIN
    await checkAdmin(ctx);

    // GET THE USERID OF THE ADMIN
    const userId = await getAuthUserId(ctx); // Ensure the user is authenticated

    if (!userId) {
      throw new ConvexError("User does not exist");
    }

    const user = await ctx.db.get(userId);

    // GET THE OUTSTANDING PAYMENT
    const outstandingPayment = await ctx.db.get(args.outstandingId);

    if (!outstandingPayment) {
      throw new ConvexError("outstanding payment not found");
    }

    // CHECK IF THE OUTSTANDING PAYMENT SCHOOLID IS THE SAME WITH THE ADMIN MAKING THE REQUEST
    if (outstandingPayment.schoolId !== user?.schoolId) {
      throw new ConvexError("Outstanding payment do not belong to the school");
    }

    // SEND DELETE REQUEST
    await ctx.db.delete(args.outstandingId);

    return { success: true };
  },
});

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
