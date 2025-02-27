/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { v } from "convex/values";
import { query, internalQuery } from "../_generated/server";

export const getClassFeeStructure = query({
  args: {
    classId: v.union(v.id("classes"), v.any()),
    academicYear: v.string(),
    termId: v.number(),
  },
  handler: async (ctx, args) => {
    if (args.classId === "") {
      return;
    }
    return await ctx.db
      .query("classFeeStructure")
      .withIndex("by_class_term", (q) =>
        q
          .eq("classId", args.classId)
          .eq("academicYear", args.academicYear)
          .eq("termId", args.termId),
      )
      .first();
  },
});

export const getOutstandingPayment = internalQuery({
  args: { outstandingPaymentId: v.id("outstandingPayments") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.outstandingPaymentId);
  },
});

export const getOutstandingPayments = query({
  args: {
    schoolId: v.id("schools"),
    academicYear: v.optional(v.string()),
    termId: v.optional(v.number()),
    classId: v.optional(v.id("classes")),
    studentId: v.optional(v.id("users")),
    isCompulsory: v.optional(v.boolean()),
    status: v.optional(
      v.union(v.literal("unpaid"), v.literal("partial"), v.literal("overdue")),
    ),
  },
  handler: async (ctx, args) => {
    let query = ctx.db
      .query("outstandingPayments")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId));

    if (args.academicYear) {
      query = query.filter((q) =>
        q.eq(q.field("academicYear"), args.academicYear),
      );
    }
    if (args.termId) {
      query = query.filter((q) => q.eq(q.field("termId"), args.termId));
    }
    if (args.classId) {
      query = query.filter((q) => q.eq(q.field("classId"), args.classId));
    }
    if (args.studentId) {
      query = query.filter((q) => q.eq(q.field("studentId"), args.studentId));
    }
    if (args.isCompulsory !== undefined) {
      query = query.filter((q) =>
        q.eq(q.field("isCompulsory"), args.isCompulsory),
      );
    }
    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    const outstandings = await query.collect();

    // Resolve student and class details
    return await Promise.all(
      outstandings.map(async (outstanding) => {
        const student = await ctx.db.get(outstanding.studentId);
        const class_ = await ctx.db.get(outstanding.classId);

        return {
          ...outstanding,
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
  },
});
