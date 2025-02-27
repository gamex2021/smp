import { query } from "../_generated/server";
import { v } from "convex/values";

export const getCurrentTerm = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("academicConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return { id: config?._id, ...(config?.currentTerm ?? null) };
  },
});

export const getTermProgressLogs = query({
  args: {
    schoolId: v.id("schools"),
    academicYear: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("termProgressLogs")
      .withIndex("by_school_year", (q) =>
        q.eq("schoolId", args.schoolId).eq("academicYear", args.academicYear),
      )
      .order("desc")
      .collect();
  },
});

// get academic config by its id
export const getAcademicConfig = query({
  args: {
    configId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.configId);
  },
});
