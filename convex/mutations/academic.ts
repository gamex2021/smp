/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { v } from "convex/values";
import { mutation } from "../_generated/server";
import { ConvexError } from "convex/values";
import { internal } from "../_generated/api";
import { checkAdmin } from "./helpers";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createAcademicYear = mutation({
  args: {
    schoolId: v.id("schools"),
    academicYear: v.string(),
    numberOfTerms: v.number(),
    startDate: v.string(),
    endDate: v.string(),
    autoTermProgression: v.boolean(),
    autoYearProgression: v.boolean(),
    terms: v.array(
      v.object({
        termNumber: v.number(),
        name: v.string(),
        startDate: v.string(),
        endDate: v.string(),
        status: v.union(
          v.literal("upcoming"),
          v.literal("active"),
          v.literal("completed"),
        ),
      }),
    ),
    description: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Check if this academic year already exists for this school
    const existingYear = await ctx.db
      .query("academicConfig")
      .withIndex("by_school_year", (q) =>
        q.eq("schoolId", args.schoolId).eq("academicYear", args.academicYear),
      )
      .first();

    if (existingYear) {
      throw new Error("Academic year already exists");
    }

    // Create the new academic year
    const academicYearId = await ctx.db.insert("academicConfig", {
      ...args,
      isActive: false, // New years are not active by default
      status: "upcoming",
      currentTerm: {
        ...args.terms[0], // Set first term as current term
        status: "upcoming",
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
    });

    return academicYearId;
  },
});

export const updateAcademicYear = mutation({
  args: {
    academicYearId: v.id("academicConfig"),
    academicYear: v.optional(v.string()),
    numberOfTerms: v.optional(v.number()),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    autoTermProgression: v.optional(v.boolean()),
    autoYearProgression: v.optional(v.boolean()),
    terms: v.optional(
      v.array(
        v.object({
          termNumber: v.number(),
          name: v.string(),
          startDate: v.string(),
          endDate: v.string(),
          status: v.union(
            v.literal("upcoming"),
            v.literal("active"),
            v.literal("completed"),
          ),
        }),
      ),
    ),
    description: v.optional(v.string()),
    metadata: v.optional(v.record(v.string(), v.string())),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const academicYear = await ctx.db.get(args.academicYearId);
    if (!academicYear) throw new Error("Academic year not found");

    // If academic year is being changed, check for uniqueness
    if (args.academicYear && args.academicYear !== academicYear.academicYear) {
      const existingYear = await ctx.db
        .query("academicConfig")
        .withIndex("by_school_year", (q) =>
          q
            .eq("schoolId", academicYear.schoolId)
            .eq("academicYear", args.academicYear!),
        )
        .first();

      if (existingYear) {
        throw new Error("Academic year already exists");
      }
    }

    // Update the academic year
    await ctx.db.patch(args.academicYearId, {
      ...args,
      updatedAt: new Date().toISOString(),
      updatedBy: userId,
    });

    return args.academicYearId;
  },
});

export const deleteAcademicYear = mutation({
  args: {
    academicYearId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const academicYear = await ctx.db.get(args.academicYearId);
    if (!academicYear) throw new Error("Academic year not found");

    // Don't allow deletion of active academic year
    if (academicYear.isActive) {
      throw new Error("Cannot delete active academic year");
    }

    await ctx.db.delete(args.academicYearId);
    return true;
  },
});

export const setActiveAcademicYear = mutation({
  args: {
    academicYearId: v.id("academicConfig"),
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get the academic year to activate
    const academicYear = await ctx.db.get(args.academicYearId);
    if (!academicYear) throw new Error("Academic year not found");

    // Get the current active academic year
    const currentActiveYear = await ctx.db
      .query("academicConfig")
      .withIndex("active_years", (q) =>
        q.eq("schoolId", args.schoolId).eq("isActive", true),
      )
      .first();

    // Start a transaction to update both academic years
    if (currentActiveYear) {
      await ctx.db.patch(currentActiveYear._id, {
        isActive: false,
        status: "completed",
        updatedAt: new Date().toISOString(),
      });
    }

    await ctx.db.patch(args.academicYearId, {
      isActive: true,
      status: "active",
      updatedAt: new Date().toISOString(),
    });

    return args.academicYearId;
  },
});

export const archiveAcademicYear = mutation({
  args: {
    academicYearId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

    const academicYear = await ctx.db.get(args.academicYearId);
    if (!academicYear) throw new Error("Academic year not found");

    // Don't allow archiving of active academic year
    if (academicYear.isActive) {
      throw new Error("Cannot archive active academic year");
    }

    await ctx.db.patch(args.academicYearId, {
      status: "archived",
      updatedAt: new Date().toISOString(),
    });

    return args.academicYearId;
  },
});

export const updateAutoTermProgression = mutation({
  args: {
    configId: v.id("academicConfig"),
    autoTermProgression: v.boolean(),
  },
  handler: async (ctx, args) => {
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

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
    await checkAdmin(ctx);
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      throw new Error("User not authenticated");
    }

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
