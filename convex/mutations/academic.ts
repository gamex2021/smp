/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";

export const updateAutoTermProgression = mutation({
  args: {
    configId: v.id("academicConfig"),
    autoTermProgression: v.boolean(),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new ConvexError("Academic configuration not found");
    }

    await ctx.db.patch(args.configId, {
      autoTermProgression: args.autoTermProgression,
    });

    // If enabling auto progression, schedule the check
    if (args.autoTermProgression) {
      await ctx.scheduler.runAfter(
        0,
        internal.schedulers.academic.checkTermProgression,
        {
          configId: args.configId,
        },
      );
    }
  },
});

export const progressToNextTerm = mutation({
  args: {
    configId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.configId);
    if (!config) {
      throw new ConvexError("Academic configuration not found");
    }

    const currentTerm = config.currentTerm;
    if (!currentTerm) {
      throw new ConvexError("No current term found");
    }

    // Find the next term
    const nextTerm = config.terms.find(
      (term) => term.termNumber === currentTerm.termNumber + 1,
    );

    if (!nextTerm) {
      // No next term - academic year is complete
      await ctx.db.patch(args.configId, {
        currentTerm: {
          ...config.currentTerm,
          status: "completed",
        },
      });

      // Log the completion
      await ctx.db.insert("termProgressLogs", {
        schoolId: config.schoolId,
        academicYear: config.academicYear,
        fromTerm: currentTerm.termNumber,
        toTerm: currentTerm.termNumber,
        progressedAt: new Date().toISOString(),
        status: "success",
      });

      return;
    }

    try {
      // Update current term status
      const updatedTerms = config.terms.map((term) => ({
        ...term,
        status:
          term.termNumber === currentTerm.termNumber
            ? "completed"
            : term.termNumber === nextTerm.termNumber
              ? "active"
              : term.status,
      }));

      // Update configuration
      await ctx.db.patch(args.configId, {
        terms: updatedTerms,
        currentTerm: {
          ...nextTerm,
          status: "active",
        },
      });

      // Log the progression
      await ctx.db.insert("termProgressLogs", {
        schoolId: config.schoolId,
        academicYear: config.academicYear,
        fromTerm: currentTerm.termNumber,
        toTerm: nextTerm.termNumber,
        progressedAt: new Date().toISOString(),
        status: "success",
      });

      // Send notifications
      await ctx.scheduler.runAfter(
        0,
        internal.actions.notifications.sendTermProgressionNotification,
        {
          schoolId: config.schoolId,
          fromTerm: currentTerm,
          toTerm: nextTerm,
        },
      );
    } catch (error) {
      // Log failure
      await ctx.db.insert("termProgressLogs", {
        schoolId: config.schoolId,
        academicYear: config.academicYear,
        fromTerm: currentTerm.termNumber,
        toTerm: nextTerm.termNumber,
        progressedAt: new Date().toISOString(),
        status: "failed",
        error: (error as Error).message,
      });

      throw error;
    }
  },
});
