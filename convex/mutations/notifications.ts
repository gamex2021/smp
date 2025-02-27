/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";

// update notification with its args given

export const updateNotification = internalMutation({
  args: {
    outstandingPaymentId: v.id("outstandingPayments"),
    status: v.union(
      v.literal("pending"),
      v.literal("sent"),
      v.literal("failed"),
    ),
    sentAt: v.optional(v.string()),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const outstanding = await ctx.runQuery(
      internal.queries.fees.getOutstandingPayment,
      {
        outstandingPaymentId: args.outstandingPaymentId,
      },
    );

    if (!outstanding?._id) {
      throw new ConvexError("Notification not found");
    }

    await ctx.db.insert("paymentNotifications", {
      studentId: outstanding?.studentId,
      schoolId: outstanding?.schoolId,
      status: args?.status,
      sentAt: args?.sentAt,
      error: args?.error,
      type: "reminder",
      outstandingPaymentId: args.outstandingPaymentId,
      createdAt: new Date().toISOString(),
    });
  },
});
