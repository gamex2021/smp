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

    return {
      id: config?._id,
      year: config?.academicYear,
      terms: config?.terms ?? [],
      ...(config?.currentTerm ?? null),
    };
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

export const getAllAcademicYears = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const academicYears = await ctx.db
      .query("academicConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return academicYears;
  },
});

export const getActiveAcademicYear = query({
  args: {
    schoolId: v.id("schools"),
  },
  handler: async (ctx, args) => {
    const activeYear = await ctx.db
      .query("academicConfig")
      .withIndex("active_years", (q) =>
        q.eq("schoolId", args.schoolId).eq("isActive", true),
      )
      .first();

    return activeYear;
  },
});

export const getAcademicYearsByStatus = query({
  args: {
    schoolId: v.id("schools"),
    status: v.union(
      v.literal("upcoming"),
      v.literal("active"),
      v.literal("completed"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    const years = await ctx.db
      .query("academicConfig")
      .withIndex("by_school_and_status", (q) =>
        q.eq("schoolId", args.schoolId).eq("status", args.status),
      )
      .collect();

    return years;
  },
});

export const getAcademicYearById = query({
  args: {
    academicYearId: v.id("academicConfig"),
  },
  handler: async (ctx, args) => {
    const year = await ctx.db.get(args.academicYearId);
    return year;
  },
});
