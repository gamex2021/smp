import { internalQuery, query } from "../_generated/server";
import { v } from "convex/values";
import { getSchoolByDomain } from "./helpers";

export const findSchool = query({
  args: { domain: v.string() },
  handler: async (ctx, args) => {
    const school = await getSchoolByDomain(ctx, args.domain);

    if (!school) {
      return null;
    }

    return {
      id: school._id,
      ...school,
    };
  },
});

// Get school profile
export const getSchoolProfile = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const school = await ctx.db.get(args.schoolId);
    if (!school) return null;
    return school;
  },
});

// Get academic year configuration
export const getAcademicConfig = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("academicConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return config;
  },
});

// get current academic year
export const getCurrentAcademicYear = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const config = await ctx.db
      .query("academicConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();

    return config;
  },
});

// getschool by its id internal query
export const getSchool = internalQuery({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.schoolId);
  },
});

// Get all academic years
export const getAllAcademicYears = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    const configs = await ctx.db
      .query("academicConfig")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();

    return configs;
  },
});

// Get term settings
export const getTermSettings = query({
  args: {
    academicConfigId: v.id("academicConfig"),
    termNumber: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const config = await ctx.db.get(args.academicConfigId);
    if (!config) return null;

    if (args.termNumber !== undefined) {
      const term = config.terms?.find((t) => t.termNumber === args.termNumber);
      return term ?? null;
    }

    return config.terms || [];
  },
});

export const getSchoolByUser = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // Get the user first to verify their role and school association
    const user = await ctx.db.get(args.userId);
    if (!user || !user.schoolId) {
      return null;
    }

    // Get the school
    const school = await ctx.db.get(user.schoolId);
    if (!school) {
      return null;
    }

    return school;
  },
});
