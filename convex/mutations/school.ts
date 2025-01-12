import { ConvexError, v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";
import { getSchoolByDomain } from "../queries/helpers";

export const createSchool = mutation({
  args: {
    domain: v.string(),
    type: v.string(),
    name: v.string(),
    logo: v.string(),
    registeration_doc: v.string(),
    address: v.id("addresses"),
    user: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const schoolExist = await getSchoolByDomain(ctx, args.domain);

    if (schoolExist) {
      throw new ConvexError("School domain already taken.");
    }

    // create the school
    const newSchoolId = await ctx.db.insert("schools", {
      ...args,
      verified: false,
    });

    return {
      id: newSchoolId,
    };
  },
});

export const setSchoolOwner = internalMutation({
  args: {
    schoolId: v.id("schools"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.schoolId, { user: args.userId });
  },
});
